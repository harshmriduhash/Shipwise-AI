import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For individual developers exploring AI-powered QA.",
    features: ["Up to 3 repos", "5 PR analyses/month", "Basic risk scoring", "Community support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Team",
    price: "$99",
    period: "/month",
    description: "For growing teams shipping fast with confidence.",
    features: ["Unlimited repos", "Unlimited analyses", "Advanced risk engine", "Test recommendations", "GitHub PR comments", "Slack integration", "Priority support"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Organization",
    price: "$299",
    period: "/month",
    description: "For enterprises with complex release pipelines.",
    features: ["Everything in Team", "Custom AI models", "SSO & RBAC", "Audit logs", "SLA guarantee", "Dedicated success manager", "Custom integrations"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">Pricing</p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
                Save hours every sprint.<br /><span className="gradient-text">Reduce release risk.</span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Simple pricing that scales with your team. Start free, upgrade when you're ready.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`glass rounded-xl p-6 flex flex-col h-full ${plan.highlighted ? "ring-1 ring-primary/50 relative" : ""}`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
                  <div className="mt-3 mb-1.5">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-xs text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">{plan.description}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-foreground">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className={`w-full ${plan.highlighted ? "glow-sm" : ""}`}
                      variant={plan.highlighted ? "default" : "outline"}
                      size="sm"
                      onClick={() => navigate("/auth")}
                    >
                      {plan.cta}
                    </Button>
                  </motion.div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Pricing;
