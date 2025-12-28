/**
 * Scottsdale-Specific SEO Landing Page
 * Target Keywords: "resume writing services Scottsdale", "Scottsdale resume writer", "career coach Scottsdale AZ"
 * Created: 2025-12-26
 */

import Link from 'next/link';
import Script from 'next/script';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scottsdale Resume Writing Services | Executive Resume Writer Scottsdale AZ | Southwest Resume Services',
  description:
    'Executive resume writing services in Scottsdale, Arizona. Premium career coaching for Scottsdale professionals. Research-backed resumes for discerning executives in luxury hospitality, tech, finance, and healthcare.',
  openGraph: {
    title: 'Scottsdale Resume Writing Services | Executive Resume Writer Scottsdale AZ',
    description:
      'Premium resume writing services in Scottsdale, AZ. Serving Scottsdale executives with research-backed resumes that command attention.',
    url: 'https://southwestresumes.com/scottsdale-resume-services',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Scottsdale Resume Writing Services - Southwest Resume Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scottsdale Resume Writing Services | Executive Resume Writer Scottsdale AZ',
    description:
      'Executive resume writing services in Scottsdale, AZ. Premium career coaching for discerning professionals.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://southwestresumes.com/scottsdale-resume-services',
  },
};

// SVG Icons
const IconCheck = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const IconDocument = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const IconLinkedIn = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const IconMic = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
  </svg>
);

