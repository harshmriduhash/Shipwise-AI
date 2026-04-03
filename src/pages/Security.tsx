import { Shield, Lock, Key, Server, Eye, FileCheck } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";

const securityItems = [
  { icon: Lock, title: "End-to-End Encryption", description: "All data encrypted at rest (AES-256) and in transit (TLS 1.3). Your code never leaves secure boundaries." },
  { icon: Key, title: "Secure OAuth", description: "GitHub OAuth with scoped permissions. We request only the minimum access needed to analyze your repositories." },
  { icon: Shield, title: "Role-Based Access", description: "Granular RBAC with team-level permissions. Control who can view, analyze, and ship releases." },
  { icon: Server, title: "SOC 2 Compliant", description: "Hosted on SOC 2 Type II certified infrastructure with 99.9% uptime SLA." },
  { icon: Eye, title: "Audit Logging", description: "Complete audit trail of every action. Know who accessed what, when, and from where." },
  { icon: FileCheck, title: "API Protection", description: "Rate limiting, input validation, CORS protection, and security headers on every endpoint." },
];

const Security = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Enterprise-Grade Security</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
                Your code is <span className="gradient-text">safe with us.</span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Security isn't an afterthought — it's foundational to everything we build.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityItems.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="glass rounded-xl p-5 h-full"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
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

export default Security;
