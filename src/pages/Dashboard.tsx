import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, GitPullRequest, TestTube, Activity,
  ChevronRight, AlertTriangle, CheckCircle, Clock,
  FileCode, Bell, LogOut, Zap, ArrowRight, Settings, Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ProgressBar from "@/components/ui/ProgressBar";
import AIThinking from "@/components/ui/AIThinking";
import SkeletonCard, { SkeletonList } from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const mockPRs = [
  { id: 1, title: "feat: add payment processing module", author: "sarah.dev", risk: 82, tests: 3, time: "2m ago", files: 12, additions: 340, deletions: 45 },
  { id: 2, title: "fix: resolve auth token refresh bug", author: "mike.eng", risk: 45, tests: 5, time: "15m ago", files: 4, additions: 89, deletions: 23 },
  { id: 3, title: "chore: update dependencies", author: "bot", risk: 12, tests: 1, time: "1h ago", files: 2, additions: 156, deletions: 143 },
  { id: 4, title: "feat: user profile settings page", author: "alex.ui", risk: 34, tests: 4, time: "3h ago", files: 8, additions: 220, deletions: 30 },
];

const mockActivity = [
  { type: "risk", message: "PR #142 risk score increased to 82", time: "2m ago", icon: AlertTriangle },
  { type: "test", message: "5 test suggestions generated for PR #139", time: "15m ago", icon: TestTube },
  { type: "success", message: "PR #137 shipped successfully", time: "1h ago", icon: CheckCircle },
  { type: "analysis", message: "New PR #142 analysis started", time: "2h ago", icon: Activity },
];

const testSuggestions = [
  { id: 1, text: "Test payment flow with expired credit card", priority: "critical", checked: false },
  { id: 2, text: "Verify webhook retry on timeout", priority: "high", checked: true },
  { id: 3, text: "Test concurrent payment sessions", priority: "high", checked: false },
  { id: 4, text: "Validate currency conversion edge cases", priority: "medium", checked: false },
  { id: 5, text: "Check refund flow for partial payments", priority: "medium", checked: true },
];

const getRiskColor = (risk: number) => {
  if (risk >= 70) return "text-destructive";
  if (risk >= 40) return "text-warning";
  return "text-primary";
};

