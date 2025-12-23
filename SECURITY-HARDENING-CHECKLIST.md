# SECURITY HARDENING CHECKLIST

**Project:** Southwest Resume Services - Admin Authentication System
**Version:** 1.0
**Last Updated:** December 22, 2025
**Owner:** Security Team

This checklist provides actionable steps to harden the security posture of the admin authentication system based on the findings in `SECURITY-AUDIT-REPORT.md`.

---

## PRIORITY LEVELS

- **P0 (Critical):** Must fix before production deployment
- **P1 (High):** Fix within 1 week
- **P2 (Medium):** Fix within 1 month
- **P3 (Low):** Fix as time permits

---

## P0 - CRITICAL (BEFORE PRODUCTION)

### 1. Implement Consistent Permission Checking

**Status:** ❌ Not Started
**Priority:** P0
**Time Estimate:** 4-6 hours
**Risk:** Privilege escalation, unauthorized access

**Tasks:**
- [ ] Create permission middleware for API routes
- [ ] Add permission checks to all admin API endpoints
- [ ] Verify role-based access on sensitive operations
- [ ] Add automated tests for permission boundaries
- [ ] Document permission requirements for each endpoint

**Files to Modify:**
```
/app/api/admin/clients/route.ts
/app/api/admin/questionnaires/route.ts
/app/api/admin/settings/route.ts
/app/api/admin/clients/[clientId]/route.ts
/app/api/admin/questionnaires/[id]/route.ts
```

**Implementation Example:**
```typescript
// Create: /lib/middleware/require-permission.ts
export async function requirePermission(permission: AdminPermission, request: NextRequest) {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (!await hasPermission(permission, adminUser)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  return adminUser;
}

// Usage in API routes:
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await requirePermission('delete_questionnaires', request);
  if (adminUser instanceof NextResponse) return adminUser; // Error response

  // Proceed with deletion
}
```

**Verification:**
- [ ] Test with viewer role - should deny write operations
- [ ] Test with admin role - should allow most operations
- [ ] Test with super_admin - should allow all operations
- [ ] Verify 403 responses include proper error messages
- [ ] Check audit logs record permission denials

---

### 2. Implement Session Invalidation on Password Change

**Status:** ❌ Not Started
**Priority:** P0
**Time Estimate:** 2-3 hours
**Risk:** Compromised accounts remain accessible after password change

**Tasks:**
- [ ] Create sessions table in database
- [ ] Track all active sessions per user
- [ ] Add function to invalidate all user sessions
- [ ] Hook into password change flow
- [ ] Send email notification on password change
- [ ] Add tests for session invalidation

**Database Migration:**
```sql
-- /lib/supabase/migrations/003_admin_sessions.sql
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  access_token_hash TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_admin_sessions_user_id ON admin_sessions(admin_user_id);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Function to invalidate all sessions for a user
CREATE OR REPLACE FUNCTION invalidate_all_user_sessions(user_id UUID)
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE admin_user_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Implementation:**
```typescript
// /lib/auth/session-manager.ts
export async function invalidateAllUserSessions(userId: string): Promise<void> {
  const supabase = createAdminClient();

  await supabase.rpc('invalidate_all_user_sessions', {
    user_id: userId
  });

  // Log security event
  await logSecurityEvent({
    event_type: 'session_expired',
    action: 'invalidate_all_sessions',
    success: true,
    user_id: userId,
    user_type: 'admin',
    ip_address: 'system',
  });
}

