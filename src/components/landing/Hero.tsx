import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-14 overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">Now in Public Beta</span>
            </div>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
              Ship with confidence.
              <br />
              <span className="gradient-text">Not guesswork.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              AI-powered quality intelligence that tells you what to test, 
              what's risky, and when it's safe to ship.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" onClick={() => navigate("/auth")} className="glow text-sm px-7 py-5">
                  Start Free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="lg" className="text-sm px-7 py-5 border-border/50 text-muted-foreground hover:text-foreground hover:border-border">
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
              {[
                { icon: Shield, label: "Risk Accuracy", value: "94%" },
                { icon: Zap, label: "Faster Releases", value: "3x" },
                { icon: BarChart3, label: "Bugs Prevented", value: "67%" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Terminal-style demo */}
          <ScrollReveal delay={0.5}>
            <div className="glass rounded-xl p-1 max-w-2xl mx-auto glow">
              <div className="bg-background rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warning/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/70" />
                  <span className="text-xs text-muted-foreground ml-2 font-mono">shipwise analyze PR #142</span>
                </div>
                <div className="font-mono text-xs space-y-1.5 text-left">
                  <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-muted-foreground">
                    <span className="text-primary">→</span> Analyzing diff... <span className="text-primary">142 files changed</span>
                  </motion.p>
                  <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-muted-foreground">
                    <span className="text-primary">→</span> Risk Score: <span className="text-warning font-bold">72/100</span> (medium-high)
                  </motion.p>
                  <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-muted-foreground">
                    <span className="text-primary">→</span> Generated <span className="text-foreground font-bold">8 test suggestions</span>
                  </motion.p>
                  <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-primary font-semibold">
                    ✓ Analysis complete. Recommendation: Review before shipping.
                  </motion.p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