const getRiskBg = (risk: number) => {
  if (risk >= 70) return "bg-destructive/10";
  if (risk >= 40) return "bg-warning/10";
  return "bg-primary/10";
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [checks, setChecks] = useState(testSuggestions.map(t => t.checked));
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const overallRisk = 58;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="text-base font-bold text-foreground">
                SHIPWISE<span className="gradient-text">.ai</span>
              </span>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline">acme-corp/web-platform</span>
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
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-foreground">Release Dashboard</h1>
              <p className="text-xs text-muted-foreground mt-0.5">main branch · last synced 2m ago</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-border/50 text-muted-foreground text-xs h-8">
                <Bell className="w-3.5 h-3.5 mr-1.5" /> Alerts
              </Button>
              <Button size="sm" onClick={handleAnalyze} className="glow-sm text-xs h-8" disabled={analyzing}>
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1 h-1 rounded-full bg-primary-foreground animate-ai-pulse" style={{ animationDelay: `${i*0.2}s` }} />
                      ))}
                    </div>
                    Analyzing
                  </span>
                ) : (
                  <><GitPullRequest className="w-3.5 h-3.5 mr-1.5" /> Analyze PR</>
                )}
              </Button>
            </div>
          </div>

          {/* AI Analysis Banner */}
          <AnimatePresence>
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="glass rounded-xl p-6 flex items-center justify-center">
                  <AIThinking label="AI is analyzing your latest changes" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="grid lg:grid-cols-3 gap-4 mb-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <>
              {/* Top Row */}
              <div className="grid lg:grid-cols-3 gap-4 mb-4">
                {/* Risk Score */}
                <ScrollReveal>
                  <div className="glass rounded-xl p-5 h-full">
                    <h3 className="text-xs font-medium text-muted-foreground mb-3">Overall Risk Score</h3>
                    <div className="flex items-center gap-5">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                          <motion.circle
                            cx="50" cy="50" r="42" fill="none"
                            stroke="hsl(var(--warning))" strokeWidth="6"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0 264" }}
                            animate={{ strokeDasharray: `${overallRisk * 2.64} 264` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-warning">{overallRisk}</span>
                        </div>
                      </div>
                      <div className="space-y-3 flex-1">
                        <ProgressBar value={42} label="Logic" variant="warning" />
                        <ProgressBar value={68} label="Integration" variant="warning" />
                        <ProgressBar value={35} label="Regression" variant="default" />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Release Readiness */}
                <ScrollReveal delay={0.1}>
                  <div className="glass rounded-xl p-5 h-full">
                    <h3 className="text-xs font-medium text-muted-foreground mb-3">Release Readiness</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-warning">Caution</p>
                        <p className="text-[10px] text-muted-foreground">Review high-risk PRs before shipping</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { label: "Open PRs", value: "4", color: "text-foreground" },
                        { label: "High Risk", value: "1", color: "text-destructive" },
                        { label: "Tests Passing", value: "92%", color: "text-primary" },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className={`font-medium ${item.color}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>

                {/* Quick Stats */}
                <ScrollReveal delay={0.2}>
                  <div className="glass rounded-xl p-5 h-full">
                    <h3 className="text-xs font-medium text-muted-foreground mb-3">This Sprint</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "PRs Analyzed", value: "24", icon: FileCode },
                        { label: "Bugs Caught", value: "7", icon: Shield },
                        { label: "Tests Suggested", value: "89", icon: TestTube },
                        { label: "Time Saved", value: "18h", icon: Clock },
                      ].map((stat) => (
                        <motion.div
                          key={stat.label}
                          whileHover={{ scale: 1.03 }}
                          className="p-3 rounded-lg bg-secondary/50 text-center cursor-default"
                        >
                          <stat.icon className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
                          <p className="text-lg font-bold text-foreground">{stat.value}</p>
                          <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Bottom Row */}
              <div className="grid lg:grid-cols-3 gap-4">
                {/* PR Insights */}
                <div className="lg:col-span-2 glass rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-muted-foreground">PR Insights</h3>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
                      View All <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {mockPRs.map((pr) => (
                      <HoverCard key={pr.id}>
                        <HoverCardTrigger asChild>
                          <motion.div
                            whileHover={{ x: 2 }}
                            onClick={() => navigate(`/pr/${pr.id}`)}
                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                          >
                            <div className={`w-9 h-9 rounded-lg ${getRiskBg(pr.risk)} flex items-center justify-center`}>
                              <span className={`text-xs font-bold ${getRiskColor(pr.risk)}`}>{pr.risk}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{pr.title}</p>
                              <p className="text-[10px] text-muted-foreground">by {pr.author} · {pr.time}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground">{pr.tests} tests</span>
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                          </motion.div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64 glass" side="left">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">{pr.title}</p>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div><span className="text-muted-foreground">Files</span><br /><span className="font-medium text-foreground">{pr.files}</span></div>
                              <div><span className="text-muted-foreground">Added</span><br /><span className="font-medium text-primary">+{pr.additions}</span></div>
                              <div><span className="text-muted-foreground">Removed</span><br /><span className="font-medium text-destructive">-{pr.deletions}</span></div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  {/* Test Recommendations */}
                  <div className="glass rounded-xl p-5">
                    <h3 className="text-xs font-medium text-muted-foreground mb-3">Test Recommendations</h3>
                    <div className="space-y-1.5">
                      {testSuggestions.map((test, i) => (
                        <motion.label
                          key={test.id}
                          whileHover={{ x: 2 }}
                          className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-secondary/30 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={checks[i]}
                            onChange={() => setChecks(prev => prev.map((c, idx) => idx === i ? !c : c))}
                            className="mt-0.5 rounded border-border accent-primary"
                          />
                          <div>
                            <p className={`text-xs ${checks[i] ? "line-through text-muted-foreground" : "text-foreground"}`}>{test.text}</p>
                            <span className={`text-[10px] font-medium ${
                              test.priority === "critical" ? "text-destructive" :
                              test.priority === "high" ? "text-warning" : "text-muted-foreground"
                            }`}>{test.priority}</span>
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="glass rounded-xl p-5">
                    <h3 className="text-xs font-medium text-muted-foreground mb-3">Activity</h3>
                    <div className="space-y-2.5">
                      {mockActivity.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-2.5"
                        >
                          <div className="w-6 h-6 rounded-md bg-secondary/50 flex items-center justify-center shrink-0 mt-0.5">
                            <item.icon className="w-3 h-3 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-foreground">{item.message}</p>
                            <p className="text-[10px] text-muted-foreground">{item.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