// Hook into password change
export async function changePassword(userId: string, newPassword: string) {
  // Update password
  await supabase.auth.updateUser({ password: newPassword });

  // Invalidate all sessions
  await invalidateAllUserSessions(userId);

  // Send notification
  await sendPasswordChangeEmail(userId);
}
```

**Verification:**
- [ ] Change password while logged in - should force re-login
- [ ] Have multiple browser sessions - all should be invalidated
- [ ] Check audit log shows session invalidation
- [ ] Email notification sent
- [ ] User can log in with new password

---

### 3. Fix Privilege Escalation via Direct API Access

**Status:** ❌ Not Started
**Priority:** P0
**Time Estimate:** 6-8 hours
**Risk:** Lower-privilege users can perform admin-only actions

**Tasks:**
- [ ] Audit all admin API routes for missing permission checks
- [ ] Add permission guards to every mutating operation
- [ ] Implement authorization middleware
- [ ] Add role-specific response filtering (data hiding)
- [ ] Create automated authorization tests
- [ ] Document permission matrix

**Authorization Matrix:**
```typescript
// /lib/auth/permission-matrix.ts
export const API_PERMISSIONS = {
  // Client management
  'GET /api/admin/clients': ['view_clients'],
  'POST /api/admin/clients': ['edit_clients'],
  'PUT /api/admin/clients/[id]': ['edit_clients'],
  'DELETE /api/admin/clients/[id]': ['edit_clients'], // require super_admin

  // Questionnaire management
  'GET /api/admin/questionnaires': ['view_questionnaires'],
  'POST /api/admin/questionnaires': ['edit_questionnaires'],
  'PUT /api/admin/questionnaires/[id]': ['edit_questionnaires'],
  'DELETE /api/admin/questionnaires/[id]': ['delete_questionnaires'],

  // Settings
  'GET /api/admin/settings': ['view_settings'],
  'PUT /api/admin/settings': ['edit_settings'],

  // User management (super_admin only)
  'GET /api/admin/users': ['manage_users'],
  'POST /api/admin/users': ['manage_users'],
  'PUT /api/admin/users/[id]': ['manage_users'],
  'DELETE /api/admin/users/[id]': ['manage_users'],
};
```

**Middleware Implementation:**
```typescript
// /middleware.ts - enhance with authorization
export async function middleware(request: NextRequest) {
  // ... existing auth checks ...

  // Authorization check for API routes
  if (pathname.startsWith('/api/admin/')) {
    const adminUser = await getAdminUser();

    // Get required permissions for this endpoint
    const requiredPermissions = getRequiredPermissions(pathname, request.method);

    if (requiredPermissions) {
      const hasAllPermissions = await Promise.all(
        requiredPermissions.map(perm => hasPermission(perm, adminUser))
      );

      if (!hasAllPermissions.every(Boolean)) {
        // Log unauthorized attempt
        await logAccessDenied({
          user_id: adminUser?.id,
          user_type: 'admin',
          ip_address: getClientIp(request),
          resource_type: 'api',
          resource_id: pathname,
          error_message: 'Insufficient permissions'
        });

        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}
```

**Verification:**
- [ ] Viewer cannot edit/delete anything
- [ ] Admin cannot delete questionnaires
- [ ] Admin cannot manage users
- [ ] Super admin has full access
- [ ] All denied attempts are logged
- [ ] API responses don't leak sensitive data

---

## P1 - HIGH PRIORITY (THIS WEEK)

### 4. Add Cookie Domain Attribute

**Status:** ❌ Not Started
**Priority:** P1
**Time Estimate:** 30 minutes
**Risk:** Cookie leakage across subdomains

**Tasks:**
- [ ] Add COOKIE_DOMAIN environment variable
- [ ] Update cookie setting code
- [ ] Test with subdomain scenarios
- [ ] Update documentation

**Implementation:**
```typescript
// /lib/auth/admin-auth.ts
cookieStore.set('sb-access-token', authData.session.access_token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
  domain: process.env.COOKIE_DOMAIN || undefined, // Add this
});

cookieStore.set('sb-refresh-token', authData.session.refresh_token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 30,
  path: '/',
  domain: process.env.COOKIE_DOMAIN || undefined, // Add this
});
```

**Environment Variable:**
```bash
# Production
COOKIE_DOMAIN=.southwestresumes.com

# Development
COOKIE_DOMAIN=localhost
```

**Verification:**
- [ ] Cookies only accessible from specified domain
- [ ] Subdomains cannot access parent domain cookies
- [ ] Cookies work in development (localhost)
- [ ] Cookies work in production

---

### 5. Enable Refresh Token Rotation

**Status:** ❌ Not Started
**Priority:** P1
**Time Estimate:** 1 hour
**Risk:** Poor user experience, potential security issue

**Tasks:**
- [ ] Enable autoRefreshToken in Supabase client
- [ ] Test automatic token refresh
- [ ] Verify refresh behavior before expiration
- [ ] Add token refresh error handling
- [ ] Update session monitoring

**Implementation:**
```typescript
// /lib/auth/admin-auth.ts
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
      autoRefreshToken: true, // ✅ ENABLE
      persistSession: true,
    },
  });

  if (accessToken && refreshToken) {
    await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  return client;
}

