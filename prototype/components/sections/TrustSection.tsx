import Container from '@/components/layout/Container';
import { getFeaturedReview, GOOGLE_REVIEWS_URL, RATING, REVIEW_COUNT } from '@/lib/reviews';

const IconStar = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default function TrustSection() {
  const featuredReview = getFeaturedReview();

  return (
    <section className="py-16 md:py-20 bg-white border-b border-gray-100">
      <Container>
        <div className="max-w-3xl mx-auto text-center">

          {/* Featured Review - Rotates daily (deterministic) */}
          <blockquote className="mb-6">
            <p className="text-xl md:text-2xl text-navy leading-relaxed mb-4">
              "{featuredReview.excerpt}"
            </p>
            <cite className="text-sm text-gray-500 not-italic">
              — {featuredReview.name}, {featuredReview.sourceLabel}
            </cite>
          </blockquote>

          {/* Single Verification Line - ONLY place rating appears on page */}
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-10"
          >
            <div className="flex gap-0.5 text-gold">
              {[1,2,3,4,5].map(i => <IconStar key={i} />)}
            </div>
            <span>{RATING} on Google</span>
            <span>•</span>
            <span>{REVIEW_COUNT} reviews</span>
            <span className="text-gold hover:underline">Read reviews →</span>
          </a>

          {/* Three Proof Chips - No Badges */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 pt-8 border-t border-gray-100">
            <span>Founder-led, no outsourcing</span>
            <span className="hidden md:inline text-gray-300">•</span>
            <span>Phoenix / Chandler, Arizona</span>
            <span className="hidden md:inline text-gray-300">•</span>
            <span>Validated against O*NET + BLS</span>
          </div>

        </div>
      </Container>
    </section>
  );
}
