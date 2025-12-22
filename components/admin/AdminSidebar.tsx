'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  count?: number;
}

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Navigation items configuration
const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Questionnaires',
    href: '/admin/questionnaires',
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: 'Clients',
    href: '/admin/clients',
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    name: 'Security',
    href: '/admin/security',
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 lg:z-0 h-screen bg-navy border-r border-navy-600 transition-transform duration-300',
          'flex flex-col w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Admin navigation sidebar"
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-navy-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
              <span className="text-navy font-bold text-lg">SR</span>
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Admin Panel</h2>
              <p className="text-sand-300 text-xs">Southwest Resumes</p>
            </div>
          </div>

          {/* Close button (mobile only) */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-sand-300 hover:text-white hover:bg-navy-600 transition-colors"
              aria-label="Close navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto" aria-label="Main navigation">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                      'min-h-[44px] text-sm font-medium',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy',
                      isActive
                        ? 'bg-gold text-navy shadow-lg'
                        : 'text-sand-200 hover:bg-navy-600 hover:text-white'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    <span className="flex-1">{item.name}</span>
                    {item.count !== undefined && (
                      <span
                        className={cn(
                          'px-2 py-1 text-xs font-semibold rounded-full',
                          isActive ? 'bg-navy/20 text-navy' : 'bg-navy-600 text-sand-200'
                        )}
                        aria-label={`${item.count} items`}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section (placeholder) */}
        <div className="px-4 py-4 border-t border-navy-600">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-navy-600">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
              <span className="text-navy font-semibold text-sm">RZ</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Ryan Zimmerman</p>
              <p className="text-sand-300 text-xs truncate">Admin</p>
            </div>
            <button
              type="button"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-sand-300 hover:text-white transition-colors"
              aria-label="User menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
