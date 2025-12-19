import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import { Service } from '@/components/sections/ServiceGrid';
import Container from '@/components/layout/Container';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Southwest Resume Services | Your Career, Elevated.',
  description:
    'Premium career services and resume optimization based in Arizona. Research-backed, authentically crafted career documents that help you own your professional story.',
};

// SVG Icons for crisp rendering
const IconDocument = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const IconBriefcase = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const IconTarget = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

const IconBeaker = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

const IconSparkles = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);

const IconRocket = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const IconBolt = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const coreServices: (Service & { iconComponent: React.ReactNode })[] = [
  {
    title: 'Resume Writing & Optimization',
    description:
      'Research-validated resume writing that reveals your true professional value through the Client Truth Principle.',
    icon: '',
    iconComponent: <IconDocument />,
    features: [
      'In-depth discovery and market research',
      'O*NET and industry-validated language',
      'ATS-optimized formatting',
      'Authentic, defensible enhancements',
    ],
    cta: { text: 'Learn More', href: '/services#resume' },
  },
  {
    title: 'LinkedIn Optimization',
    description:
      'Transform your LinkedIn presence with research-backed optimization that attracts recruiters and opportunities.',
    icon: '',
    iconComponent: <IconBriefcase />,
    features: [
      'Keyword-optimized profile',
      'Compelling headline and about section',
      'Strategic positioning',
      'Skills and endorsement strategy',
    ],
    cta: { text: 'Learn More', href: '/services#linkedin' },
  },
  {
    title: 'Interview Coaching',
    description:
      'Build confidence and master your interview narrative with our comprehensive preparation framework.',
    icon: '',
    iconComponent: <IconTarget />,
    features: [
      'STAR+ story development',
      'Mock interview sessions',
      'Enhancement defense strategies',
      'Stress inoculation protocols',
    ],
    cta: { text: 'Learn More', href: '/services#interview' },
  },
];

