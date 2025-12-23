'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function QuestionnaireRateLimitedPage() {
  const router = useRouter();
  const [retryTime, setRetryTime] = useState(60); // 1 minute in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setRetryTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${seconds} second${seconds === 1 ? '' : 's'}`;
  };

  const handleRetry = () => {
    router.push('/q');
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy mb-2">
            Please Wait
          </h1>
          <p className="text-gray-600">
            Too many attempts detected
          </p>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle as="h2" className="text-xl text-center text-amber-600">
              Too Many Token Attempts
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-6">
              <p className="text-gray-700 mb-4">
                You have made too many token verification attempts.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                For security reasons, please wait a moment before trying again.
              </p>

              {retryTime > 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium">
                    Please wait {formatTime(retryTime)}
                  </p>
                  <div className="mt-3">
                    <div className="w-full bg-amber-200 rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${((60 - retryTime) / 60) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    You can now try again.
                  </p>
                </div>
              )}
            </div>

            {/* Retry Button */}
            <Button
              onClick={handleRetry}
              variant="primary"
              size="lg"
              className="w-full justify-center"
              disabled={retryTime > 0}
            >
              {retryTime > 0 ? `Try Again (${formatTime(retryTime)})` : 'Try Again'}
            </Button>

            {/* Help Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Need Help?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    Make sure you are entering the exact token from your invitation email
                  </p>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    Check for any extra spaces or typos in your token
                  </p>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    Tokens are case-sensitive and must match exactly
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs text-blue-800">
                      <strong>Security Notice:</strong> Rate limiting is enabled to protect against unauthorized access.
                      Maximum 10 attempts per minute.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Can&apos;t find your token?{' '}
                <a
                  href="mailto:support@southwestresumeservices.com"
                  className="text-gold hover:text-gold-600 transition-colors"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
