import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import type { Metadata } from 'next';
import { withBasePath } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Career Services | Southwest Resume Services',
  description:
    'Comprehensive career services including resume writing, LinkedIn optimization, interview coaching, and career strategy. Research-backed and authentically crafted.',
};

const services = [
  {
    id: 'resume',
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
  },
  {
    id: 'linkedin',
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
  },
  {
    id: 'cover-letter',
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
  },
  {
    id: 'strategy',
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
  },
  {
    id: 'interview',
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
  },
  {
    id: 'transition',
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
  },
];

const qualityStandards = [
  'ATS-optimized and tested for parseability',
  '80%+ must-have keyword alignment (role-dependent)',
  'Bias-aware language screening (DEI-friendly)',
  'Quantification targets (role-dependent)',
  'WCAG 2.2 AA accessibility principles',
  'Active voice and clarity emphasis',
  'Grade 10–12 readability target (role-dependent)',
  'Professional grammar and consistency review',
  'Strong visual hierarchy and scannability',
  'Privacy and identifying-detail controls',
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service) => (
              <div
                key={service.id}
                id={service.id}
                className="glass p-8 rounded-2xl hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full group"
              >
                <div className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-navy group-hover:scale-110 transition-all duration-300">
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-navy mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                <ul className="space-y-2 mb-8 flex-grow">
                  {service.features.slice(0, 5).map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start text-sm text-gray-600">
                      <span className="text-gold mr-2 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                  {service.features.length > 5 && (
                    <li className="text-sm text-navy font-medium">
                      +{service.features.length - 5} more...
                    </li>
                  )}
                </ul>

                <Link href="/contact" className="mt-auto">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Approach */}
      <section className="section-padding bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[80px] transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-16 text-white">Our Research-Backed Approach</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="glass-dark p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔬</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Research Authority Index (RAI)
                </h3>
                <p className="text-sm text-sand-200 leading-relaxed">
                  Every enhancement validated through authoritative sources (O*NET, BLS,
                  Lightcast). Target RAI ≥ 7.0 for all strategic claims.
                </p>
              </div>

              <div className="glass-dark p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Mathematical Risk Assessment
                </h3>
                <p className="text-sm text-sand-200 leading-relaxed">
                  Systematic evaluation of every enhancement using Integrity Score,
                  Ownership Score, and Composite Risk calculation.
                </p>
              </div>

              <div className="glass-dark p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Ownership Transfer
                </h3>
                <p className="text-sm text-sand-200 leading-relaxed">
                  Four-test verification framework ensures you can explain, exemplify,
                  feel comfortable with, and defend every claim under stress.
                </p>
              </div>
            </div>

            <div className="glass-dark p-8 rounded-2xl border border-gold/20">
              <h3 className="text-xl font-serif font-semibold text-gold mb-6">
                Ten-Dimensional Quality Framework
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {qualityStandards.map((standard, index) => (
                  <div key={index} className="flex items-start">
                    <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-gold text-xs mr-3 flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-sm text-sand-100">{standard}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Packages */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="mb-4">Service Packages</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Choose the package that fits your career goals. All packages include our
                research-backed methodology and commitment to genuine ownership transfer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Essentials Package */}
              <div className="glass p-8 rounded-2xl flex flex-col items-center text-center hover:shadow-premium-hover transition-all duration-300">
                <div className="w-full h-48 relative mb-6">
                  <Image
                    src={withBasePath('/assets/images/packages/essential.png')}
                    alt="Essentials Package"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                  Essentials
                </h3>
                <div className="text-3xl font-bold text-gold mb-4">$150</div>
                <p className="text-sm text-gray-600 mb-6 flex-grow">
                  Perfectly optimized resume highlighting your strengths clearly and
                  effectively to land more interviews.
                </p>
                <Link href="/contact" className="w-full mt-auto">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Accelerator Package */}
              <div className="glass-dark p-8 rounded-2xl flex flex-col items-center text-center relative border border-gold/30">
                <div className="absolute top-4 right-4 bg-gold text-navy text-xs font-semibold px-3 py-1 rounded-full">
                  POPULAR
                </div>
                <div className="w-full h-48 relative mb-6">
                  <Image
                    src={withBasePath('/assets/images/packages/accelerator.png')}
                    alt="Accelerator Package"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-white mb-2">
                  Accelerator
                </h3>
                <div className="text-3xl font-bold text-gold mb-4">$300</div>
                <p className="text-sm text-sand-200 mb-6 flex-grow">
                  Enhanced resume crafted with advanced ATS strategies, targeted keyword
                  analytics, and professional narrative refinement.
                </p>
                <Link href="/contact" className="w-full mt-auto">
                  <Button variant="primary" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Career Launch Package */}
              <div className="glass p-8 rounded-2xl flex flex-col items-center text-center hover:shadow-premium-hover transition-all duration-300">
                <div className="w-full h-48 relative mb-6">
                  <Image
                    src={withBasePath('/assets/images/packages/career-launch.png')}
                    alt="Career Launch Package"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                  Career Launch
                </h3>
                <div className="text-3xl font-bold text-gold mb-4">$449</div>
                <p className="text-sm text-gray-600 mb-6 flex-grow">
                  Comprehensive resume rewrite, LinkedIn profile optimization, and targeted
                  portfolio design—ideal for career changers.
                </p>
                <Link href="/contact" className="w-full mt-auto">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Custom Package */}
              <div className="glass p-8 rounded-2xl flex flex-col items-center text-center hover:shadow-premium-hover transition-all duration-300">
                <div className="w-full h-48 relative mb-6">
                  <Image
                    src={withBasePath('/assets/images/packages/custom.png')}
                    alt="Custom Solutions Package"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                  Custom Solutions
                </h3>
                <div className="text-3xl font-bold text-gold mb-4">$500+</div>
                <p className="text-sm text-gray-600 mb-6 flex-grow">
                  Fully customized career branding solution—executive resumes, LinkedIn
                  overhaul, and personalized coaching.
                </p>
                <Link href="/contact" className="w-full mt-auto">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
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
      <section className="section-padding bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-gold to-transparent"></div>
        </div>
        <Container>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-white mb-6 text-4xl md:text-5xl">Ready to Get Started?</h2>
            <p className="text-xl text-sand-100 mb-10">
              Let&apos;s discuss your career goals and determine which services will best
              serve your needs.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg" className="text-lg px-10">
                Schedule a Consultation
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
