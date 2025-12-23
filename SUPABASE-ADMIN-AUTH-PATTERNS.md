# Supabase Admin Authentication Patterns

**Last Updated:** December 2025
**Target Audience:** Developers implementing admin authentication with Supabase

---

## Table of Contents
- [Service Role Key Security](#service-role-key-security)
- [Admin User Management Patterns](#admin-user-management-patterns)
- [Row Level Security for Admins](#row-level-security-for-admins)
- [Custom Claims & RBAC](#custom-claims--rbac)
- [Admin Invitation Flows](#admin-invitation-flows)
- [API Key Management](#api-key-management)
- [Security Best Practices](#security-best-practices)

---

## Service Role Key Security

### Understanding Service Role Keys

The Service Role Key is a **superuser credential** that:
- Bypasses ALL Row Level Security (RLS) policies
- Has unrestricted database access
- Is equivalent to database root access
- Should NEVER be exposed to clients

**Think of it as:** The master key to your entire database.

### Critical Security Rules

**1. Server-Side Only**

```typescript
// ❌ WRONG: Never use in client-side code
'use client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // NEVER DO THIS
);
```

```typescript
// ✅ CORRECT: Only use in server-side code
import 'server-only';
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
```

**2. Environment Variable Storage**

```bash
# .env.local (NEVER commit to git)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Add to .gitignore
.env.local
.env*.local
```

**3. Appropriate Use Cases**

Use service role key ONLY for:
- Server-side admin operations
- Edge Functions with authorization checks
- Periodic background jobs
- Admin tools with proper authorization
- Data processing pipelines
- Server-side user invitation flows

**Never use for:**
- Client-side operations
- Public API endpoints
- Direct database queries without authorization
- Operations that could be done with user credentials

### Key Rotation Best Practices

**When to Rotate:**
- At least once per year (compliance requirement)
- Immediately if key is compromised
- When team members with access leave
- After security audits

**How to Rotate:**

1. Generate new secret key in Supabase Dashboard (API Keys settings)
2. Update environment variables in all environments
3. Deploy updated applications
4. Revoke old key after confirming new key works
5. Monitor for any failed authentication attempts

**Important:** When rotating, create and test the new key before revoking the old one to prevent downtime.

### Transition to New Key Types (2025)

Supabase is transitioning from JWT-based keys to publishable/secret keys:

**Old System (Deprecated):**
- `anon` key (JWT-based, public)
- `service_role` key (JWT-based, private)

**New System (Recommended):**
- `publishable` key (public, for client-side)
- `secret` key (private, for server-side)

**Benefits:**
- Improved security model
- Better developer experience
- Easier key rotation
- Enhanced monitoring capabilities

**Migration:** Update to the latest Supabase client libraries to use the new key types.

**Sources:**
- [Understanding API keys | Supabase Docs](https://supabase.com/docs/guides/api/api-keys)
- [How to Secure Your Supabase Service Role Key](https://chat2db.ai/resources/blog/secure-supabase-role-key)
- [JWT Signing Keys | Supabase Docs](https://supabase.com/docs/guides/auth/signing-keys)

---

## Admin User Management Patterns

### Pattern 1: Database-Level Admin Flag

The simplest approach for small teams:

```sql
-- Add admin column to user metadata
ALTER TABLE auth.users
ADD COLUMN IF NOT EXISTS raw_app_meta_data JSONB DEFAULT '{}';

-- Or create a separate admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view admin_users table
CREATE POLICY "Admins can view admin users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);
```

**Usage:**

```typescript
// lib/supabase/admin.ts
import 'server-only';
import { createAdminClient } from './server';

export async function isUserAdmin(userId: string): Promise<boolean> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  return !!data && !error;
}

export async function getAdminRole(userId: string): Promise<string | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  return data?.role || null;
}
```

### Pattern 2: Custom Claims in JWT

Use Supabase Auth hooks to add custom claims to the JWT token:

```sql
-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.admin_users
  WHERE user_id = $1 AND is_active = true;
$$ LANGUAGE SQL SECURITY DEFINER;

-- This gets added to JWT automatically via Supabase Auth hooks
-- Configure in Supabase Dashboard > Authentication > Hooks
```

**Access in application:**

```typescript
// lib/auth/session.ts
import { createClient } from '@/lib/supabase/server';

export async function getSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Custom claims are available in user.app_metadata
  const role = user.app_metadata?.role;
  const isAdmin = ['admin', 'super_admin'].includes(role);

  return {
    userId: user.id,
    email: user.email!,
    role,
    isAdmin,
  };
}
```

### Pattern 3: Email Domain-Based Admin Access

For organizations where admin access is determined by email domain:

```typescript
// lib/auth/admin.ts
const ADMIN_DOMAINS = ['yourcompany.com'];
const ADMIN_EMAILS = ['admin@external.com']; // Whitelist specific emails

export function isAdminEmail(email: string): boolean {
  const domain = email.split('@')[1];
  return ADMIN_DOMAINS.includes(domain) || ADMIN_EMAILS.includes(email);
}
```

**Combine with database check for security:**

```typescript
export async function verifyAdminAccess(userId: string): Promise<boolean> {
  const supabase = createAdminClient();

  const { data: user } = await supabase.auth.admin.getUserById(userId);

  if (!user) return false;

  // Check email domain
  const emailCheck = isAdminEmail(user.user.email!);

  // Verify in admin_users table
  const dbCheck = await isUserAdmin(userId);

  // Both must be true
  return emailCheck && dbCheck;
}
```

**Sources:**
- [Custom Claims & Role-based Access Control (RBAC)](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)
- [Securing your data | Supabase Docs](https://supabase.com/docs/guides/database/secure-data)

---

## Row Level Security for Admins

### Core RLS Principles

Row Level Security (RLS) enforces access control at the database level, ensuring users can only access data they're authorized to see, regardless of how they connect.

**Key Benefits:**
- Security enforced in database, not application
- Works with any client (web, mobile, API)
- Impossible to bypass (unlike application-level checks)
- Centralized authorization logic

### Admin RLS Patterns

**Pattern 1: Admin Bypass for Specific Tables**

```sql
-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Regular users can only view their own data
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all profiles"
ON public.users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- Admins can update any user
CREATE POLICY "Admins can update any profile"
ON public.users
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);
```

**Pattern 2: Role-Based Policies**

```sql
-- Create helper function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
    AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Use in policies
CREATE POLICY "Admins can delete posts"
ON public.posts
FOR DELETE
TO authenticated
USING (is_admin());
```

**Pattern 3: Super Admin vs Admin Policies**

```sql
-- Create role checking function
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
    AND (
      role = required_role
      OR role = 'super_admin' -- Super admin has all permissions
    )
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Settings table: Only super_admin can modify
CREATE POLICY "Only super admins can update settings"
ON public.settings
FOR UPDATE
TO authenticated
USING (has_role('super_admin'));

-- Content table: Admin or super_admin can modify
CREATE POLICY "Admins can update content"
ON public.content
FOR UPDATE
TO authenticated
USING (has_role('admin'));
```

### Bypassing RLS When Necessary

**When using service role key, RLS is automatically bypassed:**

```typescript
import { createAdminClient } from '@/lib/supabase/admin';

export async function deleteUserAsAdmin(userId: string) {
  // Verify caller is admin
  const session = await verifyAdminSession();
  if (!session.isAdmin) {
    throw new Error('Unauthorized');
  }

  // Use admin client to bypass RLS
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) throw error;

  // Log admin action
  await logAdminAction(session.userId, 'delete_user', { userId });
}
```

**Important:** Even when bypassing RLS, always verify authorization in application code.

### Performance Optimization

**Index columns used in RLS policies:**

```sql
-- Index the admin_users table for fast lookups
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id) WHERE is_active = true;

-- Index any foreign keys used in policies
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
```

### Testing RLS Policies

```sql
-- Test as a regular user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub TO 'user-uuid-here';

SELECT * FROM public.users; -- Should only see own data

-- Test as admin
SET LOCAL request.jwt.claims.sub TO 'admin-uuid-here';

SELECT * FROM public.users; -- Should see all data

-- Reset
RESET ROLE;
```

**Sources:**
- [Row Level Security | Supabase Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Easy Row Level Security (RLS) Policies in Supabase and Postgres](https://maxlynch.com/2023/11/04/tips-for-row-level-security-rls-in-postgres-and-supabase/)
- [Setting Up Row-Level Security in Supabase User and Admin Roles](https://dev.to/shahidkhans/setting-up-row-level-security-in-supabase-user-and-admin-2ac1)

---

## Custom Claims & RBAC

### Adding Custom Claims to JWT

Supabase allows you to add custom claims to the JWT token, making role information available without additional database queries.

**Method 1: Database Function (Recommended)**

```sql
-- Create function that runs on auth events
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Add custom claims to raw_app_meta_data
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', 'user')
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**Method 2: Auth Hooks (Supabase Cloud)**

Configure in Supabase Dashboard > Authentication > Hooks:

```typescript
// Hook: Custom Access Token
export function customAccessToken(event: any) {
  const userId = event.user_id;

  // Query admin_users table
  const { data } = supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', userId)
    .single();

  return {
    claims: {
      role: data?.role || 'user',
    },
  };
}
```

### Accessing Custom Claims

```typescript
// Client-side
const { data: { user } } = await supabase.auth.getUser();
const role = user?.app_metadata?.role;

// Server-side
import { createClient } from '@/lib/supabase/server';

export async function getUserRole() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return user?.app_metadata?.role || 'user';
}
```

### Using Claims in RLS Policies

```sql
-- Access custom claims in policies using auth.jwt()
CREATE POLICY "Editors can update content"
ON public.content
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'role')::TEXT IN ('editor', 'admin', 'super_admin')
);

-- More complex role check
CREATE POLICY "Role-based content access"
ON public.content
FOR SELECT
TO authenticated
USING (
  CASE
    WHEN (auth.jwt() ->> 'role')::TEXT = 'super_admin' THEN true
    WHEN (auth.jwt() ->> 'role')::TEXT = 'admin' THEN true
    WHEN (auth.jwt() ->> 'role')::TEXT = 'editor' THEN status = 'published'
    ELSE user_id = auth.uid()
  END
);
```

### RBAC Implementation Example

```typescript
// lib/auth/permissions.ts
export type Role = 'super_admin' | 'admin' | 'editor' | 'viewer' | 'user';
export type Permission =
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'content:read'
  | 'content:write'
  | 'content:delete'
  | 'settings:read'
  | 'settings:write';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    'users:read', 'users:write', 'users:delete',
    'content:read', 'content:write', 'content:delete',
    'settings:read', 'settings:write',
  ],
  admin: [
    'users:read', 'users:write',
    'content:read', 'content:write', 'content:delete',
    'settings:read',
  ],
  editor: [
    'content:read', 'content:write',
  ],
  viewer: [
    'content:read',
  ],
  user: [],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

export function requirePermission(role: Role, permission: Permission) {
  if (!hasPermission(role, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
}
```

**Sources:**
- [Custom Claims & Role-based Access Control (RBAC)](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)
- [Role-Based Access Control (RBAC) | Supabase Features](https://supabase.com/features/role-based-access-control)

---

## Admin Invitation Flows

### Secure Admin Invitation Pattern

**Step 1: Create invitation in database**

```sql
-- Create invitations table
CREATE TABLE IF NOT EXISTS public.admin_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- Only admins can create invitations
CREATE POLICY "Admins can create invitations"
ON public.admin_invitations
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = true
  )
);
```

**Step 2: Server Action to send invitation**

```typescript
'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { verifySession } from '@/lib/dal';
import { sendInvitationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function inviteAdmin(email: string, role: string) {
  // Verify inviter is admin
  const session = await verifySession();
  if (!session.isAdmin) {
    throw new Error('Unauthorized');
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const supabase = createAdminClient();

  // Create invitation
  const { data, error } = await supabase
    .from('admin_invitations')
    .insert({
      email,
      role,
      invited_by: session.userId,
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  // Send email with invitation link
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/accept-invite?token=${token}`;

  await sendInvitationEmail({
    to: email,
    inviteUrl,
    inviterEmail: session.email,
    role,
  });

  return { success: true };
}
```

**Step 3: Accept invitation flow**

```typescript
// app/admin/accept-invite/page.tsx
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = searchParams;

  if (!token) {
    redirect('/admin/login?error=invalid_token');
  }

  const supabase = createAdminClient();

  // Verify token
  const { data: invitation } = await supabase
    .from('admin_invitations')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .is('accepted_at', null)
    .single();

  if (!invitation) {
    redirect('/admin/login?error=invalid_or_expired_token');
  }

  // Show signup form pre-filled with email
  return (
    <InviteAcceptForm
      email={invitation.email}
      role={invitation.role}
      token={token}
    />
  );
}
```

**Step 4: Complete signup and activate admin**

```typescript
'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function completeInvitation({
  token,
  email,
  password,
}: {
  token: string;
  email: string;
  password: string;
}) {
  const supabase = createAdminClient();

  // Verify invitation again
  const { data: invitation } = await supabase
    .from('admin_invitations')
    .select('*')
    .eq('token', token)
    .eq('email', email)
    .gt('expires_at', new Date().toISOString())
    .is('accepted_at', null)
    .single();

  if (!invitation) {
    throw new Error('Invalid or expired invitation');
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      invited_by: invitation.invited_by,
    },
  });

  if (authError) throw authError;

  // Add to admin_users table
  const { error: adminError } = await supabase
    .from('admin_users')
    .insert({
      user_id: authData.user.id,
      role: invitation.role,
      created_by: invitation.invited_by,
    });

  if (adminError) throw adminError;

  // Mark invitation as accepted
  await supabase
    .from('admin_invitations')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invitation.id);

  return { success: true, userId: authData.user.id };
}
```

### Security Considerations

- Use cryptographically secure tokens (crypto.randomBytes)
- Set reasonable expiration times (7 days recommended)
- Validate token on every step
- Mark tokens as used after acceptance
- Log all invitation actions
- Limit who can send invitations (super_admin only)
- Rate limit invitation sending
- Send notification to inviter when accepted

**Sources:**
- [Best Security Practices in Supabase: A Comprehensive Guide](https://www.supadex.app/blog/best-security-practices-in-supabase-a-comprehensive-guide)
- User Onboarding research from previous searches

---

## API Key Management

### Understanding Supabase API Keys

**anon (public) key:**
- Safe to use in client-side code
- Respects RLS policies
- Used for authenticated user operations
- Can be exposed in frontend code

**service_role (secret) key:**
- NEVER use in client-side code
- Bypasses all RLS policies
- Server-side only
- Treat as database root password

### Key Storage Best Practices

```bash
# .env.local (gitignored)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... # Safe to expose
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # NEVER expose
```

```typescript
// lib/supabase/client.ts - Client-side
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Public key OK
  );
}
```

```typescript
// lib/supabase/admin.ts - Server-side only
import 'server-only'; // Ensures not imported in client
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Secret key
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
```

### Monitoring & Alerts

Set up monitoring for:
- Unusual service_role key usage patterns
- Failed authentication attempts
- RLS policy violations
- API rate limit hits
- Unexpected data access patterns

**Sources:**
- [Understanding API keys | Supabase Docs](https://supabase.com/docs/guides/api/api-keys)
- [How to Secure Your Supabase Service Role Key](https://chat2db.ai/resources/blog/secure-supabase-role-key)

---

## Security Best Practices

### Checklist for Production

- [ ] Service role key stored in environment variables only
- [ ] Service role key never committed to version control
- [ ] Service role key only used in server-side code
- [ ] 'server-only' package used for admin modules
- [ ] RLS enabled on all tables
- [ ] RLS policies tested for all roles
- [ ] Custom claims added to JWT for performance
- [ ] Admin actions logged to audit table
- [ ] Email verification required for admin invitations
- [ ] MFA enforced for admin accounts
- [ ] Regular key rotation schedule established
- [ ] Monitoring alerts configured
- [ ] Database indexes on columns used in RLS policies

### Multi-Layer Security

```
Layer 1: Supabase RLS
├── Database-level enforcement
├── Cannot be bypassed (except service_role)
└── Centralized authorization logic

Layer 2: Server-Side Authorization
├── Verify admin status before using service_role
├── Check permissions in Server Actions
└── Validate inputs with Zod

Layer 3: Application Logic
├── Additional business rule checks
├── Rate limiting on sensitive operations
└── Audit logging

Layer 4: Monitoring & Alerts
├── Track unusual access patterns
├── Failed auth attempts
└── Suspicious admin operations
```

### Common Security Mistakes to Avoid

**1. Using service_role without authorization checks**
```typescript
// ❌ WRONG
export async function deleteUser(userId: string) {
  const supabase = createAdminClient(); // Bypasses RLS
  await supabase.from('users').delete().eq('id', userId);
}

// ✅ CORRECT
export async function deleteUser(userId: string) {
  const session = await verifyAdminSession();
  if (!session.isAdmin) throw new Error('Unauthorized');

  const supabase = createAdminClient();
  await supabase.from('users').delete().eq('id', userId);

  await logAdminAction(session.userId, 'delete_user', { userId });
}
```

**2. Not enabling RLS**
```sql
-- ❌ WRONG: Table without RLS
CREATE TABLE sensitive_data (...);

-- ✅ CORRECT: Enable RLS immediately
CREATE TABLE sensitive_data (...);
ALTER TABLE sensitive_data ENABLE ROW LEVEL SECURITY;
```

**3. Overly permissive RLS policies**
```sql
-- ❌ WRONG: Too broad
CREATE POLICY "Anyone can read"
ON users FOR SELECT
TO authenticated
USING (true);

-- ✅ CORRECT: Specific conditions
CREATE POLICY "Users read own data or admins read all"
ON users FOR SELECT
TO authenticated
USING (
  auth.uid() = id
  OR is_admin()
);
```

---

## Implementation Difficulty Ratings

| Feature | Difficulty | Time Estimate | Priority |
|---------|-----------|---------------|----------|
| Service role key setup | Low | 30 min | Critical |
| Admin user table | Low | 1-2 hours | Critical |
| Basic RLS policies | Medium | 2-4 hours | Critical |
| Custom claims | Medium | 2-4 hours | High |
| Invitation flow | Medium-High | 4-8 hours | High |
| Advanced RLS patterns | High | 8-16 hours | Medium |
| Audit logging | Medium | 2-4 hours | Medium |
| Key rotation automation | High | 4-8 hours | Low |

---

## References

1. [Understanding API keys | Supabase Docs](https://supabase.com/docs/guides/api/api-keys)
2. [How to Secure Your Supabase Service Role Key](https://chat2db.ai/resources/blog/secure-supabase-role-key)
3. [Row Level Security | Supabase Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
4. [Custom Claims & Role-based Access Control (RBAC)](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)
5. [Securing your data | Supabase Docs](https://supabase.com/docs/guides/database/secure-data)
6. [Best Security Practices in Supabase: A Comprehensive Guide](https://www.supadex.app/blog/best-security-practices-in-supabase-a-comprehensive-guide)
7. [Easy Row Level Security (RLS) Policies in Supabase and Postgres](https://maxlynch.com/2023/11/04/tips-for-row-level-security-rls-in-postgres-and-supabase/)
