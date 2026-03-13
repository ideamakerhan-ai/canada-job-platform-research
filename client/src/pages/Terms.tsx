import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Terms() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">CanadaJobBoard</h1>
            <Button variant="ghost" onClick={() => navigate("/")} className="ml-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>

          <div className="prose prose-sm max-w-none text-slate-700 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p>
                Welcome to CanadaJobBoard ("we," "us," "our," or "Company"). These Terms of Service ("Terms") govern your access to and use of our website and services. By accessing or using CanadaJobBoard, you agree to be bound by these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. User Eligibility</h2>
              <p>
                You must be at least 18 years old to use CanadaJobBoard. By using our services, you represent and warrant that you meet this age requirement and have the legal authority to enter into this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>
              <p>
                When you create an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Job Postings</h2>
              <p>
                Employers are responsible for the accuracy and legality of job postings. CanadaJobBoard does not endorse any job postings and is not responsible for the content, accuracy, or legitimacy of job listings. We reserve the right to remove any postings that violate these Terms or applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Post false, misleading, or fraudulent information</li>
                <li>Engage in harassment, discrimination, or abusive behavior</li>
                <li>Attempt to hack, disrupt, or damage our services</li>
                <li>Post content that violates intellectual property rights</li>
                <li>Use our services for illegal purposes</li>
                <li>Spam or send unsolicited communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Intellectual Property</h2>
              <p>
                All content on CanadaJobBoard, including logos, text, images, and software, is owned by or licensed to CanadaJobBoard and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or transmit any content without our prior written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, CanadaJobBoard is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless CanadaJobBoard from any claims, damages, or expenses arising from your violation of these Terms or your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to Terms</h2>
              <p>
                We may update these Terms at any time. Your continued use of CanadaJobBoard after changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Governing Law</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of Ontario, Canada, without regard to its conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-4">
                <strong>CanadaJobBoard</strong><br />
                Email: support@canadajobboard.ca<br />
                Phone: +1 (416) 555-1234<br />
                Address: Toronto, Ontario, Canada
              </p>
            </section>

            <p className="text-sm text-slate-500 mt-8">
              Last updated: March 2026
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
