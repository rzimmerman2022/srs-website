import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth/admin-auth';

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is already authenticated
  const adminUser = await getAdminUser();

  // If already logged in, redirect to admin dashboard
  if (adminUser) {
    redirect('/admin');
  }

  // Not authenticated - show login page (without admin layout wrapper)
  return <>{children}</>;
}
