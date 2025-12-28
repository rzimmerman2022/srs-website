/**
 * REDESIGN: Enhanced Results Page with SVG Icons
 * Marketing improvements: Reduced disclaimers, standardized labels, preview cards, inline CTAs
 * Date: 2025-12-20
 */

import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Results & Success Stories | Southwest Resume Services',
  description:
    'Resume writing results and career success stories from Phoenix professionals. See how our research-backed methodology transforms careers through defensible positioning and verified proof points.',
  keywords: 'resume writing results Phoenix, career success stories Phoenix, professional resume transformation, resume writing case studies',
  openGraph: {
    title: 'Client Results & Success Stories | Southwest Resume Services',
    description: 'Career success stories from Phoenix professionals using research-backed resume writing methodology.',
    type: 'website',
  },
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
    title: 'Shift from Minimizing to Accurate Language',
    description: 'Clients often notice and eliminate minimizing language ("just," "only," "helped") and replace it with accurate, defensible impact framing.',
  },
];

export default function ResultsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Top Right Gold Glow */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3 opacity-60" />
          {/* Bottom Left Blue Glow */}
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3 opacity-40" />
        </div>

        <Container className="relative z-10 section-padding">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block px-6 py-2 rounded-full bg-white/5 text-gold text-sm font-semibold mb-8 border border-white/10 backdrop-blur-md shadow-lg animate-fade-in-up">
              Client Results
            </div>

            <h1 className="mb-8 text-white text-5xl md:text-6xl lg:text-7xl leading-tight font-serif tracking-tight drop-shadow-lg">
              Real Results,{' '}
              <span className="text-gold">Real Transformations</span>
            </h1>

            <p className="text-xl md:text-2xl text-sand-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light text-balance opacity-90">
              Defensible transformations produced by our research-backed methodology
              and ownership transfer process.
            </p>
          </div>
        </Container>
      </section>

      {/* Proof Standard Banner */}
      <section className="bg-navy/5 py-10 md:py-12 border-b border-sand-200 backdrop-blur-sm">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-700 leading-relaxed">
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
            <p className="text-xl text-charcoal/80">
              Our methodology adapts to your unique situation and career goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {outcomeCategories.map((category) => (
              <div
                key={category.title}
                className="glass p-8 rounded-2xl hover:shadow-premium-hover transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-navy/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-navy group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{category.icon}</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                  {category.title}
                </h3>
                <p className="text-charcoal/80 text-sm leading-relaxed">
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
              <p className="text-charcoal/80 max-w-2xl mx-auto">
                Common themes clients report after completing the SRS process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientValues.map((value) => (
                <div
                  key={value.title}
                  className="glass p-6 rounded-xl border-l-4 border-gold hover:shadow-premium-hover transition-all duration-300"
                >
                  <h3 className="font-semibold text-navy mb-2">{value.title}</h3>
                  <p className="text-charcoal/80 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
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
            <h2 className="text-center mb-16 text-white">The SRS Difference</h2>

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
                  ].map((item) => (
                    <li key={item} className="flex items-start text-sand-200">
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
                  ].map((item) => (
                    <li key={item} className="flex items-start text-sand-100">
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
      <section className="py-12 md:py-14 lg:py-16 bg-white border-b border-sand-100">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">Client Transformations</h2>
            <p className="text-charcoal/80">
              Client names and identifying details protected per our privacy standards.
            </p>
          </div>
        </Container>
      </section>

      {/* Case Study Preview Cards */}
      <section className="section-padding bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <a href="#case-study-1" className="group glass p-6 rounded-2xl border border-sand-200 hover:border-gold hover:shadow-premium-hover transition-all duration-300">
              <div className="text-xs font-bold uppercase tracking-wider text-navy/60 mb-3">Tech Executive Transition</div>
              <h3 className="text-xl font-serif font-bold text-navy mb-3 group-hover:text-gold transition-colors">From Generic to Director-Ready</h3>
              <p className="text-charcoal/80 text-sm mb-4">Senior PM with 15 years experience transformed into interview-ready Director candidate.</p>
              <span className="text-gold font-semibold text-sm flex items-center">
                Read the full story
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </a>

            {/* Card 2 */}
            <a href="#case-study-2" className="group glass p-6 rounded-2xl border border-sand-200 hover:border-gold hover:shadow-premium-hover transition-all duration-300">
              <div className="text-xs font-bold uppercase tracking-wider text-navy/60 mb-3">Healthcare Career Pivot</div>
              <h3 className="text-xl font-serif font-bold text-navy mb-3 group-hover:text-gold transition-colors">Clinical to Executive Leadership</h3>
              <p className="text-charcoal/80 text-sm mb-4">Nurse Manager successfully repositioned for Healthcare Administration director role.</p>
              <span className="text-gold font-semibold text-sm flex items-center">
                Read the full story
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </a>

            {/* Card 3 */}
            <a href="#case-study-3" className="group glass p-6 rounded-2xl border border-sand-200 hover:border-gold hover:shadow-premium-hover transition-all duration-300">
              <div className="text-xs font-bold uppercase tracking-wider text-navy/60 mb-3">Recent Graduate Launch</div>
              <h3 className="text-xl font-serif font-bold text-navy mb-3 group-hover:text-gold transition-colors">From Internships to Multiple Offers</h3>
              <p className="text-charcoal/80 text-sm mb-4">ASU graduate with limited experience optimized for competitive job market success.</p>
              <span className="text-gold font-semibold text-sm flex items-center">
                Read the full story
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </a>
          </div>
        </Container>
      </section>

      {/* Case Study 1 */}
      <section id="case-study-1" className="section-padding bg-white border-b border-sand-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Schema.org structured data for Case Study */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Article',
                  '@id': 'https://southwestresumeservices.com/results#case-study-1',
                  headline: 'Tech Executive Transition: From Generic to Director-Ready',
                  description: 'Senior PM with 15 years experience transformed into interview-ready Director candidate through research-backed positioning.',
                  articleBody: 'Representative example case study demonstrating career advancement methodology for technology professionals.',
                  author: {
                    '@type': 'Organization',
                    name: 'Southwest Resume Services',
                  },
                  publisher: {
                    '@type': 'Organization',
                    name: 'Southwest Resume Services',
                    logo: {
                      '@type': 'ImageObject',
                      url: 'https://southwestresumeservices.com/logo.png',
                    },
                  },
                  keywords: 'tech executive resume, director level positioning, career advancement, resume transformation',
                }),
              }}
            />

            <div className="mb-10">
              <div className="inline-block px-4 py-1.5 bg-navy/5 text-navy text-xs font-bold uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm">
                Tech Executive Transition | Technology
              </div>
              <h2 className="text-3xl md:text-4xl mb-6">From Generic to Director-Ready</h2>

              <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6">
                <p className="text-sm text-charcoal/90">
                  <strong>Note:</strong> This is a representative example case study created to illustrate our methodology. While based on common client scenarios, specific details and outcomes are for demonstration purposes only.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass p-6 rounded-2xl border border-sand-200">
                  <h3 className="text-lg font-bold text-navy mb-3">The Challenge</h3>
                  <p className="text-charcoal/80 leading-relaxed">
                    Senior Product Manager at a major tech company with 15 years of experience sought Director-level roles but had a generic resume that failed to differentiate their strategic impact from tactical execution.
                  </p>
                </div>
                <div className="glass-dark p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-gold mb-3">What We Discovered</h3>
                  <p className="text-sand-100 leading-relaxed">
                    Through our discovery process, we identified quantified achievements including cross-functional team leadership, product launches with measurable user adoption, and strategic roadmap ownership that was previously buried in generic bullet points.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-serif font-semibold text-navy mb-6">Our Methodology</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-charcoal/80"><strong>Research-backed positioning:</strong> Analyzed Director-level job descriptions and industry standards to identify gaps between current presentation and target role requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-charcoal/80"><strong>Quantified achievements:</strong> Extracted and verified specific metrics (user adoption rates, team size, revenue impact) that demonstrated strategic scope</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-charcoal/80"><strong>Industry keyword optimization:</strong> Incorporated ATS-friendly language and role-specific terminology validated through market research</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-charcoal/80"><strong>Interview preparation:</strong> Developed proof points and defense strategies for every enhanced claim</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-serif font-semibold text-navy mb-2">The Deliverables</h3>
                  <ul className="space-y-2 text-charcoal/80 text-sm">
                    <li>• Director-level resume with strategic positioning</li>
                    <li>• LinkedIn profile optimization</li>
                    <li>• Interview-ready talking points with quantified proof</li>
                    <li>• Cover letter template aligned to target roles</li>
                  </ul>
                </div>
                <div className="glass p-6 rounded-xl border-l-4 border-gold">
                  <h3 className="text-lg font-serif font-semibold text-navy mb-2">Representative Outcome</h3>
                  <p className="text-charcoal/80 text-sm mb-3"><strong>Example result:</strong> Client reported 3 interviews secured within 2 weeks of deploying optimized materials.</p>
                  <p className="text-xs text-charcoal/60 italic">Note: This outcome is illustrative of typical client experiences but not a guarantee of specific results.</p>
                </div>
              </div>
            </div>

            {/* Inline CTA */}
            <div className="mt-12 p-8 bg-gold/5 rounded-2xl border border-gold/20 text-center">
              <p className="text-navy font-semibold text-lg mb-4">
                Ready to position yourself for executive-level opportunities?
              </p>
              <Button href="/contact" variant="outline" size="md">
                Start Your Discovery
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Case Study 2 */}
      <section id="case-study-2" className="section-padding bg-sand-50 border-b border-sand-200">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Schema.org structured data for Case Study */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Article',
                  '@id': 'https://southwestresumeservices.com/results#case-study-2',
                  headline: 'Healthcare Career Pivot: Clinical to Executive Leadership',
                  description: 'Nurse Manager successfully repositioned for Healthcare Administration director role through transferable skills translation.',
                  articleBody: 'Representative example case study demonstrating career transition methodology for healthcare professionals.',
                  author: {
                    '@type': 'Organization',
                    name: 'Southwest Resume Services',
                  },
                  publisher: {
                    '@type': 'Organization',
                    name: 'Southwest Resume Services',
                    logo: {
                      '@type': 'ImageObject',
                      url: 'https://southwestresumeservices.com/logo.png',
                    },
                  },
                  keywords: 'healthcare career transition, nurse to administrator, healthcare executive resume, clinical leadership',
                }),
              }}
            />

            <div className="mb-10">
              <div className="inline-block px-4 py-1.5 bg-navy/5 text-navy text-xs font-bold uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm">
                Healthcare Career Pivot | Clinical to Administration
              </div>
              <h2 className="text-3xl md:text-4xl mb-6">Clinical to Executive Leadership</h2>

              <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6">
                <p className="text-sm text-charcoal/90">
                  <strong>Note:</strong> This is a representative example case study created to illustrate our methodology. While based on common client scenarios, specific details and outcomes are for demonstration purposes only.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-navy mb-3">The Challenge</h3>
                  <p className="text-charcoal/80 leading-relaxed mb-3">
                    Experienced Nurse Manager with strong clinical background sought to transition into Healthcare Administration at the Director level.
                  </p>
                  <p className="text-charcoal/80 leading-relaxed">
                    Resume emphasized clinical skills and patient care but failed to showcase the administrative, operational, and strategic competencies required for executive healthcare leadership roles.
                  </p>
                </div>
                <div className="glass-dark p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-gold mb-3">What We Discovered</h3>
                  <ul className="space-y-2 text-sm text-sand-100">
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      Budget management oversight for multi-million dollar department
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      Staff scheduling, training, and performance management for 20+ employees
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      Compliance and regulatory reporting experience
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      Quality improvement initiatives with measurable patient outcomes
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-serif font-semibold text-navy mb-6">Our Methodology</h3>
                <p className="text-charcoal/80 mb-6">We repositioned clinical experience into executive competencies valued in healthcare administration:</p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-charcoal/80"><strong>Transferable skills translation:</strong> Mapped clinical leadership responsibilities to operational management, budget oversight, and strategic planning language</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-charcoal/80"><strong>Industry keyword optimization:</strong> Incorporated healthcare administration terminology aligned with Director of Operations job postings and industry standards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-charcoal/80"><strong>Executive positioning:</strong> Shifted narrative from clinical care provider to strategic operations leader with P&L responsibility and regulatory compliance expertise</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-charcoal/80"><strong>Quantified impact:</strong> Highlighted measurable outcomes including cost savings, efficiency improvements, and quality metrics</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-serif font-semibold text-navy mb-2">The Deliverables</h3>
                  <ul className="space-y-2 text-charcoal/80 text-sm">
                    <li>• Executive-level resume with administrative positioning</li>
                    <li>• Transferable skills matrix for interview preparation</li>
                    <li>• LinkedIn profile optimized for healthcare administration roles</li>
                    <li>• Industry-specific keyword alignment for ATS systems</li>
                  </ul>
                </div>
                <div className="glass p-6 rounded-xl border-l-4 border-gold">
                  <h3 className="text-lg font-serif font-semibold text-navy mb-2">Representative Outcome</h3>
                  <p className="text-charcoal/80 text-sm mb-3"><strong>Example result:</strong> Client successfully landed Director of Operations role at healthcare facility.</p>
                  <p className="text-xs text-charcoal/60 italic">Note: This outcome is illustrative of typical client experiences but not a guarantee of specific results.</p>
                </div>
              </div>
            </div>

            {/* Inline CTA */}
            <div className="mt-12 p-8 bg-gold/5 rounded-2xl border border-gold/20 text-center">
              <p className="text-navy font-semibold text-lg mb-4">
                Looking to pivot your career into a new industry or role?
              </p>
              <Button href="/contact" variant="outline" size="md">
                Start Your Discovery
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Case Study 3 */}
      <section id="case-study-3" className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Schema.org structured data for Case Study */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Article',
                  '@id': 'https://southwestresumeservices.com/results#case-study-3',
                  headline: 'Recent Graduate Launch: From Internships to Multiple Offers',
                  description: 'ASU graduate with limited experience optimized for competitive job market through skills-based resume and LinkedIn optimization.',
                  articleBody: 'Representative example case study demonstrating early career methodology for recent college graduates.',
                  author: {
                    '@type': 'Organization',
                    name: 'Southwest Resume Services',
                  },
                  publisher: {
                    '@type': 'Organization',
                    name: 'Southwest Resume Services',
                    logo: {
                      '@type': 'ImageObject',
                      url: 'https://southwestresumeservices.com/logo.png',
                    },
                  },
                  keywords: 'recent graduate resume, ASU graduate, entry level resume, college graduate job search, LinkedIn optimization',
                }),
              }}
            />

            <div className="mb-10">
              <div className="inline-block px-4 py-1.5 bg-navy/5 text-navy text-xs font-bold uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm">
                Recent Graduate Launch | ASU Graduate
              </div>
              <h2 className="text-3xl md:text-4xl mb-6">From Internships to Multiple Offers</h2>

              <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6">
                <p className="text-sm text-charcoal/90">
                  <strong>Note:</strong> This is a representative example case study created to illustrate our methodology. While based on common client scenarios, specific details and outcomes are for demonstration purposes only.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass p-6 rounded-2xl border border-sand-200">
                  <h3 className="text-lg font-bold text-navy mb-3">The Challenge</h3>
                  <p className="text-charcoal/80 leading-relaxed">
                    Recent ASU graduate entering competitive job market with limited full-time work experience. Strong internship background but struggled to differentiate from hundreds of other new graduates applying to the same entry-level positions.
                  </p>
                </div>
                <div className="glass-dark p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-gold mb-3">What We Discovered</h3>
                  <p className="text-sand-100 leading-relaxed">
                    Multiple high-quality internships with tangible contributions, relevant coursework with practical applications, leadership in student organizations, and technical skills that aligned directly with target roles but were undersold in original materials.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-serif font-semibold text-navy mb-6">Our Methodology</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-charcoal/80"><strong>Skills-based resume structure:</strong> Emphasized competencies and achievements over chronological job history, positioning internship projects as professional accomplishments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-charcoal/80"><strong>Quantified internship impact:</strong> Extracted measurable contributions from internship experiences (e.g., &quot;contributed to project that increased efficiency by 15%&quot;)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-charcoal/80"><strong>LinkedIn optimization:</strong> Built professional online presence with keyword-rich headline, compelling about section, and strategic skill endorsements to improve recruiter visibility</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold mr-4 flex-shrink-0">✓</span>
                    <span className="text-charcoal/80"><strong>ATS keyword alignment:</strong> Incorporated industry-standard terminology and technical skills relevant to target entry-level positions</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-serif font-semibold text-navy mb-2">The Deliverables</h3>
                  <ul className="space-y-2 text-charcoal/80 text-sm">
                    <li>• Skills-based resume highlighting transferable competencies</li>
                    <li>• Optimized LinkedIn profile for recruiter searches</li>
                    <li>• Technical skills matrix aligned to job requirements</li>
                    <li>• Interview preparation guide for common graduate questions</li>
                  </ul>
                </div>
                <div className="glass p-6 rounded-xl border-l-4 border-gold">
                  <h3 className="text-lg font-serif font-semibold text-navy mb-2">Representative Outcome</h3>
                  <p className="text-charcoal/80 text-sm mb-3"><strong>Example result:</strong> Client reported multiple job offers within 30 days of launching optimized resume and LinkedIn profile.</p>
                  <p className="text-xs text-charcoal/60 italic">Note: This outcome is illustrative of typical client experiences but not a guarantee of specific results.</p>
                </div>
              </div>
            </div>

            {/* Inline CTA */}
            <div className="mt-12 p-8 bg-gold/5 rounded-2xl border border-gold/20 text-center">
              <p className="text-navy font-semibold text-lg mb-4">
                Ready to launch your career with confidence?
              </p>
              <Button href="/contact" variant="outline" size="md">
                Start Your Discovery
              </Button>
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
            <h2 className="mb-6 text-white text-4xl md:text-5xl">Ready for Your Own Success Story?</h2>
            <p className="text-xl text-sand-100 mb-10">
              Let&apos;s uncover your professional value and build your confidence through our
              research-backed methodology.
            </p>
            <Button href="/contact" variant="primary" size="lg" className="text-lg px-10 group">
              Close Your Truth Gap
              <IconArrowRight />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
