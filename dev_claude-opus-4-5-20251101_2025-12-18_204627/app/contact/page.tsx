import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import ContactForm from '@/components/sections/ContactForm';
import Container from '@/components/layout/Container';
import ContactLink from '@/components/ui/ContactLink';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Southwest Resume Services to discuss your career goals. Schedule a consultation and start your career elevation journey.',
};

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Get in Touch"
        subtitle="Contact Us"
        description="Ready to elevate your career? Let's discuss your goals and how we can help you reveal your true professional value."
        gradient={false}
      />

      <section className="section-padding bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we&apos;ll get back to you within 1-2 business
                days. The more details you provide about your background and goals, the
                better we can serve you.
              </p>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="mb-6">Get Started</h2>

              <div className="space-y-8">
                {/* Email */}
                <div>
                  <h3 className="text-lg font-semibold text-navy mb-2">Email Us</h3>
                  <p className="text-gray-600 mb-2">
                    For general inquiries and to start a conversation:
                  </p>
                  <ContactLink
                    type="email"
                    href="mailto:info@southwestresumes.com"
                    className="text-gold hover:text-gold-600 font-medium transition-colors"
                  >
                    info@southwestresumes.com
                  </ContactLink>
                </div>

                {/* Phone */}
                <div>
                  <h3 className="text-lg font-semibold text-navy mb-2">Call Us</h3>
                  <p className="text-gray-600 mb-2">
                    Prefer to speak directly? Give us a call:
                  </p>
                  <ContactLink
                    type="phone"
                    href="tel:+14803743418"
                    className="text-gold hover:text-gold-600 font-medium transition-colors"
                  >
                    (480) 374-3418
                  </ContactLink>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-lg font-semibold text-navy mb-2">Our Location</h3>
                  <p className="text-gray-600">
                    Based in Arizona, serving professionals nationwide.
                  </p>
                </div>

                {/* What to Expect */}
                <div className="bg-sand-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-navy mb-4">
                    What Happens Next?
                  </h3>
                  <ol className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-navy font-semibold text-sm mr-3">
                        1
                      </span>
                      <div>
                        <strong className="text-navy">Initial Review</strong>
                        <p className="text-sm text-gray-600">
                          We&apos;ll review your inquiry and background within 1-2 business
                          days.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-navy font-semibold text-sm mr-3">
                        2
                      </span>
                      <div>
                        <strong className="text-navy">Detailed Response</strong>
                        <p className="text-sm text-gray-600">
                          You&apos;ll receive a comprehensive email outlining how we can help
                          and recommended services.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-navy font-semibold text-sm mr-3">
                        3
                      </span>
                      <div>
                        <strong className="text-navy">Consultation Call</strong>
                        <p className="text-sm text-gray-600">
                          If appropriate, we&apos;ll schedule a consultation to discuss your
                          goals in depth.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-navy font-semibold text-sm mr-3">
                        4
                      </span>
                      <div>
                        <strong className="text-navy">Begin Your Journey</strong>
                        <p className="text-sm text-gray-600">
                          Once we agree on the scope, we&apos;ll begin the discovery process and
                          start elevating your career.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                {/* FAQs Link */}
                <div className="bg-navy text-sand p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Have Questions?
                  </h3>
                  <p className="text-sand-200 text-sm mb-4">
                    Check out our FAQ page for answers to common questions about our
                    process, pricing, timelines, and more.
                  </p>
                  <Link
                    href="/faq"
                    className="inline-block bg-gold text-navy px-4 py-2 rounded-lg font-medium hover:bg-gold-600 transition-colors"
                  >
                    View FAQs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Additional CTAs */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12">Explore Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/services"
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
              >
                <div className="text-4xl mb-3">📄</div>
                <h3 className="text-lg font-semibold text-navy mb-2">View Services</h3>
                <p className="text-sm text-gray-600">
                  Explore our comprehensive career services and packages.
                </p>
              </Link>

              <Link
                href="/process"
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
              >
                <div className="text-4xl mb-3">🔬</div>
                <h3 className="text-lg font-semibold text-navy mb-2">Our Process</h3>
                <p className="text-sm text-gray-600">
                  Learn about our research-backed methodology and approach.
                </p>
              </Link>

              <Link
                href="/results"
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
              >
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="text-lg font-semibold text-navy mb-2">See Results</h3>
                <p className="text-sm text-gray-600">
                  Read about our client success stories and outcomes.
                </p>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
