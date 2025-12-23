'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { QuestionnaireContainer } from '@/components/questionnaire';
import ErrorBoundary from '@/components/questionnaire/ErrorBoundary';
import { jackieDeleonQuestionnaire } from '@/lib/questionnaire';
import { verifyQuestionnaireToken } from '@/lib/auth/questionnaire-auth';
import Container from '@/components/layout/Container';
import Link from 'next/link';

/**
 * Secure Token-Based Questionnaire Page
 *
 * This page replaces guessable /discovery/[clientId] URLs with secure token-based access.
 *
 * Security Features:
 * - Verifies token before showing questionnaire
 * - Tracks access (timestamp, count)
 * - Shows error page for invalid/expired tokens
 * - Prevents search engine indexing (via layout metadata)
 *
 * Flow:
 * 1. Extract token from URL parameter
 * 2. Verify token with database
 * 3. If valid: render QuestionnaireContainer
 * 4. If invalid: show error page
 */

// In production, fetch questionnaires from database/API
const questionnaires: Record<string, typeof jackieDeleonQuestionnaire> = {
  'discovery-basic': jackieDeleonQuestionnaire,
};

export default function QuestionnaireTokenPage() {
  const params = useParams();
  const token = params.token as string;

  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [questionnaireId, setQuestionnaireId] = useState<string | null>(null);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Verify token on mount
  useEffect(() => {
    async function verify() {
      try {
        setIsVerifying(true);
        setVerificationError(null);

        const result = await verifyQuestionnaireToken(token);

        if (!result) {
          setVerificationError('invalid');
          return;
        }

        // Token is valid
        setClientId(result.clientId);
        setQuestionnaireId(result.questionnaireId);
      } catch (error) {
        // Log error only in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Error verifying token:', error);
        }
        setVerificationError('error');
      } finally {
        setIsVerifying(false);
      }
    }

    if (token) {
      verify();
    } else {
      setVerificationError('missing');
      setIsVerifying(false);
    }
  }, [token]);

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

  // Loading state
  if (isVerifying) {
    return (
      <>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <div id="main-content" className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628] flex items-center justify-center">
          <Container>
            <div className="bg-[#0d1f3c] border border-[#1a3a5a] rounded-3xl p-12 max-w-md mx-auto text-center">
              <div
                className={prefersReducedMotion ? "w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-6" : "animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-6"}
                role="status"
                aria-label="Verifying access"
              />
              <h1 className="text-2xl font-serif font-bold text-gold mb-4">
                Verifying Access
              </h1>
              <p className="text-gray-200">
                Please wait while we verify your access token...
              </p>
            </div>
          </Container>
        </div>
      </>
    );
  }

  // Error states
  if (verificationError) {
    let errorTitle = 'Invalid or Expired Link';
    let errorMessage = 'This questionnaire link is invalid or has expired.';
    let errorIcon = '🔒';

    if (verificationError === 'missing') {
      errorTitle = 'Missing Access Token';
      errorMessage = 'No access token was provided. Please use the link from your invitation email.';
      errorIcon = '🔑';
    } else if (verificationError === 'error') {
      errorTitle = 'Verification Error';
      errorMessage = 'An error occurred while verifying your access. Please try again or contact support.';
      errorIcon = '⚠️';
    }

    return (
      <>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <div id="main-content" className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628] flex items-center justify-center">
          <Container>
            <div className="bg-[#0d1f3c] border border-[#1a3a5a] rounded-3xl p-12 max-w-md mx-auto text-center">
              <div className="text-6xl mb-6" aria-hidden="true">{errorIcon}</div>
              <h1 className="text-2xl font-serif font-bold text-gold mb-4">
                {errorTitle}
              </h1>
              <p className="text-gray-200 mb-8">
                {errorMessage}
              </p>
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="block px-8 py-3 bg-gradient-to-r from-gold to-gold/80 text-[#0a1628] font-medium rounded-xl hover:from-gold/90 hover:to-gold/70 transition-colors"
                >
                  Contact Support
                </Link>
                <p className="text-sm text-gray-400">
                  If you believe this is an error, please reach out to our team.
                </p>
              </div>
            </div>
          </Container>
        </div>
      </>
    );
  }

  // Get the questionnaire based on questionnaireId
  const questionnaire = questionnaireId ? questionnaires[questionnaireId] : null;

  if (!questionnaire || !clientId) {
    return (
      <>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <div id="main-content" className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628] flex items-center justify-center">
          <Container>
            <div className="bg-[#0d1f3c] border border-[#1a3a5a] rounded-3xl p-12 max-w-md mx-auto text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h1 className="text-2xl font-serif font-bold text-gold mb-4">
                Questionnaire Not Found
              </h1>
              <p className="text-gray-200 mb-8">
                The requested questionnaire could not be found. Please contact support.
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-gradient-to-r from-gold to-gold/80 text-[#0a1628] font-medium rounded-xl hover:from-gold/90 hover:to-gold/70 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </Container>
        </div>
      </>
    );
  }

  const handleComplete = (_responses: Record<string, unknown>) => {
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
                href="/contact"
                className="inline-block px-8 py-3 bg-gradient-to-r from-gold to-gold/80 text-[#0a1628] font-medium rounded-xl hover:from-gold/90 hover:to-gold/70 transition-colors min-h-[44px]"
              >
                Return to Contact
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
