import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Loader2, LogOut, Plus, RefreshCw, ShieldCheck, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ScrollReveal from "@/components/ui/ScrollReveal";
import EmptyState from "@/components/ui/EmptyState";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { parseGitHubRepositoryUrl } from "@/lib/github";

interface Repository {
  id: string;
  github_url: string;
  name: string;
  description: string | null;
  default_branch: string;
  created_at: string;
  webhook_status: string;
  webhook_error: string | null;
}

interface GitHubStatus {
  connected: boolean;
  reconnectRequired?: boolean;
  account?: { login: string; name: string | null; avatarUrl: string | null };
}

function waitForGitHubOAuth(popup: Window) {
  return new Promise<void>((resolve, reject) => {
    let poll: number | undefined;
    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      if (poll !== undefined) window.clearInterval(poll);
    };
    const onMessage = (event: MessageEvent) => {
      const type = event.data?.type;
      if (event.origin !== window.location.origin || event.source !== popup || event.data?.connectorId !== "github" ||
          (type !== "appUserConnectorOAuthComplete" && type !== "appUserConnectorOAuthFailed")) return;
      cleanup();
      if (type === "appUserConnectorOAuthComplete") resolve();
      else reject(new Error(typeof event.data?.reason === "string" ? event.data.reason : "GitHub connection was not completed."));
    };
    window.addEventListener("message", onMessage);
    poll = window.setInterval(() => {
      if (!popup.closed) return;
      cleanup();
      reject(new Error("The GitHub connection window closed before finishing."));
    }, 500);
  });
}

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [githubStatus, setGithubStatus] = useState<GitHubStatus>({ connected: false });
  const [githubLoading, setGithubLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const fetchRepos = useCallback(async () => {
    const { data, error } = await supabase.from("repositories")
      .select("id,github_url,name,description,default_branch,created_at,webhook_status,webhook_error")
      .order("created_at", { ascending: false });
    if (error) toast.error("Could not load your repositories.");
    else setRepos((data ?? []) as Repository[]);
    setLoading(false);
  }, []);

  const fetchGitHubStatus = useCallback(async () => {
    setGithubLoading(true);
    const { data, error } = await supabase.functions.invoke("github-oauth-status", { method: "GET" });
    if (error) {
      setGithubStatus({ connected: false });
    } else {
      setGithubStatus(data as GitHubStatus);
    }
    setGithubLoading(false);
  }, []);

  useEffect(() => {
    void fetchRepos();
    void fetchGitHubStatus();
  }, [fetchRepos, fetchGitHubStatus]);

  const connectGitHub = async () => {
    const popup = window.open("", "shipwise-github-oauth", "width=600,height=720");
    if (!popup) {
      toast.error("Allow pop-up windows to connect GitHub.");
      return;
    }
    setConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("github-oauth-start", {
        body: { origin: window.location.origin },
      });
      if (error) throw error;
      if (typeof data?.authorizationUrl !== "string") throw new Error("GitHub authorization could not start.");
      const completion = waitForGitHubOAuth(popup);
      popup.location.href = data.authorizationUrl;
      await completion;
      await fetchGitHubStatus();
      toast.success("GitHub connected.");
    } catch (error) {
      popup.close();
      toast.error(error instanceof Error ? error.message : "Could not connect GitHub.");
    } finally {
      setConnecting(false);
    }
  };

  const disconnectGitHub = async () => {
    const { data, error } = await supabase.functions.invoke("github-oauth-status", { body: { disconnect: true } });
    if (error || !data?.disconnected) {
      toast.error("GitHub could not be disconnected.");
      return;
    }
    setGithubStatus({ connected: false });
    toast.success("GitHub disconnected. Saved repositories remain available if public.");
  };

  const syncRepository = async (repositoryId: string, url: string) => {
    const coordinates = parseGitHubRepositoryUrl(url);
    if (!coordinates) {
      toast.error("Enter a valid HTTPS GitHub repository link.");
      return null;
    }
    const { data, error } = await supabase.functions.invoke("github-sync-repository", {
      body: coordinates,
    });
    if (error) {
      const detail = data?.error;
      throw new Error(typeof detail === "string" ? detail : error.message || "GitHub could not sync this repository.");
    }
    if (data?.webhookNotice) toast.warning("The repository synced, but automatic updates are not active yet.");
    await fetchRepos();
    return data;
  };

  const handleAddRepo = async (event: React.FormEvent) => {
    event.preventDefault();
    const coordinates = parseGitHubRepositoryUrl(repoUrl);
    if (!coordinates) {
      toast.error("Enter a valid link such as https://github.com/owner/repository.");
      return;
    }
    setAdding(true);
    try {
      await syncRepository("", repoUrl);
      setRepoUrl("");
      setShowForm(false);
      toast.success("Repository connected and open pull requests synced.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not connect this repository.");
    } finally {
      setAdding(false);
    }
  };

  const handleSyncExisting = async (repository: Repository) => {
    setSyncingId(repository.id);
    try {
      const result = await syncRepository(repository.id, repository.github_url);
      toast.success(`Synced ${result?.pullRequests ?? 0} open pull requests.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sync this repository.");
    } finally {
      setSyncingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("repositories").delete().eq("id", id);
    if (error) toast.error("Could not remove this repository.");
    else {
      setRepos(previous => previous.filter(repository => repository.id !== id));
      toast.success("Repository removed.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <button type="button" className="flex items-center gap-2" onClick={() => navigate("/dashboard")}>
            <span className="w-7 h-7 rounded-md bg-primary flex items-center justify-center"><Zap className="w-3.5 h-3.5 text-primary-foreground" /></span>
            <span className="text-base font-bold text-foreground">SHIPWISE<span className="gradient-text">.ai</span></span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut} aria-label="Sign out" className="text-muted-foreground h-8 w-8 p-0"><LogOut className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-3xl">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground text-xs mb-4 -ml-2 h-7">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
          </Button>

          <section className="border-b border-border/60 pb-6 mb-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-foreground">GitHub connection</h1>
                <p className="text-xs text-muted-foreground mt-1">Connect your account for private repositories and automatic pull request updates.</p>
              </div>
              {!githubLoading && (githubStatus.connected
                ? <Button variant="outline" size="sm" onClick={disconnectGitHub} className="shrink-0"><ShieldCheck className="w-4 h-4 mr-2" />Connected as @{githubStatus.account?.login || "GitHub user"}</Button>
                : <Button size="sm" onClick={connectGitHub} disabled={connecting} className="shrink-0">
                  {connecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Github className="w-4 h-4 mr-2" />}
                  {githubStatus.reconnectRequired ? "Reconnect GitHub" : "Connect GitHub"}
                </Button>)}
              {githubLoading && <div className="h-9 w-32 bg-secondary animate-pulse" />}
            </div>
            {!githubStatus.connected && !githubLoading && (
              <p className="text-[11px] text-muted-foreground mt-3">Public repositories can be added without connecting. GitHub access is needed for private repositories and automatic webhook setup.</p>
            )}
          </section>

          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Repositories</h2>
              <p className="text-xs text-muted-foreground mt-1">Open pull requests sync from GitHub.</p>
            </div>
            <Button size="sm" onClick={() => setShowForm(true)} className="glow-sm text-xs h-8">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add repository
            </Button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                <div className="border-y border-border/60 py-5">
                  <div className="flex items-center gap-2 mb-2"><Github className="w-4 h-4 text-primary" /><h3 className="text-sm font-medium text-foreground">Add a GitHub repository</h3></div>
                  <p className="text-xs text-muted-foreground mb-4">Paste a repository link. SHIPWISE will verify access and import open pull requests.</p>
                  <form onSubmit={handleAddRepo} className="flex flex-col sm:flex-row gap-2">
                    <Input placeholder="https://github.com/owner/repository" value={repoUrl} onChange={event => setRepoUrl(event.target.value)} className="bg-secondary/50 border-border/50 h-10 flex-1 font-mono text-xs" />
                    <Button type="submit" size="sm" className="h-10 px-4" disabled={adding}>
                      {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Sync repository"}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-10" onClick={() => setShowForm(false)}>Cancel</Button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? <div className="space-y-3"><SkeletonCard /><SkeletonCard /></div> : repos.length === 0 ? (
            <EmptyState type="generic" title="No repositories connected" description="Add a public repository, or connect GitHub first to sync a private one." action={{ label: "Add repository", onClick: () => setShowForm(true) }} />
          ) : (
            <div className="divide-y divide-border/50">
              {repos.map((repo, index) => (
                <ScrollReveal key={repo.id} delay={index * 0.04}>
                  <motion.div whileHover={{ x: 2 }} className="py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0"><Github className="w-5 h-5 text-foreground" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{repo.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">{repo.github_url}</p>
                      <p className={`text-[10px] mt-1 ${repo.webhook_status === "active" ? "text-primary" : "text-muted-foreground"}`}>
                        {repo.webhook_status === "active" ? "Automatic pull request updates active" : repo.webhook_error || "Automatic updates not configured"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="sm" aria-label={`Sync ${repo.name}`} title="Sync pull requests" onClick={() => handleSyncExisting(repo)} disabled={syncingId === repo.id} className="h-8 w-8 p-0">
                        {syncingId === repo.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      </Button>
                      <a href={repo.github_url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${repo.name} on GitHub`} className="text-muted-foreground hover:text-foreground p-2"><ExternalLink className="w-3.5 h-3.5" /></a>
                      <Button variant="ghost" size="sm" aria-label={`Remove ${repo.name}`} onClick={() => handleDelete(repo.id)} className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;