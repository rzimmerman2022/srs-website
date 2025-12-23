'use client';

import { useRef, useState } from 'react';
import { getProofReviews } from '@/lib/reviews';

interface VerifiedProofProps {
  excludeHeroId?: string; // ID of review currently shown in hero
}

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

export default function VerifiedProof({ excludeHeroId }: VerifiedProofProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const proofReviews = getProofReviews(excludeHeroId);

  if (proofReviews.length === 0) {
    return null; // Safety check
  }

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const cards = scrollRef.current.querySelectorAll('[data-card]');
      cards[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setActiveIndex(index);
    }
  };

  const handlePrevious = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : proofReviews.length - 1;
    scrollToCard(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex < proofReviews.length - 1 ? activeIndex + 1 : 0;
    scrollToCard(newIndex);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cards = Array.from(container.querySelectorAll('[data-card]')) as HTMLElement[];

      // Find card closest to center of viewport
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - containerCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    }
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">

        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Verified Proof
          </h2>
          <p className="text-lg text-charcoal/80">
            Real clients, real results—no fabrication
          </p>
        </div>

        {/* Card Container with Navigation */}
        <div className="relative max-w-4xl mx-auto">
          {/* Arrow Navigation (desktop only) */}
          {proofReviews.length > 1 && (
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

          {/* Scrollable Cards */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              touchAction: 'pan-x',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {proofReviews.map((review) => (
              <div
                key={review.id}
                data-card
                className="flex-shrink-0 w-[90%] md:w-full snap-center"
              >
                <div className="bg-white rounded-xl p-8 md:p-10 shadow-sm border border-sand-200 h-full">
                  <blockquote className="mb-6">
                    <p className="text-base md:text-lg text-navy leading-relaxed tracking-tight">
                      &quot;{review.excerpt}&quot;
                    </p>
                  </blockquote>
                  <cite className="text-xs text-charcoal/70 not-italic">
                    <span className="font-medium text-charcoal/80">— {review.name}</span>
                    {review.title && `, ${review.title}`}
                  </cite>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators (only show if multiple cards) */}
        {proofReviews.length > 1 && (
          <div className="flex justify-center gap-3 mt-6">
            {proofReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
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

      </div>
    </section>
  );
}
