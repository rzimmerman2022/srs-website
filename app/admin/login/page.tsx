'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check for rate limiting
        if (response.status === 429) {
          router.push('/admin/login/rate-limited');
          return;
        }

        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Success - redirect to admin dashboard
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-sand-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and heading */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-navy font-bold text-2xl">SR</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-navy mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">
            Southwest Resume Services
          </p>
        </div>

        {/* Login form */}
        <div className="glass rounded-3xl p-8 shadow-premium">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
                role="alert"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-navy mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                placeholder="admin@example.com"
                aria-describedby={error ? 'error-message' : undefined}
              />
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-navy mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                placeholder="Enter your password"
                aria-describedby={error ? 'error-message' : undefined}
              />
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                disabled={loading}
                className="h-5 w-5 text-gold border-gray-300 rounded focus:ring-gold focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Forgot password link */}
          <div className="mt-6 text-center">
            <button
              type="button"
              disabled={loading}
              className="text-sm text-gray-600 hover:text-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            This is a secure admin area. All login attempts are logged.
            <br />
            Maximum 5 failed attempts per 15 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
