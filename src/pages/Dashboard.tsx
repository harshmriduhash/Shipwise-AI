import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Clock3, FileCode2, Github, GitPullRequest, LogOut, RefreshCw, Settings, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import { toast } from "sonner";

type Repository = Pick<Tables<"repositories">, "id" | "name" | "github_url">;
type PullRequest = Tables<"pull_requests">;

function riskColor(value: number | null) {
  if (value === null) return "text-muted-foreground";
  if (value >= 70) return "text-destructive";
  if (value >= 40) return "text-warning";
  return "text-primary";
}

function formatAge(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (showSpinner: boolean) => {
    if (showSpinner) setRefreshing(true);
    const { data: repoData, error: repoError } = await supabase.from("repositories")
      .select("id,name,github_url")
      .order("created_at", { ascending: false });
    if (repoError) {
      toast.error("Could not load repositories.");
      setLoading(false);
      setRefreshing(false);
      return;
    }
    const repoRows = (repoData ?? []) as Repository[];
    setRepositories(repoRows);
    if (!repoRows.length) {
      setPullRequests([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    const { data: prData, error: prError } = await supabase.from("pull_requests")
      .select("*")
      .in("repo_id", repoRows.map(repository => repository.id))
      .eq("github_state", "open")
      .order("updated_at", { ascending: false });
    if (prError) toast.error("Could not load pull requests.");
    else setPullRequests((prData ?? []) as PullRequest[]);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void loadData(false);
  }, [loadData]);

  const repoFor = (repoId: string) => repositories.find(repository => repository.id === repoId);
  const analyzed = pullRequests.filter(pr => pr.analysis_status === "complete");
  const highRisk = analyzed.filter(pr => (pr.risk_score ?? 0) >= 70).length;
  const averageRisk = analyzed.length
    ? Math.round(analyzed.reduce((total, pr) => total + (pr.risk_score ?? 0), 0) / analyzed.length)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-primary flex items-center justify-center"><Zap className="w-3.5 h-3.5 text-primary-foreground" /></span>
            <span className="text-base font-bold text-foreground">SHIPWISE<span className="gradient-text">.ai</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" aria-label="Repository settings" onClick={() => navigate("/settings")} className="text-muted-foreground h-8 w-8 p-0"><Settings className="w-3.5 h-3.5" /></Button>
            <Button variant="ghost" size="sm" aria-label="Sign out" onClick={signOut} className="text-muted-foreground h-8 w-8 p-0"><LogOut className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-primary mb-2">Quality intelligence</p>
              <h1 className="text-2xl font-bold text-foreground">Pull request overview</h1>
              <p className="text-xs text-muted-foreground mt-1">Live open pull requests from your connected repositories.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/settings")} className="border-border/50 text-muted-foreground text-xs h-8">
                <Github className="w-3.5 h-3.5 mr-1.5" /> Repositories
              </Button>
              <Button variant="ghost" size="sm" aria-label="Refresh pull requests" onClick={() => void loadData(true)} disabled={refreshing} className="h-8 w-8 p-0">
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-4 mb-8"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          ) : (
            <>
              <section className="grid sm:grid-cols-3 gap-6 py-5 border-y border-border/60 mb-8" aria-label="Pull request metrics">
                <div className="flex items-center gap-3">
                  <GitPullRequest className="w-5 h-5 text-muted-foreground" />
                  <div><p className="text-xl font-semibold text-foreground">{pullRequests.length}</p><p className="text-[11px] text-muted-foreground">Open pull requests</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                  <div><p className="text-xl font-semibold text-foreground">{averageRisk === null ? "—" : averageRisk}</p><p className="text-[11px] text-muted-foreground">Average risk score {averageRisk === null ? "· analyze a PR to begin" : `· ${highRisk} high risk`}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="w-5 h-5 text-muted-foreground" />
                  <div><p className="text-xl font-semibold text-foreground">{repositories.length}</p><p className="text-[11px] text-muted-foreground">Connected repositories</p></div>
                </div>
              </section>

              {repositories.length === 0 ? (
                <EmptyState type="generic" title="Connect a repository" description="Add a public repository, or connect GitHub first for private access. Its open pull requests will appear here." action={{ label: "Open repository settings", onClick: () => navigate("/settings") }} />
              ) : pullRequests.length === 0 ? (
                <EmptyState type="generic" title="No open pull requests" description="There are no open pull requests in the connected repositories. Refresh after opening a pull request on GitHub." action={{ label: "Manage repositories", onClick: () => navigate("/settings") }} />
              ) : (
                <section aria-labelledby="pull-requests-heading">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-1">
                    <h2 id="pull-requests-heading" className="text-sm font-semibold text-foreground">Open pull requests <span className="text-muted-foreground font-normal">({pullRequests.length})</span></h2>
                    <span className="text-[10px] text-muted-foreground">Updated from GitHub</span>
                  </div>
                  <div className="divide-y divide-border/50">
                    {pullRequests.map((pr, index) => {
                      const repository = repoFor(pr.repo_id);
                      return (
                        <motion.button
                          type="button"
                          key={pr.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(index * 0.025, 0.2) }}
                          onClick={() => navigate(`/pr/${pr.id}`)}
                          className="w-full flex items-center gap-3 text-left py-4 px-2 hover:bg-secondary/30 transition-colors group"
                        >
                          <span className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-secondary/50 font-mono text-sm font-semibold ${riskColor(pr.risk_score)}`}>
                            {pr.risk_score === null ? <Sparkles className="w-4 h-4" /> : pr.risk_score}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-foreground truncate">{pr.title}</span>
                              <span className="text-[10px] text-muted-foreground shrink-0">#{pr.github_pr_number}</span>
                            </span>
                            <span className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground flex-wrap">
                              <span>{repository?.name ?? "GitHub repository"}</span>
                              <span>·</span><span>{pr.author ?? "Unknown author"}</span>
                              <span>·</span><span className="inline-flex items-center gap-1"><FileCode2 className="w-3 h-3" />{pr.files_changed ?? 0} files</span>
                              <span>·</span><span className="inline-flex items-center gap-1"><Clock3 className="w-3 h-3" />{formatAge(pr.updated_at)}</span>
                            </span>
                          </span>
                          <span className="hidden sm:block text-right mr-2">
                            <span className="block text-[10px] text-muted-foreground">{pr.analysis_status === "complete" ? "Analysis ready" : pr.analysis_status === "failed" ? "Analysis needs attention" : "Not analyzed"}</span>
                            <span className="block text-[10px] text-muted-foreground mt-1">+{pr.additions ?? 0} / −{pr.deletions ?? 0}</span>
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </motion.button>
                      );
                    })}
                  </div>
                </section>
              )}

              {pullRequests.some(pr => pr.analysis_status === "failed") && (
                <p className="flex items-center gap-2 text-[11px] text-muted-foreground mt-5"><AlertCircle className="w-3.5 h-3.5 text-warning" />Some analyses need attention. Open a pull request to retry its analysis.</p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;