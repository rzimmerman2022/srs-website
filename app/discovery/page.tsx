'use client';

import Container from '@/components/layout/Container';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DiscoveryIndexPage() {
  const router = useRouter();
  const [clientId, setClientId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientId.trim()) {
      router.push(`/discovery/${clientId.trim().toLowerCase()}`);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-sand-100">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        </div>

        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1 bg-gold/10 text-gold text-sm font-semibold rounded-full mb-6">
              Strategic Placement Diagnostic
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">
              Your Discovery Questionnaire
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              This personalized questionnaire captures the truth of your professional experience
              so we can build a career portfolio that&apos;s both powerful and authentically yours.
            </p>
          </div>
        </Container>
      </section>

      {/* Access Form */}
      <section className="py-16">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="glass rounded-3xl p-8 shadow-premium">
              <h2 className="text-2xl font-serif font-bold text-navy mb-6 text-center">
                Access Your Questionnaire
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-2">
                    Client ID
                  </label>
                  <input
                    type="text"
                    id="clientId"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Enter your client ID"
                    className="w-full px-4 py-3 rounded-xl border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                  <p className="mt-2 text-sm text-charcoal/70">
                    Your client ID was provided in your welcome email.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-colors shadow-lg hover:shadow-xl"
                >
                  Access Questionnaire
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-sand-200 text-center">
                <p className="text-sm text-charcoal/70 mb-4">
                  Don&apos;t have a client ID yet?
                </p>
                <Link
                  href="/contact"
                  className="text-gold font-medium hover:underline"
                >
                  Get Started with SRS →
                </Link>
              </div>
            </div>

            {/* Demo Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-charcoal/70 mb-2">Demo access:</p>
              <Link
                href="/discovery/jdeleon"
                className="text-navy font-medium hover:text-gold transition-colors"
              >
                View Sample Questionnaire →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-navy mb-12 text-center">
              What to Expect
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gold/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  Thoughtful Questions
                </h3>
                <p className="text-gray-600 text-sm">
                  Each question is designed to uncover specific proof points that strengthen your positioning.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gold/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">💾</span>
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  Auto-Save Progress
                </h3>
                <p className="text-gray-600 text-sm">
                  Your answers are automatically saved. Take breaks and return anytime.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gold/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  Clear Guidance
                </h3>
                <p className="text-gray-600 text-sm">
                  We explain why each question matters and provide examples to help you answer.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
