import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Github, Loader2, ExternalLink, Zap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ScrollReveal from "@/components/ui/ScrollReveal";
import EmptyState from "@/components/ui/EmptyState";
import SkeletonCard from "@/components/ui/SkeletonCard";

interface Repository {
  id: string;
  github_url: string;
  name: string;
  description: string | null;
  default_branch: string;
  created_at: string;
}

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchRepos = async () => {
    const { data, error } = await supabase
      .from("repositories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load repositories");
    } else {
      setRepos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const extractRepoName = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
    return match ? match[1] : url;
  };

  const handleAddRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    const githubUrlPattern = /^https?:\/\/github\.com\/[^\/]+\/[^\/]+/;
    if (!githubUrlPattern.test(repoUrl.trim())) {
      toast.error("Please enter a valid GitHub repository URL (e.g. https://github.com/owner/repo)");
      return;
    }

    setAdding(true);
    const name = extractRepoName(repoUrl.trim());

    const { error } = await supabase.from("repositories").insert({
      user_id: user!.id,
      github_url: repoUrl.trim(),
      name,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Repository connected!");
      setRepoUrl("");
      setShowForm(false);
      fetchRepos();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("repositories").delete().eq("id", id);
    if (error) {
      toast.error("Failed to remove repository");
    } else {
      toast.success("Repository removed");
      setRepos(repos.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="text-base font-bold text-foreground">
                SHIPWISE<span className="gradient-text">.ai</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground h-8 w-8 p-0">
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-3xl">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground text-xs mb-4 -ml-2 h-7">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-foreground">Settings</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Manage your connected repositories</p>
            </div>
            <Button size="sm" onClick={() => setShowForm(true)} className="glow-sm text-xs h-8">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Connect Repository
            </Button>
          </div>

          {/* Add Repo Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Github className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-foreground">Connect a GitHub Repository</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Paste your GitHub repository URL below. SHIPWISE.ai will analyze PRs from this repo.
                  </p>
                  <form onSubmit={handleAddRepo} className="flex gap-2">
                    <Input
                      placeholder="https://github.com/owner/repository"
                      value={repoUrl}
                      onChange={e => setRepoUrl(e.target.value)}
                      className="bg-secondary/50 border-border/50 h-10 flex-1 font-mono text-xs"
                    />
                    <Button type="submit" size="sm" className="h-10 px-4" disabled={adding}>
                      {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Connect"}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-10" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Repos List */}
          {loading ? (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : repos.length === 0 ? (
            <EmptyState
              type="generic"
              title="No repositories connected"
              description="Connect a GitHub repository to start analyzing pull requests with AI."
              action={{ label: "Connect Repository", onClick: () => setShowForm(true) }}
            />
          ) : (
            <div className="space-y-3">
              {repos.map((repo, i) => (
                <ScrollReveal key={repo.id} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    className="glass rounded-xl p-4 flex items-center gap-4 cursor-pointer"
                    onClick={() => navigate(`/dashboard?repo=${repo.id}`)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                      <Github className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{repo.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">{repo.github_url}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={repo.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                        onClick={e => { e.stopPropagation(); handleDelete(repo.id); }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
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
