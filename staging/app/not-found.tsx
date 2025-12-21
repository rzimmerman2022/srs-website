/**
 * 404 Not Found Page
 * Custom error page for missing routes
 */

import Link from 'next/link';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist or has been moved.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="section-padding bg-white min-h-[60vh] flex items-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-serif font-bold text-gold mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-serif text-navy mb-6">Page Not Found</h2>
            <p className="text-lg text-gray-700 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/">
              <Button variant="primary" size="lg">
                Go to Homepage
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>

          <div className="bg-sand-50 p-8 rounded-xl">
            <h3 className="text-xl font-serif font-semibold text-navy mb-4">
              Looking for something specific?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <Link href="/services" className="text-navy hover:text-gold transition-colors font-medium">
                Services & Pricing
              </Link>
              <Link href="/process" className="text-navy hover:text-gold transition-colors font-medium">
                Our Process
              </Link>
              <Link href="/about" className="text-navy hover:text-gold transition-colors font-medium">
                About Us
              </Link>
              <Link href="/faq" className="text-navy hover:text-gold transition-colors font-medium">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
