'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function QuestionnaireTokenPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/questionnaire/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - redirect to rate limited page
          router.push('/q/rate-limited');
          return;
        }

        setError(data.error || 'Invalid token');
        setLoading(false);
        return;
      }

      // Success - redirect to questionnaire
      const { clientId, questionnaireId } = data;
      router.push(`/discovery/${clientId}?q=${questionnaireId}`);
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy mb-2">
            Access Questionnaire
          </h1>
          <p className="text-gray-600">
            Enter your unique access token to begin
          </p>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle as="h2" className="text-xl text-center">
              Enter Access Token
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Token Input */}
              <div>
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Access Token
                </label>
                <input
                  type="text"
                  id="token"
                  name="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value.trim())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent font-mono"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  required
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-gray-500">
                  The access token was provided in your invitation email
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Access Questionnaire'}
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Need help? Contact us at{' '}
                <a
                  href="mailto:support@southwestresumeservices.com"
                  className="text-gold hover:text-gold-600 transition-colors"
                >
                  support@southwestresumeservices.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
