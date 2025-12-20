'use client';

import { useEffect, useState, useRef } from 'react';
import { Milestone } from '@/lib/questionnaire/types';
import { cn } from '@/lib/utils';

interface MilestoneModalProps {
  milestone: Milestone | null;
  onClose: () => void;
}

export default function MilestoneModal({ milestone, onClose }: MilestoneModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }
    };
    if (milestone) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [milestone, onClose]);

  // Focus management
  useEffect(() => {
    if (milestone) {
      setIsVisible(true);
      // Store current focus and move focus to modal
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
          // Return focus to previous element
          previousFocusRef.current?.focus();
        }, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [milestone, onClose]);

  if (!milestone) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 transition-all duration-300',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="milestone-title"
        tabIndex={-1}
        className={cn(
          'relative glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 max-w-md w-full text-center shadow-2xl transition-all duration-500',
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        )}
      >
        {/* Confetti animation placeholder - in production you'd use a library */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-navy rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="absolute top-0 left-3/4 w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* Celebration emoji */}
        <div className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6 animate-pulse">
          {milestone.celebrationEmoji}
        </div>

        {/* Title */}
        <h3 id="milestone-title" className="text-2xl sm:text-3xl font-serif font-bold text-navy mb-2 sm:mb-3">
          {milestone.title}
        </h3>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
          {milestone.description}
        </p>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 text-gold font-semibold">
          <span className="text-xl sm:text-2xl">{milestone.threshold}%</span>
          <span className="text-gray-500 text-sm sm:text-base">complete</span>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 bg-navy text-white font-medium rounded-xl hover:bg-navy/90 transition-colors relative z-10 cursor-pointer min-h-[44px] text-sm sm:text-base"
        >
          Keep Going
        </button>
      </div>
    </div>
  );
}
