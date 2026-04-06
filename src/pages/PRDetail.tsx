import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GitPullRequest, FileCode, AlertTriangle, CheckCircle, TestTube, Clock, User, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/ProgressBar";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AIThinking from "@/components/ui/AIThinking";
import SuccessAnimation from "@/components/ui/SuccessAnimation";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Mock PR metadata (will come from GitHub later)
const prData: Record<string, any> = {
  "1": {
    title: "feat: add payment processing module",
    author: "sarah.dev",
    time: "2 minutes ago",
    files: 12,
    additions: 340,
    deletions: 45,
    branch: "feature/payment-processing",
    changedFiles: [
      { name: "src/services/payment.ts", additions: 145, deletions: 12 },
      { name: "src/hooks/usePayment.ts", additions: 67, deletions: 0 },
      { name: "src/components/PaymentForm.tsx", additions: 89, deletions: 23 },
      { name: "src/api/stripe.ts", additions: 39, deletions: 10 },
    ],
    diffContent: `// payment.ts - New payment processing service
export class PaymentService {
  private stripe: Stripe;
  constructor(apiKey: string) { this.stripe = new Stripe(apiKey); }
  
  async processPayment(amount: number, currency: string, token: string) {
    const charge = await this.stripe.charges.create({ amount, currency, source: token });
    if (!charge.paid) throw new Error('Payment failed');
    return charge;
  }
  
  async refund(chargeId: string, amount?: number) {
    return this.stripe.refunds.create({ charge: chargeId, amount });
  }
  
  async createSubscription(customerId: string, priceId: string) {
    return this.stripe.subscriptions.create({ customer: customerId, items: [{ price: priceId }] });
  }
}`,
  },
  "2": {
    title: "fix: resolve auth token refresh bug",
    author: "mike.eng",
    time: "15 minutes ago",
    files: 4,
    additions: 89,
    deletions: 23,
    branch: "fix/auth-token-refresh",
    changedFiles: [
      { name: "src/auth/tokenManager.ts", additions: 45, deletions: 12 },
      { name: "src/auth/session.ts", additions: 34, deletions: 8 },
      { name: "src/middleware/auth.ts", additions: 10, deletions: 3 },
    ],
    diffContent: `// tokenManager.ts - Fix token refresh race condition
export class TokenManager {
  private refreshPromise: Promise<string> | null = null;
  
  async getToken(): Promise<string> {
    const token = this.getCachedToken();
    if (token && !this.isExpired(token)) return token;
    
    // Prevent concurrent refresh calls
    if (!this.refreshPromise) {
      this.refreshPromise = this.refreshToken().finally(() => {
        this.refreshPromise = null;
      });
    }
    return this.refreshPromise;
  }
  
  private async refreshToken(): Promise<string> {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Token refresh failed');
    const { accessToken } = await response.json();
    this.cacheToken(accessToken);
    return accessToken;
  }
}`,
  },
  "3": {
    title: "chore: update dependencies",
    author: "bot",
    time: "1h ago",
    files: 2,
    additions: 156,
    deletions: 143,
    branch: "chore/update-deps",
    changedFiles: [
      { name: "package.json", additions: 78, deletions: 72 },
      { name: "bun.lock", additions: 78, deletions: 71 },
    ],
  },
  "4": {
    title: "feat: user profile settings page",
    author: "alex.ui",
    time: "3h ago",
    files: 8,
    additions: 220,
    deletions: 30,
    branch: "feature/user-profile",
    changedFiles: [
      { name: "src/pages/Settings.tsx", additions: 90, deletions: 0 },
      { name: "src/components/ProfileForm.tsx", additions: 65, deletions: 10 },
      { name: "src/hooks/useProfile.ts", additions: 45, deletions: 5 },
      { name: "src/api/profile.ts", additions: 20, deletions: 15 },
    ],
  },
};

interface AIAnalysis {
  overallRisk: number;
  riskBreakdown: { logic: number; integration: number; regression: number };
  summary: string;
  verdict: string;
  verdictMessage: string;
  tests: { text: string; priority: string }[];
  reviewComments: { file: string; comment: string; severity: string }[];
}

const getRiskVariant = (risk: number): "destructive" | "warning" | "default" =>
  risk >= 70 ? "destructive" : risk >= 40 ? "warning" : "default";

const getRiskLabel = (risk: number) => {
  if (risk >= 70) return { label: "High Risk", color: "text-destructive", bg: "bg-destructive/10" };
  if (risk >= 40) return { label: "Medium Risk", color: "text-warning", bg: "bg-warning/10" };
  return { label: "Low Risk", color: "text-primary", bg: "bg-primary/10" };
};

const PRDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pr = prData[id || ""] || prData["1"];

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-pr", {
        body: {
          title: pr.title,
          branch: pr.branch,
          author: pr.author,
          files: pr.files,
          additions: pr.additions,
          deletions: pr.deletions,
          changedFiles: pr.changedFiles,
          diffContent: pr.diffContent || null,
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setAnalysis(data as AIAnalysis);
    } catch (e: any) {
      console.error("Analysis failed:", e);
      setError(e.message || "Analysis failed");
      toast({
        title: "Analysis failed",
        description: e.message || "Could not analyze this PR. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [pr]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AIThinking label="AI is analyzing this PR..." size="lg" />
      </div>
    );
  }

  const riskInfo = analysis ? getRiskLabel(analysis.overallRisk) : getRiskLabel(50);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass border-b border-border/30">
        <div className="container mx-auto px-6 py-4 max-w-5xl">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground text-xs mb-3 -ml-2 h-7">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
          </Button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GitPullRequest className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground font-mono">{pr.branch}</span>
              </div>
              <h1 className="text-lg font-bold text-foreground">{pr.title}</h1>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {pr.author}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {pr.time}</span>
                <span className="flex items-center gap-1"><FileCode className="w-3 h-3" /> {pr.files} files</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={runAnalysis} className="text-xs h-7 border-border/50">
                <RefreshCw className="w-3 h-3 mr-1" /> Re-analyze
              </Button>
              {analysis && (
                <div className={`${riskInfo.bg} rounded-lg px-4 py-2 text-center`}>
                  <p className={`text-2xl font-bold ${riskInfo.color}`}>{analysis.overallRisk}</p>
                  <p className={`text-[10px] font-medium ${riskInfo.color}`}>{riskInfo.label}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-5xl">
        {error && !analysis ? (
          <div className="glass rounded-xl p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
            <p className="text-sm text-foreground mb-2">Analysis failed</p>
            <p className="text-xs text-muted-foreground mb-4">{error}</p>
            <Button size="sm" onClick={runAnalysis}>Try Again</Button>
          </div>
        ) : analysis ? (
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* AI Summary */}
              <ScrollReveal>
                <div className="glass rounded-xl p-5">
                  <h3 className="text-xs font-medium text-muted-foreground mb-2">AI Summary</h3>
                  <p className="text-sm text-foreground leading-relaxed">{analysis.summary}</p>
                </div>
              </ScrollReveal>

              {/* Risk Breakdown */}
              <ScrollReveal>
                <div className="glass rounded-xl p-5">
                  <h3 className="text-xs font-medium text-muted-foreground mb-4">Risk Breakdown</h3>
                  <div className="space-y-3">
                    <ProgressBar value={analysis.riskBreakdown.logic} label="Logic Risk" variant={getRiskVariant(analysis.riskBreakdown.logic)} size="md" />
                    <ProgressBar value={analysis.riskBreakdown.integration} label="Integration Risk" variant={getRiskVariant(analysis.riskBreakdown.integration)} size="md" />
                    <ProgressBar value={analysis.riskBreakdown.regression} label="Regression Risk" variant={getRiskVariant(analysis.riskBreakdown.regression)} size="md" />
                  </div>
                </div>
              </ScrollReveal>

              {/* Code Review Comments */}
              {analysis.reviewComments?.length > 0 && (
                <ScrollReveal delay={0.1}>
                  <div className="glass rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-3.5 h-3.5 text-primary" />
                      <h3 className="text-xs font-medium text-muted-foreground">AI Code Review</h3>
                    </div>
                    <div className="space-y-2">
                      {analysis.reviewComments.map((comment, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className={`p-3 rounded-lg border ${
                            comment.severity === "error" ? "border-destructive/30 bg-destructive/5" :
                            comment.severity === "warning" ? "border-warning/30 bg-warning/5" :
                            "border-border/30 bg-secondary/30"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-muted-foreground">{comment.file}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              comment.severity === "error" ? "bg-destructive/10 text-destructive" :
                              comment.severity === "warning" ? "bg-warning/10 text-warning" :
                              "bg-primary/10 text-primary"
                            }`}>{comment.severity}</span>
                          </div>
                          <p className="text-xs text-foreground">{comment.comment}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Changed Files */}
              <ScrollReveal delay={0.15}>
                <div className="glass rounded-xl p-5">
                  <h3 className="text-xs font-medium text-muted-foreground mb-3">Changed Files</h3>
                  <div className="space-y-2">
                    {pr.changedFiles.map((file: any, i: number) => (
                      <motion.div
                        key={file.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30"
                      >
                        <FileCode className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs font-mono text-foreground flex-1 truncate">{file.name}</span>
                        <span className="text-[10px] text-primary font-mono">+{file.additions}</span>
                        <span className="text-[10px] text-destructive font-mono">-{file.deletions}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Summary Stats */}
              <ScrollReveal>
                <div className="glass rounded-xl p-5">
                  <h3 className="text-xs font-medium text-muted-foreground mb-3">Summary</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg bg-secondary/50 text-center">
                      <p className="text-lg font-bold text-primary">+{pr.additions}</p>
                      <p className="text-[10px] text-muted-foreground">Additions</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-secondary/50 text-center">
                      <p className="text-lg font-bold text-destructive">-{pr.deletions}</p>
                      <p className="text-[10px] text-muted-foreground">Deletions</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* AI Test Suggestions */}
              <ScrollReveal delay={0.1}>
                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TestTube className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-xs font-medium text-muted-foreground">AI Test Suggestions</h3>
                  </div>
                  <div className="space-y-2">
                    {analysis.tests.map((test, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-2.5 rounded-lg bg-secondary/30"
                      >
                        <p className="text-xs text-foreground mb-1">{test.text}</p>
                        <span className={`text-[10px] font-medium ${
                          test.priority === "critical" ? "text-destructive" :
                          test.priority === "high" ? "text-warning" : "text-muted-foreground"
                        }`}>{test.priority}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* AI Verdict */}
              <ScrollReveal delay={0.2}>
                <SuccessAnimation
                  type={analysis.verdict === "safe_to_ship" ? "success" : "warning"}
                  message={analysis.verdictMessage}
                  show={true}
                />
              </ScrollReveal>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PRDetail;
