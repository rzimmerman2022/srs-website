import Hero from '@/components/sections/Hero';
import Container from '@/components/layout/Container';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { withBasePath } from '@/lib/paths';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Southwest Resume Services, our philosophy, and our commitment to revealing your true professional value through research-backed career services.',
};

export default function AboutPage() {
  return (
    <>
      <Hero
        title="About Southwest Resume Services"
        subtitle="Our Story & Philosophy"
        description="We believe in revealing truth, not crafting fiction. Every enhancement is grounded in your authentic experience and validated through rigorous research."
        primaryCTA={{ text: 'Work With Us', href: '/contact' }}
        gradient={false}
      />

      {/* Our Philosophy */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="mb-6 text-center">Our Philosophy</h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p className="text-xl text-center font-semibold text-navy mb-8">
                  &quot;Whether it is factual or not, if it&apos;s not the client&apos;s truth, then it&apos;s
                  all for nothing.&quot;
                </p>
                <p>
                  This Client Truth Principle is the foundation of everything we do at
                  Southwest Resume Services. We understand that a technically accurate
                  statement that doesn&apos;t feel true to you will perform like a lie when it
                  matters most—in an interview.
                </p>
                <p>
                  Our role isn&apos;t to fabricate or exaggerate. It&apos;s to uncover genuine value
                  that you cannot see in yourself, articulate it in professional language
                  that resonates with employers, and then transfer ownership so completely
                  that it becomes your authentic truth.
                </p>
              </div>
            </div>

            {/* The Problem We Solve */}
            <div className="bg-sand-50 p-8 rounded-lg mb-12">
              <h3 className="text-2xl font-serif font-semibold text-navy mb-6">
                The Problem We Solve
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Most professionals systematically minimize their own contributions.
                  This isn&apos;t a character flaw—it&apos;s a psychological pattern reinforced by
                  workplace dynamics, hierarchical organizations, and economic insecurity.
                </p>
                <p>
                  We call this the <strong>Truth Gap</strong>: the chasm between objective
                  professional value and subjective self-perception. This gap is created by:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Professional Minimization:</strong> Clients internalize a
                    diminished view of their contribution
                  </li>
                  <li>
                    <strong>Imposter Syndrome:</strong> The persistent belief that success
                    is undeserved
                  </li>
                  <li>
                    <strong>The Language Gap:</strong> Lack of professional vocabulary to
                    articulate value
                  </li>
                  <li>
                    <strong>Memory Disconnect:</strong> Remembering the feeling of struggle
                    rather than demonstrated competence
                  </li>
                </ul>
                <p className="font-semibold text-navy mt-6">
                  Our work closes this Truth Gap through investigation, translation, and
                  transformation.
                </p>
              </div>
            </div>

            {/* Our Approach */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <CardTitle as="h3" className="text-xl">
                    Research-Driven
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Every claim validated through authoritative sources: O*NET, Bureau of
                    Labor Statistics, Lightcast, LinkedIn Economic Graph, and more.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <CardTitle as="h3" className="text-xl">
                    Psychologically Informed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Deep understanding of professional minimization, imposter syndrome, and
                    the ownership imperative ensures genuine confidence transfer.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <CardTitle as="h3" className="text-xl">
                    Ethically Grounded
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Mathematical risk assessment and integrity scoring ensure every
                    enhancement is both powerful and genuinely defensible.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Arizona Connection */}
      <section className="section-padding bg-navy text-sand">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-6">Rooted in the Southwest</h2>
            <p className="text-lg text-sand-200 leading-relaxed">
              Based in Arizona, we bring the warmth, authenticity, and elevation of the
              Southwest to career services. Like the desert landscape that reveals hidden
              beauty through careful observation, we uncover professional value that others
              overlook.
            </p>
          </div>
        </Container>
      </section>

      {/* Why It Matters */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">Why This Matters</h2>
            <div className="bg-sand-50 p-8 rounded-lg">
              <h3 className="text-xl font-serif font-semibold text-navy mb-4">
                Economic Justice Through Truth Revelation
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our work isn&apos;t just about better resumes—it&apos;s about economic justice. We
                  challenge structures that systematically undervalue certain types of work
                  and workers.
                </p>
                <p>
                  By helping people claim compensation and opportunities commensurate with
                  their actual contributions rather than their socially constructed position,
                  we break the Confidence-Competence Spiral and create upward momentum based
                  on justified confidence.
                </p>
                <p className="font-semibold text-navy">
                  You deserve to be compensated fairly for the value you actually create. We
                  help you articulate that value authentically and confidently.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-4 text-center">Meet Our Team</h2>
            <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Our team combines deep expertise in career development, research methodology,
              and authentic communication to deliver exceptional results.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Ryan Zimmerman */}
              <div className="text-center">
                <div className="mb-6 relative inline-block">
                  <Image
                    src={withBasePath('/assets/images/team/ryan.jpg')}
                    alt="Ryan Zimmerman, Founder & Principal Consultant"
                    width={300}
                    height={300}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                  Ryan Zimmerman
                </h3>
                <p className="text-gold font-medium mb-4">
                  Founder & Principal Consultant
                </p>
                <div className="text-gray-600 text-left space-y-3">
                  <p>
                    Ryan founded Southwest Resume Services with a singular mission: to help
                    professionals articulate their true value without fabrication or exaggeration.
                  </p>
                  <p>
                    Drawing on extensive experience in career development and research methodology,
                    Ryan developed the Client Truth Principle and Research Authority Index that
                    define our approach—revealing authentic professional value through rigorous
                    investigation and psychological insight.
                  </p>
                  <p>
                    Based in Arizona, Ryan brings the Southwest values of authenticity and
                    straight talk to every client engagement.
                  </p>
                </div>
              </div>

              {/* Jordyn Ginsberg */}
              <div className="text-center">
                <div className="mb-6 relative inline-block">
                  <Image
                    src={withBasePath('/assets/images/team/jordyn.png')}
                    alt="Jordyn Ginsberg, Career Coach"
                    width={300}
                    height={300}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                  Jordyn Ginsberg
                </h3>
                <p className="text-gold font-medium mb-4">
                  Career Coach
                </p>
                <div className="text-gray-600 text-left space-y-3">
                  <p>
                    Jordyn specializes in helping clients overcome professional minimization
                    and imposter syndrome through structured interview preparation and
                    confidence transfer.
                  </p>
                  <p>
                    With a deep understanding of the psychological barriers that prevent
                    professionals from owning their achievements, Jordyn guides clients
                    through the transformation from intellectual understanding to embodied
                    confidence.
                  </p>
                  <p>
                    Her approach ensures that every enhancement we uncover becomes genuinely
                    your truth—so you can speak about your value with authentic conviction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">Ready to Elevate Your Career?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Let&apos;s uncover your professional truth and help you own it completely.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/process">
                <Button variant="outline" size="lg">
                  See Our Process
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
