import { getConnectionKeyForUser } from "../_shared/appUserConnections.ts";
import { githubJson, ensureRepositoryWebhook, publicGitHubJson } from "../_shared/githubApi.ts";
import { authenticatedUser, adminClient, errorResponse, jsonResponse, preflightResponse, readJson } from "../_shared/http.ts";

type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  default_branch: string;
  private: boolean;
  owner: { login: string };
};
type GitHubPullRequest = {
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
  try {
    const user = await authenticatedUser(req);
    if (!user) return jsonResponse({ error: "Sign in to add a GitHub repository." }, 401);
    const body = await readJson(req);
    const owner = typeof body.owner === "string" ? body.owner.trim() : "";
    const repo = typeof body.repo === "string" ? body.repo.trim() : "";
    if (!/^[A-Za-z0-9_.-]{1,100}$/.test(owner) || !/^[A-Za-z0-9_.-]{1,100}$/.test(repo)) {
      return jsonResponse({ error: "Enter a valid GitHub repository owner and name." }, 400);
    }
    const key = await getConnectionKeyForUser(user.id, "github");
    const encodedOwner = encodeURIComponent(owner);
    const encodedRepo = encodeURIComponent(repo);
    const repository = key
      ? await githubJson<GitHubRepository>(key, `/repos/${encodedOwner}/${encodedRepo}`)
      : await publicGitHubJson<GitHubRepository>(`/repos/${encodedOwner}/${encodedRepo}`);
    if (!key && repository.private) return jsonResponse({ error: "Private repositories require a connected GitHub account." }, 403);
    const client = adminClient();
    const { data: savedRepo, error: repoError } = await client.from("repositories").upsert({
      user_id: user.id,
      github_url: repository.html_url,
      name: repository.full_name,
      description: repository.description,
      default_branch: repository.default_branch,
      github_owner: repository.owner.login,
      github_repo: repository.name,
      github_repo_id: repository.id,
      is_private: repository.private,
    }, { onConflict: "user_id,github_repo_id" }).select("id,name,github_url,description,default_branch,github_owner,github_repo,github_repo_id,is_private,created_at").single();
    if (repoError || !savedRepo) throw repoError ?? new Error("Could not save this repository");

    const openPullRequests = key
      ? await githubJson<GitHubPullRequest[]>(key, `/repos/${encodedOwner}/${encodedRepo}/pulls?state=open&per_page=100`)
      : await publicGitHubJson<GitHubPullRequest[]>(`/repos/${encodedOwner}/${encodedRepo}/pulls?state=open&per_page=100`);
    const { error: prError } = await client.from("pull_requests").upsert(
      openPullRequests.map(pr => ({
        repo_id: savedRepo.id,
        github_pr_number: pr.number,
        title: pr.title,
        author: pr.user?.login ?? "unknown",
        branch: pr.head.ref,
        base_branch: pr.base.ref,
        github_html_url: pr.html_url,
        github_state: pr.state,
        head_sha: pr.head.sha,
        status: pr.draft ? "draft" : pr.state,
        additions: pr.additions ?? 0,
        deletions: pr.deletions ?? 0,
        files_changed: pr.changed_files ?? 0,
        analysis_status: "pending",
      })),
      { onConflict: "repo_id,github_pr_number" },
    );
    if (prError) throw prError;

    let webhookReady = false;
    let webhookNotice: string | null = null;
    try {
      if (!key) throw new Error("Connect a GitHub account to create this webhook automatically, or configure it manually in the repository settings.");
      await ensureRepositoryWebhook(key, repository.owner.login, repository.name);
      webhookReady = true;
    } catch (error) {
      webhookNotice = error instanceof Error ? error.message : "GitHub webhook could not be configured";
      await client.from("repositories").update({ webhook_status: "setup_failed", webhook_error: webhookNotice }).eq("id", savedRepo.id);
    }
    if (webhookReady) {
      await client.from("repositories").update({ webhook_status: "active", webhook_error: null }).eq("id", savedRepo.id);
    }
    return jsonResponse({ repository: savedRepo, pullRequests: openPullRequests.length, webhookReady, webhookNotice });
  } catch (error) {
    const status = (error as { status?: number }).status;
    console.error("GitHub repository sync failed:", error);
    return errorResponse(error, status && status >= 400 && status <= 599 ? status : 500);
  }
});