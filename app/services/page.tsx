import Hero from '@/components/sections/Hero';
import ServiceGrid, { Service } from '@/components/sections/ServiceGrid';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Services',
  description:
    'Comprehensive career services including resume writing, LinkedIn optimization, interview coaching, and career strategy. Research-backed and authentically crafted.',
};

const services: Service[] = [
  {
    title: 'Resume Writing & Optimization',
    description:
      'Research-validated resume writing that reveals your true professional value through our Client Truth Principle. Every enhancement is grounded in authoritative sources and defensible in interviews.',
    icon: '📄',
    features: [
      'In-depth discovery questionnaire customized to your background',
      'Market research using O*NET, BLS, and industry intelligence',
      'Enhancement calibration (Levels 3-4 optimization)',
      'Research Authority Index (RAI) validation',
      'ATS compatibility and keyword optimization',
      'DEI-friendly, WCAG-accessible formatting',
      'Unlimited revisions until you own every word',
    ],
    cta: { text: 'Get Started', href: '/contact' },
  },
  {
    title: 'LinkedIn Profile Optimization',
    description:
      'Transform your LinkedIn presence with keyword-optimized content that attracts recruiters. Based on LinkedIn Economic Graph research and real market demand signals.',
    icon: '💼',
    features: [
      'Compelling headline and about section',
      'Keyword-rich experience descriptions',
      'Skills and endorsement strategy',
      'Visual hierarchy and readability optimization',
      'Career transition positioning (if applicable)',
      'Recruiter engagement optimization',
    ],
    cta: { text: 'Get Started', href: '/contact' },
  },
  {
    title: 'Cover Letter Writing',
    description:
      'Tailored cover letters that connect your experience to employer needs. Strategic positioning that complements your resume and advances your narrative.',
    icon: '✉️',
    features: [
      'Customized to target role requirements',
      'Authentic voice and professional tone',
      'Strategic gap bridging (career change, employment gaps)',
      'Compelling value proposition',
      'Multiple versions for different opportunities',
    ],
    cta: { text: 'Get Started', href: '/contact' },
  },
  {
    title: 'Career Strategy Consultation',
    description:
      'Data-driven career guidance based on comprehensive market research, compensation analysis, and transferable skills assessment.',
    icon: '🎯',
    features: [
      'Target role identification and market analysis',
      'Compensation benchmarking and geographic optimization',
      'Certification ROI analysis',
      'Skills gap assessment (Dual Baseline scoring)',
      'Strategic positioning recommendations',
      'Job search strategy and employer targeting',
    ],
    cta: { text: 'Get Started', href: '/contact' },
  },
  {
    title: 'Interview Preparation & Coaching',
    description:
      'Comprehensive interview mastery program based on our four-tier preparation framework. From standard polish to crisis intervention, we match preparation to your risk profile.',
    icon: '🎤',
    features: [
      'Client risk assessment (5-dimension framework)',
      'STAR+ story development',
      'Enhancement defense strategies',
      'Gap narrative mastery (3-version framework)',
      'Mock interview sessions (friendly, professional, skeptical)',
      'Stress inoculation protocols',
      'Ownership verification and confidence building',
    ],
    cta: { text: 'Get Started', href: '/contact' },
  },
  {
    title: 'Career Transition Package',
    description:
      'Our most comprehensive service for career changers, non-traditional backgrounds, and complex transitions requiring Level 4 enhancement.',
    icon: '🚀',
    features: [
      'Deep market research and pathway analysis',
      'Comprehensive skills translation',
      'Strategic education and certification planning',
      'Intensive ownership transfer (Truth Bridge Protocol)',
      'Interview mastery (Tier 2-3 preparation)',
      'Resume, LinkedIn, and cover letter',
      'Ongoing support through transition',
    ],
    cta: { text: 'Learn More', href: '/contact' },
  },
];

