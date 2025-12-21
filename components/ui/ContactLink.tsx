'use client';

import { trackEmailClick, trackPhoneClick } from '@/lib/analytics';

interface ContactLinkProps {
  type: 'email' | 'phone';
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function ContactLink({
  type,
  href,
  children,
  className = '',
}: ContactLinkProps) {
  const handleClick = () => {
    if (type === 'email') {
      trackEmailClick();
    } else if (type === 'phone') {
      trackPhoneClick();
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
