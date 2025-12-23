import type { Metadata } from 'next';
import { getAdminUser } from '@/lib/auth/admin-auth';
import AdminClientLayout from './layout-client';

/**
 * CRITICAL SEO BLOCKING: Admin pages must NEVER be indexed by search engines
 * These are private admin interfaces accessible only to:
 * - Admin team
 * - Business owner
 *
 * Multiple layers of protection:
 * 1. robots.txt blocks /admin and /admin/*
 * 2. This metadata sets noindex/nofollow
 * 3. Middleware adds X-Robots-Tag headers
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
  // Prevent any sharing/preview metadata
  openGraph: undefined,
  twitter: undefined,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current admin user
  const adminUser = await getAdminUser();

  // Allow access to login page without authentication
  // The middleware will handle protecting other admin routes
  // This layout just passes the user data to client component

  return <AdminClientLayout adminUser={adminUser}>{children}</AdminClientLayout>;
}
