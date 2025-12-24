import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import Hero from '@/components/sections/Hero';
import TrustSectionWithToggle from '@/components/sections/TrustSectionWithToggle';
import ProblemBlock from '@/components/sections/ProblemBlock';
import VerifiedProof from '@/components/sections/VerifiedProof';
import { Service } from '@/components/sections/ServiceGrid';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { withBasePath } from '@/lib/paths';
import { GOOGLE_REVIEWS_URL } from '@/lib/reviews';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phoenix Resume Writing Services | Arizona Career Coach | Southwest Resume Services',
  description:
    'Professional resume writing services in Phoenix, AZ. Expert career coaching serving Scottsdale, Mesa, Tempe, and the Phoenix metro area. Research-backed career documents that help you own your professional story.',
  openGraph: {
    title: 'Phoenix Resume Writing Services | Southwest Resume Services',
    description:
      'Professional resume writing and career coaching in Phoenix, Arizona. Research-backed career documents for Scottsdale, Mesa, Tempe, and the Phoenix metro area.',
    url: 'https://southwestresumes.com',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Southwest Resume Services - Phoenix Resume Writing & Career Coaching',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phoenix Resume Writing Services | Southwest Resume Services',
    description:
      'Professional resume writing and career coaching in Phoenix, Arizona. Research-backed career documents.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://southwestresumes.com',
  },
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
      'ATS-compatible formatting for major systems',
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

