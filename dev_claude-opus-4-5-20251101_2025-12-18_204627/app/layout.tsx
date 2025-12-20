import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        {/* Critical inline CSS fallback */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root{--font-inter:'Inter',system-ui,sans-serif;--font-playfair:'Playfair Display',Georgia,serif}
          body{margin:0;font-family:var(--font-inter);background:#fff;color:#2d2d2d;line-height:1.6}
          h1,h2,h3,h4,h5,h6{font-family:var(--font-playfair);color:#1a2332;font-weight:600}
          .bg-navy{background-color:#1a2332}.bg-sand-50{background-color:#fdfcf9}.bg-white{background-color:#fff}
          .text-white{color:#fff}.text-gold{color:#d4af37}.text-navy{color:#1a2332}
          .container-custom{max-width:80rem;margin:0 auto;padding:0 1rem}
          .section-padding{padding:6rem 0}
          .btn{display:inline-flex;align-items:center;justify-content:center;padding:1rem 2rem;border-radius:.5rem;font-weight:500;transition:all .3s}
          .btn-primary{background:#d4af37;color:#1a2332}.btn-outline{border:2px solid #d4af37;color:#d4af37}
          .grid{display:grid}.gap-8{gap:2rem}
          @media(min-width:768px){.md\\:grid-cols-3{grid-template-columns:repeat(3,1fr)}.section-padding{padding:10rem 0}}
        `}} />
        {/* Google Analytics 4 */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body suppressHydrationWarning>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
