/**
 * REDESIGN: Visual Services Page with SVG Icons
 * Date: 2025-12-18
 */

import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { withBasePath } from '@/lib/paths';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services & Pricing | Phoenix Resume Writing | Arizona Career Coaching',
  description:
    'Professional resume writing, LinkedIn optimization, and interview coaching in Phoenix, AZ. Serving Scottsdale, Mesa, Tempe, and the Phoenix metro area. Transparent pricing from $150-$500+.',
};

// SVG Icons for crisp rendering
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

const IconMail = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconTarget = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

const IconMic = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
  </svg>
);

const IconRocket = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const IconArrowRight = () => (
  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const IconStar = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const services = [
  {
    id: 'resume',
    icon: <IconDocument />,
    title: 'Resume Writing',
    tagline: 'Research-validated resumes that get interviews',
    features: [
      'In-depth discovery process',
      'Market & keyword research',
      'ATS-compatible formatting for major systems',
      'Unlimited revisions (within scope)',
    ],
  },
  {
    id: 'linkedin',
    icon: <IconLinkedIn />,
    title: 'LinkedIn Optimization',
    tagline: 'Profiles that attract recruiters',
    features: [
      'Keyword-rich headline & about',
      'Experience optimization',
      'Skills strategy',
      'Recruiter engagement tips',
    ],
  },
  {
    id: 'cover-letter',
    icon: <IconMail />,
    title: 'Cover Letters',
    tagline: 'Compelling introductions that open doors',
    features: [
      'Role-specific customization',
      'Strategic gap bridging',
      'Authentic voice',
      'Multiple versions',
    ],
  },
  {
    id: 'strategy',
    icon: <IconTarget />,
    title: 'Career Strategy',
    tagline: 'Data-driven career guidance',
    features: [
      'Market analysis',
      'Compensation benchmarking',
      'Skills gap assessment',
      'Transition planning',
    ],
  },
  {
    id: 'interview',
    icon: <IconMic />,
    title: 'Interview Coaching',
    tagline: 'Confidence to own every word',
    features: [
      'Story development (STAR+)',
      'Mock interviews',
      'Gap narrative mastery',
      'Stress inoculation',
    ],
  },
  {
    id: 'transition',
    icon: <IconRocket />,
    title: 'Career Transition',
    tagline: 'Complete transformation package',
    features: [
      'Full market research',
      'Skills translation',
      'Resume + LinkedIn + Cover',
      'Interview preparation',
    ],
  },
];

const packages = [
  {
    name: 'Essentials',
    price: '$150',
    description: 'Perfect for job seekers who need a polished, professional resume.',
    image: '/assets/images/packages/essential.png',
    features: [
      'Professional resume writing → so you present confidently to any employer',
      'ATS-compatible formatting* → so your resume passes automated screens',
      'Strategic keyword targeting → so recruiters find you in database searches',
      'Unlimited revisions (within scope) → so every word feels authentically yours',
      '5-day delivery → so you can start applying this week',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Accelerator',
    price: '$300',
    description: 'Our most popular package with 200+ job postings analyzed and validated research.',
    image: '/assets/images/packages/accelerator.png',
    features: [
      'Everything in Essentials',
      'Market research report (200+ postings analyzed) → so you speak the exact language employers use',
      'O*NET occupation validation (RAI 7.0+) → so every claim is defensible under scrutiny',
      'LinkedIn headline optimization → so recruiters find you for the right roles',
      'Research-backed enhancements → so you can justify higher salary expectations',
      '3-day priority delivery → so you capitalize on time-sensitive opportunities',
    ],
    cta: 'Get Started',
    featured: true,
  },
  {
    name: 'Career Launch',
    price: '$449',
    description: 'Comprehensive package for career changers and ambitious professionals.',
    image: '/assets/images/packages/career-launch.png',
    features: [
      'Everything in Accelerator',
      'Full LinkedIn profile optimization → so you attract inbound recruiter messages',
      'Custom cover letter with gap bridging → so you reframe career transitions as strengths',
      'Interview prep session (2 hours, STAR+ method) → so you defend every enhancement with confidence',
      'Truth Bridge Protocol → so enhanced descriptions become your authentic professional identity',
      '48-hour rush available → so you meet critical application deadlines',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Executive',
    price: '$500+',
    description: 'White-glove service for senior leaders and complex transitions.',
    image: '/assets/images/packages/custom.png',
    features: [
      'Everything in Career Launch',
      'Executive positioning strategy → so you differentiate from other senior candidates',
      'Personal brand architecture → so your narrative commands premium compensation',
      'Enhanced interview preparation (3-5 hours) → so you handle stress interviews with board-level poise',
      'Ongoing support (30 days) → so you have expert guidance through negotiations',
      'Direct founder access → so complex decisions get expert attention immediately',
    ],
    cta: 'Contact Us',
    featured: false,
  },
];

export default function ServicesPage() {
  /**
   * Service Schema for SEO
   * Schema.org Service type for each service offering
   * Follows Google Rich Results guidelines for Service markup
   */
  const serviceSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Resume Writing Services',
      description: 'Professional resume writing and optimization with in-depth discovery, market research, and ATS optimization. Research-validated resumes that help you own your professional story.',
      provider: {
        '@type': 'ProfessionalService',
        name: 'Southwest Resume Services',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1111 N Mission Park Blvd #2016',
          addressLocality: 'Chandler',
          addressRegion: 'AZ',
          postalCode: '85224',
          addressCountry: 'US',
        },
        telephone: '+1-480-374-3418',
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
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: '150',
          maxPrice: '500',
          priceCurrency: 'USD',
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'LinkedIn Optimization',
      description: 'LinkedIn profile optimization with keyword-rich headline and about section, experience optimization, skills strategy, and recruiter engagement tips.',
      provider: {
        '@type': 'ProfessionalService',
        name: 'Southwest Resume Services',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1111 N Mission Park Blvd #2016',
          addressLocality: 'Chandler',
          addressRegion: 'AZ',
          postalCode: '85224',
          addressCountry: 'US',
        },
        telephone: '+1-480-374-3418',
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
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Interview Coaching',
      description: 'Interview preparation and coaching with story development (STAR+), mock interviews, gap narrative mastery, and stress inoculation protocols.',
      provider: {
        '@type': 'ProfessionalService',
        name: 'Southwest Resume Services',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1111 N Mission Park Blvd #2016',
          addressLocality: 'Chandler',
          addressRegion: 'AZ',
          postalCode: '85224',
          addressCountry: 'US',
        },
        telephone: '+1-480-374-3418',
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
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Career Strategy Consulting',
      description: 'Data-driven career guidance with market analysis, compensation benchmarking, skills gap assessment, and transition planning.',
      provider: {
        '@type': 'ProfessionalService',
        name: 'Southwest Resume Services',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1111 N Mission Park Blvd #2016',
          addressLocality: 'Chandler',
          addressRegion: 'AZ',
          postalCode: '85224',
          addressCountry: 'US',
        },
        telephone: '+1-480-374-3418',
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
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: '300',
          maxPrice: '500',
          priceCurrency: 'USD',
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Cover Letter Writing',
      description: 'Compelling cover letters with role-specific customization, strategic gap bridging, authentic voice, and multiple versions.',
      provider: {
        '@type': 'ProfessionalService',
        name: 'Southwest Resume Services',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1111 N Mission Park Blvd #2016',
          addressLocality: 'Chandler',
          addressRegion: 'AZ',
          postalCode: '85224',
          addressCountry: 'US',
        },
        telephone: '+1-480-374-3418',
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
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Career Transition Services',
      description: 'Complete transformation package with full market research, skills translation, resume + LinkedIn + cover letter, and interview preparation.',
      provider: {
        '@type': 'ProfessionalService',
        name: 'Southwest Resume Services',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1111 N Mission Park Blvd #2016',
          addressLocality: 'Chandler',
          addressRegion: 'AZ',
          postalCode: '85224',
          addressCountry: 'US',
        },
        telephone: '+1-480-374-3418',
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
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: '449',
          maxPrice: '500',
          priceCurrency: 'USD',
        },
      },
    },
  ];

  return (
    <>
      {/* Service Schema for SEO - Individual service offerings */}
      {serviceSchemas.map((schema, index) => (
        <Script
          key={`service-schema-${index}`}
          id={`service-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero Section */}
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
              Services & Pricing
            </div>

            <h1 className="mb-8 text-white text-5xl md:text-6xl lg:text-7xl leading-tight font-serif tracking-tight drop-shadow-lg">
              Career Services That{' '}
              <span className="text-gold">Deliver Results</span>
            </h1>

            <p className="text-xl md:text-2xl text-sand-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light text-balance opacity-90">
              Transparent pricing. No hidden fees. Research-backed methodology.
            </p>
          </div>
        </Container>
      </section>

      {/* Services Overview - Visual Grid */}
      <section className="section-padding bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="mb-4">What We Offer</h2>
            <p className="text-charcoal/80 max-w-2xl mx-auto">
              Every service is built on our Client Truth Principle &mdash; authentic enhancement you can defend.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service) => (
              <div
                key={service.id}
                id={service.id}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">{service.title}</h3>
                <p className="text-sm text-charcoal/80 mb-4">{service.tagline}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-charcoal/70">
                      <IconCheck className="w-4 h-4 text-gold flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Who This Is For - Wayfinding Section */}
      <section className="section-padding bg-white border-y border-sand-200">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4">
                Find Your Fit
              </p>
              <h2 className="mb-4">Which Package Is Right for You?</h2>
              <p className="text-charcoal/80 max-w-2xl mx-auto">
                Choose based on where you are in your career journey. Every package is designed to help you own your professional story with confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Essentials */}
              <div className="group bg-sand-50 rounded-2xl p-6 border border-sand-200 hover:border-gold/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center flex-shrink-0">
                    <IconDocument />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-1">Essentials</h3>
                    <p className="text-gold font-bold text-sm">$150</p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-navy mb-3">This is for you if:</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You have a clear career path and just need professional polish
                  </li>
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    Your experience speaks for itself, but your resume doesn&apos;t reflect it
                  </li>
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You&apos;re targeting roles similar to your current position
                  </li>
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You need a resume that passes ATS and looks professional
                  </li>
                </ul>
                <p className="text-xs text-charcoal/80 italic">
                  Best for: Individual contributors, lateral moves, straightforward career progression
                </p>
              </div>

              {/* Accelerator */}
              <div className="group bg-gradient-to-br from-gold/5 to-navy/5 rounded-2xl p-6 border-2 border-gold/40 hover:border-gold hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute -top-3 right-6">
                  <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    MOST POPULAR
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center flex-shrink-0">
                    <IconRocket />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-1">Accelerator</h3>
                    <p className="text-gold font-bold text-sm">$300</p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-navy mb-3">This is for you if:</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You&apos;re competing in a crowded market and need to stand out
                  </li>
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    Your expertise deserves research-backed validation to prove your value
                  </li>
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You want data-driven insights into what hiring managers actually want
                  </li>
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You&apos;re ready to leverage LinkedIn to attract recruiters
                  </li>
                </ul>
                <p className="text-xs text-charcoal/80 italic">
                  Best for: Mid-level professionals, competitive industries (tech, healthcare, finance), salary increases
                </p>
              </div>

              {/* Career Launch */}
              <div className="group bg-sand-50 rounded-2xl p-6 border border-sand-200 hover:border-gold/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center flex-shrink-0">
                    <IconTarget />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-1">Career Launch</h3>
                    <p className="text-gold font-bold text-sm">$449</p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-navy mb-3">This is for you if:</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You&apos;re changing careers and need to translate your skills to a new industry
                  </li>
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You have employment gaps that need a confident, strategic narrative
                  </li>
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You&apos;ve built valuable experience that doesn&apos;t fit traditional molds
                  </li>
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You need comprehensive support including interview confidence
                  </li>
                </ul>
                <p className="text-xs text-charcoal/80 italic">
                  Best for: Career changers, returners to workforce, non-traditional backgrounds, stretch roles
                </p>
              </div>

              {/* Executive */}
              <div className="group bg-gradient-to-br from-navy/5 to-gold/5 rounded-2xl p-6 border border-navy/20 hover:border-gold/40 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-navy/10 flex items-center justify-center flex-shrink-0">
                    <IconStar />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-1">Executive</h3>
                    <p className="text-gold font-bold text-sm">$500+</p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-navy mb-3">This is for you if:</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You&apos;re a VP, Director, or C-suite leader seeking strategic positioning
                  </li>
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    Your leadership impact requires sophisticated articulation
                  </li>
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You need personal branding that commands executive-level respect
                  </li>
                  <li className="flex items-start gap-2 text-sm text-charcoal/70">
                    <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    You want white-glove service with direct founder access
                  </li>
                </ul>
                <p className="text-xs text-charcoal/80 italic">
                  Best for: Senior leaders, board positions, complex executive transitions, six-figure+ roles
                </p>
              </div>
            </div>

            <div className="text-center mt-8 p-6 bg-sand-50 rounded-xl border border-gold/20">
              <p className="text-sm text-charcoal/80">
                <span className="font-semibold text-navy">Still not sure?</span> That&apos;s completely normal. We&apos;ll help you identify the right fit during your free consultation.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-gold font-medium hover:underline mt-2 text-sm">
                Schedule a free consultation
                <IconArrowRight />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Packages */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4">
              Pricing
            </p>
            <h2 className="mb-4">Choose Your Package</h2>
            <p className="text-charcoal/80 max-w-2xl mx-auto mb-8">
              All packages include our research-backed methodology and unlimited revisions within scope until you own every word.
            </p>

            {/* Research Value Proposition */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-gold/20">
              <h3 className="text-lg font-semibold text-navy mb-4">The Research Behind Your Investment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-sand-50 rounded-lg">
                  <div className="text-2xl font-bold text-gold mb-1">200+</div>
                  <div className="text-charcoal/80">Job postings analyzed per engagement</div>
                </div>
                <div className="text-center p-3 bg-sand-50 rounded-lg">
                  <div className="text-2xl font-bold text-gold mb-1">O*NET</div>
                  <div className="text-charcoal/80">Occupation validation & competency mapping</div>
                </div>
                <div className="text-center p-3 bg-sand-50 rounded-lg">
                  <div className="text-2xl font-bold text-gold mb-1">BLS</div>
                  <div className="text-charcoal/80">Salary benchmarking & market intelligence</div>
                </div>
              </div>
              <p className="text-xs text-charcoal/80 mt-4 italic">
                ROI Perspective: Our Accelerator package ($300) represents just 0.3% of a $100k salary — an investment that pays for itself with even a modest salary increase.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`pricing-card ${pkg.featured ? 'pricing-card-featured' : ''}`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gold text-navy text-xs font-bold px-4 py-1 rounded-full shadow-md">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <Image
                      src={withBasePath(pkg.image)}
                      alt={pkg.name}
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-navy mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-gold mb-2">{pkg.price}</div>
                  <p className="text-sm text-charcoal/80">{pkg.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-charcoal/70">
                      <IconCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className="mt-auto">
                  <Button
                    variant={pkg.featured ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {pkg.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-charcoal/80">
              Not sure which package is right for you?{' '}
              <Link href="/contact" className="text-gold font-medium hover:underline">
                Schedule a free consultation
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* Quality Standards - Condensed */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4">
                Our Standards
              </p>
              <h2 className="mb-4">Quality You Can Trust</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { metric: 'ATS', label: 'Compatible*' },
                { metric: '80%+', label: 'Keyword Alignment' },
                { metric: 'Bias', label: 'Aware Screening' },
                { metric: '50%+', label: 'Quantified' },
                { metric: 'WCAG', label: 'Accessible' },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 bg-sand-50 rounded-xl">
                  <div className="text-2xl font-bold text-gold mb-1">{item.metric}</div>
                  <div className="text-xs text-charcoal/80">{item.label}</div>
                </div>
              ))}
            </div>

            {/* ATS Footnote */}
            <div className="mt-6 text-center">
              <p className="text-sm text-charcoal/80">
                *Compatible with major ATS platforms including Workday, Taleo, Greenhouse, and iCIMS
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-navy text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-sand-200 mb-8">
              Let&apos;s discuss your career goals and find the right package for you.
            </p>
            <Button href="/contact" variant="primary" size="lg" className="group">
              Schedule Free Consultation
              <IconArrowRight />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
