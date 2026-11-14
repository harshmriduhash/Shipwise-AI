import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, ExternalLink, FileCode, GitPullRequest, Loader2, MessageSquare, RefreshCw, TestTube, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/ProgressBar";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AIThinking from "@/components/ui/AIThinking";
import SuccessAnimation from "@/components/ui/SuccessAnimation";
import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { toast } from "sonner";

type PullRequest = Tables<"pull_requests">;
type Repository = Pick<Tables<"repositories">, "name" | "github_url">;
type Suggestion = Tables<"test_suggestions">;
type ChangedFile = { name: string; status?: string; additions: number; deletions: number };
type ReviewComment = { file: string; comment: string; severity: "error" | "warning" | "info" };
type TestSuggestion = { text: string; priority: "critical" | "high" | "medium" | "low" };
type Analysis = {
  overallRisk: number;
  riskBreakdown: { logic: number; integration: number; regression: number };
  summary: string;
  verdict: string;
  verdictMessage: string;
  tests: TestSuggestion[];
  reviewComments: ReviewComment[];
};

function changedFilesFromJson(value: Json): ChangedFile[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) return [];
    const file = row as Record<string, Json>;
    if (typeof file.name !== "string") return [];
    return [{
      name: file.name,
      status: typeof file.status === "string" ? file.status : undefined,
      additions: typeof file.additions === "number" ? file.additions : 0,
      deletions: typeof file.deletions === "number" ? file.deletions : 0,
    }];
  });
}

function commentsFromJson(value: Json): ReviewComment[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) return [];
    const comment = row as Record<string, Json>;
    if (typeof comment.file !== "string" || typeof comment.comment !== "string") return [];
    const severity = comment.severity === "error" || comment.severity === "warning" ? comment.severity : "info";
    return [{ file: comment.file, comment: comment.comment, severity }];
  });
}

async function invokeErrorMessage(error: unknown) {
  if (error instanceof FunctionsHttpError) {
    try {
      const response = error.context;
      const body = await response.json() as { error?: unknown };
      if (typeof body.error === "string") return body.error;
    } catch {
      // Supabase may return an empty or non-JSON edge error response.
    }
  }
  return error instanceof Error ? error.message : "Could not analyze this pull request.";
}

function riskLabel(score: number) {
  if (score >= 70) return { label: "High risk", color: "text-destructive", background: "bg-destructive/10" };
  if (score >= 40) return { label: "Review recommended", color: "text-warning", background: "bg-warning/10" };
  return { label: "Lower risk", color: "text-primary", background: "bg-primary/10" };
}

const PRDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pullRequest, setPullRequest] = useState<PullRequest | null>(null);
  const [repository, setRepository] = useState<Repository | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPullRequest = useCallback(async () => {
    if (!id) {
      setError("This pull request could not be found.");
      setLoading(false);
      return;
    }
    const { data, error: prError } = await supabase.from("pull_requests").select("*").eq("id", id).maybeSingle();
    if (prError || !data) {
      setError(prError?.message ?? "This pull request could not be found.");
      setLoading(false);
      return;
    }
    const row = data as PullRequest;
    setPullRequest(row);
    const [repoResult, testResult] = await Promise.all([
      supabase.from("repositories").select("name,github_url").eq("id", row.repo_id).maybeSingle(),
      supabase.from("test_suggestions").select("*").eq("pr_id", row.id).order("created_at", { ascending: true }),
    ]);
    if (repoResult.error) toast.error("Repository details could not be loaded.");
    else setRepository(repoResult.data as Repository | null);
    if (testResult.error) toast.error("Test suggestions could not be loaded.");
    else setSuggestions((testResult.data ?? []) as Suggestion[]);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void loadPullRequest();
  }, [loadPullRequest]);

  const runAnalysis = async () => {
    if (!pullRequest || analyzing) return;
    setAnalyzing(true);
    setError(null);
    try {
      const { data, error: functionError } = await supabase.functions.invoke("github-analyze-pr", {
        body: { repositoryId: pullRequest.repo_id, prNumber: pullRequest.github_pr_number },
      });
      if (functionError) throw functionError;
      if (typeof data?.error === "string") throw new Error(data.error);
      const { error: reloadError } = await supabase.from("pull_requests").select("*").eq("id", pullRequest.id).single().then(async result => {
        if (!result.error && result.data) setPullRequest(result.data as PullRequest);
        const testResult = await supabase.from("test_suggestions").select("*").eq("pr_id", pullRequest.id).order("created_at", { ascending: true });
        if (!testResult.error) setSuggestions((testResult.data ?? []) as Suggestion[]);
        return result;
      });
      if (reloadError) throw reloadError;
      toast.success("Pull request analysis is ready.");
    } catch (analysisError) {
      const message = await invokeErrorMessage(analysisError);
      setError(message);
      toast.error(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleSuggestion = async (suggestion: Suggestion) => {
    const { error: updateError } = await supabase.from("test_suggestions")
      .update({ completed: !suggestion.completed })
      .eq("id", suggestion.id);
    if (updateError) toast.error("Could not update that test recommendation.");
    else setSuggestions(previous => previous.map(item => item.id === suggestion.id ? { ...item, completed: !item.completed } : item));
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><AIThinking label="Loading pull request…" size="lg" /></div>;
  if (!pullRequest) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center"><AlertTriangle className="w-8 h-8 text-warning mx-auto mb-3" /><p className="text-sm text-foreground">{error ?? "Pull request not found"}</p><Button className="mt-4" onClick={() => navigate("/dashboard")}>Back to dashboard</Button></div>
    </div>
  );

  const riskScore = pullRequest.risk_score;
  const risk = riskScore === null ? null : riskLabel(riskScore);
  const changedFiles = changedFilesFromJson(pullRequest.changed_files);
  const reviewComments = commentsFromJson(pullRequest.ai_review_comments);
  const analysisReady = pullRequest.analysis_status === "complete" && riskScore !== null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="container mx-auto max-w-5xl px-6 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground text-xs mb-3 -ml-2 h-7"><ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to pull requests</Button>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1"><GitPullRequest className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground font-mono">{repository?.name ?? "GitHub"} · #{pullRequest.github_pr_number}</span></div>
              <h1 className="text-lg font-bold text-foreground">{pullRequest.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{pullRequest.author ?? "Unknown author"}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Updated {new Date(pullRequest.updated_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><FileCode className="w-3 h-3" />{pullRequest.files_changed ?? changedFiles.length} files</span>
                {pullRequest.github_html_url && <a href={pullRequest.github_html_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">Open on GitHub <ExternalLink className="w-3 h-3" /></a>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => void runAnalysis()} disabled={analyzing} className="text-xs h-8 border-border/50">
                {analyzing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
                {analysisReady ? "Re-analyze" : "Analyze pull request"}
              </Button>
              {risk && <div className={`${risk.background} rounded-lg px-3 py-1.5 text-center`}><p className={`text-xl font-bold ${risk.color}`}>{riskScore}</p><p className={`text-[10px] font-medium ${risk.color}`}>{risk.label}</p></div>}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-6 py-6">
        {analyzing && <div className="border-y border-border/60 py-6 mb-6"><AIThinking label="Reviewing the live GitHub diff…" /></div>}
        {error && <div role="alert" className="flex items-start gap-3 border-y border-destructive/30 py-4 mb-5"><AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" /><div className="flex-1"><p className="text-sm font-medium text-foreground">Analysis could not be completed</p><p className="text-xs text-muted-foreground mt-1">{error}</p></div><Button size="sm" variant="outline" onClick={() => void runAnalysis()}>Try again</Button></div>}
        {!analysisReady && !analyzing && !error && <div className="flex items-start gap-3 border-y border-border/60 py-4 mb-5"><SparklesIcon /><div><p className="text-sm font-medium text-foreground">Analysis not available yet</p><p className="text-xs text-muted-foreground mt-1">Analyze the current GitHub diff to get risk scores, review notes, and test recommendations.</p></div></div>}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {analysisReady && <>
              <ScrollReveal><section className="border-b border-border/60 pb-5"><h2 className="text-xs font-medium text-muted-foreground mb-2">AI summary</h2><p className="text-sm text-foreground leading-relaxed">{pullRequest.ai_summary}</p></section></ScrollReveal>
              <ScrollReveal><section className="border-b border-border/60 pb-5"><h2 className="text-xs font-medium text-muted-foreground mb-4">Risk breakdown</h2><div className="space-y-3"><ProgressBar value={pullRequest.ai_risk_logic ?? 0} label="Logic risk" variant={riskLabel(pullRequest.ai_risk_logic ?? 0).label === "High risk" ? "destructive" : riskLabel(pullRequest.ai_risk_logic ?? 0).label === "Review recommended" ? "warning" : "default"} size="md" /><ProgressBar value={pullRequest.ai_risk_integration ?? 0} label="Integration risk" variant={riskLabel(pullRequest.ai_risk_integration ?? 0).label === "High risk" ? "destructive" : riskLabel(pullRequest.ai_risk_integration ?? 0).label === "Review recommended" ? "warning" : "default"} size="md" /><ProgressBar value={pullRequest.ai_risk_regression ?? 0} label="Regression risk" variant={riskLabel(pullRequest.ai_risk_regression ?? 0).label === "High risk" ? "destructive" : riskLabel(pullRequest.ai_risk_regression ?? 0).label === "Review recommended" ? "warning" : "default"} size="md" /></div></section></ScrollReveal>
              {reviewComments.length > 0 && <ScrollReveal><section className="border-b border-border/60 pb-5"><div className="flex items-center gap-2 mb-3"><MessageSquare className="w-3.5 h-3.5 text-primary" /><h2 className="text-xs font-medium text-muted-foreground">AI code review</h2></div><div className="space-y-3">{reviewComments.map((comment, index) => <div key={`${comment.file}-${index}`} className="border-l-2 border-border pl-3"><div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-mono text-muted-foreground">{comment.file}</span><span className={`text-[10px] font-medium ${comment.severity === "error" ? "text-destructive" : comment.severity === "warning" ? "text-warning" : "text-primary"}`}>{comment.severity}</span></div><p className="text-xs text-foreground leading-relaxed">{comment.comment}</p></div>)}</div></section></ScrollReveal>}
            </>}
            <ScrollReveal><section><h2 className="text-xs font-medium text-muted-foreground mb-3">Changed files</h2>{changedFiles.length === 0 ? <p className="text-xs text-muted-foreground">File details are available after analysis.</p> : <div className="divide-y divide-border/40">{changedFiles.map(file => <div key={file.name} className="flex items-center gap-3 py-2.5"><FileCode className="w-3.5 h-3.5 text-muted-foreground shrink-0" /><span className="text-xs font-mono text-foreground flex-1 truncate">{file.name}</span><span className="text-[10px] text-primary font-mono">+{file.additions}</span><span className="text-[10px] text-destructive font-mono">−{file.deletions}</span></div>)}</div>}</section></ScrollReveal>
          </div>

          <aside className="space-y-6">
            <section className="border-b border-border/60 pb-5"><h2 className="text-xs font-medium text-muted-foreground mb-3">Change size</h2><div className="grid grid-cols-2 gap-3"><div><p className="text-lg font-semibold text-primary">+{pullRequest.additions ?? 0}</p><p className="text-[10px] text-muted-foreground">Added lines</p></div><div><p className="text-lg font-semibold text-destructive">−{pullRequest.deletions ?? 0}</p><p className="text-[10px] text-muted-foreground">Removed lines</p></div></div></section>
            <section className="border-b border-border/60 pb-5"><div className="flex items-center gap-2 mb-3"><TestTube className="w-3.5 h-3.5 text-primary" /><h2 className="text-xs font-medium text-muted-foreground">Test recommendations</h2></div>{suggestions.length === 0 ? <p className="text-xs text-muted-foreground">Run an analysis to get tests for this change.</p> : <div className="space-y-2.5">{suggestions.map(suggestion => <label key={suggestion.id} className="flex items-start gap-2.5 cursor-pointer"><input type="checkbox" checked={suggestion.completed} onChange={() => void toggleSuggestion(suggestion)} className="mt-0.5 rounded border-border accent-primary" /><span className="flex-1"><span className={`block text-xs ${suggestion.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{suggestion.description}</span><span className={`text-[10px] font-medium ${suggestion.priority === "critical" ? "text-destructive" : suggestion.priority === "high" ? "text-warning" : "text-muted-foreground"}`}>{suggestion.priority}</span></span></label>)}</div>}</section>
            {analysisReady && pullRequest.ai_verdict_message && <SuccessAnimation type={pullRequest.ai_verdict === "safe_to_ship" ? "success" : pullRequest.ai_verdict === "high_risk_block" ? "error" : "warning"} message={pullRequest.ai_verdict_message} show />}
          </aside>
        </div>
      </main>
    </div>
  );
};

function SparklesIcon() {
  return <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />;
}

export default PRDetail;