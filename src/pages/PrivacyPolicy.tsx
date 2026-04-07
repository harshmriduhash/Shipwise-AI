import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <ScrollReveal>
            <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: April 7, 2026</p>
          </ScrollReveal>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
                <h3 className="text-sm font-medium text-foreground">Account Information</h3>
                <p>When you create an account, we collect your email address, full name, and password (securely hashed). We never store plaintext passwords.</p>
                <h3 className="text-sm font-medium text-foreground">Repository & Code Data</h3>
                <p>When you connect a GitHub repository, we access repository metadata (name, URL, branches) and pull request diffs for analysis. We process code diffs in real-time and do not permanently store your source code. AI analysis results (risk scores, summaries, test suggestions) are stored in your account.</p>
                <h3 className="text-sm font-medium text-foreground">Usage Data</h3>
                <p>We collect anonymous usage analytics: pages visited, features used, analysis frequency, and session duration. This data is aggregated and cannot identify individual users.</p>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Data</h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong className="text-foreground">AI Analysis:</strong> Code diffs are sent to our AI engine to generate risk scores, test suggestions, and code review comments.</li>
                  <li><strong className="text-foreground">Service Improvement:</strong> Aggregated, anonymized usage patterns help us improve the product.</li>
                  <li><strong className="text-foreground">Communication:</strong> We send transactional emails (verification, password reset) and product updates. You can opt out of non-essential emails.</li>
                  <li><strong className="text-foreground">Security:</strong> We monitor for suspicious activity to protect your account and our infrastructure.</li>
                </ul>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">3. Data Sharing</h2>
                <p>We do not sell your personal data. We share data only with:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong className="text-foreground">AI Providers:</strong> Code diffs are sent to our AI provider (Google) for analysis. Data is processed in accordance with their enterprise data processing agreements and is not used for model training.</li>
                  <li><strong className="text-foreground">Infrastructure:</strong> We use cloud providers for hosting and database services with enterprise-grade security.</li>
                  <li><strong className="text-foreground">Legal Requirements:</strong> We may disclose data if required by law, court order, or government request.</li>
                </ul>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">4. Data Retention</h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Account data is retained while your account is active.</li>
                  <li>Upon account deletion, all personal data is removed within 30 days.</li>
                  <li>AI analysis results are retained for the duration of your subscription.</li>
                  <li>Anonymized, aggregated analytics data may be retained indefinitely.</li>
                </ul>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">5. Your Rights (GDPR/CCPA)</h2>
                <p>Depending on your jurisdiction, you have the right to:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong className="text-foreground">Access:</strong> Request a copy of your personal data.</li>
                  <li><strong className="text-foreground">Rectification:</strong> Correct inaccurate data.</li>
                  <li><strong className="text-foreground">Deletion:</strong> Request deletion of your data ("right to be forgotten").</li>
                  <li><strong className="text-foreground">Portability:</strong> Export your data in a machine-readable format.</li>
                  <li><strong className="text-foreground">Opt-out:</strong> Opt out of non-essential data processing.</li>
                  <li><strong className="text-foreground">Non-discrimination:</strong> We will not discriminate against you for exercising your rights.</li>
                </ul>
                <p>To exercise these rights, contact <span className="text-primary">privacy@shipwise.ai</span></p>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">6. Cookies</h2>
                <p>We use essential cookies for authentication and session management. We use analytics cookies (with your consent) to understand usage patterns. You can manage cookie preferences at any time through the cookie consent banner.</p>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">7. Security Measures</h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>All data encrypted in transit (TLS 1.3) and at rest (AES-256).</li>
                  <li>Row Level Security (RLS) ensures data isolation between users.</li>
                  <li>Regular security audits and vulnerability assessments.</li>
                  <li>SOC 2 Type II compliance (in progress).</li>
                </ul>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">8. Children's Privacy</h2>
                <p>SHIPWISE.ai is not intended for users under 18 years of age. We do not knowingly collect data from children.</p>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">9. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notification at least 30 days before the changes take effect.</p>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">10. Contact Us</h2>
                <p>Data Protection Officer: <span className="text-primary">privacy@shipwise.ai</span></p>
                <p>For EU residents, you have the right to lodge a complaint with your local data protection authority.</p>
              </section>
            </ScrollReveal>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
