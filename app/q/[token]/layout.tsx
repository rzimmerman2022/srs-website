import type { Metadata } from 'next';

/**
 * CRITICAL SEO BLOCKING: Questionnaire pages must NEVER be indexed by search engines
 * These are private client questionnaires accessible only to:
 * - The specific client (via unique token)
 * - Admin team
 * - Business owner
 *
 * Multiple layers of protection:
 * 1. robots.txt blocks /q and /q/*
 * 2. This metadata sets noindex/nofollow
 * 3. Middleware adds X-Robots-Tag headers
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
  // Prevent any sharing/preview metadata
  openGraph: undefined,
  twitter: undefined,
};

export default function QuestionnaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
