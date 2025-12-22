'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function AdminLoginRateLimitedPage() {
  const router = useRouter();
  const [retryTime, setRetryTime] = useState(15 * 60); // 15 minutes in seconds

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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? '' : 's'}${
        remainingSeconds > 0 ? ` and ${remainingSeconds} second${remainingSeconds === 1 ? '' : 's'}` : ''
      }`;
    }

    return `${remainingSeconds} second${remainingSeconds === 1 ? '' : 's'}`;
  };

  const handleRetry = () => {
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy mb-2">
            Too Many Attempts
          </h1>
          <p className="text-gray-600">
            Southwest Resume Services
          </p>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle as="h2" className="text-xl text-center text-red-600">
              Access Temporarily Restricted
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-6">
              <p className="text-gray-700 mb-4">
                You have exceeded the maximum number of login attempts.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                For security reasons, access to the admin login page has been temporarily restricted.
              </p>

              {retryTime > 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium">
                    Please wait {formatTime(retryTime)} before trying again.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    You can now try logging in again.
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
              {retryTime > 0 ? `Retry in ${formatTime(retryTime)}` : 'Try Again'}
            </Button>

            {/* Security Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Security Information
              </h3>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Maximum 5 failed login attempts per 15 minutes</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>All login attempts are logged and monitored</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Rate limiting protects against brute force attacks</span>
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                If you believe this is an error, please contact support at{' '}
                <a
                  href="mailto:admin@southwestresumeservices.com"
                  className="text-gold hover:text-gold-600 transition-colors"
                >
                  admin@southwestresumeservices.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
