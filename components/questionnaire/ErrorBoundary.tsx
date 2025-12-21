'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('Questionnaire Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Reload the page to reset state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-sand-100 flex items-center justify-center px-4">
          <div className="glass rounded-3xl p-8 md:p-12 shadow-premium max-w-2xl text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-serif font-bold text-navy mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We encountered an unexpected error while processing your questionnaire.
              Don&apos;t worry - your progress has been saved automatically.
            </p>
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-left">
                <p className="text-xs font-mono text-red-800 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-8 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-all shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
              <a
                href="/contact"
                className="px-8 py-3 bg-sand-200 text-navy font-semibold rounded-xl hover:bg-sand-300 transition-all"
              >
                Contact Support
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              If this problem persists, please contact us with the details above.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