// Also enable in admin client
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase admin credentials not configured');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: true, // ✅ ENABLE
      persistSession: true, // ✅ ENABLE
    },
  });
}
```

**Verification:**
- [ ] Session extends automatically before expiration
- [ ] User not logged out after 7 days if active
- [ ] Refresh token rotates on use
- [ ] Expired sessions properly redirect to login

---

### 6. Implement Account-Based Rate Limiting

**Status:** ❌ Not Started
**Priority:** P1
**Time Estimate:** 2-3 hours
**Risk:** Distributed brute force attacks

**Tasks:**
- [ ] Enhance rate limit function for dual checking
- [ ] Update login route to check both IP and account
- [ ] Add email to rate limit key
- [ ] Test with multiple IPs attacking one account
- [ ] Update rate limit response messages

**Implementation:**
```typescript
// /lib/security/rate-limit.ts - enhance existing function
export function checkDualRateLimit(
  ip: string,
  email: string,
  ipMaxAttempts: number,
  ipWindowMs: number,
  accountMaxAttempts: number,
  accountWindowMs: number
): { allowed: boolean; reason?: 'ip' | 'account'; retryAfter?: number } {
  const ipKey = `ip:${ip}`;
  const accountKey = `account:${email}`;

  const ipLimit = checkRateLimit(ipKey, ipMaxAttempts, ipWindowMs);
  const accountLimit = checkRateLimit(accountKey, accountMaxAttempts, accountWindowMs);

  if (!ipLimit.allowed) {
    return {
      allowed: false,
      reason: 'ip',
      retryAfter: ipLimit.retryAfter
    };
  }

  if (!accountLimit.allowed) {
    return {
      allowed: false,
      reason: 'account',
      retryAfter: accountLimit.retryAfter
    };
  }

  return { allowed: true };
}

// Usage in login route
// /app/api/admin/auth/login/route.ts
const clientIp = getClientIp(request.headers);
const { email, password } = await request.json();

const rateLimit = checkDualRateLimit(
  clientIp,
  email,
  5, 15 * 60 * 1000,  // IP: 5 per 15 minutes
  10, 60 * 60 * 1000  // Account: 10 per hour
);

if (!rateLimit.allowed) {
  const message = rateLimit.reason === 'ip'
    ? 'Too many login attempts from your IP address'
    : 'Too many failed login attempts for this account';

  return NextResponse.json(
    { error: message, retryAfter: rateLimit.retryAfter },
    { status: 429 }
  );
}
```

**Verification:**
- [ ] Single IP attacking one account - blocked after 10 attempts
- [ ] Multiple IPs attacking one account - blocked after 10 total
- [ ] Single IP attacking multiple accounts - blocked after 5 per account
- [ ] Rate limit messages distinguish IP vs account blocking

---

### 7. Implement Account Lockout Mechanism

**Status:** ❌ Not Started
**Priority:** P1
**Time Estimate:** 3-4 hours
**Risk:** Persistent brute force over time

**Tasks:**
- [ ] Add failed_login_attempts and locked_until to admin_users table
- [ ] Increment counter on failed login
- [ ] Lock account after threshold
- [ ] Create unlock mechanism (time-based + admin override)
- [ ] Send notification emails on lockout
- [ ] Add admin UI to view/unlock accounts

**Database Migration:**
```sql
-- /lib/supabase/migrations/004_account_lockout.sql
ALTER TABLE admin_users
ADD COLUMN failed_login_attempts INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN locked_until TIMESTAMPTZ NULL,
ADD COLUMN last_failed_login TIMESTAMPTZ NULL;

CREATE INDEX idx_admin_users_locked ON admin_users(locked_until)
WHERE locked_until IS NOT NULL;

