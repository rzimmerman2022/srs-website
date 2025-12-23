import type { Metadata } from 'next';

// CRITICAL: Discovery pages must NEVER be indexed by search engines
// These are private client questionnaires accessible only to:
// - The specific client
// - Admin team
// - Business owner
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

export default function DiscoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
