import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import ServiceGrid, { Service } from '@/components/sections/ServiceGrid';
import Container from '@/components/layout/Container';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Southwest Resume Services | Your Career, Elevated.',
  description:
    'Premium career services and resume optimization based in Arizona. Research-backed, authentically crafted career documents that help you own your professional story.',
};

const coreServices: Service[] = [
  {
    title: 'Resume Writing & Optimization',
    description:
      'Research-validated resume writing that reveals your true professional value through the Client Truth Principle.',
    icon: '📄',
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
    icon: '💼',
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
    icon: '🎯',
    features: [
      'STAR+ story development',
      'Mock interview sessions',
      'Enhancement defense strategies',
      'Stress inoculation protocols',
    ],
    cta: { text: 'Learn More', href: '/services#interview' },
  },
];

const whySRS = [
  {
    title: 'Research-Backed Methodology',
    description:
      'Every claim is validated through authoritative sources including O*NET, Bureau of Labor Statistics, and leading market intelligence platforms.',
    icon: '🔬',
  },
  {
    title: 'Client Truth Principle',
    description:
      'We don\'t just write resumes—we help you own your story. Every enhancement is grounded in your authentic experience and defensible in interviews.',
    icon: '✨',
  },
  {
    title: 'Comprehensive Process',
    description:
      'From deep discovery and market research to ownership transfer and interview mastery, we guide you through every step of your career elevation.',
    icon: '🚀',
  },
  {
    title: 'Quality Obsessed',
    description:
      'Ten-dimensional quality framework ensures ATS compatibility, WCAG accessibility, and DEI-friendly language in every document.',
    icon: '⚡',
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

      {/* What We Do */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="mb-4">Career Services That Transform</h2>
            <p className="text-lg text-gray-600">
              We specialize in uncovering and articulating the professional value you
              cannot see in yourself, then helping you own it completely.
            </p>
          </div>

          <ServiceGrid services={coreServices} columns={3} />

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" size="lg">
                View All Services
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* The Client Truth Principle */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">The Client Truth Principle</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="text-lg font-semibold text-navy">
                  &quot;Whether it is factual or not, if it&apos;s not the client&apos;s truth,
                  then it&apos;s all for nothing.&quot;
                </p>
                <p>
                  This foundational principle guides everything we do at Southwest Resume
                  Services. We understand that a technically accurate statement that
                  doesn&apos;t feel true to you will perform like a lie when it matters
                  most—in an interview.
                </p>
                <p>
                  Our role isn&apos;t to fabricate or exaggerate. It&apos;s to uncover genuine
                  value that you cannot see in yourself, articulate it in professional
                  language that resonates with employers, and then transfer ownership so
                  completely that it becomes your authentic truth.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/about">
                  <Button variant="outline">Learn About Our Philosophy</Button>
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-gold">
              <h3 className="text-xl font-serif font-semibold text-navy mb-4">
                The Three Pillars of Ethical Enhancement
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-navy mb-2">1. Investigation</h4>
                  <p className="text-sm text-gray-600">
                    Uncovering the complete truth about what you actually did, not just
                    what you remember or how you describe it.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-navy mb-2">2. Translation</h4>
                  <p className="text-sm text-gray-600">
                    Converting authentic experience into professional language that
                    resonates with employers while remaining true to your reality.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-navy mb-2">3. Transformation</h4>
                  <p className="text-sm text-gray-600">
                    Helping you internalize your translated truth so completely that it
                    becomes your new professional identity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Why Choose SRS */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="mb-4">Why Southwest Resume Services</h2>
            <p className="text-lg text-gray-600">
              We combine rigorous research methodology with deep psychological insight
              to create career documents that are both powerful and authentically yours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whySRS.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <CardTitle as="h3" className="text-xl">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* How We Work */}
      <section className="section-padding bg-navy text-sand">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-white mb-4">Our Process</h2>
            <p className="text-lg text-sand-200">
              A systematic, research-driven approach to career transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Discovery',
                description: 'Deep dive into your experience and career goals',
              },
              {
                step: '02',
                title: 'Research',
                description: 'Market intelligence and validation',
              },
              {
                step: '03',
                title: 'Crafting',
                description: 'Enhancement and professional translation',
              },
              {
                step: '04',
                title: 'Ownership',
                description: 'Confidence building and interview mastery',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gold mb-3">{item.step}</div>
                <h3 className="text-xl font-serif font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-sand-300">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/process">
              <Button variant="primary" size="lg">
                See Our Full Process
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-sand via-white to-sand-100">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">Ready to Elevate Your Career?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Let&apos;s uncover your professional value and help you own your story.
              Schedule a consultation to get started.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline" size="lg">
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
