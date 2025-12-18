import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Results | Southwest Resume Services',
  description:
    'See how our research-backed methodology and Truth Bridge Protocol have helped clients authentically elevate their careers.',
};

const outcomeCategories = [
  {
    icon: '💼',
    title: 'Career Transitions',
    description: 'Professionals successfully pivoting to new industries through Level 4 enhancement and comprehensive skills translation.',
  },
  {
    icon: '📈',
    title: 'Career Advancement',
    description: 'Clients securing promotions and senior-level roles after articulating their leadership value through research-validated language.',
  },
  {
    icon: '✨',
    title: 'Confidence Transformation',
    description: 'Professionals overcoming imposter syndrome and professional minimization through our Truth Bridge Protocol.',
  },
  {
    icon: '🎯',
    title: 'Interview Success',
    description: 'Clients passing rigorous interview processes after mastering enhancement defense and gap narratives.',
  },
  {
    icon: '🌉',
    title: 'Gap Bridging',
    description: 'Professionals with employment gaps successfully reframing their narratives and securing opportunities.',
  },
  {
    icon: '🔄',
    title: 'Non-Traditional Backgrounds',
    description: 'Clients from non-traditional paths translating their experience into professional credentials that open doors.',
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
      <Hero
        title="Success Stories"
        subtitle="Client Results"
        description="Defensible transformations produced by our research-backed methodology and ownership transfer process."
        primaryCTA={{ text: 'Start Your Journey', href: '/contact' }}
        gradient={false}
      />

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
            <Link href="/contact">
              <Button variant="primary" size="lg" className="text-lg px-10">
                Get Started Today
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
