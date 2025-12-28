/**
 * Phoenix-Specific SEO Landing Page
 * Target Keywords: "resume writing services Phoenix", "Phoenix resume writer", "professional resume writer Phoenix AZ"
 * Created: 2025-12-26
 */

import Link from 'next/link';
import Script from 'next/script';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phoenix Resume Writing Services | Professional Resume Writer Phoenix AZ | Southwest Resume Services',
  description:
    'Professional resume writing services in Phoenix, Arizona. Expert career coaching for Phoenix metro professionals. Research-backed resumes that get interviews. Serving Phoenix, Scottsdale, Mesa, Tempe, Chandler, and Gilbert.',
  openGraph: {
    title: 'Phoenix Resume Writing Services | Professional Resume Writer Phoenix AZ',
    description:
      'Expert resume writing services in Phoenix, AZ. Serving Phoenix metro professionals with research-backed resumes that get interviews.',
    url: 'https://southwestresumes.com/phoenix-resume-services',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Phoenix Resume Writing Services - Southwest Resume Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phoenix Resume Writing Services | Professional Resume Writer Phoenix AZ',
    description:
      'Expert resume writing services in Phoenix, AZ. Research-backed resumes for Phoenix metro professionals.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://southwestresumes.com/phoenix-resume-services',
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

const IconBuilding = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);

const IconTrendingUp = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

