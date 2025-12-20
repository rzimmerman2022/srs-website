'use client';

import { useParams } from 'next/navigation';
import { QuestionnaireContainer } from '@/components/questionnaire';
import ErrorBoundary from '@/components/questionnaire/ErrorBoundary';
import { jackieDeleonQuestionnaire } from '@/lib/questionnaire';
import Container from '@/components/layout/Container';
import Link from 'next/link';

// In production, you'd fetch this from a database/API
const questionnaires: Record<string, typeof jackieDeleonQuestionnaire> = {
  'jdeleon': jackieDeleonQuestionnaire,
};

export default function DiscoveryPage() {
  const params = useParams();
  const clientId = params.clientId as string;

  const questionnaire = questionnaires[clientId];

  if (!questionnaire) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628] flex items-center justify-center">
        <Container>
          <div className="bg-[#0d1f3c] border border-[#1a3a5a] rounded-3xl p-12 max-w-md mx-auto text-center">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-2xl font-serif font-bold text-gold mb-4">
              Questionnaire Not Found
            </h1>
            <p className="text-gray-400 mb-8">
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
    );
  }

  const handleComplete = (responses: Record<string, unknown>) => {
    // In production, you'd send this to your backend
    if (process.env.NODE_ENV === 'development') {
      console.log('Questionnaire completed:', responses);
    }

    // For now, just show an alert
    alert('Thank you! Your responses have been saved. We will begin the next phase of your career transformation.');
  };

  return (
    <ErrorBoundary>
      <QuestionnaireContainer
        questionnaire={questionnaire}
        clientId={clientId}
        onComplete={handleComplete}
      />
    </ErrorBoundary>
  );
}
