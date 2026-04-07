import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <ScrollReveal>
            <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: April 7, 2026</p>
          </ScrollReveal>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
                <p>By accessing or using SHIPWISE.ai ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Service. These Terms apply to all users, including free tier and paid subscribers.</p>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">2. Description of Service</h2>
                <p>SHIPWISE.ai provides AI-powered code quality intelligence, including pull request risk analysis, automated test suggestions, and release readiness scoring. The Service integrates with third-party platforms such as GitHub.</p>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">3. User Accounts</h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>You must provide accurate and complete registration information.</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                  <li>You must be at least 18 years old or the age of majority in your jurisdiction.</li>
                  <li>One person or legal entity per account. Shared accounts are not permitted.</li>
                </ul>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">4. Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Use the Service for any unlawful purpose or in violation of any applicable laws.</li>
                  <li>Reverse engineer, decompile, or disassemble any part of the Service.</li>
                  <li>Attempt to gain unauthorized access to any part of the Service or its infrastructure.</li>
                  <li>Use the Service to process or store malicious code.</li>
                  <li>Exceed rate limits or abuse API endpoints.</li>
                  <li>Resell or redistribute the Service without written authorization.</li>
                </ul>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">5. Intellectual Property</h2>
                <p>SHIPWISE.ai and its original content, features, and functionality are owned by SHIPWISE.ai and are protected by international copyright, trademark, and other intellectual property laws. Your code and data remain yours — we claim no ownership of your source code, repositories, or analysis results.</p>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">6. Subscription & Billing</h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Paid plans are billed monthly or annually as selected during checkout.</li>
                  <li>All fees are non-refundable except as required by law.</li>
                  <li>We reserve the right to change pricing with 30 days advance notice.</li>
                  <li>Downgrading may result in loss of access to certain features.</li>
                </ul>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">7. Data & Privacy</h2>
                <p>Your use of the Service is also governed by our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. We process code diffs and metadata solely for analysis purposes and do not sell your data to third parties.</p>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">8. Service Availability & SLA</h2>
                <p>We aim for 99.9% uptime but do not guarantee uninterrupted access. Scheduled maintenance windows will be communicated 48 hours in advance. The AI analysis service depends on third-party AI providers and may experience occasional latency.</p>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">9. Limitation of Liability</h2>
                <p>SHIPWISE.ai shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. Our AI analysis is advisory — final release decisions remain the responsibility of your engineering team.</p>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">10. Termination</h2>
                <p>We may terminate or suspend your account at any time for violation of these Terms. You may cancel your account at any time. Upon termination, your data will be retained for 30 days before permanent deletion.</p>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section className="glass rounded-xl p-6 space-y-3">
                <h2 className="text-lg font-semibold text-foreground">11. Contact</h2>
                <p>For questions about these Terms, contact us at <span className="text-primary">legal@shipwise.ai</span></p>
              </section>
            </ScrollReveal>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