export default function ServicesPage() {
  return (
    <>
      <Hero
        title="Career Services"
        subtitle="What We Offer"
        description="Research-backed career services designed to uncover your professional value and help you own your story with confidence."
        primaryCTA={{ text: 'Schedule Consultation', href: '/contact' }}
        secondaryCTA={{ text: 'See Our Process', href: '/process' }}
        gradient={false}
      />

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <Container>
          <ServiceGrid services={services} columns={3} />
        </Container>
      </section>

      {/* Our Approach */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12">Our Research-Backed Approach</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔬</span>
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  Research Authority Index (RAI)
                </h3>
                <p className="text-sm text-gray-600">
                  Every enhancement validated through authoritative sources (O*NET, BLS,
                  Lightcast). Target RAI ≥ 7.0 for all strategic claims.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  Mathematical Risk Assessment
                </h3>
                <p className="text-sm text-gray-600">
                  Systematic evaluation of every enhancement using Integrity Score,
                  Ownership Score, and Composite Risk calculation.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  Ownership Transfer
                </h3>
                <p className="text-sm text-gray-600">
                  Four-test verification framework ensures you can explain, exemplify,
                  feel comfortable with, and defend every claim under stress.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-gold">
              <h3 className="text-xl font-serif font-semibold text-navy mb-4">
                Quality Standards
              </h3>
              <p className="text-gray-600 mb-6">
                Our Ten-Dimensional Quality Framework ensures every document meets
                rigorous standards:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-gold mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">100% ATS Parseability</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-gold mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">80%+ Keyword Match Rate</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-gold mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Zero Bias Indicators (DEI-friendly)</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-gold mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">≥50% Quantified Accomplishments</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-gold mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">WCAG 2.2 AA Accessibility</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-gold mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">80%+ Active Voice Construction</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-gold mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Grade 10-12 Readability</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-gold mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Zero Critical Grammar Errors</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-gold mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Professional Visual Hierarchy</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-gold mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">100% Privacy Compliance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Packages */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center mb-4">Service Packages</h2>
            <p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
              Choose the package that fits your career goals. All packages include our
              research-backed methodology and commitment to genuine ownership transfer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Essentials Package */}
              <div className="bg-sand-50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                <div className="w-full h-48 relative mb-6">
                  <Image
                    src="/assets/images/packages/essential.png"
                    alt="Essentials Package"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                  Essentials
                </h3>
                <div className="text-3xl font-bold text-gold mb-4">$150</div>
                <p className="text-sm text-gray-600 mb-6">
                  Perfectly optimized resume highlighting your strengths clearly and
                  effectively to land more interviews.
                </p>
                <a href="/contact" className="mt-auto">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </a>
              </div>

              {/* Accelerator Package */}
              <div className="bg-sand-50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow border-2 border-gold relative">
                <div className="absolute top-4 right-4 bg-gold text-navy text-xs font-semibold px-3 py-1 rounded-full">
                  POPULAR
                </div>
                <div className="w-full h-48 relative mb-6">
                  <Image
                    src="/assets/images/packages/accelerator.png"
                    alt="Accelerator Package"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                  Accelerator
                </h3>
                <div className="text-3xl font-bold text-gold mb-4">$300</div>
                <p className="text-sm text-gray-600 mb-6">
                  Enhanced resume crafted with advanced ATS strategies, targeted keyword
                  analytics, and professional narrative refinement.
                </p>
                <a href="/contact" className="mt-auto">
                  <Button variant="primary" className="w-full">
                    Get Started
                  </Button>
                </a>
              </div>

              {/* Career Launch Package */}
              <div className="bg-sand-50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                <div className="w-full h-48 relative mb-6">
                  <Image
                    src="/assets/images/packages/career-launch.png"
                    alt="Career Launch Package"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                  Career Launch
                </h3>
                <div className="text-3xl font-bold text-gold mb-4">$449</div>
                <p className="text-sm text-gray-600 mb-6">
                  Comprehensive resume rewrite, LinkedIn profile optimization, and targeted
                  portfolio design—ideal for career changers.
                </p>
                <a href="/contact" className="mt-auto">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </a>
              </div>

              {/* Custom Package */}
              <div className="bg-sand-50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                <div className="w-full h-48 relative mb-6">
                  <Image
                    src="/assets/images/packages/custom.png"
                    alt="Custom Solutions Package"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                  Custom Solutions
                </h3>
                <div className="text-3xl font-bold text-gold mb-4">$500+</div>
                <p className="text-sm text-gray-600 mb-6">
                  Fully customized career branding solution—executive resumes, LinkedIn
                  overhaul, and personalized coaching.
                </p>
                <a href="/contact" className="mt-auto">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </a>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 text-sm">
                All packages include unlimited revisions until you genuinely own every word.
                Contact us to discuss which package best fits your career goals.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section-padding bg-navy text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-sand-200 mb-8">
              Let&apos;s discuss your career goals and determine which services will best
              serve your needs.
            </p>
            <a href="/contact">
              <Button variant="primary" size="lg">
                Schedule a Consultation
              </Button>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
