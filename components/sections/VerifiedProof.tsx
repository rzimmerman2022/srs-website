'use client';

import { useState } from 'react';
import { getProofReviews } from '@/lib/reviews';

interface VerifiedProofProps {
  excludeHeroId?: string; // ID of review currently shown in hero
}

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

const IconQuote = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
  </svg>
);

export default function VerifiedProof({ excludeHeroId }: VerifiedProofProps) {
  const proofReviews = getProofReviews(excludeHeroId);
  const [activeIndex, setActiveIndex] = useState(0);

  if (proofReviews.length === 0) {
    return null; // Safety check
  }

  const handlePrevious = () => {
    setActiveIndex(activeIndex > 0 ? activeIndex - 1 : proofReviews.length - 1);
  };

  const handleNext = () => {
    setActiveIndex(activeIndex < proofReviews.length - 1 ? activeIndex + 1 : 0);
  };

  const activeReview = proofReviews[activeIndex];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white border-b border-sand-200">
      <div className="max-w-6xl mx-auto px-4">

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Verified Proof
          </h2>
          <p className="text-lg text-charcoal/70">
            Real clients, real results
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-sand-200 relative">

            {/* Quote Icon */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 text-gold/20">
              <IconQuote />
            </div>

            {/* Quote Content */}
            <div className="relative z-10 text-center pt-6 md:pt-2">
              <blockquote className="mb-8">
                <p className="text-lg md:text-xl lg:text-2xl text-navy leading-relaxed font-light">
                  &quot;{activeReview.excerpt}&quot;
                </p>
              </blockquote>

              <cite className="text-base text-charcoal/70 not-italic block mb-8">
                <span className="font-semibold text-navy">— {activeReview.name}</span>
                {activeReview.title && <span className="text-charcoal/60">, {activeReview.title}</span>}
              </cite>

              {/* Navigation - Clean inline design */}
              {proofReviews.length > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handlePrevious}
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-sand-300 text-navy/60 hover:border-gold hover:text-gold transition-all duration-200"
                    aria-label="Previous review"
                  >
                    <IconChevronLeft />
                  </button>

                  <span className="text-sm text-charcoal/50 font-medium tabular-nums min-w-[3rem] text-center">
                    {activeIndex + 1} / {proofReviews.length}
                  </span>

                  <button
                    onClick={handleNext}
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-sand-300 text-navy/60 hover:border-gold hover:text-gold transition-all duration-200"
                    aria-label="Next review"
                  >
                    <IconChevronRight />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