-- Function to check if account is locked
CREATE OR REPLACE FUNCTION is_account_locked(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_locked_until TIMESTAMPTZ;
BEGIN
  SELECT locked_until INTO v_locked_until
  FROM admin_users
  WHERE user_id = p_user_id;

  RETURN v_locked_until IS NOT NULL AND v_locked_until > NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Implementation:**
```typescript
// /lib/auth/account-lockout.ts
const LOCKOUT_THRESHOLD = 20;
const LOCKOUT_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function checkAccountLockout(email: string): Promise<{
  locked: boolean;
  remainingTime?: number;
}> {
  const supabase = createAdminClient();

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('locked_until, failed_login_attempts')
    .eq('email', email)
    .single();

  if (!adminUser) {
    return { locked: false };
  }

  if (adminUser.locked_until && new Date(adminUser.locked_until) > new Date()) {
    const remainingTime = new Date(adminUser.locked_until).getTime() - Date.now();
    return { locked: true, remainingTime };
  }

  return { locked: false };
}

export async function incrementFailedLogins(email: string): Promise<void> {
  const supabase = createAdminClient();

  // Get current count
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('failed_login_attempts')
    .eq('email', email)
    .single();

  if (!adminUser) return;

  const newCount = adminUser.failed_login_attempts + 1;

  // Lock account if threshold exceeded
  if (newCount >= LOCKOUT_THRESHOLD) {
    const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);

    await supabase
      .from('admin_users')
      .update({
        failed_login_attempts: newCount,
        locked_until: lockedUntil.toISOString(),
        last_failed_login: new Date().toISOString()
      })
      .eq('email', email);

    // Send notification
    await sendAccountLockedEmail(email, lockedUntil);
    await notifySuperAdmins('Account locked', email);
  } else {
    await supabase
      .from('admin_users')
      .update({
        failed_login_attempts: newCount,
        last_failed_login: new Date().toISOString()
      })
      .eq('email', email);
  }
}

export async function resetFailedLogins(email: string): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from('admin_users')
    .update({
      failed_login_attempts: 0,
      locked_until: null,
      last_failed_login: null
    })
    .eq('email', email);
}
```

**Usage in Login Route:**
```typescript
// Check if account is locked
const lockoutStatus = await checkAccountLockout(email);
if (lockoutStatus.locked) {
  return NextResponse.json(
    {
      error: 'Account is temporarily locked due to too many failed login attempts',
      lockedFor: Math.ceil(lockoutStatus.remainingTime! / 1000 / 60) + ' minutes'
    },
    { status: 403 }
  );
}

// On failed login
if (authError || !authData.session) {
  await incrementFailedLogins(email);
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

// On successful login
await resetFailedLogins(email);
```

**Verification:**
- [ ] Account locks after 20 failed attempts
- [ ] Locked account returns 403 with time remaining
- [ ] Account auto-unlocks after 24 hours
- [ ] Email sent to user on lockout
- [ ] Email sent to super admins
- [ ] Successful login resets counter

---

### 8. Implement Concurrent Session Management

**Status:** ❌ Not Started
**Priority:** P1
**Time Estimate:** 4-6 hours
**Risk:** Unlimited concurrent sessions, no session visibility

**Tasks:**
- [ ] Create sessions table (if not done in #2)
- [ ] Track all active sessions
- [ ] Limit to N concurrent sessions per user
- [ ] Create "Active Sessions" page in admin settings
- [ ] Add "Revoke Session" functionality
- [ ] Show current session indicator
- [ ] Send email on new device login

**Implementation:**
```typescript
// /lib/auth/session-manager.ts
const MAX_CONCURRENT_SESSIONS = 3;

export async function createSession(
  userId: string,
  accessToken: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  const supabase = createAdminClient();

  // Hash token for storage (don't store raw tokens)
  const tokenHash = await hashToken(accessToken);

  // Check existing session count
  const { data: sessions } = await supabase
    .from('admin_sessions')
    .select('id')
    .eq('admin_user_id', userId)
    .gt('expires_at', new Date().toISOString());

  // Remove oldest sessions if over limit
  if (sessions && sessions.length >= MAX_CONCURRENT_SESSIONS) {
    const { data: oldestSessions } = await supabase
      .from('admin_sessions')
      .select('id')
      .eq('admin_user_id', userId)
      .order('created_at', { ascending: true })
      .limit(sessions.length - MAX_CONCURRENT_SESSIONS + 1);

    if (oldestSessions) {
      await supabase
        .from('admin_sessions')
        .delete()
        .in('id', oldestSessions.map(s => s.id));
    }
  }

  // Create new session
  await supabase
    .from('admin_sessions')
    .insert({
      admin_user_id: userId,
      access_token_hash: tokenHash,
      ip_address: ipAddress,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
}

export async function getUserSessions(userId: string): Promise<Session[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('admin_sessions')
    .select('*')
    .eq('admin_user_id', userId)
    .gt('expires_at', new Date().toISOString())
    .order('last_activity', { ascending: false });

  return data || [];
}

export async function revokeSession(sessionId: string): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from('admin_sessions')
    .delete()
    .eq('id', sessionId);
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
```

**Admin UI:**
```typescript
// /app/admin/settings/sessions/page.tsx
export default async function SessionsPage() {
  const adminUser = await requireAdmin();
  const sessions = await getUserSessions(adminUser.user_id);

  return (
    <div>
      <h1>Active Sessions</h1>
      {sessions.map(session => (
        <SessionCard
          key={session.id}
          session={session}
          isCurrent={isCurrentSession(session)}
          onRevoke={() => revokeSession(session.id)}
        />
      ))}
    </div>
  );
}
```

**Verification:**
- [ ] Maximum 3 concurrent sessions enforced
- [ ] Oldest session removed when limit exceeded
- [ ] Admin can view all active sessions
- [ ] Admin can revoke specific sessions
- [ ] Current session indicated clearly
- [ ] Email sent on new device login

---

## P2 - MEDIUM PRIORITY (THIS MONTH)

### 9. Validate X-Forwarded-For Header

**Status:** ❌ Not Started
**Priority:** P2
**Time Estimate:** 2 hours
**Risk:** Rate limit bypass via header spoofing

**Tasks:**
- [ ] Define trusted proxy IP ranges
- [ ] Validate X-Forwarded-For against trusted proxies
- [ ] Add fallback to connection IP
- [ ] Log suspicious header manipulation
- [ ] Test with Vercel proxy configuration

**Implementation:**
```typescript
// /lib/security/ip-validation.ts
const TRUSTED_PROXIES = [
  '76.76.21.0/24', // Vercel proxy range (example)
  // Add actual Vercel proxy IPs
];

function isIpInRange(ip: string, range: string): boolean {
  // IP range checking logic
  // Use library like 'ipaddr.js' for production
  return true; // Placeholder
}

export function getValidatedClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const connectionIp = request.ip || 'unknown';

  // If no forwarded header, use connection IP
  if (!forwarded) {
    return connectionIp;
  }

  // Parse forwarded IPs
  const forwardedIps = forwarded.split(',').map(ip => ip.trim());
  const clientIp = forwardedIps[0];

  // Validate that request came from trusted proxy
  const lastProxy = forwardedIps[forwardedIps.length - 1];
  const isTrustedProxy = TRUSTED_PROXIES.some(range =>
    isIpInRange(lastProxy, range)
  );

  if (!isTrustedProxy) {
    // Log suspicious activity
    console.warn('Untrusted proxy detected', {
      forwarded,
      connectionIp,
      path: request.nextUrl.pathname
    });

    // Use connection IP instead of trusting header
    return connectionIp;
  }

  return clientIp;
}
```

**Verification:**
- [ ] Legitimate requests work correctly
- [ ] Spoofed headers fall back to connection IP
- [ ] Suspicious activity logged
- [ ] Rate limiting works with validated IPs

---

### 10. Implement Session Binding

**Status:** ❌ Not Started
**Priority:** P2
**Time Estimate:** 3-4 hours
**Risk:** Session hijacking via stolen tokens

**Tasks:**
- [ ] Store IP and user agent with session
- [ ] Validate on each request
- [ ] Define "suspicious change" threshold
- [ ] Handle legitimate IP changes (mobile network)
- [ ] Add re-authentication flow for suspicious sessions

**Implementation:**
```typescript
// /lib/auth/session-validation.ts
export async function validateSessionBinding(
  session: AdminSession,
  currentIp: string,
  currentUserAgent: string
): Promise<{ valid: boolean; reason?: string }> {
  // Check IP match (allow some flexibility for mobile)
  const ipMatch = session.ip_address === currentIp ||
    isSameSubnet(session.ip_address, currentIp);

  // Check user agent match (exact match required)
  const uaMatch = session.user_agent === currentUserAgent;

  if (!ipMatch && !uaMatch) {
    return {
      valid: false,
      reason: 'Session binding failed: both IP and user agent changed'
    };
  }

  if (!uaMatch) {
    return {
      valid: false,
      reason: 'Session binding failed: user agent changed'
    };
  }

  // IP changed but user agent same - allow with warning
  if (!ipMatch) {
    await logSecurityEvent({
      event_type: 'session_warning',
      action: 'ip_change_detected',
      success: true,
      user_id: session.admin_user_id,
      user_type: 'admin',
      ip_address: currentIp,
      metadata: {
        old_ip: session.ip_address,
        new_ip: currentIp
      }
    });
  }

  return { valid: true };
}

function isSameSubnet(ip1: string, ip2: string): boolean {
  // Check if IPs are in same /24 subnet
  // Allows for mobile network IP changes
  const subnet1 = ip1.split('.').slice(0, 3).join('.');
  const subnet2 = ip2.split('.').slice(0, 3).join('.');
  return subnet1 === subnet2;
}
```

**Verification:**
- [ ] Same device/location - session valid
- [ ] Different device - session invalid, requires re-auth
- [ ] Mobile network IP change - session valid with warning
- [ ] User notified of suspicious activity
- [ ] Logs show IP/UA validation events

---

### 11. Remove Verbose Error Messages

**Status:** ❌ Not Started
**Priority:** P2
**Time Estimate:** 2-3 hours
**Risk:** Information disclosure to attackers

**Tasks:**
- [ ] Audit all error responses
- [ ] Replace detailed errors with generic messages in production
- [ ] Log detailed errors server-side only
- [ ] Create error response standardization
- [ ] Test error handling doesn't leak sensitive data

**Implementation:**
```typescript
// /lib/utils/error-handler.ts
export function sanitizeError(error: Error, isDevelopment: boolean) {
  if (isDevelopment) {
    return {
      error: error.message,
      stack: error.stack,
      details: error
    };
  }

  // Production: generic error messages only
  const genericErrors: Record<string, string> = {
    'Database': 'An error occurred while processing your request',
    'Authentication': 'Authentication failed',
    'Authorization': 'Access denied',
    'Validation': 'Invalid input provided'
  };

  const errorType = Object.keys(genericErrors).find(type =>
    error.message.includes(type)
  );

  return {
    error: errorType ? genericErrors[errorType] : 'An unexpected error occurred'
  };
}

// Usage in API routes
try {
  // ... operation ...
} catch (error) {
  console.error('Detailed error:', error); // Server-side only

  return NextResponse.json(
    sanitizeError(error as Error, process.env.NODE_ENV === 'development'),
    { status: 500 }
  );
}
```

**Verification:**
- [ ] Development shows detailed errors
- [ ] Production shows generic errors
- [ ] Server logs contain full error details
- [ ] No database structure leaked
- [ ] No file paths leaked

---

### 12. Tighten Content Security Policy

**Status:** ❌ Not Started
**Priority:** P2
**Time Estimate:** 4-6 hours
**Risk:** XSS attacks via inline scripts

**Tasks:**
- [ ] Remove `unsafe-inline` from script-src
- [ ] Remove `unsafe-eval` from script-src
- [ ] Implement nonce-based CSP
- [ ] Move all inline scripts to external files
- [ ] Test all interactive features still work

**Implementation:**
```typescript
// /app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = generateNonce();

  return (
    <html>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content={`
            default-src 'self';
            script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com;
            style-src 'self' 'nonce-${nonce}';
            img-src 'self' data: https:;
            font-src 'self' data:;
            connect-src 'self' https://*.supabase.co wss://*.supabase.co;
            frame-ancestors 'none';
            base-uri 'self';
            form-action 'self';
          `.replace(/\s+/g, ' ').trim()}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}
```

**Verification:**
- [ ] All pages load correctly
- [ ] No console CSP errors
- [ ] Interactive features work
- [ ] Supabase connection works
- [ ] Third-party scripts (analytics) work

---

## P3 - LOW PRIORITY (AS TIME PERMITS)

### 13. Implement Multi-Factor Authentication (MFA)

**Status:** ❌ Not Started
**Priority:** P3
**Time Estimate:** 8-12 hours
**Risk:** Single-factor authentication less secure

**Tasks:**
- [ ] Choose MFA method (TOTP, SMS, authenticator app)
- [ ] Integrate Supabase MFA
- [ ] Create MFA enrollment flow
- [ ] Add MFA verification to login
- [ ] Generate backup codes
- [ ] Add MFA recovery process

**Verification:**
- [ ] Users can enable MFA
- [ ] MFA required on login after enabled
- [ ] Backup codes work
- [ ] Recovery process works

---

### 14. Add Intrusion Detection System

**Status:** ❌ Not Started
**Priority:** P3
**Time Estimate:** 16-20 hours
**Risk:** Undetected attacks

**Tasks:**
- [ ] Define suspicious behavior patterns
- [ ] Implement anomaly detection
- [ ] Create alert system
- [ ] Add dashboard for security events
- [ ] Integrate with incident response

---

### 15. Implement HSTS Preload

**Status:** ❌ Not Started
**Priority:** P3
**Time Estimate:** 1 hour
**Risk:** MITM attacks on initial connection

**Tasks:**
- [ ] Add HSTS header with preload directive
- [ ] Submit domain to HSTS preload list
- [ ] Verify all subdomains support HTTPS

**Implementation:**
```typescript
// /next.config.ts
headers: [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  }
]
```

---

## VERIFICATION CHECKLIST

After implementing all P0 and P1 items, verify the following:

### Authentication
- [ ] Passwords hashed with bcrypt (verified via Supabase)
- [ ] Session tokens cryptographically secure
- [ ] Cookies have all security attributes
- [ ] Token refresh works automatically
- [ ] Login rate limited (IP and account)
- [ ] Account lockout works after 20 attempts

### Authorization
- [ ] All API routes check permissions
- [ ] Viewer role cannot edit/delete
- [ ] Admin role has appropriate permissions
- [ ] Super admin has full access
- [ ] Permission denied returns 403
- [ ] All denials logged in audit log

### Session Management
- [ ] Sessions track IP and user agent
- [ ] Max 3 concurrent sessions enforced
- [ ] Admin can view/revoke sessions
- [ ] Password change invalidates all sessions
- [ ] Session binding validates IP/UA
- [ ] Logout works correctly

### Security Headers
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Content-Security-Policy (strict)
- [ ] Strict-Transport-Security (with preload)
- [ ] X-Robots-Tag on private routes

### Audit Logging
- [ ] All login attempts logged
- [ ] All permission denials logged
- [ ] All data exports logged
- [ ] All suspicious activity logged
- [ ] Logs include IP, user agent, timestamp

### Error Handling
- [ ] Production errors are generic
- [ ] Development errors are detailed
- [ ] All errors logged server-side
- [ ] No sensitive data in error responses

---

## MONITORING & MAINTENANCE

### Weekly
- [ ] Review security audit logs for anomalies
- [ ] Check failed login rates
- [ ] Review locked accounts
- [ ] Monitor rate limit triggers

### Monthly
- [ ] Update dependencies
- [ ] Review and rotate secrets
- [ ] Check for new CVEs in dependencies
- [ ] Review permission matrix

### Quarterly
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Review and update this checklist
- [ ] Staff security training

---

**Document Owner:** Security Team
**Last Updated:** December 22, 2025
**Next Review:** March 22, 2026
