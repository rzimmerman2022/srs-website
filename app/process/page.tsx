import Hero from '@/components/sections/Hero';
import ProcessTimeline, { ProcessStep } from '@/components/sections/ProcessTimeline';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Process',
  description:
    'A systematic, research-driven approach to career transformation. From deep discovery to interview mastery, we guide you through every step.',
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
  return (
    <>
      <Hero
        title="Our Process"
        subtitle="How We Work"
        description="A systematic, research-driven approach to career transformation. From deep discovery and market research to ownership transfer and interview mastery."
        primaryCTA={{ text: 'Get Started', href: '/contact' }}
        gradient={false}
      />

      {/* Process Timeline */}
      <section className="section-padding bg-white">
        <Container>
          <ProcessTimeline steps={processSteps} />
        </Container>
      </section>

      {/* Key Differentiators */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12">What Sets Our Process Apart</h2>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-gold">
                <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                  Research Authority Index (RAI)
                </h3>
                <p className="text-gray-600 mb-4">
                  Every enhancement undergoes rigorous validation using a weighted scoring
                  system:
                </p>
                <div className="bg-sand-50 p-4 rounded font-mono text-sm">
                  RAI = (Primary Source × 0.5) + (Industry Validation × 0.3) + (Compliance
                  × 0.2)
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  We require RAI ≥ 7.0 for Level 3 enhancements and RAI ≥ 8.0 for Level 4
                  (transformative reframing).
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-gold">
                <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                  Mathematical Risk Assessment
                </h3>
                <p className="text-gray-600 mb-4">
                  We use a composite risk scoring system to ensure every enhancement is
                  both powerful and defensible:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <strong>Integrity Score (0-10):</strong> Factual accuracy of the
                    enhancement
                  </li>
                  <li>
                    <strong>Ownership Score (0-10):</strong> Your ability to defend the
                    claim
                  </li>
                  <li>
                    <strong>Impact Weight (1-4):</strong> Importance to your candidacy
                  </li>
                  <li>
                    <strong>Composite Risk:</strong> Calculated to ensure Document Risk
                    Index (DRI) remains safe (&lt;40)
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-gold">
                <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                  The Truth Bridge Protocol
                </h3>
                <p className="text-gray-600 mb-4">
                  Our five-phase ownership transfer system ensures you genuinely believe and
                  can defend every word:
                </p>
                <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                  <li>
                    <strong>Truth Discovery:</strong> Deep investigation into what you
                    actually did
                  </li>
                  <li>
                    <strong>Truth Articulation:</strong> Translation into professional
                    language
                  </li>
                  <li>
                    <strong>Truth Validation:</strong> Evidence bridge using research
                    sources
                  </li>
                  <li>
                    <strong>Truth Integration:</strong> Practice and internalization
                  </li>
                  <li>
                    <strong>Truth Ownership:</strong> Genuine belief and confident defense
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Sources */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-8">Research Sources We Use</h2>
            <p className="text-center text-gray-600 mb-12">
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
                  className="text-center p-4 bg-sand-50 rounded-lg hover:bg-sand-100 transition-colors"
                >
                  <div className="font-semibold text-navy mb-1">{source.name}</div>
                  <div className="text-xs text-gray-600">{source.description}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section-padding bg-navy text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-4">Experience the Difference</h2>
            <p className="text-lg text-sand-200 mb-8">
              Our research-backed, psychologically-informed process creates career
              documents that are both powerful and authentically yours.
            </p>
            <a href="/contact">
              <Button variant="primary" size="lg">
                Get Started Today
              </Button>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
