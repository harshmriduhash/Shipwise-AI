import { Brain, GitPullRequest, Shield, TestTube, BarChart3, Bell } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Risk Intelligence",
    description: "AI analyzes every PR for logic, integration, and regression risk with a 0-100 score.",
  },
  {
    icon: TestTube,
    title: "Smart Test Suggestions",
    description: "Get minimal but effective test scenarios based on code impact analysis.",
  },
  {
    icon: Shield,
    title: "Release Confidence",
    description: "Ship/No-Ship clarity with data-driven release readiness scoring.",
  },
  {
    icon: GitPullRequest,
    title: "PR Impact Mapping",
    description: "Automatic Change → Feature → Test mapping from every code diff.",
  },
  {
    icon: BarChart3,
    title: "Requirement Analysis",
    description: "Flags ambiguities, missing edge cases, and unclear acceptance criteria.",
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description: "GitHub PR comments and Slack notifications when risk levels change.",
  },
];

const Features = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Quality Intelligence, <span className="gradient-text">Not Just Testing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform QA from execution into decision intelligence with AI that understands your codebase.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
