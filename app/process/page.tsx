/**
 * GEMINI GLASS MODERN: Interactive Process Page with ScrollSpy
 * Features: Glass morphism, sticky navigation, IntersectionObserver
 * Date: 2025-12-18
 */

import Script from 'next/script';
import Hero from '@/components/sections/Hero';
import ProcessScrollSpy from '@/components/sections/ProcessScrollSpy';
import { ProcessStep } from '@/components/sections/ProcessTimeline';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Process | Southwest Resume Services',
  description:
    'A systematic, research-driven approach to career transformation. From deep discovery to interview mastery, we guide you through every step.',
  openGraph: {
    title: 'Our 10-Phase Process | Southwest Resume Services',
    description:
      'A systematic, research-driven approach to career transformation. From discovery to interview mastery.',
    url: 'https://southwestresumes.com/process',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Southwest Resume Services - Our Research-Driven Process',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our 10-Phase Process | Southwest Resume Services',
    description:
      'A systematic, research-driven approach to career transformation.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://southwestresumes.com/process',
  },
};

const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: 'Intake & Initial Assessment',
    description:
      'We begin with a forensic analysis of your existing materials and a deep dive into your background, goals, and constraints.',
    details: [
      'Comprehensive document review and pattern recognition',
      'Constraint and opportunity mapping',
      'Strategic hypothesis formation for optimal career paths',
      'Initial market positioning assessment',
    ],
  },
  {
    number: 2,
    title: 'Market Research Execution',
    description:
      'Data-driven market intelligence gathering using authoritative sources and real-time demand signals.',
    details: [
      'Job posting analysis (200+ postings across target markets)',
      'Compensation benchmarking and geographic optimization',
      'LinkedIn career transition analysis',
      'Certification ROI evaluation',
      'Skills demand validation',
    ],
  },
  {
    number: 3,
    title: 'Discovery & Deep Dive',
    description:
      'Customized discovery questionnaire designed to uncover your complete professional truth.',
    details: [
      'Tailored questions based on market research insights',
      'Evidence collection for authentic claims',
      'Pattern identification and value revelation',
      'Gap analysis and bridge opportunities',
    ],
  },
  {
    number: 4,
    title: 'Competency Assessment',
    description:
      'Dual baseline scoring methodology evaluates your readiness for target roles.',
    details: [
      'Conservative scoring (documented evidence only)',
      'Inferred scoring (reasonable assumptions)',
      'Market readiness threshold analysis (0.70 composite)',
      'Gap-closure priority ranking',
    ],
  },
  {
    number: 5,
    title: 'Enhancement Calibration',
    description:
      'Strategic enhancement of your experience using our five-level scale, targeting optimal impact (Levels 3-4).',
    details: [
      'Investigation: Uncover complete truth of your experience',
      'Translation: Convert to professional language',
      'Mathematical risk assessment for every enhancement',
      'Research Authority Index (RAI) validation (target ≥ 7.0)',
    ],
  },
  {
    number: 6,
    title: 'Research Validation',
    description:
      'Every strategic enhancement is grounded in authoritative sources to ensure defensibility.',
    details: [
      'O*NET task and skill alignment',
      'Industry validation (LinkedIn, Indeed, Lightcast)',
      'Geographic and market-specific confirmation',
      'Authority chain documentation',
    ],
  },
  {
    number: 7,
    title: 'Ownership Transfer',
    description:
      'Our Truth Bridge Protocol ensures you genuinely own every enhancement.',
    details: [
      'Four-test ownership verification (Explanation, Example, Comfort, Stress)',
      'STAR+ story development',
      'Evidence presentation and confidence building',
      'Practice and integration exercises',
    ],
  },
  {
    number: 8,
    title: 'Quality Assurance',
    description:
      'Three-stage review process ensures excellence across all dimensions.',
    details: [
      'Technical compliance (ATS, formatting, structure)',
      'Content quality and strategic positioning',
      'Final polish and bias-free language verification',
      'Document Risk Index (DRI) assessment',
    ],
  },
  {
    number: 9,
    title: 'Interview Preparation',
    description:
      'Tiered preparation matched to your risk profile, from standard polish to intensive coaching.',
    details: [
      'Client risk assessment (5-dimension framework)',
      'Mock interview sessions (friendly, professional, skeptical)',
      'Gap narrative mastery (3-version framework)',
      'Stress inoculation protocols',
    ],
  },
  {
    number: 10,
    title: 'Delivery & Follow-Through',
    description:
      'Final document delivery with ongoing support to ensure your success.',
    details: [
      'Complete career document package',
      'Implementation guidance',
      'Follow-up support and adjustments',
      'Outcome tracking and continuous improvement',
    ],
  },
];

