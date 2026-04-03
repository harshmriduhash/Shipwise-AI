import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Save hours every sprint.<br /><span className="gradient-text">Reduce release risk.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Simple pricing that scales with your team. Start free, upgrade when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`glass rounded-2xl p-8 flex flex-col ${plan.highlighted ? "ring-2 ring-primary glow relative" : ""}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className={plan.highlighted ? "glow" : ""} variant={plan.highlighted ? "default" : "outline"} size="lg">
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Pricing;