const IconArrowRight = () => (
  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const IconTrendingUp = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const IconStar = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

export default function ScottsdaleResumeServicesPage() {
  // LocalBusiness Schema for Scottsdale-specific SEO
  const scottsdaleBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Southwest Resume Services - Scottsdale',
    description: 'Executive resume writing services in Scottsdale, Arizona. Premium career coaching and resume optimization for Scottsdale executives in luxury hospitality, high-end retail, tech startups, financial services, and healthcare.',
    url: 'https://southwestresumes.com/scottsdale-resume-services',
    telephone: '+1-480-374-3418',
    email: 'info@southwestresumes.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1111 N Mission Park Blvd #2016',
      addressLocality: 'Chandler',
      addressRegion: 'AZ',
      postalCode: '85224',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.4942,
      longitude: -111.9261,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Scottsdale',
        containedInPlace: {
          '@type': 'State',
          name: 'Arizona',
        },
      },
      {
        '@type': 'City',
        name: 'Paradise Valley',
      },
      {
        '@type': 'City',
        name: 'Fountain Hills',
      },
      {
        '@type': 'City',
        name: 'Cave Creek',
      },
      {
        '@type': 'City',
        name: 'Carefree',
      },
      {
        '@type': 'City',
        name: 'North Phoenix',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Scottsdale Executive Resume Writing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Executive Resume Writing',
            description: 'Premium resume writing and optimization for Scottsdale executive job market',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'LinkedIn Optimization',
            description: 'Executive LinkedIn profile optimization for Scottsdale professionals',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Executive Interview Coaching',
            description: 'Interview preparation for Scottsdale executive positions',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Career Strategy',
            description: 'Executive career planning and job search strategy for Scottsdale area',
          },
        },
      ],
    },
    priceRange: '$150-$500+',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '6',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://southwestresumes.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Scottsdale Resume Services',
        item: 'https://southwestresumes.com/scottsdale-resume-services',
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <Script
        id="scottsdale-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(scottsdaleBusinessSchema) }}
      />
      <Script
        id="scottsdale-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-navy overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3 opacity-60" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3 opacity-40" />
        </div>

        <Container className="relative z-10 section-padding">
          <div className="max-w-5xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center justify-center gap-2 text-sand-200">
                <li>
                  <Link href="/" className="hover:text-gold transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-sand-400">/</li>
                <li className="text-gold">Scottsdale Resume Services</li>
              </ol>
            </nav>

            <div className="inline-block px-6 py-2 rounded-full bg-white/5 text-gold text-sm font-semibold mb-8 border border-white/10 backdrop-blur-md shadow-lg">
              Scottsdale, Arizona
            </div>

            <h1 className="mb-8 text-white text-5xl md:text-6xl lg:text-7xl leading-tight font-serif tracking-tight drop-shadow-lg">
              Executive Resume Writing Services for Scottsdale Professionals
            </h1>

            <p className="text-xl md:text-2xl text-sand-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light text-balance opacity-90">
              Premium resume writing and career coaching for discerning Scottsdale executives. Research-backed career documents that reflect your caliber and command the attention of top-tier employers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                  Schedule Consultation
                  <IconArrowRight />
                </Button>
              </Link>
              <Link href="/process">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-navy">
                  Our Executive Process
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Why Scottsdale Executives Choose Us */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 text-center">Why Scottsdale Executives Choose Southwest Resume Services</h2>
            <p className="text-lg text-charcoal/80 text-center max-w-3xl mx-auto leading-relaxed">
              Scottsdale represents the pinnacle of Arizona&apos;s professional landscape—home to luxury hospitality leaders, innovative tech startups, high-end retail headquarters, sophisticated financial services firms, and premier healthcare institutions. This market demands executive-level positioning that goes beyond conventional resume writing. Scottsdale professionals expect excellence, and so do the companies competing for top talent here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-sand-50 rounded-2xl p-8 border border-sand-200 hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                <IconStar />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">Premium Market Expertise</h3>
              <p className="text-charcoal/80 leading-relaxed">
                We understand Scottsdale&apos;s unique professional ecosystem—from the luxury resorts of North Scottsdale to the tech innovation corridors around Scottsdale Airpark, from boutique consulting firms to healthcare excellence at HonorHealth. We know what discerning Scottsdale employers expect from executive candidates.
              </p>
            </div>

            <div className="group bg-sand-50 rounded-2xl p-8 border border-sand-200 hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                <IconDocument />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">Research-Backed Excellence</h3>
              <p className="text-charcoal/80 leading-relaxed">
                Every executive resume we create is grounded in rigorous market research. We analyze 200+ Scottsdale-area job postings, validate executive competencies against O*NET leadership standards, and benchmark compensation using Bureau of Labor Statistics data specific to Arizona&apos;s premium market segment.
              </p>
            </div>

            <div className="group bg-sand-50 rounded-2xl p-8 border border-sand-200 hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                <IconTrendingUp />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">Executive-Level Results</h3>
              <p className="text-charcoal/80 leading-relaxed">
                Our Scottsdale clients consistently secure interviews with premier employers including HonorHealth, Vanguard, GoDaddy, Discount Tire Corporate, Four Seasons, Fairmont, boutique consulting firms, and emerging tech companies. We create executive positioning that opens doors at the highest levels.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Services for Scottsdale's Competitive Market */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4 text-center">
              Tailored to Scottsdale Excellence
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 text-center">Services Designed for Scottsdale&apos;s Competitive Market</h2>
            <p className="text-lg text-charcoal/80 text-center max-w-3xl mx-auto leading-relaxed">
              Whether you&apos;re pursuing executive opportunities in Scottsdale&apos;s luxury hospitality sector, high-growth tech startups, sophisticated financial services firms, premium healthcare institutions, or boutique professional services, we have the expertise to position you at the executive level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
            {/* Executive Resume Writing */}
            <div className="bg-white rounded-2xl p-8 border border-sand-200 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold flex-shrink-0">
                  <IconDocument />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-navy mb-2">Executive Resume Writing</h3>
                  <p className="text-gold font-bold">From $150</p>
                </div>
              </div>
              <p className="text-charcoal/80 mb-4 leading-relaxed">
                Premium resume development optimized for Scottsdale&apos;s executive market and ATS systems used by sophisticated Arizona employers. We incorporate executive-level competencies, strategic achievements, and positioning that resonates with C-suite hiring managers and executive search firms.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Scottsdale executive market research and positioning
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  ATS-compatible formatting for premium employers
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Industry-specific executive positioning
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Unlimited revisions within scope
                </li>
              </ul>
              <Link href="/services#resume">
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* LinkedIn Optimization */}
            <div className="bg-white rounded-2xl p-8 border border-sand-200 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold flex-shrink-0">
                  <IconLinkedIn />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-navy mb-2">Executive LinkedIn Optimization</h3>
                  <p className="text-gold font-bold">Included in packages</p>
                </div>
              </div>
              <p className="text-charcoal/80 mb-4 leading-relaxed">
                Executive recruiters and Scottsdale employers actively search LinkedIn for senior-level talent every day. Our premium optimization service ensures your profile commands attention, appears in executive searches, and attracts high-caliber opportunities from Arizona&apos;s most prestigious employers.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Executive-level headline targeting premium employers
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Compelling executive summary with strategic positioning
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Leadership achievements and executive competencies
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Strategic skills selection for executive recruiter visibility
                </li>
              </ul>
              <Link href="/services#linkedin">
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Executive Interview Coaching */}
            <div className="bg-white rounded-2xl p-8 border border-sand-200 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold flex-shrink-0">
                  <IconMic />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-navy mb-2">Executive Interview Coaching</h3>
                  <p className="text-gold font-bold">Premium packages</p>
                </div>
              </div>
              <p className="text-charcoal/80 mb-4 leading-relaxed">
                Prepare for executive-level interviews with Scottsdale&apos;s most discerning employers through our comprehensive coaching program. Master the STAR+ method for leadership scenarios, develop compelling narratives about strategic achievements, and build the executive presence to excel in panel interviews and assessment centers.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Mock interviews simulating C-suite panel questions
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  STAR+ framework for leadership competency stories
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Executive presence and strategic communication
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Confidence building for high-stakes interviews
                </li>
              </ul>
              <Link href="/services#interview">
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Career Strategy */}
            <div className="bg-white rounded-2xl p-8 border border-sand-200 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold flex-shrink-0">
                  <IconTrendingUp />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-navy mb-2">Executive Career Strategy</h3>
                  <p className="text-gold font-bold">Custom packages</p>
                </div>
              </div>
              <p className="text-charcoal/80 mb-4 leading-relaxed">
                Navigate Scottsdale&apos;s executive job market strategically with data-driven career planning. We provide executive market analysis, executive compensation benchmarking using Arizona premium market data, leadership competency assessment, and actionable strategies for C-suite career advancement.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Scottsdale executive market analysis and opportunity mapping
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Arizona executive compensation benchmarking
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Leadership development roadmap
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Executive transition planning and execution
                </li>
              </ul>
              <Link href="/services#strategy">
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Scottsdale Job Market Insights */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-8 text-center">Understanding Scottsdale&apos;s Executive Job Market</h2>

            <div className="prose prose-lg max-w-none text-charcoal/80 space-y-6 leading-relaxed">
              <p>
                Scottsdale has distinguished itself as Arizona&apos;s premier professional destination, attracting executives, entrepreneurs, and industry leaders who value quality of life alongside career excellence. Known for world-class resorts, thriving tech innovation, sophisticated financial services, and exceptional healthcare, Scottsdale offers a unique combination of lifestyle amenities and professional opportunities that appeals to discerning executives seeking the best of both worlds.
              </p>

              <h3 className="text-2xl font-semibold text-navy mt-8 mb-4">Key Industries Defining Scottsdale&apos;s Executive Landscape</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Luxury Hospitality & Resort Management</h4>
                  <p className="text-charcoal/80 mb-3">
                    Scottsdale is synonymous with luxury hospitality, home to some of North America&apos;s most prestigious resorts and hotels. Executive roles in hotel operations, guest services, event management, food and beverage, and resort development offer sophisticated career paths for hospitality professionals.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: Four Seasons Scottsdale, Fairmont Scottsdale Princess, The Phoenician, JW Marriott, Andaz Scottsdale, Canyon Suites
                  </p>
                </div>

                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Healthcare Excellence & Medical Innovation</h4>
                  <p className="text-charcoal/80 mb-3">
                    Scottsdale&apos;s healthcare sector represents the pinnacle of Arizona medical care, with world-renowned institutions attracting top clinical talent, healthcare administrators, research professionals, and medical technology experts seeking to work at the forefront of healthcare innovation.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: HonorHealth (Scottsdale Healthcare), Mayo Clinic Arizona, Scottsdale Thompson Peak Medical Center, Virginia G. Piper Cancer Center
                  </p>
                </div>

                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Technology & Innovation</h4>
                  <p className="text-charcoal/80 mb-3">
                    Scottsdale has emerged as a tech innovation hub, particularly around Scottsdale Airpark and the Loop 101 corridor. The area attracts tech startups, established software companies, and corporate innovation centers seeking Arizona&apos;s business-friendly environment and educated talent pool.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: GoDaddy (Global HQ), Axon Enterprise, WebPT, RevLocal, emerging SaaS startups, tech consultancies
                  </p>
                </div>

                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Financial Services & Investment Management</h4>
                  <p className="text-charcoal/80 mb-3">
                    Scottsdale hosts significant operations for major financial institutions, wealth management firms, and boutique investment advisory practices. The concentration of high-net-worth individuals creates demand for sophisticated financial services professionals and relationship managers.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: Vanguard, Merrill Lynch, Morgan Stanley, Edward Jones, independent wealth management firms, private banking divisions
                  </p>
                </div>

                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">High-End Retail & Luxury Services</h4>
                  <p className="text-charcoal/80 mb-3">
                    Scottsdale&apos;s affluent demographics support a thriving luxury retail sector, from Scottsdale Fashion Square to boutique galleries and high-end specialty retail. Executive positions in retail operations, merchandising, and customer experience reflect Scottsdale&apos;s sophisticated market.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: Scottsdale Fashion Square (Macerich), Kierland Commons, Discount Tire Corporate HQ, luxury automotive dealerships, fine art galleries
                  </p>
                </div>

                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Boutique Consulting & Professional Services</h4>
                  <p className="text-charcoal/80 mb-3">
                    Scottsdale attracts boutique consulting firms, specialized professional services providers, and advisory practices serving clients across industries. Executive consultants, practice leaders, and senior advisors value Scottsdale&apos;s business environment and proximity to decision-makers.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: Management consulting firms, executive coaching practices, specialized advisory firms, professional services boutiques
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-navy mt-8 mb-4">What Scottsdale Employers Seek in Executive Candidates</h3>

              <p>
                Based on our analysis of hundreds of Scottsdale executive-level job postings, employers consistently seek candidates who demonstrate specific leadership competencies and executive presence. Understanding these expectations is critical to positioning your executive resume effectively.
              </p>

              <div className="bg-navy text-white rounded-xl p-8 my-8">
                <h4 className="text-xl font-semibold mb-4 text-gold">Top Executive Competencies in Demand Across Scottsdale Industries</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sand-100">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Strategic Leadership & Vision Setting
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      P&L Management & Financial Acumen
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Executive Stakeholder Management
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Organizational Development & Change Leadership
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Market Expansion & Growth Strategy
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Customer Experience Excellence
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Brand Management & Positioning
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Innovation & Digital Transformation
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Team Building & Executive Coaching
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Board Relations & Governance
                    </li>
                  </ul>
                </div>
              </div>

              <p>
                Our executive resume writing service incorporates these market realities into every document we create. We don&apos;t just list your experience—we strategically position your executive competencies using language that resonates with Scottsdale hiring managers, executive search firms, and the ATS systems used by Arizona&apos;s most prestigious employers.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Process - Brief */}
      <section className="section-padding bg-sand-50 border-y border-sand-200">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4 text-center">
              Our Executive Method
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 text-center">How We Work With Scottsdale Executives</h2>
            <p className="text-lg text-charcoal/80 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
              Our proven three-step process combines deep executive discovery, research-backed strategic positioning, and ownership transfer to create career documents you can defend with absolute confidence in the most demanding interview scenarios.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold text-navy mb-3">Executive Discovery</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  We conduct an in-depth executive consultation to understand your leadership philosophy, strategic achievements, career trajectory, and target roles in Scottsdale&apos;s premium market.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold text-navy mb-3">Strategic Translation</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  We analyze 200+ Scottsdale executive job postings, validate leadership competencies against O*NET standards, and craft executive positioning that speaks to C-suite decision makers and executive search professionals.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold text-navy mb-3">Executive Ownership</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  Through collaborative refinement, you internalize every strategic enhancement until the document feels authentically yours and you can articulate your executive value proposition with complete confidence.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/process" className="inline-flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium text-lg">
                See the complete executive process
                <IconArrowRight />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Service Areas */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">Serving Scottsdale and Surrounding Premium Communities</h2>
            <p className="text-lg text-charcoal/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              We proudly serve executives and senior professionals throughout Scottsdale and the surrounding premium communities. Whether you&apos;re in North Scottsdale, Old Town, or the neighboring executive enclaves, our resume writing services are designed to help you succeed in Arizona&apos;s most competitive executive markets.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Scottsdale</h3>
                <p className="text-sm text-charcoal/70 mt-1">Old Town, North Scottsdale, Airpark</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Paradise Valley</h3>
                <p className="text-sm text-charcoal/70 mt-1">Exclusive residential community</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Fountain Hills</h3>
                <p className="text-sm text-charcoal/70 mt-1">Fort McDowell, Eagle Mountain</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Cave Creek</h3>
                <p className="text-sm text-charcoal/70 mt-1">Desert Hills, Tatum Ranch</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Carefree</h3>
                <p className="text-sm text-charcoal/70 mt-1">Desert Forest, Black Mountain</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">North Phoenix</h3>
                <p className="text-sm text-charcoal/70 mt-1">Desert Ridge, Anthem</p>
              </div>
            </div>

            <p className="text-charcoal/70 italic">
              Also serving: Rio Verde, Desert Mountain, DC Ranch, Gainey Ranch, McDowell Mountain Ranch, Grayhawk, Troon North, and premium communities throughout North Scottsdale and the East Valley
            </p>
          </div>
        </Container>
      </section>

      {/* Testimonial Section */}
      <section className="section-padding bg-navy text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <svg className="w-16 h-16 mx-auto text-gold opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            <p className="text-2xl md:text-3xl text-sand-100 font-serif italic mb-8 leading-relaxed">
              As a healthcare executive seeking C-suite opportunities in Scottsdale, I needed more than a standard resume—I needed strategic positioning that reflected my leadership caliber. Southwest Resume Services delivered exactly that. The research-backed approach gave me confidence in every interview, and within five weeks I accepted an offer as VP of Operations at a premier Scottsdale healthcare system with a significant compensation increase.
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xl">
                D.R.
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">VP of Operations, Healthcare</p>
                <p className="text-sm text-sand-200">Scottsdale, Arizona</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-12 text-center">Frequently Asked Questions from Scottsdale Executives</h2>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">How do you understand Scottsdale&apos;s executive market specifically?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  For every executive engagement, we analyze 200+ job postings from Scottsdale-area employers to identify the exact leadership competencies, strategic priorities, and executive language that C-suite hiring managers and executive search firms seek. We track trends across Scottsdale&apos;s premium employers, understand executive compensation benchmarks in Arizona&apos;s luxury markets, and stay current with the industries defining Scottsdale&apos;s growth. This executive market intelligence directly informs how we position your leadership value.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">Will my executive resume work with ATS systems used by premium Scottsdale employers?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  Absolutely. Premium Scottsdale employers like HonorHealth, Vanguard, GoDaddy, and luxury hospitality groups use sophisticated ATS platforms including Workday, Taleo, Greenhouse, and iCIMS. Every executive resume we create is formatted to pass these systems while maintaining the visual sophistication expected at the executive level. We test compatibility and optimize leadership keyword placement to maximize your chances of reaching C-suite decision makers and executive search professionals.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">Do I need to meet in person, or can executive coaching be done remotely?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  All of our executive services are conducted remotely via phone and video conferencing, making the process convenient regardless of where you are in the Scottsdale area or if you travel frequently. Our virtual executive process is thorough and efficient, allowing you to participate from your office, home, or anywhere with secure internet access. We&apos;ve perfected this approach to provide the same high-quality executive results as in-person meetings while respecting the demanding schedules of senior professionals.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">How long does the executive resume writing process take?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  Timeline varies by executive package. Our Essentials package delivers in 5 business days, Accelerator in 3 days, and Career Launch in 48 hours (rush available for urgent executive opportunities). However, the most important timeline is yours—we work iteratively until you own every strategic element. Some Scottsdale executives finalize quickly, while others prefer additional refinement rounds to perfect their executive positioning. Unlimited revisions within scope mean we never rush you to acceptance before you&apos;re completely confident.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">What executive industries and leadership levels do you specialize in?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  We work with executives and senior professionals across all major Scottsdale industries including luxury hospitality, healthcare, financial services, technology, high-end retail, professional services, and boutique consulting. We serve leaders at all executive levels from VP and Director roles through C-suite positions (CXO, President, Managing Director). Our research-backed methodology allows us to quickly develop expertise in your specific industry and leadership context by analyzing relevant executive job postings and industry standards.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">How do you position executives transitioning between industries?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  Executive transitions require strategic positioning that emphasizes transferable leadership competencies over industry-specific technical skills. We identify the universal executive capabilities you&apos;ve demonstrated—strategic planning, P&L management, organizational development, stakeholder leadership, change management—and position these competencies using language that resonates in your target industry. Our research into your target sector ensures we speak the right executive language while maintaining authentic representation of your leadership track record.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">What makes your executive service different from other Scottsdale resume writers?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  Our Client Truth Principle sets us apart at every level, but especially for executives. We never fabricate or exaggerate leadership achievements—instead, we help you recognize and articulate genuine executive value and strategic impact you&apos;ve been too close to see. Every enhancement is grounded in O*NET leadership standards, validated through executive market research, and refined until you can defend it with authentic confidence in C-suite interviews. This results in executive resumes that perform exceptionally well because they represent your true leadership capabilities, not fiction you&apos;ll struggle to support when questioned by experienced board members or executive search professionals.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">Do you guarantee executive interview results?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  We don&apos;t make unrealistic guarantees because executive interview success depends on many factors beyond resume quality, including market conditions, executive search dynamics, timing, networking relationships, and application strategy. However, we do guarantee unlimited revisions until you&apos;re completely satisfied with your executive documents. Our Scottsdale executive clients consistently report increased interview rates with C-suite positions, better executive recruiter response, improved confidence throughout the executive search process, and stronger negotiating positions. We focus on creating authentic, research-backed executive positioning that gives you the best possible foundation for senior-level success.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-charcoal/80 mb-4">Have more questions about executive services?</p>
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Schedule Executive Consultation
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-navy text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gold blur-3xl"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Elevate Your Executive Career in Scottsdale?</h2>
            <p className="text-xl text-sand-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Scottsdale&apos;s premium executive market demands more than a standard resume. Let us help you command attention from Arizona&apos;s most prestigious employers with research-backed executive positioning that reveals your strategic leadership value.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <Link href="/contact">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-10 group">
                  Schedule Executive Consultation
                  <IconArrowRight />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 border-white text-white hover:bg-white hover:text-navy">
                  View Executive Pricing
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
              <div>
                <div className="text-4xl font-bold text-gold mb-2">200+</div>
                <div className="text-sand-200">Executive job postings analyzed per engagement</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gold mb-2">5.0</div>
                <div className="text-sand-200">Star rating from Scottsdale executives</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gold mb-2">100%</div>
                <div className="text-sand-200">Executive satisfaction guarantee</div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
