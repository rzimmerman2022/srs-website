# Top 10 Recommendations for SRS Admin Authentication

**Last Updated:** December 2025
**Target:** SRS Admin System Implementation
**Framework:** Next.js 15 + Supabase

---

## Executive Summary

Based on comprehensive research of industry best practices from Next.js 15, Supabase, Fortune 500 companies (AWS, Google Cloud, Azure, Salesforce, Stripe, Vercel), and 2025 security standards, here are the **top 10 actionable recommendations** for implementing a secure, scalable admin authentication system for SRS.

---

## Top 10 Recommendations

### 1. Implement Defense-in-Depth Architecture (CRITICAL)

**Priority:** 🔴 Critical
**Difficulty:** Medium-High
**Time Estimate:** 16-24 hours
**ROI:** Very High

**What to do:**
Never rely solely on middleware for authentication. Implement verification at every layer:

```
┌─────────────────────────────────────────────┐
│ Layer 1: Middleware (Initial route guard)   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│ Layer 2: Server Components (Session check)  │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│ Layer 3: Server Actions (Re-authenticate)   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│ Layer 4: Data Access Layer (Final check)    │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│ Layer 5: Supabase RLS (Database-level)      │
└─────────────────────────────────────────────┘
```

**Why it matters:**
- CVE-2025-29927 demonstrated middleware can be bypassed
- Multiple verification layers prevent single point of failure
- Each layer catches different attack vectors

**Implementation steps:**
1. Create Data Access Layer (DAL) with `verifySession()` function
2. Call `verifySession()` in every Server Action
3. Enable RLS on all Supabase tables
4. Add authorization checks at each layer

**Code example:**
```typescript
// lib/dal.ts
import 'server-only';

export async function verifySession() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}

// Every Server Action
'use server';
export async function deleteUser(userId: string) {
  await verifySession(); // REQUIRED
  // ... rest of logic
}
```

