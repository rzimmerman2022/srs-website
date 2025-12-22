import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/types';

// Admin user type from database
export type AdminUser = Database['public']['Tables']['admin_users']['Row'];

// Permission types
export type AdminPermission = 'view_questionnaires' | 'edit_questionnaires' | 'delete_questionnaires' | 'view_clients' | 'edit_clients' | 'manage_users' | 'view_settings' | 'edit_settings';

// Role definitions with permissions
export const ADMIN_ROLES = {
  super_admin: [
    'view_questionnaires',
    'edit_questionnaires',
    'delete_questionnaires',
    'view_clients',
    'edit_clients',
    'manage_users',
    'view_settings',
    'edit_settings',
  ] as AdminPermission[],
  admin: [
    'view_questionnaires',
    'edit_questionnaires',
    'view_clients',
    'edit_clients',
    'view_settings',
  ] as AdminPermission[],
  viewer: [
    'view_questionnaires',
    'view_clients',
  ] as AdminPermission[],
} as const;

export type AdminRole = keyof typeof ADMIN_ROLES;

/**
 * Create a Supabase client for server-side admin operations
 * Uses service role key for elevated permissions (admin operations only)
 */
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase admin credentials not configured');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Create a Supabase client for server-side user session validation
 * Uses anon key with user's session token
 */
async function createAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;

  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });

  // Set session if tokens exist
  if (accessToken && refreshToken) {
    await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  return client;
}

/**
 * Get the currently authenticated admin user
 *
 * @returns AdminUser if authenticated, null otherwise
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const authClient = await createAuthClient();
    if (!authClient) {
      return null;
    }

    // Get the current session
    const { data: { session }, error: sessionError } = await authClient.auth.getSession();

    if (sessionError || !session) {
      return null;
    }

    // Get admin user from database using the authenticated user's ID
    const adminClient = createAdminClient();
    const { data: adminUser, error: adminError } = await (adminClient
      .from('admin_users') as any)
      .select('*')
      .eq('user_id', session.user.id)
      .eq('active', true)
      .single();

    if (adminError || !adminUser) {
      return null;
    }

    return adminUser;
  } catch (error) {
    console.error('[getAdminUser] Error:', error);
    return null;
  }
}

/**
 * Require admin authentication - throws redirect if not authenticated
 * Use this in Server Components and Server Actions
 *
 * @returns AdminUser if authenticated
 * @throws Redirect to /admin/login if not authenticated
 */
export async function requireAdmin(): Promise<AdminUser> {
  const { redirect } = await import('next/navigation');

  const adminUser = await getAdminUser();

  if (!adminUser) {
    redirect('/admin/login');
  }

  // TypeScript doesn't know that redirect() never returns, so we need to assert
  return adminUser as AdminUser;
}

/**
 * Check if admin user has a specific permission
 *
 * @param permission - Permission to check
 * @param adminUser - Optional admin user (will fetch current user if not provided)
 * @returns true if user has permission, false otherwise
 */
export async function hasPermission(
  permission: AdminPermission,
  adminUser?: AdminUser | null
): Promise<boolean> {
  try {
    // Get admin user if not provided
    const user = adminUser ?? await getAdminUser();

    if (!user || !user.active) {
      return false;
    }

    // Get role permissions
    const rolePermissions = ADMIN_ROLES[user.role as AdminRole] || [];

    // Check if user has permission
    return rolePermissions.includes(permission);
  } catch (error) {
    console.error('[hasPermission] Error:', error);
    return false;
  }
}

/**
 * Authenticate admin user with email and password
 *
 * @param email - Admin email
 * @param password - Admin password
 * @returns AdminUser if authentication successful, null otherwise
 */
export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ user: AdminUser | null; error: string | null }> {
  try {
    const authClient = await createAuthClient();
    if (!authClient) {
      return { user: null, error: 'Authentication service not configured' };
    }

    // Sign in with email and password
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session) {
      return { user: null, error: authError?.message || 'Invalid credentials' };
    }

    // Store session in cookies
    const cookieStore = await cookies();
    cookieStore.set('sb-access-token', authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    cookieStore.set('sb-refresh-token', authData.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // Get admin user
    const adminClient = createAdminClient();
    const { data: adminUser, error: adminError } = await (adminClient
      .from('admin_users') as any)
      .select('*')
      .eq('user_id', authData.user.id)
      .eq('active', true)
      .single();

    if (adminError || !adminUser) {
      return { user: null, error: 'Not authorized as admin' };
    }

    // Update last login
    type AdminUpdate = Database['public']['Tables']['admin_users']['Update'];
    const updatePayload: AdminUpdate = {
      last_login_at: new Date().toISOString()
    };
    await (adminClient
      .from('admin_users') as any)
      .update(updatePayload)
      .eq('id', adminUser.id);

    return { user: adminUser, error: null };
  } catch (error) {
    console.error('[authenticateAdmin] Error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

/**
 * Sign out the current admin user
 */
export async function signOutAdmin(): Promise<void> {
  try {
    const authClient = await createAuthClient();
    if (authClient) {
      await authClient.auth.signOut();
    }

    // Clear session cookies
    const cookieStore = await cookies();
    cookieStore.delete('sb-access-token');
    cookieStore.delete('sb-refresh-token');
  } catch (error) {
    console.error('[signOutAdmin] Error:', error);
  }
}
