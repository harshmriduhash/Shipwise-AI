export type GitHubRepositoryCoordinates = { owner: string; repo: string };

export function parseGitHubRepositoryUrl(value: string): GitHubRepositoryCoordinates | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password) return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length !== 2 || !parts.every(part => /^[A-Za-z0-9_.-]+$/.test(part))) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/i, "") };
  } catch {
    return null;
  }
}