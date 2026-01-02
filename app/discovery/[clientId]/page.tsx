'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { QuestionnaireContainer } from '@/components/questionnaire';
import ErrorBoundary from '@/components/questionnaire/ErrorBoundary';
import { jackieDeleonQuestionnaire, eliteDiscoveryQuestionnaire } from '@/lib/questionnaire';
import Container from '@/components/layout/Container';
import Link from 'next/link';

// In production, you'd fetch this from a database/API
const questionnaires: Record<string, typeof jackieDeleonQuestionnaire> = {
  // Generic templates
  'elite-discovery': eliteDiscoveryQuestionnaire,
  // Client-specific (legacy)
  'jdeleon': jackieDeleonQuestionnaire,
  'jackie-deleon-dec-2025': jackieDeleonQuestionnaire,
};

export default function DiscoveryPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const questionnaire = questionnaires[clientId];

  // Check for prefers-reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!questionnaire) {
    return (
      <>
        {/* Skip to main content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <div id="main-content" className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628] flex items-center justify-center">
          <Container>
            <div className="bg-[#0d1f3c] border border-[#1a3a5a] rounded-3xl p-12 max-w-md mx-auto text-center">
              <div className="text-6xl mb-6">🔒</div>
              <h1 className="text-2xl font-serif font-bold text-gold mb-4">
                Questionnaire Not Found
              </h1>
              <p className="text-gray-200 mb-8">
                This discovery questionnaire does not exist or has expired.
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-gradient-to-r from-gold to-gold/80 text-[#0a1628] font-medium rounded-xl hover:from-gold/90 hover:to-gold/70 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </Container>
        </div>
      </>
    );
  }

  const handleComplete = (_responses: Record<string, unknown>) => {
    // In production, you'd send this to your backend
    // Responses are already synced to Supabase via useQuestionnaireSync hook

    // Show accessible completion message
    setShowCompletionMessage(true);
  };

  return (
    <ErrorBoundary>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {showCompletionMessage ? (
        <div id="main-content" className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628] flex items-center justify-center p-4">
          <Container>
            <div
              role="alert"
              aria-live="polite"
              className="bg-[#0d1f3c] border border-gold/30 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto text-center shadow-2xl"
            >
              <div className="text-6xl mb-6" aria-hidden="true">
                🎉
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gold mb-4">
                Thank You!
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Your responses have been saved. We will begin the next phase of your career transformation.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-gold to-gold/80 text-[#0a1628] font-medium rounded-xl hover:from-gold/90 hover:to-gold/70 transition-colors min-h-[44px]"
              >
                Return Home
              </Link>
            </div>
          </Container>
        </div>
      ) : (
        <div id="main-content">
          <QuestionnaireContainer
            questionnaire={questionnaire}
            clientId={clientId}
            onComplete={handleComplete}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
      )}
    </ErrorBoundary>
  );
}
