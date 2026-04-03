import { Brain, GitPullRequest, Shield, TestTube, BarChart3, Bell } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Risk Intelligence",
    description: "AI analyzes every PR for logic, integration, and regression risk with a 0–100 score.",
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
    <section className="py-28 relative">
      <div className="glow-line w-full mb-20" />

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
              Quality Intelligence, <span className="gradient-text">Not Just Testing</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              Transform QA from execution into decision intelligence with AI that understands your codebase.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4, borderColor: "hsl(160 84% 39% / 0.2)" }}
                transition={{ duration: 0.2 }}
                className="glass rounded-xl p-5 transition-all duration-300 cursor-default h-full"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
