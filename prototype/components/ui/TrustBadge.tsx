import { ReactNode } from 'react';

type TrustBadgeVariant = 'methodology' | 'review' | 'local' | 'metric';

interface TrustBadgeProps {
  icon: ReactNode;
  label: string;
  sublabel?: string;
  variant?: TrustBadgeVariant;
  href?: string;
  className?: string;
}

// Fortune 500 Gold Standard: Increased opacity for visual weight (10-15% min)
const variantStyles: Record<TrustBadgeVariant, string> = {
  methodology: 'bg-navy/10 border-navy/20 text-navy',
  review: 'bg-gold/15 border-gold/30 text-navy',
  local: 'bg-sand-200 border-sand-300 text-navy',
  metric: 'bg-white border-gray-200 text-navy shadow-sm',
};

export default function TrustBadge({
  icon,
  label,
  sublabel,
  variant = 'methodology',
  href,
  className = '',
}: TrustBadgeProps) {
  // Fortune 500 Gold Standard Styling:
  // - rounded-lg (8px) not rounded-xl (12px) per IBM Carbon
  // - No scale transform on hover (only translateY)
  // - Focus ring for keyboard accessibility
  // - Line height 1.4 for readability
  const baseStyles = `
    inline-flex items-center gap-3 px-4 py-3 rounded-lg border
    transition-all duration-200 min-h-[44px] leading-[1.4]
    ${variantStyles[variant]}
    ${href ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2' : ''}
    ${className}
  `;

  const ariaLabel = sublabel ? `${label}: ${sublabel}` : label;

  const content = (
    <>
      {/* Fortune 500 Gold Standard: 20px icons (w-5 h-5) for consistent visual weight */}
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gold">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-sm leading-[1.4]">{label}</span>
        {sublabel && (
          <span className="text-xs text-gray-600 leading-[1.4]">{sublabel}</span>
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

// Metric Badge - Fortune 500 Gold Standard variant for displaying hero stats
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
        // Fortune 500 Gold Standard: 24px icons for metric badges (larger context)
        <div className="w-6 h-6 mx-auto mb-3 text-gold flex items-center justify-center">
          {icon}
        </div>
      )}
      {/* Fortune 500 Gold Standard: 48-60px metric numbers (text-5xl to text-6xl) */}
      <div className="text-5xl md:text-6xl font-bold text-navy mb-2 leading-[1.1] tracking-tight">{value}</div>
      <div className="text-sm text-gray-600 leading-[1.4] font-medium">{label}</div>
    </div>
  );
}
