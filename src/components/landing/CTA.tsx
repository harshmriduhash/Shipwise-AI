import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 relative">
      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="glass rounded-2xl p-10 md:p-14 text-center max-w-3xl mx-auto relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/5 blur-[80px] rounded-full" />

            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
                Stop guessing.<br />
                <span className="gradient-text">Start shipping smarter.</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-md mx-auto">
                Join teams who have reduced release risk by 67% and ship 3x faster with AI-powered quality intelligence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" onClick={() => navigate("/auth")} className="glow text-sm px-7 py-5">
                    Start Free Today <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="text-sm px-7 py-5 border-border/50 text-muted-foreground hover:text-foreground">
                    Book a Demo
                  </Button>
                </motion.div>
              </div>
              <p className="text-xs text-muted-foreground mt-5">No credit card required · Free for up to 3 repos</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTA;