const whySRS: { title: string; description: string; iconComponent: React.ReactNode; features: string[] }[] = [
  {
    title: 'Research-Backed Methodology',
    description:
      'Every claim is validated through authoritative sources including O*NET, Bureau of Labor Statistics, and leading market intelligence platforms.',
    iconComponent: <IconBeaker />,
    features: ['O*NET Validation', 'BLS Data Integration', 'Market Intelligence'],
  },
  {
    title: 'Client Truth Principle',
    description:
      'We don\'t just write resumes—we help you own your story. Every enhancement is grounded in your authentic experience and defensible in interviews.',
    iconComponent: <IconSparkles />,
    features: ['Authenticity Focus', 'Defensible Claims', 'Confidence Building'],
  },
  {
    title: 'Comprehensive Process',
    description:
      'From deep discovery and market research to ownership transfer and interview mastery, we guide you through every step of your career elevation.',
    iconComponent: <IconRocket />,
    features: ['Deep Discovery', 'Ownership Transfer', 'Interview Mastery'],
  },
  {
    title: 'Quality Obsessed',
    description:
      'Ten-dimensional quality framework ensures ATS compatibility, WCAG accessibility, and DEI-friendly language in every document.',
    iconComponent: <IconBolt />,
    features: ['ATS Compatible', 'WCAG Accessible', 'DEI Friendly'],
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        title="Your Career, Elevated."
        subtitle="Southwest Resume Services"
        description="Premium career services and resume optimization that reveal your true professional value. Research-backed. Authentically crafted. Genuinely defensible."
        primaryCTA={{ text: 'Get Started', href: '/contact' }}
        secondaryCTA={{ text: 'Our Process', href: '/process' }}
      />

      {/* Verified Proof Section */}
      <section className="section-padding bg-sand-50 border-b border-sand-200">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="mb-4">Verified Proof</h2>
            <p className="text-xl text-gray-600 text-balance">
              A premium promise requires defensible evidence. Here is what we can show, without hype.
            </p>
          </div>

          {/* Subsection 1: Google Reviews */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h3 className="text-2xl font-serif font-semibold text-navy mb-2">Verified Google Reviews</h3>
                <p className="text-sm text-gray-500">Excerpts from publicly posted Google reviews. Shortened for clarity. Reviews are shown exactly as written, with only minor truncation (ellipsis) for length.</p>
                <p className="text-xs text-gray-400 mt-1">We use initials by default to respect privacy. Full names are only used with written permission.</p>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-sand-200">
                <span className="text-gold text-lg">★★★★★</span>
                <span className="font-semibold text-navy">5.0 on Google</span>
                <span className="text-gray-500 text-sm">(3 reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-sand-100 flex flex-col h-full">
                <div className="text-gold text-xl mb-4">★★★★★</div>
                <blockquote className="text-gray-600 italic mb-6 flex-grow leading-relaxed">
                  &quot;I was very impressed with the time and effort Ryan at Southwest Resume Services took to revise my current resume. His initial questionnaire helped provide a foundation...&quot;
                </blockquote>
                <div className="mt-auto">
                  <div className="font-semibold text-navy">Lisa W.</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Google Review</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-sand-100 flex flex-col h-full">
                <div className="text-gold text-xl mb-4">★★★★★</div>
                <blockquote className="text-gray-600 italic mb-6 flex-grow leading-relaxed">
                  &quot;I am so thankful I found Ryan. He was very helpful and made this process easy for me. He knows the questions to ask and I felt that I was in great hands...&quot;
                </blockquote>
                <div className="mt-auto">
                  <div className="font-semibold text-navy">Carie L.</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Google Review</div>
                </div>
              </div>

              {/* Card 3 - Proof Statement */}
              <div className="bg-navy p-8 rounded-xl shadow-lg border border-navy flex flex-col h-full text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <h4 className="text-lg font-semibold text-gold mb-4 uppercase tracking-wider">Proof you can feel</h4>
                <p className="text-sand-100 mb-6 flex-grow leading-relaxed">
                  Evidence-backed positioning. Clear process. Materials you can defend under pressure.
                </p>
                <div className="mt-auto pt-6 border-t border-white/10">
                  <a
                    href="https://www.google.com/search?q=Southwest+Resume+Services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gold transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    Read all reviews on Google <span>→</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400 max-w-2xl mx-auto">
                Reviews are shown as excerpts and may be shortened. We do not publish outcomes beyond deliverables unless documented and permitted.
              </p>
            </div>
          </div>

          {/* Subsection 2: Recent Wins */}
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-semibold text-navy mb-2">Recent Wins</h3>
              <p className="text-sm text-gray-500">Details are anonymized for privacy. Metrics are shown as ranges when needed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Case Study 1 */}
              <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-sand-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="p-8 flex flex-col h-full">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-navy mb-1">The Truth Gap, Closed</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Senior Financial Operations | Retail</p>
                  </div>

                  <div className="space-y-4 mb-6 flex-grow">
                    <div>
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">Challenge</span>
                      <p className="text-sm text-gray-600">30+ years of real scope, but no resume and no language for it.</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">What we did</span>
                      <p className="text-sm text-gray-600">Truth inventory → standards-aligned translation → ownership transfer.</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">Outcome</span>
                      <p className="text-sm text-gray-600">A defensible positioning narrative and interview-ready proof stack, built to compete without exaggeration.</p>
                    </div>
                  </div>

                  <Link href="/results#case-study-1" className="text-navy font-medium text-sm group-hover:text-gold transition-colors flex items-center gap-2 mt-auto">
                    Read the case study <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Case Study 2 */}
              <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-sand-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="p-8 flex flex-col h-full">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-navy mb-1">Evidence-First Reframe for Regulated Work</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Public Benefits Specialist | 5+ Years | Regulated Programs</p>
                  </div>

                  <div className="space-y-4 mb-6 flex-grow">
                    <div>
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">Challenge</span>
                      <p className="text-sm text-gray-600">A task-based resume hid what hiring teams actually screen for: accuracy, throughput controls, and calm execution under pressure. Role ended in an agency-wide workforce reduction, not performance.</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">What we did</span>
                      <p className="text-sm text-gray-600">Truth inventory → standards-aligned translation → ownership transfer.</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">Outcome</span>
                      <p className="text-sm text-gray-600">A compliance-forward, metrics-backed narrative and interview script — built to support risk-conscious hiring teams without exaggeration.</p>
                    </div>
                  </div>

                  <Link href="/results#case-study-2" className="text-navy font-medium text-sm group-hover:text-gold transition-colors flex items-center gap-2 mt-auto">
                    Read the case study <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Case Study 3 */}
              <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-sand-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="p-8 flex flex-col h-full">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-navy mb-1">From Owner-Operator to Systems Leader</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Hospitality Executive | Multi-Unit</p>
                  </div>

                  <div className="space-y-4 mb-6 flex-grow">
                    <div>
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">Challenge</span>
                      <p className="text-sm text-gray-600">Entrepreneurial success was real, but the resume read like responsibilities instead of scalable operating systems.</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">What we did</span>
                      <p className="text-sm text-gray-600">Truth inventory → standards-aligned translation → ownership transfer.</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">Outcome</span>
                      <p className="text-sm text-gray-600">Executive-ready positioning built on proof points, not promises.</p>
                    </div>
                  </div>

                  <Link href="/results#case-study-3" className="text-navy font-medium text-sm group-hover:text-gold transition-colors flex items-center gap-2 mt-auto">
                    Read the case study <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center border-t border-sand-200 pt-8">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-2">Proof Standard</p>
              <p className="text-xs text-gray-500 max-w-2xl mx-auto">
                We publish outcomes beyond deliverables only when documented and permitted. Otherwise, we report what we deliver: defensible positioning, verified proof points, and interview-ready ownership.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* What We Do */}
      <section className="section-padding bg-navy text-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-6 text-white text-4xl md:text-5xl">Career Services That Transform</h2>
            <p className="text-xl text-sand-100 text-balance">
              We specialize in uncovering and articulating the professional value you
              cannot see in yourself, then helping you own it completely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreServices.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-gold/20 border border-white/10 flex flex-col h-full">
                <div className="w-16 h-16 bg-navy text-gold rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  {service.iconComponent}
                </div>
                <h3 className="text-2xl font-serif font-bold text-navy mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-8 flex-grow text-lg leading-relaxed">{service.description}</p>

                <Link href={service.cta?.href || '#'}>
                  <Button variant="outline" className="w-full border-navy text-navy hover:bg-navy hover:text-white">
                    {service.cta?.text}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/services">
              <Button variant="primary" size="lg" className="px-10 text-lg shadow-gold/20">
                View All Services & Pricing
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Transparent Pricing Preview */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-6">Transparent Investment</h2>
            <p className="text-xl text-gray-600">
              Professional career documents are an investment in your future earning potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Essentials */}
            <div className="bg-white p-8 rounded-2xl shadow-premium border border-sand-100 flex flex-col text-center hover:shadow-premium-hover transition-all duration-300">
              <h3 className="text-xl font-serif font-bold text-navy mb-2">Essentials</h3>
              <div className="text-3xl font-bold text-gold mb-4">$150</div>
              <p className="text-gray-600 mb-6 flex-grow">
                Perfectly optimized resume highlighting your strengths clearly and effectively.
              </p>
              <Link href="/contact">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Accelerator */}
            <div className="bg-navy p-8 rounded-2xl shadow-2xl border border-navy flex flex-col text-center transform scale-105 z-10 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gold text-navy text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-2">Accelerator</h3>
              <div className="text-3xl font-bold text-gold mb-4">$300</div>
              <p className="text-sand-100 mb-6 flex-grow">
                Enhanced resume with advanced ATS strategies and narrative refinement.
              </p>
              <Link href="/contact">
                <Button variant="primary" className="w-full shadow-gold/20">Get Started</Button>
              </Link>
            </div>

            {/* Career Launch */}
            <div className="bg-white p-8 rounded-2xl shadow-premium border border-sand-100 flex flex-col text-center hover:shadow-premium-hover transition-all duration-300">
              <h3 className="text-xl font-serif font-bold text-navy mb-2">Career Launch</h3>
              <div className="text-3xl font-bold text-gold mb-4">$449</div>
              <p className="text-gray-600 mb-6 flex-grow">
                Comprehensive resume rewrite, LinkedIn optimization, and portfolio design.
              </p>
              <Link href="/contact">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* The Client Truth Principle - Redesigned */}
      <section className="section-padding bg-navy text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gold blur-3xl"></div>
        </div>

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-gold/10 text-gold text-sm font-semibold mb-6 border border-gold/20">
                Our Core Philosophy
              </div>
              <h2 className="mb-8 text-white">The Client Truth Principle</h2>
              <div className="space-y-6 text-sand-100 leading-relaxed text-lg">
                <p className="font-serif text-2xl text-gold italic">
                  &quot;Whether it is factual or not, if it&apos;s not the client&apos;s truth,
                  then it&apos;s all for nothing.&quot;
                </p>
                <p>
                  This foundational principle guides everything we do. We understand that a technically accurate statement that
                  doesn&apos;t feel true to you will perform like a lie when it matters
                  most—in an interview.
                </p>
                <p>
                  Our role isn&apos;t to fabricate. It&apos;s to uncover genuine
                  value, articulate it in professional language, and transfer ownership so
                  completely that it becomes your authentic truth.
                </p>
              </div>
              <div className="mt-10">
                <Link href="/about">
                  <Button variant="primary">Learn About Our Philosophy</Button>
                </Link>
              </div>
            </div>

            <div className="glass-dark p-8 rounded-2xl shadow-2xl border border-white/10">
              <h3 className="text-2xl font-serif font-semibold text-white mb-8 border-b border-white/10 pb-4">
                The Three Pillars of Ethical Enhancement
              </h3>
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold flex-shrink-0">1</div>
                  <h4 className="text-xl font-semibold text-white">Investigation</h4>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold flex-shrink-0">2</div>
                  <h4 className="text-xl font-semibold text-white">Translation</h4>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold flex-shrink-0">3</div>
                  <h4 className="text-xl font-semibold text-white">Transformation</h4>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Why Choose SRS - Grid Layout */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-6">Why Southwest Resume Services</h2>
            <p className="text-xl text-gray-600 text-balance">
              We combine rigorous research methodology with deep psychological insight
              to create career documents that are both powerful and authentically yours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whySRS.map((item, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="w-14 h-14 bg-navy text-gold rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    {item.iconComponent}
                  </div>
                  <CardTitle as="h3" className="text-2xl mb-4">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {item.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-base text-navy font-medium">
                        <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* How We Work - Simplified Visuals */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-6">Our Process</h2>
            <p className="text-xl text-gray-600">
              A systematic, research-driven approach to career transformation.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-sand-200 -z-10 transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Discovery',
                  description: 'Deep dive into your experience',
                },
                {
                  step: '02',
                  title: 'Research',
                  description: 'Market intelligence & validation',
                },
                {
                  step: '03',
                  title: 'Crafting',
                  description: 'Professional translation',
                },
                {
                  step: '04',
                  title: 'Ownership',
                  description: 'Interview mastery',
                },
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-sand-100 shadow-premium text-center relative group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-12 h-12 mx-auto bg-navy text-gold rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/process">
              <Button variant="primary" size="lg">
                See Our Full Process
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-gold to-transparent"></div>
        </div>
        <Container>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="mb-6 text-white text-4xl md:text-5xl">Ready to Elevate Your Career?</h2>
            <p className="text-xl text-sand-100 mb-10 text-balance">
              Let&apos;s uncover your professional value and help you own your story.
              Schedule a consultation to get started.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/contact">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-10">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 border-white text-white hover:bg-white hover:text-navy">
                  Have Questions?
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
