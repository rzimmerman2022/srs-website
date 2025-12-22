import Hero from '@/components/sections/Hero';
import Container from '@/components/layout/Container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Southwest Resume Services',
  description: 'Privacy Policy for Southwest Resume Services. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <Hero
        title="Privacy Policy"
        subtitle="Legal"
        description="How we collect, use, and protect your information."
      />

      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="glass p-8 md:p-12 rounded-2xl">
              <p className="text-sm text-charcoal/70 mb-8">Last updated: December 2024</p>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">1. Introduction</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Southwest Resume Services, LLC (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website and our practices for collecting, using, maintaining, protecting, and disclosing that information.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">2. Information We Collect</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may collect several types of information from and about users of our website, including:
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span><strong>Personal Information:</strong> Name, email address, phone number, and resume content that you provide through our contact forms or service inquiries.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span><strong>Career Documents:</strong> Resumes, cover letters, and other professional materials you submit for our services.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span><strong>Technical Information:</strong> Internet connection details, browser type, and usage data collected automatically through cookies and similar technologies.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">3. How We Use Your Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use information that we collect about you or that you provide to us:
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>To present our website and its contents to you.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>To provide you with information, products, or services that you request from us.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>To fulfill any other purpose for which you provide it.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>To carry out our obligations and enforce our rights arising from any contracts entered into between you and us.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>To notify you about changes to our website or any products or services we offer.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">4. Data Security</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers. The safety and security of your information also depends on you—where we have given you (or where you have chosen) a password for access to certain parts of our website, you are responsible for keeping this password confidential.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">5. Data Retention</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We retain your personal information and career documents only for as long as necessary to fulfill the purposes for which they were collected, including to satisfy any legal, accounting, or reporting requirements. Upon request, we will delete or anonymize your personal data within 30 days, unless we are legally required to retain it.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">6. Your Rights</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Depending on your location, you may have certain rights regarding your personal information, including:
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>The right to access your personal information.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>The right to request correction of inaccurate data.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>The right to request deletion of your personal data.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>The right to opt-out of marketing communications.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">7. Third-Party Services</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may use third-party services such as analytics providers (Google Analytics), payment processors, and communication tools. These services may collect information sent by your browser as part of their operation. We encourage you to review the privacy policies of these third parties.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">8. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed">
                    To ask questions or comment about this privacy policy and our privacy practices, contact us at:
                  </p>
                  <div className="mt-4 glass-dark p-6 rounded-xl">
                    <p className="text-sand-100">
                      <strong className="text-gold">Email:</strong> info@southwestresumes.com<br />
                      <strong className="text-gold">Phone:</strong> (480) 374-3418<br />
                      <strong className="text-gold">Location:</strong> Arizona, USA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
