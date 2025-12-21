import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
}

export default function Card({
  children,
  className = '',
  hover = true,
  interactive = false,
  ...props
}: CardProps) {
  const hoverStyles = hover ? 'hover:shadow-md' : '';
  const interactiveStyles = interactive
    ? 'focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:outline-none cursor-pointer'
    : '';

  return (
    <div
      className={`card ${hoverStyles} ${interactiveStyles} ${className}`}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function CardTitle({
  children,
  className = '',
  as: Component = 'h3',
}: CardTitleProps) {
  return <Component className={`font-serif font-semibold text-navy ${className}`}>{children}</Component>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={className}>{children}</div>;
}
