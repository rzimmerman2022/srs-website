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
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconChevronRight = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="max-w-3xl mx-auto text-center relative">

          {/* Arrow Navigation (desktop only) */}
          {heroReviews.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-sand-200 text-navy hover:bg-sand-50 transition-colors"
                aria-label="Previous review"
              >
                <IconChevronLeft />
              </button>
              <button
                onClick={handleNext}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-sand-200 text-navy hover:bg-sand-50 transition-colors"
                aria-label="Next review"
              >
                <IconChevronRight />
              </button>
            </>
          )}

          {/* Hero Quote with Manual Toggle */}
          <blockquote className="mb-6">
            <p className="text-base md:text-lg text-navy leading-relaxed tracking-tight mb-4">
              &quot;{activeReview.excerpt}&quot;
            </p>
            <cite className="text-xs text-charcoal/70 not-italic">
              <span className="font-medium text-charcoal/80">— {activeReview.name}</span>
              {activeReview.title && `, ${activeReview.title}`}
            </cite>
          </blockquote>

          {/* Manual Toggle Dots (only show if multiple reviews) */}
          {heroReviews.length > 1 && (
            <div className="flex justify-center gap-3 mb-6">
              {heroReviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-full transition-all ${
                    index === activeIndex
                      ? 'bg-gold w-8 h-3'
                      : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
                  }`}
                  aria-label={`Show review ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Dynamic Google Rating - ONLY place rating appears on page */}
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-10"
          >
            <div className="flex gap-0.5 text-gold">
              {[1,2,3,4,5].map(i => <IconStar key={i} />)}
            </div>
            <span>{ratingData.rating} on Google</span>
            <span>•</span>
            <span>{ratingData.reviewCount} reviews</span>
            <span className="text-gold hover:underline">Read reviews →</span>
          </a>

          {/* Three Proof Chips - No Badges */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 pt-8 border-t border-sand-200">
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
