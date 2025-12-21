import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';

type ButtonBaseProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'btn';

  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'text-charcoal hover:text-gold hover:bg-sand-100 focus:ring-2 focus:ring-gold focus:ring-offset-2',
  };

  // All sizes must meet 44px minimum touch target per WCAG 2.1 AAA
  const sizeStyles = {
    sm: 'px-4 py-3 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[44px]',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const content = isLoading ? (
    <span className="flex items-center">
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      Loading...
    </span>
  ) : (
    children
  );

  // If href is provided, render as a Link
  if ('href' in props && props.href) {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <Link
        href={href}
        className={combinedClassName}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  // Otherwise render as a button
  const { disabled, ...buttonProps } = props as ButtonAsButton;
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={combinedClassName}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
