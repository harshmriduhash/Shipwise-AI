import { Shield, Lock, Key, Server, Eye, FileCheck } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const securityItems = [
  { icon: Lock, title: "End-to-End Encryption", description: "All data encrypted at rest (AES-256) and in transit (TLS 1.3). Your code never leaves secure boundaries." },
  { icon: Key, title: "Secure OAuth", description: "GitHub OAuth with scoped permissions. We request only the minimum access needed to analyze your repositories." },
  { icon: Shield, title: "Role-Based Access", description: "Granular RBAC with team-level permissions. Control who can view, analyze, and ship releases." },
  { icon: Server, title: "SOC 2 Compliant Infrastructure", description: "Hosted on SOC 2 Type II certified infrastructure with 99.9% uptime SLA." },
  { icon: Eye, title: "Audit Logging", description: "Complete audit trail of every action. Know who accessed what, when, and from where." },
  { icon: FileCheck, title: "API Protection", description: "Rate limiting, input validation, CORS protection, and security headers on every endpoint." },
];

const Security = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-muted-foreground">Enterprise-Grade Security</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Your code is <span className="gradient-text">safe with us.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Security isn't an afterthought — it's foundational to everything we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityItems.map((item) => (
              <div key={item.title} className="glass rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Security;
