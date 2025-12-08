import Link from 'next/link';

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
    { name: 'Results', href: '/results' },
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
              <div className="w-10 h-10 bg-navy-600 rounded-full flex items-center justify-center border-2 border-gold">
                <span className="text-gold font-serif font-bold text-lg">SRS</span>
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
              Premium career services and resume optimization based in Arizona.
              Research-backed, authentically crafted career documents that elevate
              your professional journey.
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
                    className="text-sm text-sand-300 hover:text-gold transition-colors"
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
                    className="text-sm text-sand-300 hover:text-gold transition-colors"
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
                  className="text-sm text-sand-300 hover:text-gold transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@southwestresumes.com"
                  className="text-sm text-sand-300 hover:text-gold transition-colors"
                >
                  info@southwestresumes.com
                </a>
              </li>
              {/* TODO: Add phone number and location if provided */}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-navy-600">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-sand-400">
              &copy; {currentYear} Southwest Resume Services, LLC. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {footerNavigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-sand-400 hover:text-gold transition-colors"
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
