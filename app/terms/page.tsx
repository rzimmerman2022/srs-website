import Hero from '@/components/sections/Hero';
import Container from '@/components/layout/Container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Southwest Resume Services',
  description: 'Terms of Service for Southwest Resume Services. Read our terms and conditions for using our career services.',
};

export default function TermsPage() {
  return (
    <>
      <Hero
        title="Terms of Service"
        subtitle="Legal"
        description="Terms and conditions for using our services."
      />

      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="glass p-8 md:p-12 rounded-2xl">
              <p className="text-sm text-charcoal/70 mb-8">Last updated: December 2024</p>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing or using the Southwest Resume Services website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">2. Services Description</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Southwest Resume Services provides career document preparation and coaching services, including but not limited to:
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Resume writing and optimization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>LinkedIn profile optimization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Cover letter writing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Interview preparation and coaching</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Career strategy consultation</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">3. No Employment Guarantee</h2>
                  <div className="glass-dark p-6 rounded-xl mb-4">
                    <p className="text-sand-100 leading-relaxed">
                      <strong className="text-gold">Important:</strong> Southwest Resume Services does not guarantee employment, job interviews, salary outcomes, or specific hiring results. Our services are designed to improve your career materials and interview readiness, but hiring decisions are made solely by employers.
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    The effectiveness of career documents depends on many factors beyond our control, including market conditions, your qualifications, and employer preferences.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">4. Intellectual Property</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Upon full payment, you are granted ownership of the final documents created specifically for you, including your resume, cover letters, and LinkedIn content. However:
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Southwest Resume Services retains ownership of all proprietary methodologies, frameworks, templates, and processes used in creating your documents.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>We may use anonymized excerpts from your project for training, portfolio, or marketing purposes unless you explicitly opt out in writing.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Website content, design, and branding remain the exclusive property of Southwest Resume Services.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">5. Client Responsibilities</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You agree to:
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Provide accurate and truthful information about your work experience, education, and qualifications.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Respond to requests for information in a timely manner.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Review and approve all final documents before use.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Take responsibility for verifying that all information in your documents is accurate and defensible.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">6. Revisions and Deliverables</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our service packages include revision periods as detailed in your service agreement. We are committed to working with you until you genuinely own every word in your documents. However, the revision period is intended for refinement of the agreed-upon scope, not for expanding the project or making fundamental changes to direction after initial drafts are delivered.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">7. Payment Terms</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Payment is required before work begins unless otherwise agreed in writing. We accept major credit cards and other payment methods as specified at the time of purchase.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Refund Policy:</strong> Due to the custom nature of our work, refunds are generally not provided once work has commenced. If you are dissatisfied with our services, please contact us to discuss resolution options.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">8. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed">
                    In no event shall Southwest Resume Services, its owners, employees, or contractors be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our services. Our total liability for any claim arising from services rendered shall not exceed the amount paid for those specific services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">9. Confidentiality</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We treat all client information as confidential. We will not share your personal information or career documents with third parties without your consent, except as required by law or as necessary to provide our services (e.g., sharing with subcontractors under confidentiality agreements).
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">10. Governing Law</h2>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of the State of Arizona, without regard to its conflict of law provisions. Any disputes arising under these terms shall be resolved in the courts of Maricopa County, Arizona.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">11. Changes to Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after any changes constitutes acceptance of the new terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold text-navy mb-4">12. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed">
                    For questions about these Terms of Service, please contact us:
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
