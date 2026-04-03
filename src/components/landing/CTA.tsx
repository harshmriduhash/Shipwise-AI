import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: "var(--gradient-glow)" }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="glass rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto glow">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Stop guessing.<br />
            <span className="gradient-text">Start shipping smarter.</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join teams who have reduced release risk by 67% and ship 3x faster with AI-powered quality intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="glow text-base px-8 py-6">
              Start Free Today <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-6 border-border/50 text-muted-foreground hover:text-foreground">
              Book a Demo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">No credit card required · Free for up to 3 repos</p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
