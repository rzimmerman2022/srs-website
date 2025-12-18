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
  gradient: _gradient = true, // Kept for compatibility
  children,
}: HeroProps) {
  return (
    <section className="relative bg-navy overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Right Gold Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3 opacity-60" />
        {/* Bottom Left Blue Glow */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3 opacity-40" />
        {/* Subtle Texture/Noise could go here */}
      </div>

      <Container className="relative z-10 section-padding">
        <div className="max-w-5xl mx-auto text-center">
          {subtitle && (
            <div className="inline-block px-6 py-2 rounded-full bg-white/5 text-gold text-sm font-semibold mb-8 border border-white/10 backdrop-blur-md shadow-lg animate-fade-in-up">
              {subtitle}
            </div>
          )}

          <h1 className="mb-8 text-white text-5xl md:text-6xl lg:text-7xl leading-tight font-serif tracking-tight drop-shadow-lg">
            {title}
          </h1>

          {description && (
            <p className="text-xl md:text-2xl text-sand-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light text-balance opacity-90">
              {description}
            </p>
          )}

          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              {primaryCTA && (
                <Link href={primaryCTA.href}>
                  <Button variant="primary" size="lg" className="text-lg px-10 shadow-gold/20 h-14 min-w-[200px]">
                    {primaryCTA.text}
                  </Button>
                </Link>
              )}
              {secondaryCTA && (
                <Link href={secondaryCTA.href}>
                  <Button variant="outline" size="lg" className="text-lg px-10 border-white/20 text-white hover:bg-white hover:text-navy h-14 min-w-[200px] backdrop-blur-sm bg-white/5">
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
