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
    'Professional resume writing services in Phoenix, Arizona. Expert career coaching, LinkedIn optimization, and interview preparation for job seekers across the Phoenix metro area including Scottsdale, Mesa, Tempe, and Chandler.',
  keywords: [
    'resume writing services Phoenix',
    'Phoenix resume writer',
    'Arizona career coach',
    'Scottsdale resume services',
    'Mesa professional resume',
    'career services Arizona',
    'LinkedIn optimization Phoenix',
    'interview coaching Arizona',
    'Phoenix career strategy',
    'Arizona resume services',
    'professional resume writer Phoenix AZ',
    'executive resume writer Phoenix',
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
      'Professional resume writing services in Phoenix, Arizona. Expert career coaching and LinkedIn optimization.',
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
    // Google Search Console verification code will be added after domain is verified
    // Instructions: https://search.google.com/search-console
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * BreadcrumbList Schema for Site Navigation
   * Helps search engines understand site structure
   * Follows Google Rich Results guidelines for Breadcrumb markup
   */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://southwestresumes.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://southwestresumes.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Our Process',
        item: 'https://southwestresumes.com/process',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'About',
        item: 'https://southwestresumes.com/about',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Contact',
        item: 'https://southwestresumes.com/contact',
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'FAQ',
        item: 'https://southwestresumes.com/faq',
      },
      {
        '@type': 'ListItem',
        position: 7,
        name: 'Privacy Policy',
        item: 'https://southwestresumes.com/privacy',
      },
      {
        '@type': 'ListItem',
        position: 8,
        name: 'Terms of Service',
        item: 'https://southwestresumes.com/terms',
      },
    ],
  };

  // LocalBusiness structured data for SEO
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Southwest Resume Services',
    alternateName: 'Southwest Resume Services, LLC',
    description: 'Professional resume writing, LinkedIn optimization, and career coaching services in Arizona. Research-backed career documents for Phoenix, Scottsdale, Mesa, and nationwide.',
    url: 'https://southwestresumes.com',
    telephone: '+1-480-374-3418',
    email: 'info@southwestresumes.com',
    priceRange: '$$',
    areaServed: [
      {
        '@type': 'State',
        name: 'Arizona',
      },
      {
        '@type': 'City',
        name: 'Phoenix',
        containedInPlace: {
          '@type': 'State',
          name: 'Arizona',
        },
      },
      {
        '@type': 'City',
        name: 'Scottsdale',
        containedInPlace: {
          '@type': 'State',
          name: 'Arizona',
        },
      },
      {
        '@type': 'City',
        name: 'Mesa',
        containedInPlace: {
          '@type': 'State',
          name: 'Arizona',
        },
      },
      {
        '@type': 'City',
        name: 'Tempe',
        containedInPlace: {
          '@type': 'State',
          name: 'Arizona',
        },
      },
      {
        '@type': 'City',
        name: 'Chandler',
        containedInPlace: {
          '@type': 'State',
          name: 'Arizona',
        },
      },
      {
        '@type': 'Country',
        name: 'United States',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1111 N Mission Park Blvd #2016',
      addressLocality: 'Chandler',
      addressRegion: 'AZ',
      postalCode: '85224',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.3062,
      longitude: -111.8413,
    },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 33.3062,
        longitude: -111.8413,
      },
      geoRadius: '50000',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Career Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Resume Writing Services',
            description: 'Professional resume writing and optimization',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'LinkedIn Optimization',
            description: 'LinkedIn profile optimization and strategy',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Interview Coaching',
            description: 'Interview preparation and coaching',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Career Strategy Consulting',
            description: 'Career transition and strategy planning',
          },
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '3',
      bestRating: '5',
      worstRating: '1',
    },
    founder: {
      '@type': 'Person',
      name: 'Ryan Zimmerman',
      jobTitle: 'Founder & Principal Consultant',
    },
    sameAs: [
      'https://www.google.com/search?q=Southwest+Resume+Services',
    ],
  };

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
          @media(min-width:768px){.md\\:grid-cols-3{grid-template-columns:repeat(3,1fr)}.section-padding{padding:5rem 0}}
        `}} />

        {/* BreadcrumbList Structured Data */}
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          strategy="beforeInteractive"
        />

        {/* LocalBusiness Structured Data */}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
          strategy="beforeInteractive"
        />

        {/* Google Analytics 4 */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
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
