import Link from 'next/link';
import Container from '@/components/layout/Container';

export default function ProblemBlock() {
  return (
    <section className="section-padding bg-sand-50 border-b border-sand-200">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">The problem we solve</h2>
          <p className="text-xl text-charcoal/80 leading-relaxed">
            You have the expertise. The problem isn&apos;t what you&apos;ve done. It&apos;s how you express it.
          </p>
          <p className="text-base text-charcoal/60 mt-4 italic">
            We call this the Truth Gap—the distance between your expertise and how you express it.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {/* Card 1 */}
          <div className="group flex flex-col p-6 rounded-xl bg-white hover:bg-sand-50 transition-all duration-300 border border-sand-100 shadow-sm">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-navy flex items-center justify-center shadow-md group-hover:scale-105 transition-transform mb-4">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-navy mb-2">Impact gets buried in responsibilities</h3>
            <p className="text-charcoal/80 leading-relaxed text-sm">
              Your resume lists tasks, not outcomes—so real value stays hidden.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group flex flex-col p-6 rounded-xl bg-white hover:bg-sand-50 transition-all duration-300 border border-sand-100 shadow-sm">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-navy flex items-center justify-center shadow-md group-hover:scale-105 transition-transform mb-4">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-navy mb-2">You&apos;re too close to your work</h3>
            <p className="text-charcoal/80 leading-relaxed text-sm">
              What feels routine to you is exceptional to others. You can&apos;t see it until it&apos;s mapped.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group flex flex-col p-6 rounded-xl bg-white hover:bg-sand-50 transition-all duration-300 border border-sand-100 shadow-sm">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-navy flex items-center justify-center shadow-md group-hover:scale-105 transition-transform mb-4">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-navy mb-2">Interviews expose what you can&apos;t own</h3>
            <p className="text-charcoal/80 leading-relaxed text-sm">
              Anything you can&apos;t defend under pressure collapses—even if it&apos;s true.
            </p>
          </div>
        </div>

        {/* Closing + CTA */}
        <div className="text-center">
          <p className="text-charcoal/60 italic mb-6">
            These gaps aren&apos;t a reflection of your ability—they&apos;re a matter of perspective.<br />
            That&apos;s where we come in.
          </p>
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
      </Container>
    </section>
  );
}
