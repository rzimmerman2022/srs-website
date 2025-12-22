import { NextResponse } from 'next/server';
import { signOutAdmin } from '@/lib/auth/admin-auth';

/**
 * Admin Logout API Endpoint
 *
 * Handles admin user logout by:
 * 1. Signing out from Supabase
 * 2. Clearing session cookies
 * 3. Invalidating the session
 */
export async function POST() {
  try {
    // Sign out the admin user
    await signOutAdmin();

    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('[Admin Logout] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to logout',
      },
      {
        status: 500,
      }
    );
  }
}
