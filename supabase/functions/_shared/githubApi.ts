import { appUserReconnectRequired, callAsAppUser } from "./appUserConnector.ts";
import { GITHUB_SCOPES } from "./appUserScopes.ts";

const GATEWAY_BASE_URL = "https://connector-gateway.lovable.dev";

export async function publicGitHubRequest(path: string, accept = "application/vnd.github+json") {
  const response = await fetch(`https://api.github.com${path.startsWith("/") ? path : `/${path}`}`, {
    method: "GET",
    headers: {
      Accept: accept,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "SHIPWISE.ai",
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error(`Public GitHub request failed [${response.status}]: ${detail.slice(0, 500)}`);
    throw Object.assign(new Error(response.status === 404
      ? "This repository is not publicly accessible. Connect your GitHub account for private repositories."
      : `GitHub request failed (${response.status}).`), { status: response.status });
  }
  return response;
}

export async function publicGitHubJson<T>(path: string): Promise<T> {
  return await (await publicGitHubRequest(path)).json() as T;
}

export async function githubRequest(
  connectionKey: string,
  path: string,
  accept = "application/vnd.github+json",
  method = "GET",
  body?: unknown,
) {
  const response = await callAsAppUser({
    gatewayBaseUrl: GATEWAY_BASE_URL,
    connectionAPIKey: connectionKey,
    connectorId: "github",
    path,
    requiredScopes: GITHUB_SCOPES,
    init: {
      method,
      headers: { Accept: accept, ...(body ? { "Content-Type": "application/json" } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
  });
  if (await appUserReconnectRequired(response)) {
    throw Object.assign(new Error("Reconnect your GitHub account to continue."), { status: 401, reconnectRequired: true });
  }
  if (!response.ok) {
    const details = await response.text();
    console.error(`GitHub request failed [${response.status}]: ${details.slice(0, 1000)}`);
    throw Object.assign(new Error(`GitHub request failed (${response.status}). Check repository access and try again.`), { status: response.status });
  }
  return response;
}

export async function githubJson<T>(connectionKey: string, path: string): Promise<T> {
  return await (await githubRequest(connectionKey, path)).json() as T;
}

export async function ensureRepositoryWebhook(connectionKey: string, owner: string, repo: string) {
  const secret = Deno.env.get("GITHUB_WEBHOOK_SECRET");
  const projectUrl = Deno.env.get("SUPABASE_URL");
  if (!secret || !projectUrl) throw new Error("GitHub webhook setup is not configured yet");
  const url = `${projectUrl.replace(/\/$/, "")}/functions/v1/github-webhook`;
  const hooks = await githubJson<Array<{ id: number; config?: { url?: string } }>>(
    connectionKey,
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/hooks?per_page=100`,
  );
  const existing = hooks.find(hook => hook.config?.url === url);
  if (existing) return;
  await githubRequest(connectionKey, `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/hooks`, "application/vnd.github+json", "POST", {
    name: "web",
    active: true,
    events: ["pull_request"],
    config: { url, content_type: "json", secret, insecure_ssl: "0" },
  });
}