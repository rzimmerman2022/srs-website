import Hero from '@/components/sections/Hero';
import Container from '@/components/layout/Container';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { withBasePath } from '@/lib/paths';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Phoenix Resume Writers | Southwest Resume Services',
  description:
    'Learn about Southwest Resume Services, a Phoenix-based career coaching company serving Arizona professionals. Our research-backed methodology helps Phoenix, Scottsdale, and Mesa job seekers reveal their true professional value.',
};

export default function AboutPage() {
  return (
    <>
      <Hero
        title="About Southwest Resume Services"
        subtitle="Our Story & Philosophy"
        description="We believe in revealing truth, not crafting fiction. Every enhancement is grounded in your authentic experience and validated through rigorous research."
        primaryCTA={{ text: 'Work With Us', href: '/contact' }}
      />

      {/* Our Philosophy */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="mb-6 text-center">Our Philosophy</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-xl text-center font-semibold text-navy mb-8">
                  &quot;A resume you can&apos;t own performs like fiction when it matters most.&quot;
                </p>
                <p>
                  This Client Truth Principle is the foundation of everything we do at
                  Southwest Resume Services. In interviews, only genuine ownership translates
                  to confident delivery.
                </p>
                <p>
                  Our role is straightforward: we bring outside perspective backed by
                  research methodology, and professional language expertise. You bring
                  lived experience and genuine achievements. Together, we build a narrative
                  you can defend with authentic confidence.
                </p>
              </div>
            </div>

            {/* The Truth Gap */}
            <div className="bg-sand-50 p-8 rounded-lg mb-12">
              <h3 className="text-2xl font-serif font-semibold text-navy mb-6">
                The Truth Gap
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  Here&apos;s what we see consistently: talented professionals who&apos;ve built
                  impressive careers often find it challenging to articulate that value
                  in compelling, strategic language.
                </p>
                <p>
                  We call this the <strong>Truth Gap</strong>—the distance between your
                  expertise and how you express it. When you&apos;re close to your work,
                  patterns of excellence can become invisible. Skills that took years
                  to develop feel routine. Contributions that required genuine capability
                  get filed under &quot;just doing my job.&quot;
                </p>
                <p>
                  This isn&apos;t a flaw—it&apos;s a natural consequence of expertise. And it&apos;s
                  exactly where outside perspective becomes valuable.
                </p>
                <p className="font-medium text-navy">
                  The Truth Gap typically shows up as:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>The Language Challenge:</strong> Knowing what you did, but
                    lacking the professional vocabulary to express it strategically
                  </li>
                  <li>
                    <strong>The Proximity Effect:</strong> Being so close to your work
                    that patterns of excellence feel ordinary
                  </li>
                  <li>
                    <strong>The Expertise Paradox:</strong> Skills that took years to
                    develop now feel like &quot;anyone could do this&quot;
                  </li>
                  <li>
                    <strong>The Ownership Hesitation:</strong> Understanding your value
                    intellectually without feeling it emotionally
                  </li>
                </ul>
                <p className="font-semibold text-navy mt-6">
                  Our work closes this Truth Gap through collaborative discovery,
                  research-validated translation, and complete ownership transfer.
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
                  <p className="text-gray-700 text-sm">
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
                    Ownership-Focused
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">
                    Our ownership transfer process ensures you can defend every claim
                    with confidence—because you genuinely own it.
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
                  <p className="text-gray-700 text-sm">
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
            <div className="space-y-4 text-lg text-sand-200 leading-relaxed">
              <p>
                Based in Phoenix, Arizona, we bring the warmth, authenticity, and elevation of the
                Southwest to career services. We serve professionals throughout the Phoenix metro area,
                including Scottsdale, Mesa, Tempe, Chandler, and across Arizona.
              </p>
              <p>
                The Sonoran Desert appears barren at first glance—until you look closer.
                Then you discover the saguaro that took 75 years to grow its first arm,
                the ironwood tree that anchors entire ecosystems, the hidden springs that
                sustain life for miles around. Careful observation reveals what casual
                assessment missed. The value was always there. It just required the right
                perspective to see beyond the surface.
              </p>
              <p>
                This is exactly what we do. Your resume says &quot;managed daily operations&quot;—but
                investigation reveals you navigated HIPAA compliance, coordinated cross-functional
                workflows, and maintained quality standards under resource constraints. The saguaro
                doesn&apos;t announce its 75-year journey. The desert tortoise doesn&apos;t advertise
                how it converts scarcity into an 80-year lifespan. And you don&apos;t naturally
                articulate how years of problem-solving under pressure built genuine strategic capability.
                Memory fades the struggle while the capability remains.
              </p>
              <p className="font-medium text-sand-100">
                Our work bridges that gap—seeing beyond the surface description to the professional
                value underneath, then translating your authentic experience into language that
                reveals what proximity made invisible. Whether you&apos;re navigating Arizona&apos;s
                tech sector, healthcare industry, or expanding business landscape, the contributions
                are real. The capability is measurable. We help you own it completely.
              </p>
            </div>
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
              <div className="space-y-4 text-gray-700">
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
            <p className="text-center text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
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
                <div className="text-gray-700 text-left space-y-3">
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
                    Based in Phoenix, Arizona, Ryan brings the Southwest values of authenticity and
                    straight talk to every client engagement, serving professionals throughout the
                    Phoenix metro area and beyond.
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
                <div className="text-gray-700 text-left space-y-3">
                  <p>
                    Jordyn specializes in helping clients move from intellectual understanding
                    to genuine ownership through structured interview preparation and
                    confidence transfer.
                  </p>
                  <p>
                    With a deep understanding of the natural barriers that arise when professionals
                    articulate their own value, Jordyn guides clients through the transformation
                    from knowing what they did to owning how they talk about it.
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
            <p className="text-lg text-gray-700 mb-8">
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
