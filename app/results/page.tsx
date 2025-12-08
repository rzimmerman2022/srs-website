import Hero from '@/components/sections/Hero';
import Container from '@/components/layout/Container';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Results',
  description:
    'See how our research-backed methodology and Truth Bridge Protocol have helped clients authentically elevate their careers.',
};

export default function ResultsPage() {
  return (
    <>
      <Hero
        title="Client Results"
        subtitle="Success Stories"
        description="Real outcomes from our research-backed methodology and comprehensive ownership transfer process."
        primaryCTA={{ text: 'Start Your Journey', href: '/contact' }}
        gradient={false}
      />

      {/* Intro Section */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-lg text-gray-600 leading-relaxed">
              While we cannot fabricate metrics or guarantee outcomes, we can share the types
              of transformations our clients experience when they go through our comprehensive
              process.
            </p>
          </div>

          {/* Outcome Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💼</span>
                </div>
                <CardTitle as="h3" className="text-lg">
                  Career Transitions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Professionals successfully pivoting to new industries through Level 4
                  enhancement and comprehensive skills translation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <CardTitle as="h3" className="text-lg">
                  Career Advancement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Clients securing promotions and senior-level roles after articulating their
                  leadership value through research-validated language.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <CardTitle as="h3" className="text-lg">
                  Confidence Transformation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Professionals overcoming imposter syndrome and professional minimization
                  through our Truth Bridge Protocol.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle as="h3" className="text-lg">
                  Interview Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Clients passing rigorous interview processes after mastering enhancement
                  defense and gap narratives.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🌉</span>
                </div>
                <CardTitle as="h3" className="text-lg">
                  Gap Bridging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Professionals with employment gaps successfully reframing their narratives
                  and securing opportunities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <CardTitle as="h3" className="text-lg">
                  Non-Traditional Backgrounds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Clients from non-traditional paths translating their experience into
                  professional credentials that open doors.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* What Clients Value */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12">What Clients Value Most</h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gold">
                <h3 className="font-semibold text-navy mb-2">Genuine Ownership</h3>
                <p className="text-gray-600 text-sm">
                  &quot;I was skeptical about enhanced language, but the research validation and
                  practice exercises helped me genuinely believe every word. In the interview,
                  I defended my experience confidently because it really was my truth.&quot;
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gold">
                <h3 className="font-semibold text-navy mb-2">Research-Backed Confidence</h3>
                <p className="text-gray-600 text-sm">
                  &quot;Seeing my experience validated through O*NET and market data changed how I
                  viewed myself. I wasn&apos;t inflating anything—I was finally articulating the
                  value that was always there.&quot;
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gold">
                <h3 className="font-semibold text-navy mb-2">Interview Mastery</h3>
                <p className="text-gray-600 text-sm">
                  &quot;The mock interviews prepared me for every possible question. When they
                  pushed back on my career gap, I had three versions of my narrative ready.
                  The stress inoculation protocols really worked.&quot;
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gold">
                <h3 className="font-semibold text-navy mb-2">Breaking Minimization Patterns</h3>
                <p className="text-gray-600 text-sm">
                  &quot;I didn&apos;t realize how much I was underselling myself. The pattern
                  interruption exercises helped me stop using qualifiers like &apos;just&apos; and
                  &apos;only.&apos; I learned to own my professional achievements.&quot;
                </p>
              </div>
            </div>

            <div className="mt-12 p-8 bg-navy text-sand rounded-lg text-center">
              <p className="text-lg font-semibold mb-2 text-white">
                {/* TODO: Insert verified credential or professional affiliation here */}
                Testimonials represent genuine client feedback
              </p>
              <p className="text-sm text-sand-300">
                Specific client names, metrics, and identifying details have been omitted to
                protect privacy. All feedback reflects real client experiences with our process.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* The Difference */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-8">The SRS Difference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-navy mb-4">
                  Traditional Resume Writing
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Generic templates and boilerplate language
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    No research validation or source documentation
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Client receives document but no ownership transfer
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    No interview preparation or defense strategies
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Risk of over-enhancement without verification
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy mb-4">
                  Southwest Resume Services
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    Research-validated enhancements (RAI ≥ 7.0)
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    Mathematical risk assessment for every claim
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    Truth Bridge Protocol for genuine ownership
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    Comprehensive interview preparation included
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    Four-test ownership verification framework
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">Ready for Your Own Success Story?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Let&apos;s uncover your professional value and build your confidence through our
              research-backed methodology.
            </p>
            <a href="/contact">
              <Button variant="primary" size="lg">
                Get Started Today
              </Button>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
