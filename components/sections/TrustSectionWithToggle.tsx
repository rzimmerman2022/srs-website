'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import { getHeroReviews, GOOGLE_REVIEWS_URL, RATING_FALLBACK, REVIEW_COUNT_FALLBACK } from '@/lib/reviews';

const IconStar = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const IconChevronLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconChevronRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

interface RatingData {
  rating: string;
  reviewCount: number;
  fallback?: boolean;
}

export default function TrustSectionWithToggle() {
  const heroReviews = getHeroReviews();
  const [activeIndex, setActiveIndex] = useState(0);
  const [ratingData, setRatingData] = useState<RatingData>({
    rating: RATING_FALLBACK,
    reviewCount: REVIEW_COUNT_FALLBACK,
    fallback: true,
  });

  // Fetch dynamic rating on mount
  useEffect(() => {
    fetch('/api/google-rating')
      .then(res => res.json())
      .then(data => {
        setRatingData({
          rating: data.rating,
          reviewCount: data.reviewCount,
          fallback: data.fallback || false,
        });
      })
      .catch(err => {
        console.error('Failed to fetch Google rating:', err);
        // Keep fallback data
      });
  }, []);

  if (heroReviews.length === 0) {
    return null; // Safety check
  }

  const activeReview = heroReviews[activeIndex];

  const handlePrevious = () => {
    setActiveIndex(activeIndex > 0 ? activeIndex - 1 : heroReviews.length - 1);
  };

  const handleNext = () => {
    setActiveIndex(activeIndex < heroReviews.length - 1 ? activeIndex + 1 : 0);
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white border-b border-sand-200">
      <Container>
        <div className="max-w-4xl mx-auto">

          {/* Testimonial Card */}
          <div className="bg-gradient-to-br from-sand-50 to-white rounded-2xl p-8 md:p-12 shadow-sm border border-sand-200 relative">

            {/* Quote Icon */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 text-gold/20">
              <svg className="w-12 h-12 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>

            {/* Quote Content */}
            <div className="relative z-10 text-center pt-8 md:pt-4">
              <blockquote className="mb-8">
                <p className="text-xl md:text-2xl lg:text-3xl text-navy leading-relaxed font-light">
                  &quot;{activeReview.excerpt}&quot;
                </p>
              </blockquote>

              <cite className="text-base text-charcoal/70 not-italic block mb-8">
                <span className="font-semibold text-navy">— {activeReview.name}</span>
                {activeReview.title && <span className="text-charcoal/60">, {activeReview.title}</span>}
              </cite>

              {/* Navigation - Clean inline design */}
              {heroReviews.length > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handlePrevious}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-sand-300 text-navy/60 hover:border-gold hover:text-gold transition-all duration-200"
                    aria-label="Previous review"
                  >
                    <IconChevronLeft />
                  </button>

                  <span className="text-sm text-charcoal/50 font-medium tabular-nums min-w-[3rem] text-center">
                    {activeIndex + 1} / {heroReviews.length}
                  </span>

                  <button
                    onClick={handleNext}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-sand-300 text-navy/60 hover:border-gold hover:text-gold transition-all duration-200"
                    aria-label="Next review"
                  >
                    <IconChevronRight />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Google Rating */}
          <div className="mt-8 text-center">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal transition-colors"
            >
              <div className="flex gap-0.5 text-gold">
                {[1,2,3,4,5].map(i => <IconStar key={i} />)}
              </div>
              <span className="font-medium">{ratingData.rating} on Google</span>
              <span className="text-charcoal/30">•</span>
              <span>{ratingData.reviewCount} reviews</span>
              <span className="text-gold font-medium hover:underline">Read reviews →</span>
            </a>
          </div>

          {/* Three Proof Chips */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-charcoal/50 pt-8 mt-8 border-t border-sand-200">
            <span>Founder-led, no outsourcing</span>
            <span className="hidden md:inline text-charcoal/20">•</span>
            <span>Phoenix / Chandler, Arizona</span>
            <span className="hidden md:inline text-charcoal/20">•</span>
            <span>Validated against O*NET + BLS</span>
          </div>

        </div>
      </Container>
    </section>
  );
}
