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
  href,
  className = '',
}: TrustBadgeProps) {
  const baseStyles = `
    inline-flex items-center gap-3 px-4 py-3 rounded-xl border
    transition-all duration-200 min-h-[44px]
    ${variantStyles[variant]}
    ${href ? 'hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer' : ''}
    ${className}
  `;

  const ariaLabel = sublabel ? `${label}: ${sublabel}` : label;

  const content = (
    <>
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gold">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-sm leading-tight">{label}</span>
        {sublabel && (
          <span className="text-xs text-gray-600 leading-tight">{sublabel}</span>
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

// Metric Badge - A special variant for displaying stats
interface MetricBadgeProps {
  value: string;
  label: string;
  icon?: ReactNode;
  className?: string;
}

export function MetricBadge({ value, label, icon, className = '' }: MetricBadgeProps) {
  return (
    <div className={`text-center p-4 ${className}`}>
      {icon && (
        <div className="w-10 h-10 mx-auto mb-2 text-gold flex items-center justify-center">
          {icon}
        </div>
      )}
      <div className="text-3xl md:text-4xl font-bold text-navy mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
