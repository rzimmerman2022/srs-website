'use client';

import { useEffect, useState, useCallback } from 'react';

interface PointsPopupProps {
  points: number;
  show: boolean;
  onComplete: () => void;
}

export default function PointsPopup({ points, show, onComplete }: PointsPopupProps) {
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

      // Create timeouts with cleanup to prevent memory leaks
      const timer1 = setTimeout(() => setAnimationPhase('float'), 200);
      const timer2 = setTimeout(() => setAnimationPhase('fade'), 600);
      const timer3 = setTimeout(() => {
        setAnimationPhase('idle');
        setIsVisible(false);
        handleComplete();
      }, 1200);

      // Cleanup function to clear all timeouts if component unmounts
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [show, handleComplete]); // Removed animationPhase from deps to prevent blocking

  if (!isVisible) return null;

  const getAnimationStyles = () => {
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
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      <div
        className="transition-all duration-300 ease-out"
        style={getAnimationStyles()}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="relative">
          {/* Glow pulse effect */}
          <div
            className="absolute inset-0 bg-amber-400/40 blur-2xl rounded-full animate-pulse"
            style={{ transform: 'scale(2)' }}
            aria-hidden="true"
          />

          {/* Main badge */}
          <div className="relative flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-2xl shadow-2xl">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-2xl" aria-hidden="true" />

            {/* Points text */}
            <span
              className="relative text-3xl sm:text-4xl font-black text-white"
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
              className="relative text-2xl sm:text-3xl"
              style={{
                animation: 'bounce 0.3s ease-in-out infinite',
                filter: 'drop-shadow(0 0 10px rgba(255,150,0,0.8))'
              }}
              aria-hidden="true"
            >
              🔥
            </span>
          </div>

          {/* Sparkle particles */}
          {animationPhase !== 'idle' && (
            <>
              <span
                className="absolute -top-4 -left-4 text-2xl"
                style={{
                  animation: 'ping 0.5s ease-out forwards',
                  animationDelay: '0ms'
                }}
              >
                ✨
              </span>
              <span
                className="absolute -top-2 -right-6 text-xl"
                style={{
                  animation: 'ping 0.5s ease-out forwards',
                  animationDelay: '100ms'
                }}
              >
                ✨
              </span>
              <span
                className="absolute -bottom-3 left-1/4 text-lg"
                style={{
                  animation: 'ping 0.5s ease-out forwards',
                  animationDelay: '200ms'
                }}
              >
                ✨
              </span>
              <span
                className="absolute -bottom-2 right-1/4 text-xl"
                style={{
                  animation: 'ping 0.5s ease-out forwards',
                  animationDelay: '150ms'
                }}
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