**Sources:**
- [Guides: Authentication | Next.js](https://nextjs.org/docs/app/guides/authentication)
- [Complete Next.js security guide 2025](https://www.turbostarter.dev/blog/complete-nextjs-security-guide-2025-authentication-api-protection-and-best-practices)

---

### 2. Use __Host- Prefix Cookies with All Security Attributes (CRITICAL)

**Priority:** 🔴 Critical
**Difficulty:** Low
**Time Estimate:** 1-2 hours
**ROI:** Very High

**What to do:**
Use the most secure cookie configuration available in 2025:

```typescript
const cookieStore = await cookies();

cookieStore.set('__Host-admin-session', token, {
  httpOnly: true,        // Prevent JavaScript access
  secure: true,          // HTTPS only
  sameSite: 'strict',    // Maximum CSRF protection
  path: '/',             // Required for __Host- prefix
  maxAge: 900,           // 15 minutes
  // NO domain attribute (required for __Host-)
});
```

**Why it matters:**
- `__Host-` prefix prevents subdomain attacks
- `httpOnly` blocks XSS cookie theft
- `secure` prevents network sniffing
- `sameSite: 'strict'` prevents CSRF attacks

**Configuration for different tokens:**
```typescript
// Access token: Short-lived, all routes
cookieStore.set('__Host-access-token', accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
  maxAge: 900, // 15 minutes
});

// Refresh token: Long-lived, restricted path
cookieStore.set('__Host-refresh-token', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/api/auth/refresh', // Only sent to refresh endpoint
  maxAge: 604800, // 7 days
});
```

**Sources:**
- [Secure cookie configuration - MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies)
- [Cookie Security Guide](https://barrion.io/blog/cookie-security-best-practices)

---

### 3. Implement Access Token + Refresh Token with Rotation (CRITICAL)

**Priority:** 🔴 Critical
**Difficulty:** Medium
**Time Estimate:** 8-12 hours
**ROI:** Very High

**What to do:**
Use the industry-standard OAuth 2.0 pattern:

**Token Strategy:**
- **Access Token:** JWT, 15 minutes, stored in httpOnly cookie
- **Refresh Token:** Opaque, 7 days, stored in httpOnly cookie, rotates on every use

**Implementation:**
```typescript
// Login flow
const accessToken = generateJWT({ userId, role }, '15m');
const refreshToken = crypto.randomBytes(32).toString('hex');

await db.refreshTokens.create({
  token: refreshToken,
  userId,
  expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
});

// Set cookies (see Recommendation #2 for attributes)
```

**Refresh token rotation:**
```typescript
// On refresh request
const oldToken = await validateRefreshToken(incomingToken);

// Generate new tokens
const newAccessToken = generateJWT({ userId, role }, '15m');
const newRefreshToken = crypto.randomBytes(32).toString('hex');

// Atomic operation
await db.transaction(async (tx) => {
  await tx.refreshTokens.create({
    token: newRefreshToken,
    userId: oldToken.userId,
    previousToken: incomingToken, // For reuse detection
  });
  await tx.refreshTokens.delete({ token: incomingToken });
});
```

**Reuse detection (CRITICAL security feature):**
```typescript
if (!tokenExists) {
  // Check if recently rotated (grace period)
  const recent = await checkRecentRotation(token);

  if (!recent) {
    // SECURITY BREACH: Revoke ALL user tokens
    await revokeAllUserSessions(userId);
    await sendSecurityAlert(userId);
    throw new Error('Token reuse detected');
  }
}
```

**Why it matters:**
- Limits damage from stolen access tokens (15 min window)
- Refresh token rotation prevents replay attacks
- Reuse detection catches security breaches immediately
- Standard pattern used by all major platforms

**Sources:**
- [Refresh Token Rotation | Auth0](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation)
- [The Developer's Guide to Refresh Token Rotation](https://www.descope.com/blog/post/refresh-token-rotation)

---

### 4. Enable Supabase RLS with Admin Bypass Policies (CRITICAL)

**Priority:** 🔴 Critical
**Difficulty:** Medium
**Time Estimate:** 4-8 hours
**ROI:** Very High

**What to do:**
Enable Row Level Security on all tables with admin bypass patterns:

```sql
-- 1. Create admin_users table
CREATE TABLE public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Create helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- 3. Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Create policies
-- Users can view their own data
CREATE POLICY "Users view own data"
ON public.users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Admins can view all data
CREATE POLICY "Admins view all data"
ON public.users FOR SELECT
TO authenticated
USING (is_admin());

-- Admins can update any data
CREATE POLICY "Admins update all data"
ON public.users FOR UPDATE
TO authenticated
USING (is_admin());
```

**Why it matters:**
- Database-level enforcement (cannot be bypassed except with service_role)
- Works regardless of client (web, mobile, API)
- Centralized authorization logic
- Defense-in-depth layer

**Important:** Still verify authorization in application code when using service_role key.

**Sources:**
- [Row Level Security | Supabase Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Easy Row Level Security (RLS) Policies](https://maxlynch.com/2023/11/04/tips-for-row-level-security-rls-in-postgres-and-supabase/)

---

### 5. Require MFA for All Admin Accounts (HIGH)

**Priority:** 🟡 High
**Difficulty:** Medium
**Time Estimate:** 8-16 hours
**ROI:** Very High

**What to do:**
Enforce Multi-Factor Authentication using Supabase Auth MFA:

```typescript
// 1. Enable MFA enrollment
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
});

// 2. Verify enrollment
await supabase.auth.mfa.verify({
  factorId: data.id,
  challengeId: challenge.id,
  code: userEnteredCode,
});

// 3. Enforce MFA for admin routes
export async function verifyAdminSession() {
  const session = await getSession();

  if (!session.isAdmin) {
    throw new Error('Admin access required');
  }

  // Check MFA level
  const { data: { user } } = await supabase.auth.getUser();
  const mfaLevel = user.app_metadata.mfa_level;

  if (mfaLevel !== 'aal2') {
    throw new Error('MFA_REQUIRED');
  }

  return session;
}
```

**Enforcement points:**
- Admin invitation acceptance (must set up MFA)
- First login after invitation
- Before performing sensitive operations
- Re-authentication for critical actions

**Why it matters:**
- ALL Fortune 500 platforms require or strongly recommend MFA
- Protects against credential theft/phishing
- Required for compliance (SOC 2, ISO 27001)
- Minimal user friction with authenticator apps

**MFA methods priority:**
1. **Authenticator apps** (recommended): Google Authenticator, Authy
2. **Security keys** (highest security): YubiKey, hardware tokens
3. **SMS** (deprecated): Vulnerable to SIM swapping

**Sources:**
- AWS, Azure, Google Cloud, Salesforce all require MFA for privileged accounts
- [Require Multifactor Authentication | CISA](https://www.cisa.gov/audiences/small-and-medium-businesses/secure-your-business/require-multifactor-authentication)

---

### 6. Implement Comprehensive Audit Logging (HIGH)

**Priority:** 🟡 High
**Difficulty:** Low-Medium
**Time Estimate:** 4-8 hours
**ROI:** High

**What to do:**
Log all admin actions to a dedicated audit table:

```sql
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', etc.
  resource_type TEXT NOT NULL, -- 'user', 'questionnaire', 'settings', etc.
  resource_id TEXT,
  details JSONB, -- Additional context
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_action ON public.audit_log(action);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX idx_audit_log_resource ON public.audit_log(resource_type, resource_id);

-- Enable RLS
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can read audit log"
ON public.audit_log FOR SELECT
TO authenticated
USING (is_admin());
```

**Helper function:**
```typescript
// lib/audit.ts
import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { headers } from 'next/headers';

export async function logAdminAction(
  userId: string,
  userEmail: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip');
  const userAgent = headersList.get('user-agent');

  const supabase = createAdminClient();

  await supabase.from('audit_log').insert({
    user_id: userId,
    user_email: userEmail,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    details,
    ip_address: ip,
    user_agent: userAgent,
  });
}
```

**Usage in Server Actions:**
```typescript
'use server';
export async function deleteUser(userId: string) {
  const session = await verifyAdminSession();

  // Perform action
  await db.users.delete({ where: { id: userId } });

  // Log action
  await logAdminAction(
    session.userId,
    session.email,
    'delete',
    'user',
    userId,
    { reason: 'Admin deletion' }
  );
}
```

**What to log:**
- All CRUD operations (create, read, update, delete)
- Login/logout events
- Failed authentication attempts
- Permission changes
- MFA enrollment/removal
- Session creation/revocation
- API key generation
- Settings changes

**Why it matters:**
- Security incident investigation
- Compliance requirements (GDPR, HIPAA, SOC 2)
- Detect unauthorized access
- User accountability
- Forensic analysis

**Retention policy:**
- Minimum: 90 days
- Recommended: 1 year
- Compliance: Check specific requirements

**Sources:**
- All Fortune 500 platforms have comprehensive audit logging
- Required for SOC 2, ISO 27001, GDPR compliance

---

### 7. Implement Rate Limiting on Authentication Endpoints (HIGH)

**Priority:** 🟡 High
**Difficulty:** Medium
**Time Estimate:** 4-8 hours
**ROI:** High

**What to do:**
Protect authentication endpoints from brute-force attacks:

**Recommended limits:**
- Login endpoint: 5 attempts per 15 minutes per email/IP
- Refresh token: 10 requests per minute per token
- MFA verification: 3 attempts per 5 minutes per session
- Password reset: 3 requests per hour per email

**Implementation options:**

**Option 1: Upstash Redis (Recommended for production)**
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  prefix: 'ratelimit:login',
});

export async function loginAction(email: string, password: string) {
  // Rate limit by email
  const { success } = await loginRateLimit.limit(email);

  if (!success) {
    throw new Error('Too many login attempts. Please try again in 15 minutes.');
  }

  // Continue with login logic...
}
```

**Option 2: Supabase database (Simpler, works for low-medium traffic)**
```sql
CREATE TABLE public.rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL, -- email, IP, or token
  action TEXT NOT NULL, -- 'login', 'refresh', etc.
  attempts INTEGER DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rate_limits_lookup ON public.rate_limits(identifier, action, window_start);
```

```typescript
async function checkRateLimit(identifier: string, action: string, maxAttempts: number, windowMinutes: number) {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

  const { data } = await supabase
    .from('rate_limits')
    .select('attempts')
    .eq('identifier', identifier)
    .eq('action', action)
    .gte('window_start', windowStart.toISOString())
    .single();

  if (data && data.attempts >= maxAttempts) {
    throw new Error('Rate limit exceeded');
  }

  // Increment or create
  await supabase.rpc('increment_rate_limit', { identifier, action });
}
```

**User experience:**
```typescript
// Show clear error message
if (rateLimitExceeded) {
  return {
    error: 'Too many unsuccessful login attempts. Please try again in 15 minutes or reset your password.',
    retryAfter: 900, // seconds
  };
}
```

**Why it matters:**
- Prevents brute-force password attacks
- Protects against credential stuffing
- Reduces server load from attacks
- Required for compliance

**Sources:**
- [10 Best Practices for API Rate Limiting in 2025](https://zuplo.com/blog/2025/01/06/10-best-practices-for-api-rate-limiting-in-2025)
- [Rate Limiting with Redis](https://redis.io/glossary/rate-limiting/)

---

### 8. Secure Service Role Key Usage (HIGH)

**Priority:** 🟡 High
**Difficulty:** Low
**Time Estimate:** 2-4 hours
**ROI:** Very High

**What to do:**
Properly secure and scope Supabase service role key usage:

**Rules:**
1. NEVER expose in client-side code
2. NEVER commit to version control
3. Store ONLY in environment variables
4. Use ONLY in server-side code
5. ALWAYS verify authorization before use

**Server-only module:**
```typescript
// lib/supabase/admin.ts
import 'server-only'; // This line is CRITICAL
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

**Authorized usage pattern:**
```typescript
'use server';
export async function adminOnlyAction() {
  // 1. ALWAYS verify authorization first
  const session = await verifyAdminSession();

  if (!session.isAdmin) {
    throw new Error('Unauthorized');
  }

  // 2. ONLY NOW use admin client
  const adminClient = createAdminClient();

  // 3. Perform operation (bypasses RLS)
  const { data } = await adminClient
    .from('users')
    .select('*');

  // 4. Log the action
  await logAdminAction(session.userId, 'read', 'users');

  return data;
}
```

**Environment variables:**
```bash
# .env.local (MUST be in .gitignore)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# .gitignore
.env.local
.env*.local
```

**Key rotation schedule:**
- Regular rotation: Every 12 months
- After security incident: Immediately
- After team member departure: Within 24 hours

**Why it matters:**
- Service role key bypasses ALL RLS policies
- Exposing it = complete database compromise
- No recovery except key rotation
- Defense-in-depth requires app-level checks

**Sources:**
- [Understanding API keys | Supabase Docs](https://supabase.com/docs/guides/api/api-keys)
- [How to Secure Your Supabase Service Role Key](https://chat2db.ai/resources/blog/secure-supabase-role-key)

---

### 9. Implement Session Timeout with UX Warning (MEDIUM)

**Priority:** 🟢 Medium
**Difficulty:** Low-Medium
**Time Estimate:** 4-6 hours
**ROI:** Medium-High

**What to do:**
Implement automatic session timeout with user-friendly warnings:

**Recommended timeouts:**
- **Idle timeout:** 15 minutes (admin systems)
- **Absolute timeout:** 8 hours
- **Warning before:** 60 seconds

**Implementation:**
```typescript
// components/SessionTimeoutWarning.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function SessionTimeoutWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const router = useRouter();

  useEffect(() => {
    // Show warning at 14 minutes (1 min before 15 min timeout)
    const warningTimer = setTimeout(() => {
      setShowWarning(true);
    }, 14 * 60 * 1000);

    return () => clearTimeout(warningTimer);
  }, []);

  useEffect(() => {
    if (showWarning) {
      const countdown = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Timeout reached
            clearInterval(countdown);
            router.push('/admin/login?reason=timeout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [showWarning, router]);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Session expiring soon
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            You will be logged out in {secondsLeft} seconds due to inactivity.
          </p>
          <div className="mt-3">
            <button
              onClick={async () => {
                // Extend session
                await fetch('/api/auth/extend-session', { method: 'POST' });
                setShowWarning(false);
                setSecondsLeft(60);
              }}
              className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded hover:bg-yellow-500 font-medium text-sm"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Server-side session extension:**
```typescript
// app/api/auth/extend-session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth/session';
import { generateAccessToken } from '@/lib/auth/tokens';

export async function POST() {
  try {
    const session = await verifySession();

    // Generate new access token (resets 15-minute timer)
    const newAccessToken = await generateAccessToken(session);

    const cookieStore = await cookies();
    cookieStore.set('__Host-access-token', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 900, // Reset to 15 minutes
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

**Activity tracking:**
```typescript
// Track user activity to reset idle timer
'use client';
import { useEffect } from 'react';
import { debounce } from 'lodash';

export function useActivityTracking() {
  useEffect(() => {
    const updateActivity = debounce(async () => {
      await fetch('/api/auth/activity', { method: 'POST' });
    }, 30000); // Max once per 30 seconds

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    events.forEach((event) => {
      document.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, []);
}
```

**Why it matters:**
- Reduces window for unauthorized access
- Required for compliance (HIPAA, PCI-DSS)
- User-friendly warnings prevent data loss
- Balance security with usability

**Sources:**
- [Session Timeout Best Practices](https://www.descope.com/learn/post/session-timeout-best-practices)
- [Mastering Session Timeout in UX](https://www.numberanalytics.com/blog/ultimate-guide-session-timeout-ux-accessibility)

---

### 10. Create Security Dashboard for Admins (MEDIUM)

**Priority:** 🟢 Medium
**Difficulty:** Medium
**Time Estimate:** 8-12 hours
**ROI:** Medium

**What to do:**
Build a dashboard for admins to monitor security:

**Features to include:**
1. Active sessions overview
2. Recent security events
3. Failed login attempts
4. Admin action history
5. Permission summary
6. Security recommendations

**Example dashboard page:**
```typescript
// app/admin/security/page.tsx
import { verifyAdminSession } from '@/lib/auth/session';
import { getActiveSessions } from '@/lib/auth/sessions';
import { getRecentAuditLogs } from '@/lib/audit';
import { getFailedLogins } from '@/lib/security';

export default async function SecurityDashboard() {
  const session = await verifyAdminSession();

  const [
    activeSessions,
    recentAudits,
    failedLogins,
  ] = await Promise.all([
    getActiveSessions(session.userId),
    getRecentAuditLogs(50),
    getFailedLogins(24), // Last 24 hours
  ]);

  return (
    <div className="space-y-6">
      {/* Active Sessions */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Active Sessions</h2>
        <div className="grid gap-4">
          {activeSessions.map((s) => (
            <div key={s.id} className="border p-4 rounded">
              <p className="font-medium">{s.deviceName} - {s.deviceType}</p>
              <p className="text-sm text-gray-600">
                Last active: {s.lastActiveAt.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">IP: {s.ipAddress}</p>
              {s.isCurrent && <span className="text-green-600">Current session</span>}
              <button onClick={() => handleRevoke(s.id)}>Revoke</button>
            </div>
          ))}
        </div>
      </section>

      {/* Failed Logins */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Failed Login Attempts (24h)</h2>
        <div className="bg-red-50 p-4 rounded">
          <p className="text-3xl font-bold text-red-600">{failedLogins.count}</p>
          <p className="text-sm text-red-800">Attempts from {failedLogins.uniqueIPs} unique IPs</p>
        </div>
      </section>

      {/* Recent Admin Actions */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Admin Actions</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {recentAudits.map((log) => (
              <tr key={log.id}>
                <td>{log.created_at.toLocaleString()}</td>
                <td>{log.user_email}</td>
                <td>{log.action}</td>
                <td>{log.resource_type} {log.resource_id}</td>
                <td>{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Security Recommendations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Security Recommendations</h2>
        <ul className="space-y-2">
          {!session.mfaEnabled && (
            <li className="bg-yellow-50 p-3 rounded">
              <strong>Enable MFA:</strong> Multi-factor authentication is not enabled for your account.
              <a href="/admin/settings/mfa" className="text-blue-600 ml-2">Enable now</a>
            </li>
          )}
          {activeSessions.length > 3 && (
            <li className="bg-yellow-50 p-3 rounded">
              <strong>Multiple Sessions:</strong> You have {activeSessions.length} active sessions.
              <button onClick={handleRevokeAllOther} className="text-blue-600 ml-2">
                Sign out other devices
              </button>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
```

**Why it matters:**
- Visibility into security posture
- Early detection of suspicious activity
- User empowerment (manage own sessions)
- Security awareness for admins

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1) - CRITICAL

**Goal:** Secure authentication foundation

- [ ] Upgrade to Next.js 15.2.3+ (CVE patch)
- [ ] Implement defense-in-depth architecture (Rec #1)
- [ ] Set up __Host- prefix cookies (Rec #2)
- [ ] Create admin_users table in Supabase
- [ ] Enable RLS on all tables (Rec #4)
- [ ] Secure service role key usage (Rec #8)

**Deliverable:** Basic admin auth working with multiple security layers

### Phase 2: Token Management (Week 2) - CRITICAL

**Goal:** Robust session management

- [ ] Implement access + refresh token pattern (Rec #3)
- [ ] Add refresh token rotation
- [ ] Implement reuse detection
- [ ] Add session timeout with warnings (Rec #9)

**Deliverable:** Production-ready session management

### Phase 3: Hardening (Week 3) - HIGH PRIORITY

**Goal:** Additional security measures

- [ ] Implement MFA for all admins (Rec #5)
- [ ] Add comprehensive audit logging (Rec #6)
- [ ] Implement rate limiting (Rec #7)
- [ ] Create security dashboard (Rec #10)

**Deliverable:** Enterprise-grade security

### Phase 4: Polish & Monitor (Week 4) - ONGOING

**Goal:** Operational excellence

- [ ] Set up monitoring alerts
- [ ] Create security runbooks
- [ ] Conduct security audit
- [ ] Performance optimization
- [ ] Documentation

**Deliverable:** Production-ready admin system with monitoring

---

## Quick Wins (Do These First)

These can be implemented quickly for immediate security improvements:

### Quick Win #1: Cookie Security (30 minutes)
Update all cookie configurations to use __Host- prefix and all security attributes.

### Quick Win #2: Service Role Key (1 hour)
Move service role key to environment variables, add 'server-only' package, verify authorization before use.

### Quick Win #3: Audit Logging Table (2 hours)
Create audit_log table and start logging admin actions.

### Quick Win #4: Rate Limiting (4 hours)
Add basic rate limiting to login endpoint using Supabase table.

### Quick Win #5: Upgrade Next.js (1 hour)
Upgrade to Next.js 15.2.3+ to patch critical CVE-2025-29927.

---

## Measuring Success

### Security Metrics

**Week 1-2:**
- [ ] Zero client-side service role key usage
- [ ] 100% of tables have RLS enabled
- [ ] All cookies use __Host- prefix
- [ ] Defense-in-depth verified at all layers

**Week 3-4:**
- [ ] 100% of admins using MFA
- [ ] Token rotation working (monitor refresh token table)
- [ ] Audit log capturing all admin actions
- [ ] Rate limiting blocking brute-force attempts

**Month 2:**
- [ ] Zero successful session hijacking
- [ ] Average session timeout compliance >95%
- [ ] Failed login rate <1% of total logins
- [ ] Audit log retention policy enforced

### User Experience Metrics

- Session timeout warnings shown >1 minute before expiry
- MFA enrollment completion rate >90%
- Session extension success rate >95%
- Admin satisfaction score >4/5

---

## Common Mistakes to Avoid

### 1. Relying Only on Middleware
CVE-2025-29927 proved middleware can be bypassed. Always re-verify in Server Actions and DAL.

### 2. Not Using __Host- Prefix
Leaving cookies vulnerable to subdomain attacks. Always use __Host- prefix for auth cookies.

### 3. Long-Lived Access Tokens
Never make access tokens longer than 30 minutes. Use refresh tokens for persistence.

### 4. Exposing Service Role Key
Exposing service role key = complete database compromise. Use 'server-only' package.

### 5. No Refresh Token Rotation
Refresh tokens without rotation can be replayed indefinitely if stolen.

### 6. Skipping Audit Logs
No audit trail = impossible to investigate security incidents.

### 7. No Rate Limiting
Allows brute-force attacks. Always rate limit authentication endpoints.

### 8. Missing MFA
All Fortune 500 platforms require MFA for admin accounts. No exceptions.

### 9. Ignoring Session Timeouts
Long sessions = larger attack window. Implement timeouts with warnings.

### 10. No RLS on Supabase Tables
Application-level checks can be bypassed. Database-level RLS is mandatory.

---

## Conclusion

These 10 recommendations represent the **minimum viable security** for a production admin authentication system in 2025, based on:

- Next.js 15 official security guidance
- Supabase best practices
- Fortune 500 company patterns (AWS, Azure, Google Cloud, Salesforce, Stripe, Vercel)
- Current security standards (OWASP, NIST, etc.)
- 2025 threat landscape

**Critical path:** Implement recommendations #1-4 first (defense-in-depth, cookies, tokens, RLS). These are foundational and cannot be skipped.

**High priority:** Add #5-7 (MFA, audit logging, rate limiting) as soon as foundation is stable.

**Medium priority:** Complete #8-10 (service role security, session timeout, dashboard) for operational excellence.

**Total time estimate:** 50-80 hours for complete implementation

**Expected outcome:** Enterprise-grade admin authentication system that meets or exceeds Fortune 500 security standards.

---

## Additional Resources

### Documentation Created
1. [NEXTJS-15-AUTH-BEST-PRACTICES.md](/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/NEXTJS-15-AUTH-BEST-PRACTICES.md)
2. [SUPABASE-ADMIN-AUTH-PATTERNS.md](/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/SUPABASE-ADMIN-AUTH-PATTERNS.md)
3. [SESSION-MANAGEMENT-RESEARCH.md](/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/SESSION-MANAGEMENT-RESEARCH.md)
4. [COOKIE-SECURITY-2025.md](/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/COOKIE-SECURITY-2025.md)
5. [FORTUNE-500-AUTH-PATTERNS.md](/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/FORTUNE-500-AUTH-PATTERNS.md)

### External Resources
- [Next.js 15 Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OAuth 2.0 Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
