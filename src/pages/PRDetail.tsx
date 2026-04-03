import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GitPullRequest, FileCode, AlertTriangle, CheckCircle, TestTube, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/ProgressBar";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AIThinking from "@/components/ui/AIThinking";
import SuccessAnimation from "@/components/ui/SuccessAnimation";
import { useState, useEffect } from "react";

const prData: Record<string, any> = {
  "1": {
    title: "feat: add payment processing module",
    author: "sarah.dev",
    time: "2 minutes ago",
    risk: 82,
    files: 12,
    additions: 340,
    deletions: 45,
    branch: "feature/payment-processing",
    riskBreakdown: { logic: 78, integration: 92, regression: 65 },
    tests: [
      { text: "Test payment flow with expired credit card", priority: "critical" },
      { text: "Verify webhook retry on timeout", priority: "high" },
      { text: "Test concurrent payment sessions", priority: "high" },
      { text: "Validate currency conversion edge cases", priority: "medium" },
      { text: "Check refund flow for partial payments", priority: "medium" },
    ],
    changedFiles: [
      { name: "src/services/payment.ts", additions: 145, deletions: 12, risk: "high" },
      { name: "src/hooks/usePayment.ts", additions: 67, deletions: 0, risk: "medium" },
      { name: "src/components/PaymentForm.tsx", additions: 89, deletions: 23, risk: "low" },
      { name: "src/api/stripe.ts", additions: 39, deletions: 10, risk: "high" },
    ],
  },
  "2": {
    title: "fix: resolve auth token refresh bug",
    author: "mike.eng",
    time: "15 minutes ago",
    risk: 45,
    files: 4,
    additions: 89,
    deletions: 23,
    branch: "fix/auth-token-refresh",
    riskBreakdown: { logic: 35, integration: 55, regression: 40 },
    tests: [
      { text: "Test token refresh with expired session", priority: "high" },
      { text: "Verify concurrent refresh requests", priority: "medium" },
    ],
    changedFiles: [
      { name: "src/auth/tokenManager.ts", additions: 45, deletions: 12, risk: "medium" },
      { name: "src/auth/session.ts", additions: 34, deletions: 8, risk: "low" },
    ],
  },
};

const getRiskLabel = (risk: number) => {
  if (risk >= 70) return { label: "High Risk", color: "text-destructive", bg: "bg-destructive/10" };
  if (risk >= 40) return { label: "Medium Risk", color: "text-warning", bg: "bg-warning/10" };
  return { label: "Low Risk", color: "text-primary", bg: "bg-primary/10" };
};

const PRDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const pr = prData[id || ""] || prData["1"];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const riskInfo = getRiskLabel(pr.risk);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AIThinking label="Analyzing PR changes" size="lg" />
      </div>
    );
  }

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
            <div className={`${riskInfo.bg} rounded-lg px-4 py-2 text-center`}>
              <p className={`text-2xl font-bold ${riskInfo.color}`}>{pr.risk}</p>
              <p className={`text-[10px] font-medium ${riskInfo.color}`}>{riskInfo.label}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Risk Breakdown */}
            <ScrollReveal>
              <div className="glass rounded-xl p-5">
                <h3 className="text-xs font-medium text-muted-foreground mb-4">Risk Breakdown</h3>
                <div className="space-y-3">
                  <ProgressBar value={pr.riskBreakdown.logic} label="Logic Risk" variant={pr.riskBreakdown.logic >= 70 ? "destructive" : pr.riskBreakdown.logic >= 40 ? "warning" : "default"} size="md" />
                  <ProgressBar value={pr.riskBreakdown.integration} label="Integration Risk" variant={pr.riskBreakdown.integration >= 70 ? "destructive" : pr.riskBreakdown.integration >= 40 ? "warning" : "default"} size="md" />
                  <ProgressBar value={pr.riskBreakdown.regression} label="Regression Risk" variant={pr.riskBreakdown.regression >= 70 ? "destructive" : pr.riskBreakdown.regression >= 40 ? "warning" : "default"} size="md" />
                </div>
              </div>
            </ScrollReveal>

            {/* Changed Files */}
            <ScrollReveal delay={0.1}>
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
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        file.risk === "high" ? "bg-destructive/10 text-destructive" :
                        file.risk === "medium" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
                      }`}>{file.risk}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Summary */}
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
                  {pr.tests.map((test: any, i: number) => (
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
                type={pr.risk >= 70 ? "warning" : "success"}
                message={pr.risk >= 70 ? "Review recommended before shipping" : "Safe to ship with tests"}
                show={true}
              />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDetail;
