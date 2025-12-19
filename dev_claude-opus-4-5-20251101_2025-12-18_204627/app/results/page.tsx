/**
 * REDESIGN: Enhanced Results Page with SVG Icons
 * Preserves all 3 detailed case studies
 * Date: 2025-12-18
 */

import Link from 'next/link';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Results | Southwest Resume Services',
  description:
    'See how our research-backed methodology and Truth Bridge Protocol have helped clients authentically elevate their careers.',
};

// SVG Icons
const IconBriefcase = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const IconTrendingUp = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const IconSparkles = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);

const IconTarget = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

const IconArrowPath = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const IconUserGroup = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const IconX = () => (
  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
  </svg>
);

const IconArrowRight = () => (
  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const outcomeCategories = [
  {
    icon: <IconBriefcase />,
    title: 'Career Transition Positioning',
    description: 'Skills translation and Level 4 enhancement for professionals pivoting to new industries. Deliverables include transferable-skills mapping and cross-industry language alignment.',
  },
  {
    icon: <IconTrendingUp />,
    title: 'Advancement Narrative',
    description: 'Leadership value articulation using research-validated language. We build the positioning and proof stack for promotion-track conversations.',
  },
  {
    icon: <IconSparkles />,
    title: 'Ownership & Confidence',
    description: 'Truth Bridge Protocol to help professionals internalize and defend their positioning. The goal is genuine belief, not performance.',
  },
  {
    icon: <IconTarget />,
    title: 'Interview-Ready Positioning',
    description: 'Enhancement defense strategies and gap narratives. We prepare you to handle pushback with evidence-backed responses.',
  },
  {
    icon: <IconArrowPath />,
    title: 'Gap Narrative Development',
    description: 'Structured narratives for employment gaps using our three-version framework. Defensible framing that holds up under scrutiny.',
  },
  {
    icon: <IconUserGroup />,
    title: 'Non-Traditional Path Translation',
    description: 'Skills and experience translation for non-linear careers. We align your background to market language without fabrication.',
  },
];

const clientValues = [
  {
    title: 'Genuine Ownership',
    description: 'Clients value being able to defend every line in interviews because the language is evidence-backed and rehearsed until it feels natural.',
  },
  {
    title: 'Research-Backed Confidence',
    description: 'Clients report a mindset shift after seeing their experience validated against role standards and market data.',
  },
  {
    title: 'Interview Readiness',
    description: 'Clients value having prepared narratives for pushback: transitions, scope questions, gaps, and "prove it" follow-ups.',
  },
  {
    title: 'Breaking Minimization Patterns',
    description: 'Clients often notice and eliminate minimizing language ("just," "only," "helped") and replace it with accurate, defensible impact framing.',
  },
];

export default function ResultsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sand-50 via-white to-sand-100 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        </div>

        <Container className="relative py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4">
              Client Results
            </p>
            <h1 className="mb-6">
              Real Results,{' '}
              <span className="text-gold">Real Transformations</span>
            </h1>
            <p className="text-xl text-charcoal/70">
              Defensible transformations produced by our research-backed methodology
              and ownership transfer process.
            </p>
          </div>
        </Container>
      </section>

      {/* Proof Standard Banner */}
      <section className="bg-navy/5 py-6 border-b border-sand-200 backdrop-blur-sm">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-600 leading-relaxed">
              We do not publish job offers, salary outcomes, or timelines unless documented and permitted. What we can show is the transformation we deliver: <span className="text-navy font-medium">defensible positioning</span>, <span className="text-navy font-medium">verified proof points</span>, and <span className="text-navy font-medium">interview-ready ownership</span>.
            </p>
          </div>
        </Container>
      </section>

      {/* Outcome Categories - Scannable Grid */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-4">Types of Transformations</h2>
            <p className="text-xl text-gray-600">
              Our methodology adapts to your unique situation and career goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {outcomeCategories.map((category, index) => (
              <div
                key={index}
                className="glass p-8 rounded-2xl hover:shadow-premium-hover transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-navy/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-navy group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{category.icon}</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* What Clients Value Most */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="mb-4">What Clients Value Most</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Common themes clients report after completing the SRS process. Examples are anonymized and not presented as individual testimonials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientValues.map((value, index) => (
                <div
                  key={index}
                  className="glass p-6 rounded-xl border-l-4 border-gold hover:shadow-premium-hover transition-all duration-300"
                >
                  <h3 className="font-semibold text-navy mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-xs text-gray-500 italic">
                Proof Standard: Specific names, metrics, and identifying details are omitted to protect privacy.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* The SRS Difference */}
      <section className="section-padding bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[80px] transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12 text-white">The SRS Difference</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-dark p-8 rounded-2xl">
                <h3 className="text-lg font-semibold text-sand-200 mb-6 uppercase tracking-wider">
                  Traditional Resume Writing
                </h3>
                <ul className="space-y-4">
                  {[
                    'Generic templates and boilerplate language',
                    'No research validation or source documentation',
                    'Client receives document but no ownership transfer',
                    'No interview preparation or defense strategies',
                    'Risk of over-enhancement without verification',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start text-sand-200">
                      <span className="text-red-400 mr-3 mt-0.5">✗</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-dark p-8 rounded-2xl border border-gold/20">
                <h3 className="text-lg font-semibold text-gold mb-6 uppercase tracking-wider">
                  Southwest Resume Services
                </h3>
                <ul className="space-y-4">
                  {[
                    'Research-validated enhancements (RAI ≥ 7.0)',
                    'Mathematical risk assessment for every claim',
                    'Truth Bridge Protocol for genuine ownership',
                    'Comprehensive interview preparation included',
                    'Four-test ownership verification framework',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start text-sand-100">
                      <span className="text-gold mr-3 mt-0.5">✓</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Case Studies Section Header */}
      <section className="py-16 bg-white border-b border-sand-100">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">Detailed Case Studies</h2>
            <p className="text-gray-600">
              Real transformations with our methodology. Details anonymized for privacy.
            </p>
          </div>
        </Container>
      </section>

      {/* Case Study 1 */}
      <section id="case-study-1" className="section-padding bg-white border-b border-sand-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <div className="inline-block px-4 py-1.5 bg-navy/5 text-navy text-xs font-bold uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm">
                Senior Financial Operations | Retail
              </div>
              <h2 className="text-3xl md:text-4xl mb-6">The Truth Gap, Closed</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass p-6 rounded-2xl border border-sand-200">
                  <h3 className="text-lg font-bold text-navy mb-3">The Truth Gap</h3>
                  <p className="text-gray-600 leading-relaxed">
                    After decades of running the accounting backbone of a multi-site operation, the client had no resume and minimized their contribution as routine work.
                  </p>
                </div>
                <div className="glass-dark p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-gold mb-3">What We Found</h3>
                  <p className="text-sand-100 leading-relaxed">
                    Verified scope included fast close cadence, multi-account reconciliations, payroll administration, multi-jurisdiction compliance, and successful system transitions.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-serif font-semibold text-navy mb-6">What We Did</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-gray-700">Conducted a structured truth inventory to isolate only defensible claims</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-gray-700">Translated operational work into market language aligned to role standards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-gray-700">Applied ownership testing so the client could explain and defend every claim</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-serif font-semibold text-navy mb-2">Deliverable</h3>
                  <p className="text-gray-600">Dual-track positioning (operations plus accounting) with a proof stack and interview narrative.</p>
                </div>
                <div className="glass p-6 rounded-xl border-l-4 border-gold">
                  <h3 className="text-lg font-serif font-semibold text-navy mb-2">Outcome</h3>
                  <p className="text-gray-600">Client equipped to compete for target roles with defensible positioning and interview-ready ownership transfer.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Case Study 2 */}
      <section id="case-study-2" className="section-padding bg-sand-50 border-b border-sand-200">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <div className="inline-block px-4 py-1.5 bg-navy/5 text-navy text-xs font-bold uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm">
                Public Benefits Specialist | Regulated Programs | 5+ Years
              </div>
              <h2 className="text-3xl md:text-4xl mb-4">Evidence-First Compliance Narrative</h2>
              <p className="text-sm text-gray-500 italic">Privacy Note: Details are anonymized. Metrics are shown conservatively.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-navy mb-3">The Truth Gap</h3>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    This client delivered strong performance in a high-stakes eligibility environment, but their resume read like a duties list.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    The role ended in an agency-wide workforce reduction—not performance—and the client needed a narrative that would stand up to skeptical screening.
                  </p>
                </div>
                <div className="glass-dark p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-gold mb-3">What We Validated</h3>
                  <ul className="space-y-2 text-sm text-sand-100">
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      Sustained top-tier quality performance across 5+ years
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      Consistent daily throughput targets
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      Five-figure month of emergency benefits at perfect quality
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      Systems fluency across core platforms
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-serif font-semibold text-navy mb-6">What We Built</h3>
                <p className="text-gray-600 mb-6">We reframed the story around what employers actually evaluate in regulated environments:</p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-gray-700"><strong>Risk containment:</strong> accuracy, compliance, and clean documentation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-gray-700"><strong>Throughput controls:</strong> meeting targets without sacrificing quality</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-gray-700"><strong>Human mechanism:</strong> empathy as a tool for complete disclosures</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-serif font-semibold text-navy mb-2">Deliverables</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Metrics-backed resume with compliance-forward positioning</li>
                    <li>• Factual workforce-reduction script</li>
                    <li>• Interview-ready talking points built on proof</li>
                  </ul>
                </div>
                <div className="glass p-6 rounded-xl border-l-4 border-gold">
                  <h3 className="text-lg font-serif font-semibold text-navy mb-2">Outcome</h3>
                  <p className="text-gray-600 text-sm">Defensible positioning and interview-ready ownership transfer. We do not claim interviews or offers without documented permission.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Case Study 3 */}
      <section id="case-study-3" className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <div className="inline-block px-4 py-1.5 bg-navy/5 text-navy text-xs font-bold uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm">
                Hospitality Executive | Multi-Unit
              </div>
              <h2 className="text-3xl md:text-4xl mb-6">From Owner-Operator to Systems Leader</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass p-6 rounded-2xl border border-sand-200">
                  <h3 className="text-lg font-bold text-navy mb-3">The Truth Gap</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The client&apos;s resume described responsibilities, not the systems and controls that drove measurable outcomes.
                  </p>
                </div>
                <div className="glass-dark p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-gold mb-3">What We Found</h3>
                  <p className="text-sand-100 leading-relaxed">
                    Verified proof points included revenue growth into the $2M+ range, meaningful cost control improvements, measurable service throughput gains, and a successful exit to a strategic buyer.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-serif font-semibold text-navy mb-6">What We Did</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-gray-700">Mapped entrepreneurial work into corporate evaluation language (systems, controls, cadence)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-gray-700">Converted outcomes into defensible proof points tied to mechanisms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-gray-700">Removed any claim that could not be defended under scrutiny</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-serif font-semibold text-navy mb-2">Deliverable</h3>
                  <p className="text-gray-600">Executive positioning narrative with interview-ready proof points and ATS-ready structure.</p>
                </div>
                <div className="glass p-6 rounded-xl border-l-4 border-gold">
                  <h3 className="text-lg font-serif font-semibold text-navy mb-2">Outcome</h3>
                  <p className="text-gray-600">Client equipped to compete for VP and COO roles with proof points, not promises.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Proof Standard Footer */}
      <section className="py-8 bg-sand-50 border-t border-sand-200">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-2">Proof Standard</p>
            <p className="text-xs text-gray-500">
              Outcomes beyond deliverables are only stated when documented and permitted. We report what we deliver: defensible positioning, verified proof points, and interview-ready ownership.
            </p>
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
            <h2 className="mb-6 text-white text-4xl md:text-5xl">Ready for Your Own Success Story?</h2>
            <p className="text-xl text-sand-100 mb-10">
              Let&apos;s uncover your professional value and build your confidence through our
              research-backed methodology.
            </p>
            <Button href="/contact" variant="primary" size="lg" className="text-lg px-10 group">
              Get Started Today
              <IconArrowRight />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
