'use client';

/**
 * PointsPopup Component
 *
 * Displays an animated popup when points are earned.
 *
 * Performance Note (Q-PERF-20):
 * This component should be dynamically imported in the parent component to reduce
 * initial bundle size since it's not visible on first render.
 *
 * Example usage in parent:
 * const PointsPopup = dynamic(() => import('./PointsPopup'), { ssr: false });
 */

import { useEffect, useState, useCallback } from 'react';
import { UI_TIMING } from '@/lib/questionnaire/config';

interface PointsPopupProps {
  points: number;
  show: boolean;
  onComplete: () => void;
  prefersReducedMotion?: boolean;
}

export default function PointsPopup({ points, show, onComplete, prefersReducedMotion = false }: PointsPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'pop' | 'float' | 'fade'>('idle');

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (!show) {
      // Reset when show becomes false
      setAnimationPhase('idle');
      setIsVisible(false);
      return;
    }

    // Only start animation if we're idle and show is true
    if (show && animationPhase === 'idle') {
      setIsVisible(true);
      setAnimationPhase('pop');

      // Create timeouts with cleanup to prevent memory leaks (Q-CQ-05: Use config constants)
      const timer1 = setTimeout(() => setAnimationPhase('float'), UI_TIMING.POINTS_POPUP.FLOAT_DELAY);
      const timer2 = setTimeout(() => setAnimationPhase('fade'), UI_TIMING.POINTS_POPUP.FADE_DELAY);
      const timer3 = setTimeout(() => {
        setAnimationPhase('idle');
        setIsVisible(false);
        handleComplete();
      }, UI_TIMING.POINTS_POPUP.COMPLETE_DELAY);

      // Cleanup function to clear all timeouts if component unmounts or deps change
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
    // Note: animationPhase is intentionally excluded from dependencies to prevent
    // re-triggering the animation when state updates occur during the animation sequence.
    // This is safe because we explicitly check for 'idle' state before starting animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, handleComplete]);

  if (!isVisible) return null;

  const getAnimationStyles = () => {
    // If reduced motion is preferred, use simpler fade-only animations
    if (prefersReducedMotion) {
      switch (animationPhase) {
        case 'pop':
        case 'float':
          return {
            transform: 'translateY(0) scale(1)',
            opacity: 1,
          };
        case 'fade':
          return {
            transform: 'translateY(0) scale(1)',
            opacity: 0,
          };
        default:
          return {
            transform: 'translateY(0) scale(1)',
            opacity: 0,
          };
      }
    }

    // Full animations for users who don't prefer reduced motion
    switch (animationPhase) {
      case 'pop':
        return {
          transform: 'translateY(0) scale(1.4)',
          opacity: 1,
        };
      case 'float':
        return {
          transform: 'translateY(-40px) scale(1.2)',
          opacity: 1,
        };
      case 'fade':
        return {
          transform: 'translateY(-100px) scale(0.9)',
          opacity: 0,
        };
      default:
        return {
          transform: 'translateY(20px) scale(0.5)',
          opacity: 0,
        };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center px-4">
      <div
        className="transition-all duration-300 ease-out"
        style={getAnimationStyles()}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="relative">
          {/* Glow pulse effect */}
          {!prefersReducedMotion && (
            <div
              className="absolute inset-0 bg-amber-400/40 blur-xl sm:blur-2xl rounded-full animate-pulse"
              style={{ transform: 'scale(2)' }}
              aria-hidden="true"
            />
          )}

          {/* Main badge */}
          <div className="relative flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-xl sm:rounded-2xl shadow-2xl">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-xl sm:rounded-2xl" aria-hidden="true" />

            {/* Points text */}
            <span
              className="relative text-2xl sm:text-3xl md:text-4xl font-black text-white"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.5)'
              }}
            >
              +{points}
            </span>

            {/* Screen reader text */}
            <span className="sr-only">You earned {points} points</span>

            {/* Fire icon with bounce */}
            <span
              className="relative text-xl sm:text-2xl md:text-3xl"
              style={{
                animation: prefersReducedMotion ? 'none' : 'bounce 0.3s ease-in-out infinite',
                filter: 'drop-shadow(0 0 10px rgba(255,150,0,0.8))'
              }}
              aria-hidden="true"
            >
              🔥
            </span>
          </div>

          {/* Sparkle particles */}
          {!prefersReducedMotion && animationPhase !== 'idle' && (
            <>
              <span
                className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 text-xl sm:text-2xl"
                style={{
                  animation: 'ping 0.5s ease-out forwards',
                  animationDelay: '0ms'
                }}
                aria-hidden="true"
              >
                ✨
              </span>
              <span
                className="absolute -top-2 -right-4 sm:-right-6 text-lg sm:text-xl"
                style={{
                  animation: 'ping 0.5s ease-out forwards',
                  animationDelay: '100ms'
                }}
                aria-hidden="true"
              >
                ✨
              </span>
              <span
                className="absolute -bottom-2 sm:-bottom-3 left-1/4 text-base sm:text-lg"
                style={{
                  animation: 'ping 0.5s ease-out forwards',
                  animationDelay: '200ms'
                }}
                aria-hidden="true"
              >
                ✨
              </span>
              <span
                className="absolute -bottom-2 right-1/4 text-lg sm:text-xl"
                style={{
                  animation: 'ping 0.5s ease-out forwards',
                  animationDelay: '150ms'
                }}
                aria-hidden="true"
              >
                ⭐
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