export default function ProcessPage() {
  /**
   * HowTo Schema for SEO
   * Schema.org HowTo type for the 10-phase process
   * Follows Google Rich Results guidelines for HowTo markup
   */
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How Southwest Resume Services Transforms Your Career Documents',
    description: 'A systematic, research-driven 10-phase approach to career transformation. From deep discovery and market research to ownership transfer and interview mastery.',
    image: 'https://southwestresumes.com/og-image.jpg',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '150-500',
    },
    totalTime: 'P5D',
    step: processSteps.map((step) => ({
      '@type': 'HowToStep',
      position: step.number,
      name: step.title,
      text: step.description,
      itemListElement: step.details?.map((detail, index) => ({
        '@type': 'HowToDirection',
        position: index + 1,
        text: detail,
      })) || [],
    })),
    tool: [
      {
        '@type': 'HowToTool',
        name: 'O*NET Database',
      },
      {
        '@type': 'HowToTool',
        name: 'Bureau of Labor Statistics (BLS)',
      },
      {
        '@type': 'HowToTool',
        name: 'Lightcast Market Intelligence',
      },
      {
        '@type': 'HowToTool',
        name: 'LinkedIn Career Insights',
      },
    ],
  };

  return (
    <>
      {/* HowTo Schema for SEO - 10-phase process */}
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <Hero
        title="Our Process"
        subtitle="How We Work"
        description="A systematic, research-driven approach to career transformation. From deep discovery and market research to ownership transfer and interview mastery."
        primaryCTA={{ text: 'Get Started', href: '/contact' }}
      />

      {/* Process Timeline with ScrollSpy */}
      <section className="section-padding bg-gradient-to-br from-sand-50 via-white to-sand-100">
        <Container>
          <ProcessScrollSpy steps={processSteps} />
        </Container>
      </section>

      {/* Key Differentiators - Glass Cards */}
      <section className="section-padding bg-navy relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[80px] transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12 text-white">What Sets Our Process Apart</h2>

            <div className="space-y-8">
              {/* Truth Bridge Protocol - Always Visible */}
              <div className="glass-dark p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-serif font-semibold text-gold mb-3">
                  The Truth Bridge Protocol
                </h3>
                <p className="text-sand-200 mb-4">
                  Our five-phase ownership transfer system ensures you genuinely believe and
                  can defend every word:
                </p>
                <ol className="space-y-2 text-sm text-sand-200">
                  <li className="flex items-start">
                    <span className="text-gold font-bold mr-3">1.</span>
                    <span><strong className="text-white">Truth Discovery:</strong> Deep investigation into what you actually did</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold font-bold mr-3">2.</span>
                    <span><strong className="text-white">Truth Articulation:</strong> Translation into professional language</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold font-bold mr-3">3.</span>
                    <span><strong className="text-white">Truth Validation:</strong> Evidence bridge using research sources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold font-bold mr-3">4.</span>
                    <span><strong className="text-white">Truth Integration:</strong> Practice and internalization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold font-bold mr-3">5.</span>
                    <span><strong className="text-white">Truth Ownership:</strong> Genuine belief and confident defense</span>
                  </li>
                </ol>
              </div>

              {/* Collapsible Technical Details */}
              <details className="glass-dark rounded-2xl border border-white/10 group">
                <summary className="p-8 cursor-pointer list-none flex items-center justify-between">
                  <h3 className="text-xl font-serif font-semibold text-gold">
                    Technical Methodology Details
                  </h3>
                  <span className="text-gold text-sm font-medium group-open:hidden">Show details ▼</span>
                  <span className="text-gold text-sm font-medium hidden group-open:inline">Hide details ▲</span>
                </summary>
                <div className="px-8 pb-8 space-y-8 border-t border-white/10 pt-6">
                  {/* RAI */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">
                      Research Authority Index (RAI)
                    </h4>
                    <p className="text-sand-200 mb-4 text-sm">
                      Every enhancement undergoes rigorous validation using a weighted scoring
                      system:
                    </p>
                    <div className="bg-navy-800/50 p-4 rounded-lg font-mono text-sm text-gold border border-gold/20">
                      RAI = (Primary Source × 0.5) + (Industry Validation × 0.3) + (Compliance × 0.2)
                    </div>
                    <p className="text-sm text-sand-300 mt-4">
                      We require RAI ≥ 7.0 for Level 3 enhancements and RAI ≥ 8.0 for Level 4
                      (transformative reframing).
                    </p>
                  </div>

                  {/* DRI */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">
                      Mathematical Risk Assessment
                    </h4>
                    <p className="text-sand-200 mb-4 text-sm">
                      We use a composite risk scoring system to ensure every enhancement is
                      both powerful and defensible:
                    </p>
                    <ul className="space-y-2 text-sm text-sand-200">
                      <li className="flex items-start">
                        <span className="text-gold mr-2">•</span>
                        <span><strong className="text-white">Integrity Score (0-10):</strong> Factual accuracy of the enhancement</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold mr-2">•</span>
                        <span><strong className="text-white">Ownership Score (0-10):</strong> Your ability to defend the claim</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold mr-2">•</span>
                        <span><strong className="text-white">Impact Weight (1-4):</strong> Importance to your candidacy</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold mr-2">•</span>
                        <span><strong className="text-white">Composite Risk:</strong> Document Risk Index (DRI) remains safe (&lt;40)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </Container>
      </section>

      {/* Sources - Glass Cards */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-8">Research Sources We Use</h2>
            <p className="text-center text-gray-700 mb-12">
              Every enhancement is validated against authoritative, government, and
              industry sources:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'O*NET', description: 'Occupational data' },
                { name: 'BLS OEWS', description: 'Wage data' },
                { name: 'Lightcast', description: 'Market intelligence' },
                { name: 'LinkedIn', description: 'Career transitions' },
                { name: 'Indeed', description: 'Job demand signals' },
                { name: 'CareerOneStop', description: 'DOL portal' },
                { name: 'College Scorecard', description: 'Education ROI' },
                { name: 'Credential Engine', description: 'Certifications' },
              ].map((source, index) => (
                <div
                  key={index}
                  className="glass text-center p-4 rounded-xl hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="font-semibold text-navy mb-1">{source.name}</div>
                  <div className="text-xs text-gray-700">{source.description}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-navy via-navy-700 to-navy-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-gold to-transparent"></div>
        </div>
        <Container>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-white mb-4">Experience the Difference</h2>
            <p className="text-lg text-sand-200 mb-8">
              Our research-backed, psychologically-informed process creates career
              documents that are both powerful and authentically yours.
            </p>
            <Button href="/contact" variant="primary" size="lg" className="group">
              Get Started Today
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
