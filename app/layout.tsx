import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://southwestresumes.com'),
  title: {
    default: 'Southwest Resume Services | Your Career, Elevated.',
    template: '%s | Southwest Resume Services',
  },
  description:
    'Premium career services and resume optimization based in Arizona. Expert resume writing, LinkedIn optimization, interview coaching, and career strategy to elevate your professional journey.',
  keywords: [
    'resume writing',
    'career services',
    'LinkedIn optimization',
    'interview coaching',
    'Arizona resume services',
    'professional resume writer',
    'career strategy',
  ],
  authors: [{ name: 'Southwest Resume Services' }],
  creator: 'Southwest Resume Services',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://southwestresumes.com',
    siteName: 'Southwest Resume Services',
    title: 'Southwest Resume Services | Your Career, Elevated.',
    description:
      'Premium career services and resume optimization based in Arizona. Expert resume writing, LinkedIn optimization, and career strategy.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Southwest Resume Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Southwest Resume Services | Your Career, Elevated.',
    description:
      'Premium career services and resume optimization based in Arizona.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // TODO: Add Google Search Console verification after domain setup
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