export default function PhoenixResumeServicesPage() {
  // LocalBusiness Schema for Phoenix-specific SEO
  const phoenixBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Southwest Resume Services - Phoenix',
    description: 'Professional resume writing services in Phoenix, Arizona. Expert career coaching and resume optimization for Phoenix metro professionals in tech, healthcare, finance, and more.',
    url: 'https://southwestresumes.com/phoenix-resume-services',
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
      latitude: 33.4484,
      longitude: -112.0740,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Phoenix',
        containedInPlace: {
          '@type': 'State',
          name: 'Arizona',
        },
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
        '@type': 'City',
        name: 'Gilbert',
      },
      {
        '@type': 'City',
        name: 'Glendale',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Phoenix Resume Writing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Resume Writing',
            description: 'Professional resume writing and optimization for Phoenix job market',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'LinkedIn Optimization',
            description: 'LinkedIn profile optimization for Phoenix professionals',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Interview Coaching',
            description: 'Interview preparation for Phoenix employers',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Career Strategy',
            description: 'Career planning and job search strategy for Phoenix metro area',
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
        name: 'Phoenix Resume Services',
        item: 'https://southwestresumes.com/phoenix-resume-services',
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <Script
        id="phoenix-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(phoenixBusinessSchema) }}
      />
      <Script
        id="phoenix-breadcrumb-schema"
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
                <li className="text-gold">Phoenix Resume Services</li>
              </ol>
            </nav>

            <div className="inline-block px-6 py-2 rounded-full bg-white/5 text-gold text-sm font-semibold mb-8 border border-white/10 backdrop-blur-md shadow-lg">
              Phoenix, Arizona
            </div>

            <h1 className="mb-8 text-white text-5xl md:text-6xl lg:text-7xl leading-tight font-serif tracking-tight drop-shadow-lg">
              Phoenix Resume Writing Services
            </h1>

            <p className="text-xl md:text-2xl text-sand-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light text-balance opacity-90">
              Expert resume writing and career coaching for Phoenix metro professionals. Research-backed career documents that reveal your true professional value and get interviews.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                  Get Started Today
                  <IconArrowRight />
                </Button>
              </Link>
              <Link href="/process">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-navy">
                  Our Process
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Why Phoenix Professionals Choose Us */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 text-center">Why Phoenix Professionals Choose Southwest Resume Services</h2>
            <p className="text-lg text-charcoal/80 text-center max-w-3xl mx-auto leading-relaxed">
              Phoenix is one of the fastest-growing metropolitan areas in the United States, with a dynamic job market spanning technology, healthcare, finance, aerospace, and more. As the Valley continues to attract major employers and startups alike, competition for top positions has never been fiercer. Phoenix professionals need more than a standard resume template—they need strategic positioning that speaks directly to the unique demands of the local market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-sand-50 rounded-2xl p-8 border border-sand-200 hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                <IconBuilding />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">Local Market Expertise</h3>
              <p className="text-charcoal/80 leading-relaxed">
                We understand the Phoenix job market inside and out. From the tech corridors of Tempe to the healthcare hubs in Scottsdale, we know what local employers are looking for and how to position you for success in Arizona&apos;s competitive landscape.
              </p>
            </div>

            <div className="group bg-sand-50 rounded-2xl p-8 border border-sand-200 hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                <IconDocument />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">Research-Backed Methodology</h3>
              <p className="text-charcoal/80 leading-relaxed">
                Every resume we create is grounded in extensive market research. We analyze 200+ Phoenix-area job postings, validate language against O*NET occupational standards, and benchmark compensation using Bureau of Labor Statistics data specific to the Phoenix metro area.
              </p>
            </div>

            <div className="group bg-sand-50 rounded-2xl p-8 border border-sand-200 hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                <IconTrendingUp />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">Proven Results</h3>
              <p className="text-charcoal/80 leading-relaxed">
                Our Phoenix clients consistently land interviews with top employers including Banner Health, Intel, American Express, State Farm, Wells Fargo, and emerging tech companies throughout the Valley. We don&apos;t just write resumes—we create career transformation tools.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Services for Phoenix Job Market */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4 text-center">
              Tailored to Phoenix
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 text-center">Services Designed for the Phoenix Job Market</h2>
            <p className="text-lg text-charcoal/80 text-center max-w-3xl mx-auto leading-relaxed">
              Whether you&apos;re pursuing opportunities in Phoenix&apos;s booming tech sector, established healthcare institutions, growing financial services industry, or thriving aerospace and defense companies, we have the expertise to position you effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
            {/* Resume Writing */}
            <div className="bg-white rounded-2xl p-8 border border-sand-200 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold flex-shrink-0">
                  <IconDocument />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-navy mb-2">Professional Resume Writing</h3>
                  <p className="text-gold font-bold">From $150</p>
                </div>
              </div>
              <p className="text-charcoal/80 mb-4 leading-relaxed">
                Comprehensive resume development optimized for Phoenix-area employers and ATS systems used by major Arizona companies. We incorporate industry-specific keywords, quantified achievements, and strategic positioning that resonates with local hiring managers.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Phoenix market research and keyword optimization
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  ATS-compatible formatting for major Arizona employers
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Industry-specific positioning (tech, healthcare, finance, etc.)
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
                  <h3 className="text-2xl font-semibold text-navy mb-2">LinkedIn Profile Optimization</h3>
                  <p className="text-gold font-bold">Included in packages</p>
                </div>
              </div>
              <p className="text-charcoal/80 mb-4 leading-relaxed">
                Phoenix recruiters are actively searching LinkedIn for qualified candidates every day. Our optimization service ensures your profile appears in searches for your target roles and attracts inbound opportunities from Arizona&apos;s top employers.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Keyword-rich headline targeting Phoenix employers
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Compelling about section with local positioning
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Experience section optimization with achievements
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Strategic skills selection for recruiter visibility
                </li>
              </ul>
              <Link href="/services#linkedin">
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Interview Coaching */}
            <div className="bg-white rounded-2xl p-8 border border-sand-200 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold flex-shrink-0">
                  <IconMic />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-navy mb-2">Interview Coaching</h3>
                  <p className="text-gold font-bold">Premium packages</p>
                </div>
              </div>
              <p className="text-charcoal/80 mb-4 leading-relaxed">
                Prepare for interviews with Phoenix employers through our comprehensive coaching program. Master the STAR+ method, develop compelling stories about your achievements, and build the confidence to handle any interview scenario with authenticity.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Mock interviews simulating Phoenix employer questions
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  STAR+ story development framework
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Career gap narrative strategies
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Stress inoculation and confidence building
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
                  <h3 className="text-2xl font-semibold text-navy mb-2">Career Strategy Consulting</h3>
                  <p className="text-gold font-bold">Custom packages</p>
                </div>
              </div>
              <p className="text-charcoal/80 mb-4 leading-relaxed">
                Navigate Phoenix&apos;s job market strategically with data-driven career planning. We provide market analysis, compensation benchmarking using local data, skills gap assessment, and actionable strategies for career growth in Arizona.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Phoenix market analysis and opportunity identification
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Arizona compensation benchmarking
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Skills development roadmap
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Career transition planning and execution
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

      {/* Phoenix Job Market Insights */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-8 text-center">Understanding the Phoenix Job Market</h2>

            <div className="prose prose-lg max-w-none text-charcoal/80 space-y-6 leading-relaxed">
              <p>
                Phoenix has emerged as one of America&apos;s most dynamic metropolitan areas, attracting Fortune 500 companies, innovative startups, and talented professionals from across the nation. The Valley of the Sun offers a unique combination of affordable living, no state income tax, excellent weather, and a business-friendly environment that continues to fuel unprecedented growth.
              </p>

              <h3 className="text-2xl font-semibold text-navy mt-8 mb-4">Key Industries Driving Phoenix Growth</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Technology & Innovation</h4>
                  <p className="text-charcoal/80 mb-3">
                    Phoenix&apos;s tech sector is booming, with major employers like Intel, Amazon Web Services, and Microsoft expanding operations throughout the Valley. Tempe and Chandler have become tech hubs, while downtown Phoenix attracts fintech and software startups.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: Intel, Amazon, Microsoft, GoDaddy, Insight Enterprises, Infusionsoft (Keap)
                  </p>
                </div>

                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Healthcare & Bioscience</h4>
                  <p className="text-charcoal/80 mb-3">
                    With world-class medical facilities and research institutions, Phoenix&apos;s healthcare sector offers opportunities for clinical professionals, administrators, researchers, and support staff. Scottsdale and North Phoenix are major healthcare employment centers.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: Banner Health, Mayo Clinic, HonorHealth, Dignity Health, Phoenix Children&apos;s Hospital
                  </p>
                </div>

                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Financial Services</h4>
                  <p className="text-charcoal/80 mb-3">
                    Phoenix has become a major financial services hub, housing operations centers for national banks, insurance companies, and fintech innovators. Tempe and Chandler host significant financial operations centers.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: American Express, Wells Fargo, JPMorgan Chase, State Farm, USAA, Vanguard
                  </p>
                </div>

                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Aerospace & Defense</h4>
                  <p className="text-charcoal/80 mb-3">
                    Arizona&apos;s aerospace industry continues to thrive, with defense contractors, aviation companies, and space technology firms maintaining significant operations in the Phoenix metro area, particularly in Mesa and Glendale.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: Boeing, Raytheon, Northrop Grumman, General Dynamics, Honeywell Aerospace
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-navy mt-8 mb-4">What Phoenix Employers Are Looking For</h3>

              <p>
                Based on our analysis of thousands of Phoenix-area job postings, employers consistently seek candidates who demonstrate specific qualities and qualifications. Understanding these expectations is critical to positioning your resume effectively.
              </p>

              <div className="bg-navy text-white rounded-xl p-8 my-8">
                <h4 className="text-xl font-semibold mb-4 text-gold">Top Skills in Demand Across Phoenix Industries</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sand-100">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Project Management & Cross-Functional Leadership
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Data Analysis & Business Intelligence
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Cloud Technologies (AWS, Azure, GCP)
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Agile Methodologies & Scrum
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Customer Relationship Management
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Regulatory Compliance & Quality Assurance
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Process Improvement & Operational Excellence
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Strategic Planning & Business Development
                    </li>
                  </ul>
                </div>
              </div>

              <p>
                Our resume writing service incorporates these market realities into every document we create. We don&apos;t just list your experience—we strategically position your qualifications using language that resonates with Phoenix hiring managers and passes through the ATS systems used by major Arizona employers.
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
              Our Method
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 text-center">How We Work With Phoenix Professionals</h2>
            <p className="text-lg text-charcoal/80 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
              Our proven three-step process combines deep discovery, research-backed translation, and ownership transfer to create career documents you can defend with confidence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold text-navy mb-3">Discovery</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  We conduct an in-depth consultation to understand your experience, achievements, career goals, and target roles in the Phoenix market.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold text-navy mb-3">Translation</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  We analyze 200+ Phoenix job postings, validate language against O*NET standards, and craft positioning that speaks to local employers.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold text-navy mb-3">Ownership</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  Through collaborative refinement, you internalize every enhancement until the document feels authentically yours and you can defend it with confidence.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/process" className="inline-flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium text-lg">
                See the complete process
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
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">Serving the Entire Phoenix Metro Area</h2>
            <p className="text-lg text-charcoal/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              We proudly serve professionals throughout the Phoenix metropolitan area and across Arizona. Whether you&apos;re in the heart of downtown Phoenix or the surrounding communities, our resume writing services are designed to help you succeed in the local job market.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Phoenix</h3>
                <p className="text-sm text-charcoal/70 mt-1">Downtown, Midtown, North Phoenix</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Scottsdale</h3>
                <p className="text-sm text-charcoal/70 mt-1">Old Town, North Scottsdale, McDowell Mountain</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Mesa</h3>
                <p className="text-sm text-charcoal/70 mt-1">Downtown Mesa, East Mesa, Red Mountain</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Tempe</h3>
                <p className="text-sm text-charcoal/70 mt-1">ASU Area, Tempe Marketplace, South Tempe</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Chandler</h3>
                <p className="text-sm text-charcoal/70 mt-1">Downtown Chandler, Price Corridor, Ocotillo</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Gilbert</h3>
                <p className="text-sm text-charcoal/70 mt-1">Heritage District, San Tan, Agritopia</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Glendale</h3>
                <p className="text-sm text-charcoal/70 mt-1">Westgate, Arrowhead, Historic Glendale</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Peoria</h3>
                <p className="text-sm text-charcoal/70 mt-1">Lake Pleasant, Vistancia, Arrowhead Ranch</p>
              </div>
            </div>

            <p className="text-charcoal/70 italic">
              Also serving: Surprise, Avondale, Goodyear, Queen Creek, Buckeye, Paradise Valley, Fountain Hills, and communities throughout Maricopa County
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
              Working with Southwest Resume Services transformed how I present my professional experience. The research-backed approach gave me confidence to pursue senior positions at Phoenix tech companies I never thought would consider me. Within three weeks, I had interviews with three major employers and accepted an offer with a 28% salary increase.
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xl">
                M.T.
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Software Engineering Manager</p>
                <p className="text-sm text-sand-200">Phoenix, Arizona</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-12 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">How do you understand the Phoenix job market specifically?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  For every project, we analyze 200+ job postings from Phoenix-area employers to identify the exact language, qualifications, and priorities that local hiring managers seek. We track trends across major Arizona employers, understand regional compensation benchmarks, and stay current with the industries driving Phoenix&apos;s growth. This local market intelligence directly informs how we position your experience.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">Will my resume work with ATS systems used by Phoenix employers?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  Absolutely. Major Phoenix employers like Intel, Banner Health, American Express, and Wells Fargo use sophisticated ATS platforms including Workday, Taleo, Greenhouse, and iCIMS. Every resume we create is formatted to pass these systems while remaining visually appealing for human readers. We test compatibility and optimize keyword placement to maximize your chances of reaching hiring managers.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">Do I need to meet in person, or can everything be done remotely?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  All of our services are conducted remotely via phone and video calls, making the process convenient regardless of where you are in the Phoenix metro area. Our virtual process is thorough and efficient, allowing you to participate from home, office, or anywhere with internet access. We&apos;ve perfected this approach to provide the same high-quality results as in-person meetings.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">How long does the resume writing process take?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  Timeline varies by package. Our Essentials package delivers in 5 business days, Accelerator in 3 days, and Career Launch in 48 hours (rush available). However, the most important timeline is yours—we work iteratively until you own every word. Some Phoenix clients finalize quickly, while others prefer additional refinement rounds. Unlimited revisions within scope mean we never rush you to acceptance.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">What industries do you specialize in for Phoenix professionals?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  We work with professionals across all major Phoenix industries including technology, healthcare, financial services, aerospace and defense, hospitality, education, manufacturing, and professional services. Our research-backed methodology allows us to quickly develop expertise in your specific field by analyzing relevant job postings and industry standards. Whether you&apos;re a software engineer in Tempe, a healthcare administrator in Scottsdale, or a financial analyst in Chandler, we can effectively position your experience.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">What makes your service different from other Phoenix resume writers?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  Our Client Truth Principle sets us apart. We never fabricate or exaggerate—instead, we help you recognize and articulate genuine professional value you&apos;ve been too close to see. Every enhancement is grounded in O*NET occupational standards, validated through market research, and refined until you can defend it with authentic confidence. This results in resumes that perform well in interviews because they represent your true capabilities, not fiction you&apos;ll struggle to support.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">Do you guarantee interview results?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  We don&apos;t make unrealistic guarantees because interview success depends on many factors beyond resume quality, including market conditions, competition, timing, and application strategy. However, we do guarantee unlimited revisions until you&apos;re completely satisfied with your documents. Our Phoenix clients consistently report increased interview rates, better recruiter response, and improved confidence throughout their job search. We focus on creating authentic, research-backed positioning that gives you the best possible foundation for success.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-charcoal/80 mb-4">Have more questions?</p>
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Schedule a Free Consultation
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Advance Your Career in Phoenix?</h2>
            <p className="text-xl text-sand-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Phoenix&apos;s competitive job market demands more than a generic resume. Let us help you stand out to Arizona&apos;s top employers with research-backed positioning that reveals your true professional value.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <Link href="/contact">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-10 group">
                  Schedule Free Consultation
                  <IconArrowRight />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 border-white text-white hover:bg-white hover:text-navy">
                  View Pricing
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
              <div>
                <div className="text-4xl font-bold text-gold mb-2">200+</div>
                <div className="text-sand-200">Job postings analyzed per engagement</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gold mb-2">5.0</div>
                <div className="text-sand-200">Star rating from Phoenix clients</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gold mb-2">100%</div>
                <div className="text-sand-200">Satisfaction guarantee</div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
