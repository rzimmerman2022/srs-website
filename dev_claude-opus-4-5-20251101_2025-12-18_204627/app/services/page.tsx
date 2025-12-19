/**
 * REDESIGN: Visual Services Page with SVG Icons
 * Date: 2025-12-18
 */

import Link from 'next/link';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services & Pricing | Southwest Resume Services',
  description:
    'Professional resume writing, LinkedIn optimization, and interview coaching services. Transparent pricing from $150-$500+.',
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

const services = [
  {
    id: 'resume',
    icon: <IconDocument />,
    title: 'Resume Writing',
    tagline: 'Research-validated resumes that get interviews',
    features: [
      'In-depth discovery process',
      'Market & keyword research',
      'ATS-optimized formatting',
      'Unlimited revisions',
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
    features: [
      'Professional resume writing',
      'ATS optimization',
      'Keyword targeting',
      'Unlimited revisions (within scope)',
      '5-day delivery',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Accelerator',
    price: '$300',
    description: 'Our most popular package with enhanced research and strategy.',
    features: [
      'Everything in Essentials',
      'Market research report',
      'LinkedIn headline optimization',
      'Unlimited revisions',
      '3-day priority delivery',
    ],
    cta: 'Get Started',
    featured: true,
  },
  {
    name: 'Career Launch',
    price: '$449',
    description: 'Comprehensive package for career changers and ambitious professionals.',
    features: [
      'Everything in Accelerator',
      'Full LinkedIn optimization',
      'Custom cover letter',
      'Interview prep session',
      '48-hour rush available',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Executive',
    price: '$500+',
    description: 'White-glove service for senior leaders and complex transitions.',
    features: [
      'Everything in Career Launch',
      'Executive positioning',
      'Personal branding strategy',
      'Ongoing support (30 days)',
      'Direct founder access',
    ],
    cta: 'Contact Us',
    featured: false,
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sand-50 via-white to-sand-100 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        </div>

        <Container className="relative py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4">
              Services & Pricing
            </p>
            <h1 className="mb-6">
              Career Services That{' '}
              <span className="text-gold">Deliver Results</span>
            </h1>
            <p className="text-xl text-charcoal/70">
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
            <p className="text-charcoal/70 max-w-2xl mx-auto">
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
                <p className="text-sm text-charcoal/60 mb-4">{service.tagline}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-charcoal/70">
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

      {/* Pricing Packages */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4">
              Pricing
            </p>
            <h2 className="mb-4">Choose Your Package</h2>
            <p className="text-charcoal/70 max-w-2xl mx-auto">
              All packages include our research-backed methodology and unlimited revisions until you own every word.
            </p>
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
                  <h3 className="text-xl font-serif font-semibold text-navy mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-gold mb-2">{pkg.price}</div>
                  <p className="text-sm text-charcoal/60">{pkg.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-charcoal/70">
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
            <p className="text-sm text-charcoal/60">
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
                { metric: 'ATS', label: 'Optimized' },
                { metric: '80%+', label: 'Keyword Alignment' },
                { metric: 'Bias', label: 'Aware Screening' },
                { metric: '50%+', label: 'Quantified' },
                { metric: 'WCAG', label: 'Accessible' },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-sand-50 rounded-xl">
                  <div className="text-2xl font-bold text-gold mb-1">{item.metric}</div>
                  <div className="text-xs text-charcoal/60">{item.label}</div>
                </div>
              ))}
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
