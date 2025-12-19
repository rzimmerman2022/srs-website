'use client';

import { useEffect, useState } from 'react';
import { Milestone } from '@/lib/questionnaire/types';
import { cn } from '@/lib/utils';

interface MilestoneModalProps {
  milestone: Milestone | null;
  onClose: () => void;
}

export default function MilestoneModal({ milestone, onClose }: MilestoneModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (milestone) {
      setIsVisible(true);
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [milestone, onClose]);

  if (!milestone) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300',
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
        className={cn(
          'relative glass rounded-3xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl transition-all duration-500',
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        )}
      >
        {/* Confetti animation placeholder - in production you'd use a library */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-navy rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="absolute top-0 left-3/4 w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* Celebration emoji */}
        <div className="text-7xl mb-6 animate-pulse">
          {milestone.celebrationEmoji}
        </div>

        {/* Title */}
        <h3 className="text-3xl font-serif font-bold text-navy mb-3">
          {milestone.title}
        </h3>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-6">
          {milestone.description}
        </p>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 text-gold font-semibold">
          <span className="text-2xl">{milestone.threshold}%</span>
          <span className="text-gray-500">complete</span>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="mt-8 px-8 py-3 bg-navy text-white font-medium rounded-xl hover:bg-navy/90 transition-colors relative z-10 cursor-pointer"
        >
          Keep Going
        </button>
      </div>
    </div>
  );
}
