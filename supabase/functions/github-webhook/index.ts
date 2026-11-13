import { analyzeGithubPullRequest, syncPullRequestMetadata } from "../_shared/analyzePullRequest.ts";
import { getConnectionKeyForUser } from "../_shared/appUserConnections.ts";
import { adminClient, corsHeaders, jsonResponse } from "../_shared/http.ts";
import { githubJson } from "../_shared/githubApi.ts";

type WebhookPullRequest = {
  number: number;
  title: string;
  body?: string | null;
  html_url: string;
  state: string;
  draft?: boolean;
  user?: { login?: string };
  head: { ref: string; sha: string };
  base: { ref: string };
  additions?: number;
  deletions?: number;
  changed_files?: number;
};

async function verifySignature(rawBody: string, providedSignature: string | null): Promise<boolean> {
  const secret = Deno.env.get("GITHUB_WEBHOOK_SECRET");
  if (!secret || !providedSignature || !/^sha256=[a-f0-9]{64}$/i.test(providedSignature)) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)));
  const expected = `sha256=${Array.from(signature, byte => byte.toString(16).padStart(2, "0")).join("")}`;
  const encoder = new TextEncoder();
  const expectedBytes = encoder.encode(expected);
  const actualBytes = encoder.encode(providedSignature.toLowerCase());
  if (expectedBytes.length !== actualBytes.length) return false;
  let difference = 0;
  for (let index = 0; index < expectedBytes.length; index += 1) difference |= expectedBytes[index] ^ actualBytes[index];
  return difference === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);
  const deliveryId = req.headers.get("X-GitHub-Delivery") ?? "";
  const eventName = req.headers.get("X-GitHub-Event") ?? "";
  if (!/^[A-Za-z0-9-]{1,100}$/.test(deliveryId) || !/^[a-z_]{1,50}$/.test(eventName)) {
    return jsonResponse({ error: "GitHub webhook headers are invalid." }, 400);
  }
  const rawBody = await req.text();
  if (rawBody.length > 1_000_000) return jsonResponse({ error: "Webhook body is too large." }, 413);
  try {
    if (!await verifySignature(rawBody, req.headers.get("X-Hub-Signature-256"))) {
      return jsonResponse({ error: "Webhook signature is invalid or not configured." }, 401);
    }
    const payload: unknown = JSON.parse(rawBody);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return jsonResponse({ error: "Webhook body must be a JSON object." }, 400);
    const body = payload as Record<string, unknown>;
    const action = typeof body.action === "string" ? body.action : "";
    if (eventName !== "pull_request" || !["opened", "reopened", "synchronize", "ready_for_review", "closed"].includes(action)) {
      return jsonResponse({ accepted: true, ignored: true });
    }
    const repository = body.repository as { full_name?: unknown; html_url?: unknown; name?: unknown; owner?: { login?: unknown } } | undefined;
    const pull = body.pull_request as WebhookPullRequest | undefined;
    const owner = typeof repository?.owner?.login === "string" ? repository.owner.login : "";
    const repo = typeof repository?.name === "string" ? repository.name : "";
    if (!owner || !repo || !pull || !Number.isSafeInteger(pull.number) || !pull.head?.sha) {
      return jsonResponse({ error: "Webhook payload is missing repository or pull request fields." }, 400);
    }

    const client = adminClient();
    const { error: deliveryError } = await client.from("github_webhook_deliveries").insert({ delivery_id: deliveryId, event_name: eventName });
    if (deliveryError?.code === "23505") return jsonResponse({ accepted: true, duplicate: true });
    if (deliveryError) throw deliveryError;

    const fullName = `${owner}/${repo}`.toLowerCase();
    const { data: repositories, error: repoError } = await client.from("repositories")
      .select("id,user_id,github_owner,github_repo,is_private")
      .ilike("name", fullName);
    if (repoError) throw repoError;
    const matched = repositories?.find(item => item.github_owner?.toLowerCase() === owner.toLowerCase() && item.github_repo?.toLowerCase() === repo.toLowerCase());
    if (!matched) {
      await client.from("github_webhook_deliveries").update({ status: "ignored" }).eq("delivery_id", deliveryId);
      return jsonResponse({ accepted: true, ignored: true });
    }

    const connectionKey = await getConnectionKeyForUser(matched.user_id, "github");
    if (action === "closed") {
      const { error } = await client.from("pull_requests").upsert({
        repo_id: matched.id,
        github_pr_number: pull.number,
        title: pull.title,
        author: pull.user?.login ?? "unknown",
        branch: pull.head.ref,
        base_branch: pull.base.ref,
        github_html_url: pull.html_url,
        github_state: "closed",
        head_sha: pull.head.sha,
        status: "closed",
        analysis_status: "skipped",
      }, { onConflict: "repo_id,github_pr_number" });
      if (error) throw error;
      await client.from("github_webhook_deliveries").update({ status: "processed" }).eq("delivery_id", deliveryId);
      return jsonResponse({ accepted: true, closed: true });
    }
    await syncPullRequestMetadata(matched, pull);
    if (!connectionKey && matched.is_private) {
      await client.from("pull_requests").update({ analysis_status: "failed", analysis_error: "Reconnect GitHub to analyze this private repository." })
        .eq("repo_id", matched.id).eq("github_pr_number", pull.number);
    } else {
      const result = await analyzeGithubPullRequest(matched, connectionKey, pull);
      console.info(`Analyzed ${fullName}#${pull.number} as record ${result.id}`);
    }
    await client.from("github_webhook_deliveries").update({ status: "processed" }).eq("delivery_id", deliveryId);
    return jsonResponse({ accepted: true, analyzed: Boolean(connectionKey || !matched.is_private) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    if (deliveryId) {
      await adminClient().from("github_webhook_deliveries")
        .update({ status: "failed", error_message: message.slice(0, 500) })
        .eq("delivery_id", deliveryId);
    }
    console.error("GitHub webhook processing failed:", error);
    return jsonResponse({ error: "Webhook delivery could not be processed." }, 500);
  }
});