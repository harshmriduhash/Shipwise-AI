import { describe, expect, it } from "vitest";
import { parseGitHubRepositoryUrl } from "@/lib/github";

describe("parseGitHubRepositoryUrl", () => {
  it("accepts a valid HTTPS repository URL and normalizes a trailing .git", () => {
    expect(parseGitHubRepositoryUrl("https://github.com/acme/platform.git")).toEqual({ owner: "acme", repo: "platform" });
  });

  it("rejects non-GitHub hosts and paths that are not a repository", () => {
    expect(parseGitHubRepositoryUrl("https://example.com/acme/platform")).toBeNull();
    expect(parseGitHubRepositoryUrl("https://github.com/acme")).toBeNull();
  });

  it("rejects non-HTTPS, credentials, and extra path segments", () => {
    expect(parseGitHubRepositoryUrl("http://github.com/acme/platform")).toBeNull();
    expect(parseGitHubRepositoryUrl("https://user:pass@github.com/acme/platform")).toBeNull();
    expect(parseGitHubRepositoryUrl("https://github.com/acme/platform/tree/main")).toBeNull();
  });
});