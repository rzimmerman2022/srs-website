/**
 * Mesa-Specific SEO Landing Page
 * Target Keywords: "resume writing services Mesa AZ", "Mesa resume writer", "professional resume writer Mesa"
 * Created: 2025-12-26
 */

import Link from 'next/link';
import Script from 'next/script';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mesa Resume Writing Services | Professional Resume Writer Mesa AZ | Southwest Resume Services',
  description:
    'Professional resume writing services in Mesa, Arizona. Expert career coaching for Mesa professionals in aerospace, healthcare, and education. Research-backed resumes that get interviews. Serving Mesa, Gilbert, Apache Junction, Queen Creek, and San Tan Valley.',
  openGraph: {
    title: 'Mesa Resume Writing Services | Professional Resume Writer Mesa AZ',
    description:
      'Expert resume writing services in Mesa, AZ. Serving Mesa professionals in aerospace, healthcare, and education with research-backed resumes that get interviews.',
    url: 'https://southwestresumes.com/mesa-resume-services',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mesa Resume Writing Services - Southwest Resume Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mesa Resume Writing Services | Professional Resume Writer Mesa AZ',
    description:
      'Expert resume writing services in Mesa, AZ. Research-backed resumes for Mesa professionals in aerospace, healthcare, and education.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://southwestresumes.com/mesa-resume-services',
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

export default function MesaResumeServicesPage() {
  // LocalBusiness Schema for Mesa-specific SEO
  const mesaBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Southwest Resume Services - Mesa',
    description: 'Professional resume writing services in Mesa, Arizona. Expert career coaching and resume optimization for Mesa professionals in aerospace, healthcare, education, and manufacturing.',
    url: 'https://southwestresumes.com/mesa-resume-services',
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
      latitude: 33.4152,
      longitude: -111.8315,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Mesa',
        containedInPlace: {
          '@type': 'State',
          name: 'Arizona',
        },
      },
      {
        '@type': 'City',
        name: 'Gilbert',
      },
      {
        '@type': 'City',
        name: 'Apache Junction',
      },
      {
        '@type': 'City',
        name: 'Queen Creek',
      },
      {
        '@type': 'City',
        name: 'San Tan Valley',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Mesa Resume Writing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Resume Writing',
            description: 'Professional resume writing and optimization for Mesa job market',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'LinkedIn Optimization',
            description: 'LinkedIn profile optimization for Mesa professionals',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Interview Coaching',
            description: 'Interview preparation for Mesa employers',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Career Strategy',
            description: 'Career planning and job search strategy for East Valley professionals',
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
        name: 'Mesa Resume Services',
        item: 'https://southwestresumes.com/mesa-resume-services',
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <Script
        id="mesa-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mesaBusinessSchema) }}
      />
      <Script
        id="mesa-breadcrumb-schema"
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
                <li className="text-gold">Mesa Resume Services</li>
              </ol>
            </nav>

            <div className="inline-block px-6 py-2 rounded-full bg-white/5 text-gold text-sm font-semibold mb-8 border border-white/10 backdrop-blur-md shadow-lg">
              Mesa, Arizona
            </div>

            <h1 className="mb-8 text-white text-5xl md:text-6xl lg:text-7xl leading-tight font-serif tracking-tight drop-shadow-lg">
              Mesa Resume Writing Services
            </h1>

            <p className="text-xl md:text-2xl text-sand-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light text-balance opacity-90">
              Expert resume writing and career coaching for Mesa professionals in aerospace, healthcare, and education. Research-backed career documents that reveal your true professional value and get interviews.
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

      {/* Why Mesa Professionals Choose Us */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 text-center">Why Mesa Professionals Choose Southwest Resume Services</h2>
            <p className="text-lg text-charcoal/80 text-center max-w-3xl mx-auto leading-relaxed">
              As Arizona&apos;s third-largest city and a major employment hub in the East Valley, Mesa offers diverse career opportunities in aerospace manufacturing, healthcare, education, and advanced manufacturing. With major employers like Boeing, Northrop Grumman, Banner Health, and Apple establishing significant operations in Mesa, competition for professional positions has intensified. Mesa professionals need strategic positioning that speaks directly to the unique demands of these specialized industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-sand-50 rounded-2xl p-8 border border-sand-200 hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                <IconBuilding />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">East Valley Expertise</h3>
              <p className="text-charcoal/80 leading-relaxed">
                We understand Mesa&apos;s unique position as an aerospace and manufacturing hub. From the advanced manufacturing facilities near Falcon Field to the healthcare centers around Banner Desert Medical Center, we know what Mesa employers are looking for and how to position you for success in the East Valley&apos;s competitive landscape.
              </p>
            </div>

            <div className="group bg-sand-50 rounded-2xl p-8 border border-sand-200 hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                <IconDocument />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">Industry-Specific Research</h3>
              <p className="text-charcoal/80 leading-relaxed">
                Every resume we create is grounded in extensive market research. We analyze 200+ Mesa-area job postings, validate technical language against O*NET occupational standards, and benchmark compensation using Bureau of Labor Statistics data specific to aerospace, healthcare, and education sectors in the East Valley.
              </p>
            </div>

            <div className="group bg-sand-50 rounded-2xl p-8 border border-sand-200 hover:shadow-xl hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                <IconTrendingUp />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">Proven Results</h3>
              <p className="text-charcoal/80 leading-relaxed">
                Our Mesa clients consistently land interviews with top employers including Boeing, Banner Health, Mesa Public Schools, Apple, Northrop Grumman, and growing manufacturing companies throughout the East Valley. We don&apos;t just write resumes—we create career transformation tools that open doors.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Services for Mesa Job Market */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4 text-center">
              Tailored to Mesa
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 text-center">Services Designed for the Mesa Job Market</h2>
            <p className="text-lg text-charcoal/80 text-center max-w-3xl mx-auto leading-relaxed">
              Whether you&apos;re pursuing opportunities in Mesa&apos;s aerospace sector, healthcare institutions, education systems, or advanced manufacturing facilities, we have the expertise to position you effectively for the East Valley&apos;s most competitive roles.
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
                Comprehensive resume development optimized for Mesa-area employers and ATS systems used by major aerospace, healthcare, and manufacturing companies. We incorporate industry-specific keywords, quantified achievements, and strategic positioning that resonates with Mesa hiring managers.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Mesa market research and technical keyword optimization
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  ATS-compatible formatting for Boeing, Banner Health, Apple
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Industry-specific positioning for aerospace, healthcare, education
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
                Mesa recruiters and aerospace headhunters are actively searching LinkedIn for qualified candidates every day. Our optimization service ensures your profile appears in searches for your target roles and attracts inbound opportunities from the East Valley&apos;s top employers.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Keyword-rich headline targeting Mesa employers
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Compelling about section with East Valley positioning
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Experience section optimization with quantified achievements
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Strategic skills selection for aerospace recruiter visibility
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
                Prepare for interviews with Mesa employers through our comprehensive coaching program. Master the STAR+ method, develop compelling stories about your technical achievements, and build the confidence to handle behavioral and technical interview scenarios with authenticity.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Mock interviews simulating Mesa employer questions
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  STAR+ story development for technical achievements
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Career transition and industry change strategies
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
                Navigate Mesa&apos;s specialized job market strategically with data-driven career planning. We provide industry analysis, compensation benchmarking using local aerospace and healthcare data, skills gap assessment, and actionable strategies for career growth in the East Valley.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Mesa market analysis and opportunity identification
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  East Valley compensation benchmarking
                </li>
                <li className="flex items-start gap-2 text-sm text-charcoal/70">
                  <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  Technical skills development roadmap
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

      {/* Mesa Job Market Insights */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-8 text-center">Understanding the Mesa Job Market</h2>

            <div className="prose prose-lg max-w-none text-charcoal/80 space-y-6 leading-relaxed">
              <p>
                Mesa stands as Arizona&apos;s third-largest city and a cornerstone of the East Valley economy, offering a unique blend of advanced aerospace manufacturing, healthcare excellence, quality education systems, and cutting-edge technology operations. With a population exceeding 500,000 and major employers establishing significant operations throughout the city, Mesa has transformed into a specialized employment hub that attracts skilled professionals from across the region.
              </p>

              <h3 className="text-2xl font-semibold text-navy mt-8 mb-4">Key Industries Driving Mesa Growth</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Aerospace & Defense</h4>
                  <p className="text-charcoal/80 mb-3">
                    Mesa is home to major aerospace manufacturing and defense operations, particularly around Falcon Field Airport. Boeing&apos;s Apache helicopter facility and Northrop Grumman&apos;s operations anchor a thriving aerospace cluster that employs thousands of engineers, technicians, and manufacturing professionals.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: Boeing, Northrop Grumman, Safran Helicopter Engines, Collins Aerospace, Aviation Technical Services
                  </p>
                </div>

                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Healthcare & Medical Services</h4>
                  <p className="text-charcoal/80 mb-3">
                    Mesa&apos;s healthcare sector features world-class medical facilities and specialty care centers. Banner Desert Medical Center, Banner Baywood Medical Center, and numerous specialty clinics create diverse opportunities for clinical professionals, healthcare administrators, and medical support staff.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: Banner Health, HonorHealth, Mountain Vista Medical Center, Arizona Spine & Joint Hospital
                  </p>
                </div>

                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Education & Research</h4>
                  <p className="text-charcoal/80 mb-3">
                    Mesa Public Schools is one of Arizona&apos;s largest school districts, while higher education institutions including Arizona State University&apos;s Polytechnic campus and Mesa Community College provide teaching, research, and administrative career opportunities for education professionals.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: Mesa Public Schools, Arizona State University, Mesa Community College, Basis Schools
                  </p>
                </div>

                <div className="bg-sand-50 rounded-xl p-6 border border-sand-200">
                  <h4 className="text-xl font-semibold text-navy mb-3">Advanced Manufacturing & Technology</h4>
                  <p className="text-charcoal/80 mb-3">
                    Beyond aerospace, Mesa hosts advanced manufacturing facilities and technology operations. Apple&apos;s Mesa facility manufactures sapphire glass, while numerous precision manufacturing companies support aerospace, medical device, and electronics industries throughout the region.
                  </p>
                  <p className="text-sm text-charcoal/70 italic">
                    Major Employers: Apple, Benchmark Electronics, Custom Manufacturing & Engineering, Amkor Technology
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-navy mt-8 mb-4">What Mesa Employers Are Looking For</h3>

              <p>
                Based on our analysis of thousands of Mesa-area job postings, employers in aerospace, healthcare, and education sectors consistently seek candidates who demonstrate specialized technical skills, regulatory compliance knowledge, and proven track records of quality and safety. Understanding these expectations is critical to positioning your resume effectively for Mesa&apos;s unique market.
              </p>

              <div className="bg-navy text-white rounded-xl p-8 my-8">
                <h4 className="text-xl font-semibold mb-4 text-gold">Top Skills in Demand Across Mesa Industries</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sand-100">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Aerospace Engineering & Manufacturing
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Quality Assurance & Regulatory Compliance
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Healthcare Clinical Specialties
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Project Management & Process Improvement
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Educational Technology & Curriculum Development
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Supply Chain & Logistics Management
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Advanced Manufacturing & Automation
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0" />
                      Safety Management & Environmental Compliance
                    </li>
                  </ul>
                </div>
              </div>

              <p>
                Our resume writing service incorporates these market realities into every document we create. We don&apos;t just list your experience—we strategically position your technical qualifications using language that resonates with Mesa hiring managers and passes through the ATS systems used by major aerospace, healthcare, and education employers in the East Valley.
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
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 text-center">How We Work With Mesa Professionals</h2>
            <p className="text-lg text-charcoal/80 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
              Our proven three-step process combines deep discovery, research-backed translation, and ownership transfer to create career documents you can defend with confidence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold text-navy mb-3">Discovery</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  We conduct an in-depth consultation to understand your technical experience, achievements, career goals, and target roles in Mesa&apos;s specialized markets.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold text-navy mb-3">Translation</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  We analyze 200+ Mesa job postings in aerospace, healthcare, and education, validate technical language against O*NET standards, and craft positioning that speaks to East Valley employers.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold text-navy mb-3">Ownership</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  Through collaborative refinement, you internalize every enhancement until the document feels authentically yours and you can defend it with confidence in technical interviews.
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
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">Serving Mesa and the Entire East Valley</h2>
            <p className="text-lg text-charcoal/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              We proudly serve professionals throughout Mesa and the surrounding East Valley communities. Whether you&apos;re near Falcon Field, downtown Mesa, or the growing East Mesa corridor, our resume writing services are designed to help you succeed in the local job market.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Mesa</h3>
                <p className="text-sm text-charcoal/70 mt-1">Downtown, East Mesa, Red Mountain</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Gilbert</h3>
                <p className="text-sm text-charcoal/70 mt-1">Heritage District, San Tan, Agritopia</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Apache Junction</h3>
                <p className="text-sm text-charcoal/70 mt-1">Gold Canyon, Superstition Foothills</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Queen Creek</h3>
                <p className="text-sm text-charcoal/70 mt-1">Town Center, San Tan Heights</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">San Tan Valley</h3>
                <p className="text-sm text-charcoal/70 mt-1">Pecan Creek, Johnson Ranch</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-6 border border-sand-200 hover:border-gold/30 transition-all">
                <h3 className="font-semibold text-navy text-lg">Tempe</h3>
                <p className="text-sm text-charcoal/70 mt-1">East Tempe, South Tempe</p>
              </div>
            </div>

            <p className="text-charcoal/70 italic">
              Also serving: Chandler, Scottsdale, Phoenix, and all communities throughout Maricopa and Pinal Counties
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
              As an aerospace engineer transitioning from defense to commercial aviation, I needed a resume that could bridge these specialized sectors. Southwest Resume Services helped me articulate my technical achievements in ways that resonated with both industries. I received interview requests from Boeing and Collins Aerospace within two weeks and accepted a senior engineering position with a 22% salary increase.
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xl">
                J.R.
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Senior Aerospace Engineer</p>
                <p className="text-sm text-sand-200">Mesa, Arizona</p>
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
                <h3 className="text-xl font-semibold text-navy mb-3">Do you understand Mesa&apos;s specialized aerospace and healthcare markets?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  Absolutely. For every Mesa project, we analyze 200+ job postings from major local employers including Boeing, Banner Health, Mesa Public Schools, and Apple to identify the exact technical language, certifications, and qualifications that Mesa hiring managers seek. We understand the unique requirements of aerospace manufacturing, healthcare administration, and educational leadership roles specific to the East Valley market.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">Will my resume work with ATS systems used by Mesa&apos;s major employers?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  Yes. Major Mesa employers like Boeing, Northrop Grumman, Banner Health, and Mesa Public Schools use sophisticated ATS platforms including Workday, Taleo, and iCIMS. Every resume we create is formatted to pass these systems while remaining visually appealing for human readers. We optimize technical keyword placement and ensure compliance with aerospace and healthcare industry standards.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">Do I need to meet in person, or can everything be done remotely?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  All of our services are conducted remotely via phone and video calls, making the process convenient regardless of where you are in Mesa or the East Valley. Our virtual process is thorough and efficient, allowing you to participate from home, office, or anywhere with internet access. We&apos;ve perfected this approach to provide the same high-quality results as in-person meetings.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">How do you handle technical certifications and security clearances?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  We understand the critical importance of properly presenting technical certifications, licenses, and security clearances for Mesa&apos;s aerospace and defense employers. We position these credentials strategically to ensure they&apos;re immediately visible to ATS systems and hiring managers, and we help you articulate clearance-appropriate project descriptions that demonstrate impact without compromising classified information.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">What makes your service different from other resume writers?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  Our Client Truth Principle sets us apart. We never fabricate or exaggerate technical capabilities—instead, we help you recognize and articulate genuine professional value you&apos;ve been too close to see. Every technical enhancement is validated against O*NET occupational standards, industry certifications, and Mesa market research. This results in resumes that perform well in technical interviews because they represent your true capabilities.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-sand-200 shadow-sm">
                <h3 className="text-xl font-semibold text-navy mb-3">Can you help with career transitions between industries?</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  Yes. Many of our Mesa clients transition between aerospace, healthcare, education, and technology sectors. We excel at translating transferable skills and positioning your experience for new industries. Whether you&apos;re moving from defense to commercial aviation, healthcare administration to medical technology, or education to corporate training, we can help you bridge the gap strategically.
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Advance Your Career in Mesa?</h2>
            <p className="text-xl text-sand-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Mesa&apos;s specialized aerospace, healthcare, and education markets demand more than a generic resume. Let us help you stand out to the East Valley&apos;s top employers with research-backed positioning that reveals your true professional value.
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
                <div className="text-sand-200">Star rating from Mesa clients</div>
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
