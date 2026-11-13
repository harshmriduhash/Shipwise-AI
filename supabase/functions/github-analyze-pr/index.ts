import { analyzeGithubPullRequest } from "../_shared/analyzePullRequest.ts";
import { getConnectionKeyForUser } from "../_shared/appUserConnections.ts";
import { adminClient, authenticatedUser, errorResponse, jsonResponse, preflightResponse, readJson } from "../_shared/http.ts";
import { githubJson, publicGitHubJson } from "../_shared/githubApi.ts";

type PullRequest = {
  number: number;
  title: string;
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

Deno.serve(async (req) => {
  const preflight = preflightResponse(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);
  let repositoryId = "";
  let prNumber = 0;
  try {
    const user = await authenticatedUser(req);
    if (!user) return jsonResponse({ error: "Sign in to analyze this pull request." }, 401);
    const body = await readJson(req);
    repositoryId = typeof body.repositoryId === "string" ? body.repositoryId : "";
    prNumber = typeof body.prNumber === "number" ? body.prNumber : Number(body.prNumber);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(repositoryId) ||
        !Number.isSafeInteger(prNumber) || prNumber < 1) {
      return jsonResponse({ error: "A valid repository and pull request number are required." }, 400);
    }
    const client = adminClient();
    const { data: repository, error } = await client.from("repositories")
      .select("id,user_id,github_owner,github_repo,is_private")
      .eq("id", repositoryId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (!repository?.github_owner || !repository.github_repo) return jsonResponse({ error: "This GitHub repository is not available." }, 404);
    const connectionKey = await getConnectionKeyForUser(user.id, "github");
    if (repository.is_private && !connectionKey) return jsonResponse({ error: "Connect your GitHub account to analyze private repositories." }, 409);
    const path = `/repos/${encodeURIComponent(repository.github_owner)}/${encodeURIComponent(repository.github_repo)}/pulls/${prNumber}`;
    const pr = connectionKey
      ? await githubJson<PullRequest>(connectionKey, path)
      : await publicGitHubJson<PullRequest>(path);
    const { id, analysis } = await analyzeGithubPullRequest({
      id: repository.id,
      github_owner: repository.github_owner,
      github_repo: repository.github_repo,
    }, connectionKey, pr);
    return jsonResponse({ pullRequestId: id, analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    if (repositoryId && prNumber) {
      await adminClient().from("pull_requests")
        .update({ analysis_status: "failed", analysis_error: message.slice(0, 500) })
        .eq("repo_id", repositoryId)
        .eq("github_pr_number", prNumber);
    }
    const status = (error as { status?: number }).status;
    console.error("GitHub pull request analysis failed:", error);
    return errorResponse(error, status && status >= 400 && status <= 599 ? status : 500);
  }
});