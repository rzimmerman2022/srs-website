import Link from 'next/link';
import Container from '@/components/layout/Container';

export default function ProblemBlock() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-sand-50 border-b border-sand-200">
      <Container>
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 text-center">
            The problem we solve
          </h2>
          <p className="text-xl text-charcoal/80 mb-8 text-center">
            Talented professionals who&apos;ve built impressive careers often find it challenging to articulate that value in compelling, strategic language.
          </p>

          {/* Truth Gap Definition */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-sand-200 mb-6">
            <p className="text-lg text-charcoal/80 mb-5 leading-relaxed">
              We call this the <strong className="text-navy">Truth Gap</strong>—the distance between your expertise and how you express it.
              When you&apos;re close to your work, patterns of excellence become invisible.
            </p>

            {/* The Truth Gap typically shows up as */}
            <p className="text-sm font-semibold text-navy mb-3 uppercase tracking-wide">Common manifestations:</p>
            <ul className="space-y-3 text-base">
              <li>
                <span className="font-semibold text-navy">Language Challenge</span>
                <span className="text-charcoal/80"> — Lacking strategic vocabulary to express your work</span>
              </li>
              <li>
                <span className="font-semibold text-navy">Proximity Effect</span>
                <span className="text-charcoal/80"> — Your excellence feels ordinary because you&apos;re so close to it</span>
              </li>
              <li>
                <span className="font-semibold text-navy">Expertise Paradox</span>
                <span className="text-charcoal/80"> — Years of skill development now feel like &quot;anyone could do this&quot;</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/process"
              className="inline-flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium"
            >
              See how we close the gap
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

        </div>
      </Container>
    </section>
  );
}
