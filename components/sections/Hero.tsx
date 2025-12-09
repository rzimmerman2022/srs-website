import { ReactNode } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Container from '@/components/layout/Container';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  gradient?: boolean;
  children?: ReactNode;
}

export default function Hero({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  gradient = true,
  children,
}: HeroProps) {
  const gradientStyles = gradient
    ? 'bg-gradient-to-br from-sand via-white to-sand-100'
    : 'bg-white';

  return (
    <section className={`relative ${gradientStyles} overflow-hidden`}>
      {/* Decorative elements */}
      {gradient && (
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
      )}

      <Container className="relative section-padding">
        <div className="max-w-4xl mx-auto text-center">
          {subtitle && (
            <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4">
              {subtitle}
            </p>
          )}

          <h1 className="mb-6">{title}</h1>

          {description && (
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}

          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {primaryCTA && (
                <Link href={primaryCTA.href}>
                  <Button variant="primary" size="lg">
                    {primaryCTA.text}
                  </Button>
                </Link>
              )}
              {secondaryCTA && (
                <Link href={secondaryCTA.href}>
                  <Button variant="outline" size="lg">
                    {secondaryCTA.text}
                  </Button>
                </Link>
              )}
            </div>
          )}

          {children}
        </div>
      </Container>
    </section>
  );
}
