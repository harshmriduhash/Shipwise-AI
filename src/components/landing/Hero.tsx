import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-30"
          style={{ background: "var(--gradient-glow)" }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">Now in Public Beta</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            Ship with confidence.
            <br />
            <span className="gradient-text">Not guesswork.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            AI-powered Quality Intelligence that tells you what to test, 
            what's risky, and when it's safe to ship.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" className="glow text-base px-8 py-6">
              Start Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-6 border-border/50 text-muted-foreground hover:text-foreground">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { icon: Shield, label: "Risk Accuracy", value: "94%" },
              { icon: Zap, label: "Faster Releases", value: "3x" },
              { icon: BarChart3, label: "Bugs Prevented", value: "67%" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="relative animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="glass rounded-2xl p-2 glow">
              <img
                src={dashboardPreview}
                alt="SHIPWISE.ai Dashboard showing risk analysis and PR insights"
                className="rounded-xl w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
