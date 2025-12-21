'use client';

import Link from 'next/link';
import Image from 'next/image';
import { withBasePath } from '@/lib/paths';
import { trackEmailClick, trackPhoneClick } from '@/lib/analytics';

const footerNavigation = {
  services: [
    { name: 'Resume Writing', href: '/services#resume' },
    { name: 'LinkedIn Optimization', href: '/services#linkedin' },
    { name: 'Interview Coaching', href: '/services#interview' },
    { name: 'Career Strategy', href: '/services#strategy' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Process', href: '/process' },
    { name: 'Methodology', href: '/methodology' },
    { name: 'Results', href: '/results' },
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

// Static year to prevent hydration mismatch (server/client time difference)
const CURRENT_YEAR = 2025;

export default function Footer() {

  return (
    <footer className="bg-navy text-sand" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src={withBasePath('/assets/logos/srs-logo.png')}
                  alt="Southwest Resume Services"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-white font-serif font-semibold leading-tight">
                  Southwest Resume Services
                </div>
                <div className="text-gold text-xs uppercase tracking-wider">
                  Your Career, Elevated
                </div>
              </div>
            </div>
            <p className="text-sm text-sand-300 max-w-xs">
              Professional resume writing and career coaching based in Chandler, Arizona.
              Serving Phoenix, Scottsdale, Mesa, Tempe, and the greater Arizona area with
              research-backed career documents.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerNavigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-sand-300 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy rounded"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-sand-300 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy rounded"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-sand-300 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy rounded"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@southwestresumes.com"
                  onClick={trackEmailClick}
                  className="text-sm text-sand-300 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy rounded"
                >
                  info@southwestresumes.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+14803743418"
                  onClick={trackPhoneClick}
                  className="text-sm text-sand-300 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy rounded"
                >
                  (480) 374-3418
                </a>
              </li>
              <li className="text-sm text-sand-300">
                1111 N Mission Park Blvd #2016
                <br />
                Chandler, AZ 85224
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges Row */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-10 py-6 border-t border-navy-600">
          <span className="inline-flex items-center gap-2 text-sm text-sand-300">
            <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            5.0 Google Rating
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-sand-300">
            <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Research Validated
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-sand-300">
            <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Arizona Local
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-navy-600">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-sand-400">
              &copy; {CURRENT_YEAR} Southwest Resume Services, LLC. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {footerNavigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-sand-400 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy rounded"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
