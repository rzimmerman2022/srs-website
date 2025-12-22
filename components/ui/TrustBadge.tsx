import { ReactNode } from 'react';

type TrustBadgeVariant = 'methodology' | 'review' | 'local' | 'metric';
type TrustBadgeSize = 'sm' | 'md' | 'lg';

interface TrustBadgeProps {
  icon: ReactNode;
  label: string;
  sublabel?: string;
  variant?: TrustBadgeVariant;
  size?: TrustBadgeSize;
  href?: string;
  className?: string;
}

/**
 * Fortune 500 Trust Badge Sizes
 * Based on TRUST-BADGE-DESIGN-SPECIFICATION.md
 *
 * | Variant | Height | Icon | Font | Padding | Use Case |
 * |---------|--------|------|------|---------|----------|
 * | SM      | 32px   | 16px | 12px | 6px 10px| Footer, dense layouts |
 * | MD      | 44px   | 20px | 14px | 10px 14px| Standard (default) |
 * | LG      | 56px   | 24px | 16px | 14px 18px| Hero, feature sections |
 */
const sizeStyles: Record<TrustBadgeSize, {
  container: string;
  icon: string;
  label: string;
  sublabel: string;
}> = {
  sm: {
    container: 'gap-2 px-3 py-2 min-h-[32px]',
    icon: 'w-5 h-5',
    label: 'text-xs font-semibold',
    sublabel: 'text-[10px]',
  },
  md: {
    container: 'gap-3 px-4 py-3 min-h-[44px]',
    icon: 'w-6 h-6',
    label: 'text-sm font-semibold',
    sublabel: 'text-xs',
  },
  lg: {
    container: 'gap-4 px-5 py-4 min-h-[56px]',
    icon: 'w-7 h-7',
    label: 'text-base font-bold',
    sublabel: 'text-sm font-medium',
  },
};

const variantStyles: Record<TrustBadgeVariant, string> = {
  methodology: 'bg-navy/5 border-navy/10 text-navy',
  review: 'bg-gold/10 border-gold/20 text-navy',
  local: 'bg-sand-100 border-sand-200 text-navy',
  metric: 'bg-white border-sand-200 text-navy shadow-sm',
};

export default function TrustBadge({
  icon,
  label,
  sublabel,
  variant = 'methodology',
  size = 'lg', // Default to LG for Fortune 500 premium look
  href,
  className = '',
}: TrustBadgeProps) {
  const sizeConfig = sizeStyles[size];

  const baseStyles = `
    inline-flex items-center rounded-xl border
    transition-all duration-200
    ${sizeConfig.container}
    ${variantStyles[variant]}
    ${href ? 'hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer' : ''}
    ${className}
  `;

  const ariaLabel = sublabel ? `${label}: ${sublabel}` : label;

  const content = (
    <>
      <div className={`flex-shrink-0 flex items-center justify-center text-gold ${sizeConfig.icon}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className={`${sizeConfig.label} leading-tight text-navy`}>{label}</span>
        {sublabel && (
          <span className={`${sizeConfig.sublabel} text-charcoal/80 leading-tight`}>{sublabel}</span>
        )}
      </div>
    </>
  );

  if (href) {
    // External link
    if (href.startsWith('http')) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseStyles}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      );
    }
    // Internal link - would use Next.js Link
    return (
      <a href={href} className={baseStyles} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  return <div className={baseStyles} aria-label={ariaLabel} role="text">{content}</div>;
}

/**
 * Metric Badge - Fortune 500 Stats Display
 *
 * Per TRUST-BADGE-DESIGN-SPECIFICATION.md:
 * - Metric numbers should be 48-56px for visual impact
 * - Icons should be 24-32px (larger than standard)
 * - Labels should have strong contrast (no gray-600)
 */
interface MetricBadgeProps {
  value: string;
  label: string;
  icon?: ReactNode;
  className?: string;
}

export function MetricBadge({ value, label, icon, className = '' }: MetricBadgeProps) {
  return (
    <div className={`text-center p-6 ${className}`}>
      {icon && (
        <div className="w-12 h-12 mx-auto mb-3 text-gold flex items-center justify-center">
          {icon}
        </div>
      )}
      <div className="text-4xl md:text-5xl font-bold text-navy mb-2 tracking-tight">{value}</div>
      <div className="text-sm md:text-base font-medium text-charcoal/90">{label}</div>
    </div>
  );
}
