import { useState } from "react";
import { 
  Shield, GitPullRequest, TestTube, Activity, 
  ChevronRight, AlertTriangle, CheckCircle, Clock,
  BarChart3, Zap, FileCode, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/landing/Navbar";

const mockPRs = [
  { id: 1, title: "feat: add payment processing module", author: "sarah.dev", risk: 82, status: "high", tests: 3, time: "2m ago" },
  { id: 2, title: "fix: resolve auth token refresh bug", author: "mike.eng", risk: 45, status: "medium", tests: 5, time: "15m ago" },
  { id: 3, title: "chore: update dependencies", author: "bot", risk: 12, status: "low", tests: 1, time: "1h ago" },
  { id: 4, title: "feat: user profile settings page", author: "alex.ui", risk: 34, status: "low", tests: 4, time: "3h ago" },
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
  return "text-success";
};

const getRiskBg = (risk: number) => {
  if (risk >= 70) return "bg-destructive/10";
  if (risk >= 40) return "bg-warning/10";
  return "bg-success/10";
};

const Dashboard = () => {
  const [checks, setChecks] = useState(testSuggestions.map(t => t.checked));
  const overallRisk = 58;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Release Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">acme-corp/web-platform · main branch</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-border/50 text-muted-foreground">
                <Bell className="w-4 h-4 mr-2" /> Alerts
              </Button>
              <Button size="sm" className="glow-sm">
                <GitPullRequest className="w-4 h-4 mr-2" /> Analyze PR
              </Button>
            </div>
          </div>

          {/* Top Row: Risk Score + Release Status */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Risk Score */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Overall Risk Score</h3>
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--warning))" strokeWidth="8"
                      strokeDasharray={`${overallRisk * 2.64} 264`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-warning">{overallRisk}</span>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Logic Risk</span>
                    <span className="text-foreground font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-1.5" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Integration</span>
                    <span className="text-foreground font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-1.5" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Regression</span>
                    <span className="text-foreground font-medium">35%</span>
                  </div>
                  <Progress value={35} className="h-1.5" />
                </div>
              </div>
            </div>

            {/* Release Readiness */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Release Readiness</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-lg font-bold text-warning">Caution</p>
                  <p className="text-xs text-muted-foreground">Review high-risk PRs before shipping</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">Open PRs</span>
                  <span className="font-medium text-foreground">4</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">High Risk</span>
                  <span className="font-medium text-destructive">1</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">Tests Passing</span>
                  <span className="font-medium text-success">92%</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">This Sprint</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "PRs Analyzed", value: "24", icon: FileCode },
                  { label: "Bugs Caught", value: "7", icon: Shield },
                  { label: "Tests Suggested", value: "89", icon: TestTube },
                  { label: "Time Saved", value: "18h", icon: Clock },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-xl bg-secondary/50 text-center">
                    <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: PR List + Test Suggestions + Activity */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* PR Insights */}
            <div className="lg:col-span-2 glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">PR Insights</h3>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  View All <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {mockPRs.map((pr) => (
                  <div key={pr.id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className={`w-10 h-10 rounded-lg ${getRiskBg(pr.risk)} flex items-center justify-center`}>
                      <span className={`text-sm font-bold ${getRiskColor(pr.risk)}`}>{pr.risk}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{pr.title}</p>
                      <p className="text-xs text-muted-foreground">by {pr.author} · {pr.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{pr.tests} tests</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Test Recommendations */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Test Recommendations</h3>
                <div className="space-y-2">
                  {testSuggestions.map((test, i) => (
                    <label key={test.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/30 cursor-pointer transition-colors">
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
                    </label>
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Activity</h3>
                <div className="space-y-3">
                  {mockActivity.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground">{item.message}</p>
                        <p className="text-[10px] text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
