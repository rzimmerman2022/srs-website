'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import type { AdminUser } from '@/lib/supabase/types';

export default function AdminClientLayout({
  children,
  adminUser,
}: {
  children: React.ReactNode;
  adminUser: AdminUser | null;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  // Handle logout
  const handleLogout = async () => {
    setLoggingOut(true);
    setUserMenuOpen(false);

    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Redirect to login page
        router.push('/admin/login');
        router.refresh();
      } else {
        console.error('Logout failed');
        setLoggingOut(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  // Get initials from full name (with null safety)
  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'AD';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Skip to main content link for accessibility */}
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-gold focus:text-navy focus:rounded-md"
      >
        Skip to main content
      </a>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top header */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
              {/* Left: Mobile menu button + breadcrumbs */}
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-600 hover:text-navy hover:bg-sand-100 transition-colors"
                  aria-label="Open navigation menu"
                  aria-expanded={sidebarOpen}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Breadcrumbs / Page title area */}
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-serif font-semibold text-navy">
                    Admin Dashboard
                  </h1>
                </div>
              </div>

              {/* Right: Actions and user menu */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Notifications */}
                <button
                  type="button"
                  className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-600 hover:text-navy hover:bg-sand-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  aria-label="Notifications"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {/* Notification badge */}
                  <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" aria-hidden="true" />
                  <span className="sr-only">3 unread notifications</span>
                </button>

                {/* User menu button */}
                {adminUser && (
                  <div className="relative" ref={userMenuRef}>
                    <div className="flex items-center space-x-3">
                      <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-navy">{adminUser.full_name || adminUser.email}</p>
                        <p className="text-xs text-gray-600 capitalize">{adminUser.role.replace('_', ' ')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        disabled={loggingOut}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center w-10 h-10 rounded-full bg-gold text-navy font-semibold hover:bg-gold-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="User menu"
                        aria-expanded={userMenuOpen}
                      >
                        {getInitials(adminUser.full_name)}
                      </button>
                    </div>

                    {/* User dropdown menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-premium border border-gray-200 py-2 z-50">
                        {/* User info (mobile) */}
                        <div className="sm:hidden px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-navy">{adminUser.full_name || adminUser.email}</p>
                          <p className="text-xs text-gray-600">{adminUser.email}</p>
                          <p className="text-xs text-gray-500 capitalize mt-1">{adminUser.role.replace('_', ' ')}</p>
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                          <button
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sand-50 transition-colors flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profile Settings</span>
                          </button>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sand-50 transition-colors flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            <span>Change Password</span>
                          </button>
                        </div>

                        {/* Logout button */}
                        <div className="border-t border-gray-200 mt-1 pt-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main content */}
          <main
            id="admin-main-content"
            className="flex-1 overflow-y-auto bg-sand-50"
            role="main"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
