'use client';

import { useEffect, useState, useRef } from 'react';
import { Milestone } from '@/lib/questionnaire/types';
import { UI_TIMING } from '@/lib/questionnaire/config';
import { cn } from '@/lib/utils';

interface MilestoneModalProps {
  milestone: Milestone | null;
  onClose: () => void;
  prefersReducedMotion?: boolean;
}

export default function MilestoneModal({ milestone, onClose, prefersReducedMotion = false }: MilestoneModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap - prevent Tab from leaving modal
  useEffect(() => {
    if (!milestone || !isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape') {
        handleClose();
        return;
      }

      // Handle Tab key for focus trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift+Tab - moving backwards
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab - moving forwards
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [milestone, isVisible]);

  // Focus management and auto-close timer
  useEffect(() => {
    if (milestone) {
      setIsVisible(true);
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus the close button when modal opens (Q-CQ-05: Use config constants)
      const focusTimer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, UI_TIMING.MILESTONE_MODAL.FOCUS_DELAY);

      // Auto-close timer (Q-CQ-05: Use config constants)
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, UI_TIMING.MILESTONE_MODAL.AUTO_CLOSE_DELAY);

      return () => {
        clearTimeout(focusTimer);
        clearTimeout(autoCloseTimer);
      };
    }
  }, [milestone]);

  // Handle close with focus restoration
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      // Return focus to previous element
      previousFocusRef.current?.focus();
    }, UI_TIMING.MILESTONE_MODAL.CLOSE_FADE_DELAY);
  };

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
        onClick={handleClose}
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
        {!prefersReducedMotion && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-navy rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="absolute top-0 left-3/4 w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        )}

        {/* Celebration emoji */}
        <div className={cn("text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6", !prefersReducedMotion && "animate-pulse")}>
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
          <span className="text-gray-600 text-sm sm:text-base">complete</span>
        </div>

        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 bg-navy text-white font-medium rounded-xl hover:bg-navy/90 transition-colors relative z-10 cursor-pointer min-h-[44px] text-sm sm:text-base"
        >
          Keep Going
        </button>
      </div>
    </div>
  );
}