export default function HomePage() {
  // LocalBusiness Schema for GEO/SEO (dynamic review count from API)
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Southwest Resume Services',
    description: 'Research-backed resume writing and career services based in Arizona',
    url: 'https://southwestresumes.com',
    telephone: '+1-480-374-3418',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1111 N Mission Park Blvd #2016',
      addressLocality: 'Chandler',
      addressRegion: 'AZ',
      postalCode: '85224',
      addressCountry: 'US',
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Phoenix',
      },
      {
        '@type': 'City',
        name: 'Scottsdale',
      },
      {
        '@type': 'City',
        name: 'Mesa',
      },
      {
        '@type': 'City',
        name: 'Tempe',
      },
      {
        '@type': 'City',
        name: 'Chandler',
      },
      {
        '@type': 'State',
        name: 'Arizona',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '6', // Updated from API fallback
      bestRating: '5',
      worstRating: '5',
    },
    priceRange: '$150-$500+',
    founder: {
      '@type': 'Person',
      name: 'Ryan Zimmerman',
      jobTitle: 'Founder & Principal Consultant',
    },
    sameAs: [
      GOOGLE_REVIEWS_URL,
    ],
  };

  return (
    <>
      {/* LocalBusiness Schema for GEO/SEO */}
      <Script
        id="business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      {/* 1. Hero (value prop + CTA) */}
      <Hero
        title="Your Career, Elevated."
        subtitle="Southwest Resume Services - Phoenix, Arizona"
        description="Professional resume writing and career coaching serving Phoenix, Scottsdale, Mesa, and the greater Arizona area. Research-backed career documents that reveal your true professional value."
        primaryCTA={{ text: 'Get Started', href: '/contact' }}
        secondaryCTA={{ text: 'Our Process', href: '/process' }}
      />

      {/* 2. Trust Rail (hero quote toggle + dynamic Google rating) */}
      <TrustSectionWithToggle />

      {/* 3. Problem Block ("The problem we solve") */}
      <ProblemBlock />

      {/* 4. Verified Proof (2 cards, manual scroll, excludes hero) */}
      <VerifiedProof excludeHeroId="jerome" />

      {/* 5. Client Transformations */}
      <section className="section-padding bg-sand-50 border-b border-sand-200">
        <Container>
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4 text-center">Client Transformations</h2>
            <p className="text-lg text-charcoal/70 text-center max-w-3xl mx-auto">
              Real clients closing the gap between their expertise and how they express it—turning hidden value into clear, defensible positioning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Case Study 1 */}
            <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-sand-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
              <div className="p-8 flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-navy mb-1">The Truth Gap, Closed</h3>
                  <p className="text-xs text-charcoal/60 uppercase tracking-wide">Senior Financial Operations | Retail</p>
                </div>

                <div className="space-y-4 mb-6 flex-grow">
                  <div>
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">Challenge</span>
                    <p className="text-sm text-charcoal/80">30+ years of real scope, but no resume and no language for it.</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">What we did</span>
                    <p className="text-sm text-charcoal/80">Truth inventory, standards-aligned translation, ownership transfer.</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">Outcome</span>
                    <p className="text-sm text-charcoal/80">A defensible positioning narrative and interview-ready proof stack, built to compete without exaggeration.</p>
                  </div>
                </div>

                <Link href="/results#case-study-1" className="text-navy font-medium text-sm group-hover:text-gold transition-colors flex items-center gap-1 mt-auto">
                  Read the full story
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-sand-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
              <div className="p-8 flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-navy mb-1">Evidence-First Reframe for Regulated Work</h3>
                  <p className="text-xs text-charcoal/60 uppercase tracking-wide">Public Benefits Specialist | 5+ Years | Regulated Programs</p>
                </div>

                <div className="space-y-4 mb-6 flex-grow">
                  <div>
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">Challenge</span>
                    <p className="text-sm text-charcoal/80">A task-based resume hid what hiring teams actually screen for: accuracy, throughput controls, and calm execution under pressure. Role ended in an agency-wide workforce reduction, not performance.</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">What we did</span>
                    <p className="text-sm text-charcoal/80">Truth inventory, standards-aligned translation, ownership transfer.</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">Outcome</span>
                    <p className="text-sm text-charcoal/80">A compliance-forward, metrics-backed narrative and interview script — built to support risk-conscious hiring teams without exaggeration.</p>
                  </div>
                </div>

                <Link href="/results#case-study-2" className="text-navy font-medium text-sm group-hover:text-gold transition-colors flex items-center gap-1 mt-auto">
                  Read the full story
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Case Study 3 */}
            <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-sand-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
              <div className="p-8 flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-navy mb-1">From Owner-Operator to Systems Leader</h3>
                  <p className="text-xs text-charcoal/60 uppercase tracking-wide">Hospitality Executive | Multi-Unit</p>
                </div>

                <div className="space-y-4 mb-6 flex-grow">
                  <div>
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">Challenge</span>
                    <p className="text-sm text-charcoal/80">Entrepreneurial success was real, but the resume read like responsibilities instead of scalable operating systems.</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">What we did</span>
                    <p className="text-sm text-charcoal/80">Truth inventory, standards-aligned translation, ownership transfer.</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">Outcome</span>
                    <p className="text-sm text-charcoal/80">Executive-ready positioning built on proof points, not promises.</p>
                  </div>
                </div>

                <Link href="/results#case-study-3" className="text-navy font-medium text-sm group-hover:text-gold transition-colors flex items-center gap-1 mt-auto">
                  Read the full story
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Services */}
      <section className="section-padding bg-navy text-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-6 text-white text-4xl md:text-5xl">Career Services That Transform</h2>
            <p className="text-xl text-sand-100 text-balance">
              We specialize in uncovering and articulating the professional value
              you&apos;ve been too close to recognize, then helping you own it completely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreServices.map((service) => (
              <div key={service.title} className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-gold/20 border border-white/10 flex flex-col h-full">
                <div className="w-16 h-16 bg-navy text-gold rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  {service.iconComponent}
                </div>
                <h3 className="text-2xl font-serif font-bold text-navy mb-4">{service.title}</h3>
                <p className="text-charcoal/80 flex-grow text-lg leading-relaxed">{service.description}</p>
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

      {/* 7. Pricing */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-6">Transparent Investment</h2>
            <p className="text-xl text-charcoal/80">
              Professional career documents are an investment in your future earning potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Essentials */}
            <div className="bg-white p-8 rounded-2xl shadow-premium border border-sand-100 flex flex-col text-center hover:shadow-premium-hover transition-all duration-300">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <Image
                  src={withBasePath('/assets/images/packages/essential.png')}
                  alt="Essentials Package"
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-serif font-bold text-navy mb-2">Essentials</h3>
              <div className="text-3xl font-bold text-gold mb-4">$150</div>
              <p className="text-charcoal/80 mb-6 flex-grow">
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
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <Image
                  src={withBasePath('/assets/images/packages/accelerator.png')}
                  alt="Accelerator Package"
                  width={96}
                  height={96}
                  className="object-contain"
                />
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
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <Image
                  src={withBasePath('/assets/images/packages/career-launch.png')}
                  alt="Career Launch Package"
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-serif font-bold text-navy mb-2">Career Launch</h3>
              <div className="text-3xl font-bold text-gold mb-4">$449</div>
              <p className="text-charcoal/80 mb-6 flex-grow">
                Comprehensive resume rewrite, LinkedIn optimization, and portfolio design.
              </p>
              <Link href="/contact">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. How It Works (ONE compact 3-step strip) */}
      <section className="section-padding bg-white border-b border-sand-200">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-12 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-lg font-semibold text-navy mb-2">Discovery</h3>
                <p className="text-sm text-charcoal/70">Deep dive into your experience and achievements</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-lg font-semibold text-navy mb-2">Translation</h3>
                <p className="text-sm text-charcoal/70">Research-validated positioning grounded in O*NET and BLS</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-lg font-semibold text-navy mb-2">Ownership</h3>
                <p className="text-sm text-charcoal/70">You own every word with authentic confidence</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link href="/process" className="inline-flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium">
                See the full process
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 9. Philosophy (Client Truth Principle) */}
      <section className="section-padding bg-navy text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gold blur-3xl"></div>
        </div>

        <Container>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block px-4 py-1 rounded-full bg-gold/10 text-gold text-sm font-semibold mb-6 border border-gold/20">
              Our Core Philosophy
            </div>
            <h2 className="mb-8 text-white">The Client Truth Principle</h2>
            <div className="space-y-6 text-sand-100 leading-relaxed text-lg">
              <p className="font-serif text-2xl text-gold italic">
                &quot;A resume you can&apos;t own performs like fiction when it matters most.&quot;
              </p>
              <p>
                This is the Client Truth Principle—the foundation of everything we create.
                In interviews, only genuine ownership translates to confident delivery.
              </p>
              <p>
                Our role is straightforward: we bring outside perspective, research methodology
                grounded in O*NET and market intelligence, and professional language expertise.
                You bring lived experience and genuine achievements. Together, we build a narrative
                you can defend with authentic confidence.
              </p>
              <p>
                Nothing fabricated. Nothing exaggerated. Just your professional story,
                finally articulated the way it deserves.
              </p>
            </div>
            <div className="mt-10">
              <Link href="/about">
                <Button variant="primary" size="lg">Learn About Our Philosophy</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 10. Final CTA */}
      <section className="section-padding bg-white relative overflow-hidden border-t border-sand-200">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-gold to-transparent"></div>
        </div>
        <Container>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="mb-6 text-navy text-4xl md:text-5xl">Ready to Elevate Your Career?</h2>
            <p className="text-xl text-charcoal/80 mb-10 text-balance">
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
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 border-navy text-navy hover:bg-navy hover:text-white">
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
