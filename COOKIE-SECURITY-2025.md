# Cookie Security Best Practices 2025

**Last Updated:** December 2025
**Target Audience:** Web developers implementing secure cookie-based authentication

---

## Table of Contents
- [Core Cookie Security Attributes](#core-cookie-security-attributes)
- [Cookie Prefixes (__Host- and __Secure-)](#cookie-prefixes-__host--and-__secure-)
- [Cookie Scope (Domain & Path)](#cookie-scope-domain--path)
- [Cookie Expiration Strategies](#cookie-expiration-strategies)
- [Third-Party Cookie Deprecation](#third-party-cookie-deprecation)
- [Complete Configuration Examples](#complete-configuration-examples)
- [Security Checklist](#security-checklist)

---

## Core Cookie Security Attributes

### HttpOnly

**What it does:** Prevents JavaScript from accessing the cookie via `document.cookie`.

**Why it matters:** Protects against Cross-Site Scripting (XSS) attacks. Even if an attacker injects malicious JavaScript, they cannot steal the cookie.

**When to use:** ALWAYS for authentication tokens and session identifiers.

```typescript
// Next.js 15
const cookieStore = await cookies();
cookieStore.set('session-token', token, {
  httpOnly: true, // REQUIRED for security
});
```

**Security Impact:**
- ✅ Blocks XSS cookie theft
- ✅ Prevents client-side manipulation
- ❌ Cookie still vulnerable to CSRF (use SameSite)

**Common Mistake:**
```typescript
// ❌ WRONG: Accessible to JavaScript
cookieStore.set('session-token', token, {
  httpOnly: false, // Vulnerable to XSS!
});
```

### Secure

**What it does:** Cookie is only sent over HTTPS connections.

**Why it matters:** Prevents man-in-the-middle attacks. Cookies sent over HTTP can be intercepted.

**When to use:** ALWAYS in production. Optional in local development (http://localhost).

```typescript
cookieStore.set('session-token', token, {
  secure: process.env.NODE_ENV === 'production', // true in production
});
```

**Security Impact:**
- ✅ Protects against network sniffing
- ✅ Prevents cookie theft over unsecured connections
- ⚠️ Requires HTTPS (certificate needed)

**Production Requirement:**
```typescript
// ✅ CORRECT: Always secure in production
cookieStore.set('session-token', token, {
  secure: true,
});
```

### SameSite

**What it does:** Controls when cookies are sent with cross-site requests.

**Options:**

1. **SameSite=Strict** (Most Secure)
   - Cookie ONLY sent on same-site requests
   - NOT sent when navigating TO your site from external link
   - Best for critical auth cookies

   ```typescript
   cookieStore.set('admin-session', token, {
     sameSite: 'strict', // Maximum CSRF protection
   });
   ```

   **Trade-off:** User must re-authenticate when clicking links from external sites (emails, social media).

2. **SameSite=Lax** (Balanced - Default in Modern Browsers)
   - Cookie sent on top-level navigation (clicking links)
   - NOT sent on cross-site sub-requests (images, iframes, AJAX)
   - Good balance of security and usability

   ```typescript
   cookieStore.set('session', token, {
     sameSite: 'lax', // Default, good for most use cases
   });
   ```

   **Use Case:** General authentication where users arrive from external links.

3. **SameSite=None** (Least Secure - Requires Secure)
   - Cookie sent on ALL requests (same-site and cross-site)
   - MUST be paired with `Secure` attribute
   - Required for embedded content (iframes), cross-domain APIs

   ```typescript
   cookieStore.set('tracking', token, {
     sameSite: 'none',
     secure: true, // REQUIRED with SameSite=None
   });
   ```

   **Use Case:** Third-party integrations, embedded widgets.

**Comparison Table:**

| SameSite Value | CSRF Protection | Link Navigation | Cross-Site AJAX | Embedded Iframe |
|---------------|-----------------|-----------------|-----------------|-----------------|
| Strict | ✅ Maximum | ❌ No cookie | ❌ No cookie | ❌ No cookie |
| Lax (default) | ✅ Good | ✅ Cookie sent | ❌ No cookie | ❌ No cookie |
| None | ❌ No protection | ✅ Cookie sent | ✅ Cookie sent | ✅ Cookie sent |

**Recommendation for Admin Auth:**
```typescript
// Use Strict for admin sessions
cookieStore.set('admin-session', token, {
  sameSite: 'strict',
});
```

**Browser Default (2025):** If not specified, browsers default to `SameSite=Lax`.

**Sources:**
- [Secure cookie configuration - MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies)
- [Using HTTP cookies - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)
- [Cookie Security Guide](https://barrion.io/blog/cookie-security-best-practices)

---

## Cookie Prefixes (__Host- and __Secure-)

### Why Use Cookie Prefixes?

Cookie prefixes provide **defense-in-depth** by enforcing security attributes at the browser level. They prevent certain classes of attacks even if your application code has bugs.

### __Host- Prefix (Maximum Security - RECOMMENDED)

**Requirements:**
- Must have `Secure` attribute
- Must have `Path=/`
- Must NOT have `Domain` attribute
- Must be set from HTTPS origin

**What it guarantees:**
- Cookie bound to exact hostname (not subdomains)
- Cannot be overwritten by subdomain
- Always sent over HTTPS
- Available on all paths

**Example:**
```typescript
// Next.js 15
const cookieStore = await cookies();
cookieStore.set('__Host-session-token', token, {
  httpOnly: true,
  secure: true,        // REQUIRED
  sameSite: 'strict',
  path: '/',           // REQUIRED
  maxAge: 3600,
  // Domain is NOT allowed with __Host- prefix
});
```

**Security Benefits:**
- ✅ Prevents subdomain cookie attacks
- ✅ Ensures HTTPS-only transmission
- ✅ Locks cookie to exact host
- ✅ No path-based attacks

**Use Case:** Primary authentication cookies for admin systems.

### __Secure- Prefix

**Requirements:**
- Must have `Secure` attribute
- Must be set from HTTPS origin

**What it guarantees:**
- Cookie sent over HTTPS only

**Example:**
```typescript
cookieStore.set('__Secure-preferences', data, {
  secure: true, // REQUIRED
  sameSite: 'lax',
  maxAge: 86400,
});
```

**Use Case:** When you need subdomain access but still want HTTPS enforcement.

### __Host-Http- Prefix (New 2025 Standard)

**Requirements:**
- All `__Host-` requirements, PLUS:
- Must have `HttpOnly` attribute
- Must be set via `Set-Cookie` header (not JavaScript)

**Example:**
```typescript
cookieStore.set('__Host-Http-admin-session', token, {
  httpOnly: true,  // REQUIRED
  secure: true,    // REQUIRED
  sameSite: 'strict',
  path: '/',       // REQUIRED
  maxAge: 3600,
});
```

**Security Benefits:**
- ✅ All `__Host-` benefits
- ✅ Guaranteed server-side only
- ✅ Impossible to set via JavaScript
- ✅ Strongest cookie security available

**Use Case:** Critical authentication tokens in 2025+ applications.

### Comparison Table

| Prefix | Secure Required | Path=/ Required | No Domain | HttpOnly Required | Best For |
|--------|----------------|-----------------|-----------|-------------------|----------|
| (none) | No | No | No | No | Non-sensitive data |
| __Secure- | Yes | No | No | No | HTTPS enforcement |
| __Host- | Yes | Yes | Yes | No | Auth tokens (legacy) |
| __Host-Http- | Yes | Yes | Yes | Yes | Auth tokens (2025) |

### Migration Strategy

**Phase 1: Add __Host- prefix**
```typescript
// Old (vulnerable to subdomain attacks)
cookieStore.set('session', token, { ... });

// New (protected)
cookieStore.set('__Host-session', token, {
  secure: true,
  path: '/',
  // No domain attribute
});
```

**Phase 2: Upgrade to __Host-Http- (when browser support is widespread)**
```typescript
cookieStore.set('__Host-Http-session', token, {
  httpOnly: true,
  secure: true,
  path: '/',
});
```

### Browser Support (2025)

- **__Host-:** Supported in all modern browsers (Chrome 49+, Firefox 47+, Safari 10+)
- **__Secure-:** Supported in all modern browsers
- **__Host-Http-:** New standard, check [caniuse.com](https://caniuse.com) for current support

**Sources:**
- [Set-Cookie - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [What are cookie prefixes?](https://inventivehq.com/blog/what-are-cookie-prefixes)
- [Cookie attributes | Privacy Sandbox](https://privacysandbox.google.com/cookies/basics/cookie-attributes)

---

## Cookie Scope (Domain & Path)

### Domain Attribute

**Default (most secure):** If omitted, cookie is bound to exact hostname.

**Specified Domain:** Cookie available to domain and all subdomains.

**Examples:**

```typescript
// Exact hostname only (example.com, NOT sub.example.com)
cookieStore.set('session', token, {
  // No domain attribute
});

// All subdomains (example.com, sub.example.com, api.example.com)
cookieStore.set('shared-session', token, {
  domain: '.example.com', // Note the leading dot
});
```

**Security Implications:**

```typescript
// ✅ SECURE: Exact hostname
cookieStore.set('__Host-admin-session', token, {
  // No domain - restricted to admin.example.com
  path: '/',
});

// ⚠️ LESS SECURE: All subdomains
cookieStore.set('session', token, {
  domain: '.example.com', // Accessible to malicious.example.com too!
});
```

**Attack Scenario:**
If you set `domain: '.example.com'` and an attacker controls `evil.example.com`, they can access your cookies.

**Best Practice for Admin Systems:**
```typescript
// Don't set domain attribute - maximum security
cookieStore.set('__Host-admin-session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
  // NO domain attribute
});
```

### Path Attribute

**Default:** `/` (available on all paths)

**Specified Path:** Cookie only sent when request path matches.

**Examples:**

```typescript
// Available on all paths
cookieStore.set('global-session', token, {
  path: '/',
});

// Only available on /admin/* paths
cookieStore.set('admin-data', token, {
  path: '/admin',
});

// Only sent to refresh endpoint
cookieStore.set('refresh-token', token, {
  path: '/api/auth/refresh',
});
```

**Security Use Case: Path Restriction**

Restrict refresh tokens to only the refresh endpoint:

```typescript
// Access token: Available everywhere
cookieStore.set('__Host-access-token', accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/', // Available on all routes
  maxAge: 900, // 15 minutes
});

// Refresh token: Only sent to refresh endpoint
cookieStore.set('__Host-refresh-token', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/api/auth/refresh', // ONLY sent to this endpoint
  maxAge: 604800, // 7 days
});
```

**Benefits:**
- ✅ Reduces refresh token exposure
- ✅ Limits attack surface
- ✅ Follows principle of least privilege

**Important:** Path is NOT a security boundary. It's defense-in-depth, not primary protection.

### Subdomain Considerations

**Scenario:** Admin dashboard at `admin.example.com`, API at `api.example.com`

**Option 1: Separate Cookies (Most Secure)**
```typescript
// Admin dashboard cookie (admin.example.com only)
cookieStore.set('__Host-admin-session', adminToken, {
  // No domain - restricted to admin.example.com
});

// API uses header-based auth instead
// Authorization: Bearer <token>
```

**Option 2: Shared Cookie (Less Secure)**
```typescript
cookieStore.set('shared-session', token, {
  domain: '.example.com', // Both subdomains can access
});
```

**Recommendation:** Use separate cookies or header-based auth for cross-subdomain scenarios.

**Sources:**
- [Using HTTP cookies - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)
- [OWASP Testing for Cookies Attributes](https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing-for-Cookies-Attributes)

---

## Cookie Expiration Strategies

### Expiration Options

**1. MaxAge (Recommended)**
```typescript
cookieStore.set('session', token, {
  maxAge: 3600, // Seconds (1 hour)
});
```

**2. Expires**
```typescript
cookieStore.set('session', token, {
  expires: new Date(Date.now() + 3600000), // Milliseconds
});
```

**Difference:**
- `maxAge`: Relative to when cookie is set (preferred)
- `expires`: Absolute timestamp (can have clock skew issues)

**Recommendation:** Use `maxAge` for consistency across timezones and clock drift.

### Session vs Persistent Cookies

**Session Cookie (Deleted When Browser Closes):**
```typescript
cookieStore.set('temp-session', token, {
  // No maxAge or expires
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
});
```

**Persistent Cookie (Survives Browser Restart):**
```typescript
cookieStore.set('persistent-session', token, {
  maxAge: 604800, // 7 days
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
});
```

### Expiration Strategy for Admin Systems

**Access Token (Short-lived):**
```typescript
cookieStore.set('__Host-access-token', accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
  maxAge: 900, // 15 minutes
});
```

**Refresh Token (Medium-lived):**
```typescript
cookieStore.set('__Host-refresh-token', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/api/auth/refresh',
  maxAge: 604800, // 7 days
});
```

**Remember Me Token (Long-lived - Use Carefully):**
```typescript
cookieStore.set('__Host-remember-me', rememberToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
  maxAge: 2592000, // 30 days (MAX recommended)
});
```

### Token Expiration Best Practices

| Token Type | Recommended Lifetime | Security Level |
|-----------|---------------------|----------------|
| Access Token | 15-30 minutes | High |
| Refresh Token | 7-14 days | Medium |
| Remember Me | 30 days max | Low |
| Session Cookie | Browser session | High |
| MFA Token | 5 minutes | Critical |

### Automatic Cleanup

**Server-side token validation:**
```typescript
export async function validateToken(token: string) {
  const decoded = jwt.verify(token, SECRET);

  // Even if cookie hasn't expired, check token exp claim
  if (decoded.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }

  return decoded;
}
```

**Database cleanup job:**
```sql
-- Delete expired refresh tokens daily
DELETE FROM refresh_tokens
WHERE expires_at < NOW();
```

### Early Expiration for Security Events

```typescript
export async function revokeUserSessions(userId: string) {
  // Delete all refresh tokens
  await db.refreshTokens.deleteMany({
    where: { userId },
  });

  // Access tokens will expire naturally (15 min max)
}
```

**Sources:**
- [Set-Cookie header - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)
- [Token Expiry Best Practices](https://zuplo.com/learning-center/token-expiry-best-practices)

---

## Third-Party Cookie Deprecation

### What's Changing in 2025?

**Chrome's Third-Party Cookie Phase-Out:**
- Chrome is deprecating third-party cookies
- Affects cookies set by domains different from the page you're on
- Tracking Protection enabled by default

**Impact on Admin Systems:** Minimal, but important to understand.

### First-Party vs Third-Party Cookies

**First-Party Cookie:**
```
User visits: https://admin.yoursite.com
Cookie domain: admin.yoursite.com
Result: FIRST-PARTY (works normally)
```

**Third-Party Cookie:**
```
User visits: https://othersite.com
Embedded iframe: https://admin.yoursite.com
Cookie from iframe: admin.yoursite.com
Result: THIRD-PARTY (blocked in modern browsers)
```

### When Third-Party Cookies Are Used

**Scenarios:**
- Embedded widgets/iframes
- Cross-domain authentication (SSO)
- Analytics/tracking
- Third-party integrations

### Solutions for Cross-Domain Scenarios

**1. Use Partitioned Cookies**

```typescript
cookieStore.set('embedded-session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'none', // Required for cross-site
  partitioned: true, // NEW: Partition by top-level site
});
```

**How Partitioned Cookies Work:**
- Cookie is isolated per top-level site
- `admin.yoursite.com` embedded in `partner1.com` gets different cookie than when embedded in `partner2.com`
- Prevents cross-site tracking while allowing legitimate embedded use

**Recommendation with Partitioned:**
```typescript
cookieStore.set('__Host-embedded-session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  partitioned: true,
  path: '/',
});
```

**2. Use Alternative Authentication Methods**

For cross-domain API calls:
```typescript
// Instead of cookies, use Authorization header
fetch('https://api.yoursite.com/data', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

**3. Storage Access API (for Embedded Content)**

```typescript
// Request storage access for embedded iframe
async function requestAccess() {
  try {
    await document.requestStorageAccess();
    // Now can access cookies
  } catch (error) {
    // User denied or not in embedded context
  }
}
```

### Impact on Admin Systems

**Typical Admin Setup (NOT AFFECTED):**
```
User visits: https://admin.yoursite.com
Admin cookies: Set by admin.yoursite.com
Result: FIRST-PARTY - No impact from third-party cookie deprecation
```

**Edge Cases (MAY BE AFFECTED):**
- Admin dashboard embedded in iframe on another domain
- Cross-domain SSO scenarios
- Third-party admin tools/widgets

**Mitigation:**
```typescript
// For admin systems, stay first-party
// Use __Host- prefix for maximum protection
cookieStore.set('__Host-admin-session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict', // First-party only
  path: '/',
});
```

### Testing Third-Party Cookie Scenarios

**Chrome DevTools:**
1. Open DevTools → Application → Cookies
2. Look for "Issues" tab - warnings about third-party cookies
3. Enable "Third-party cookies blocked" in Chrome settings to test

**Recommendations:**
- Audit all cookie usage
- Ensure admin auth uses first-party cookies
- Use Authorization headers for API calls
- Test with third-party cookies disabled

**Sources:**
- [Cookie attributes | Privacy Sandbox](https://privacysandbox.google.com/cookies/basics/cookie-attributes)
- [Understanding Secure Cookies | BrowserStack](https://www.browserstack.com/guide/cookie-secure)

---

## Complete Configuration Examples

### Example 1: Admin Session Cookie (Maximum Security)

```typescript
import { cookies } from 'next/headers';

export async function setAdminSession(token: string) {
  const cookieStore = await cookies();

  cookieStore.set('__Host-admin-session', token, {
    httpOnly: true,        // Prevent JavaScript access
    secure: true,          // HTTPS only
    sameSite: 'strict',    // Maximum CSRF protection
    path: '/',             // Available on all admin routes
    maxAge: 900,           // 15 minutes
  });
}
```

**Security Level:** Maximum
**Use Case:** Primary admin authentication token

### Example 2: Refresh Token (Path-Restricted)

```typescript
export async function setRefreshToken(token: string) {
  const cookieStore = await cookies();

  cookieStore.set('__Host-refresh-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/auth/refresh', // ONLY sent to refresh endpoint
    maxAge: 604800,            // 7 days
  });
}
```

**Security Level:** High
**Use Case:** Long-lived refresh token with restricted exposure

### Example 3: User Preferences (Non-Sensitive)

```typescript
export async function setUserPreferences(prefs: string) {
  const cookieStore = await cookies();

  cookieStore.set('__Secure-user-prefs', prefs, {
    httpOnly: false,     // Accessible to JavaScript (for UI)
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 31536000,    // 1 year
  });
}
```

**Security Level:** Medium
**Use Case:** Non-sensitive user settings that need JavaScript access

### Example 4: Development vs Production

```typescript
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';

  cookieStore.set(
    isProduction ? '__Host-session' : 'dev-session',
    token,
    {
      httpOnly: true,
      secure: isProduction, // HTTPS required in production only
      sameSite: 'strict',
      path: '/',
      maxAge: 900,
    }
  );
}
```

**Note:** Can't use `__Host-` prefix in development (requires HTTPS).

### Example 5: Multi-Cookie Auth Setup

```typescript
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();

  // Access token - short-lived, all routes
  cookieStore.set('__Host-access-token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 900, // 15 minutes
  });

  // Refresh token - long-lived, restricted path
  cookieStore.set('__Host-refresh-token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/auth/refresh',
    maxAge: 604800, // 7 days
  });

  // CSRF token - readable by JS for forms
  const csrfToken = generateCSRFToken();
  cookieStore.set('__Host-csrf-token', csrfToken, {
    httpOnly: false, // Needs to be readable
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 900,
  });
}
```

### Example 6: Clearing Cookies on Logout

```typescript
export async function clearAuthCookies() {
  const cookieStore = await cookies();

  // Delete all auth cookies
  cookieStore.delete('__Host-access-token');
  cookieStore.delete('__Host-refresh-token');
  cookieStore.delete('__Host-csrf-token');

  // Alternative: Set maxAge to 0
  cookieStore.set('__Host-session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0, // Immediately expire
  });
}
```

---

## Security Checklist

### Production Cookie Checklist

#### Authentication Cookies
- [ ] `httpOnly: true` (prevent JavaScript access)
- [ ] `secure: true` (HTTPS only)
- [ ] `sameSite: 'strict'` (CSRF protection)
- [ ] `__Host-` or `__Host-Http-` prefix (2025 standard)
- [ ] `path: '/'` (required for __Host-)
- [ ] NO `domain` attribute (host-bound)
- [ ] Short `maxAge` for access tokens (15 min)
- [ ] Longer `maxAge` for refresh tokens (7 days)

#### Refresh Tokens (Additional)
- [ ] Path-restricted (`path: '/api/auth/refresh'`)
- [ ] Rotation on every use
- [ ] Reuse detection implemented
- [ ] Stored in database with user_id
- [ ] Revocable by user

#### CSRF Protection
- [ ] `sameSite: 'strict'` or `'lax'`
- [ ] Additional CSRF token for state-changing operations
- [ ] Origin/Referer header validation

#### General Security
- [ ] All sensitive cookies use `__Host-` prefix
- [ ] No sensitive data in cookie values (use references/tokens)
- [ ] Cookie size kept minimal (<4KB)
- [ ] Regular security audits of cookie usage
- [ ] Monitoring for unusual cookie access patterns

#### Development vs Production
- [ ] Different cookie names in dev/prod
- [ ] `secure: true` enforced in production
- [ ] `__Host-` prefix used in production
- [ ] Environment-specific secrets (JWT signing keys)

#### Compliance
- [ ] Cookie consent banner (if required by GDPR/CCPA)
- [ ] Cookie policy documentation
- [ ] Data retention policies enforced
- [ ] User can view/delete their sessions

---

## Common Security Mistakes

### Mistake 1: Not Using HttpOnly
```typescript
// ❌ WRONG: Vulnerable to XSS
cookieStore.set('session', token, {
  httpOnly: false, // Can be stolen via JavaScript!
});

// ✅ CORRECT
cookieStore.set('__Host-session', token, {
  httpOnly: true,
});
```

### Mistake 2: Not Using Secure in Production
```typescript
// ❌ WRONG: Sent over HTTP
cookieStore.set('session', token, {
  secure: false, // Vulnerable to network sniffing!
});

// ✅ CORRECT
cookieStore.set('__Host-session', token, {
  secure: true,
});
```

### Mistake 3: Using SameSite=None Without Good Reason
```typescript
// ❌ WRONG: No CSRF protection
cookieStore.set('session', token, {
  sameSite: 'none',
  secure: true,
});

// ✅ CORRECT: Use 'strict' for admin systems
cookieStore.set('__Host-admin-session', token, {
  sameSite: 'strict',
});
```

### Mistake 4: Overly Broad Domain
```typescript
// ❌ WRONG: Accessible to all subdomains (including attacker-controlled)
cookieStore.set('session', token, {
  domain: '.example.com',
});

// ✅ CORRECT: No domain attribute (exact host only)
cookieStore.set('__Host-session', token, {
  // No domain attribute
});
```

### Mistake 5: Long-Lived Sensitive Tokens
```typescript
// ❌ WRONG: Access token valid for 30 days
cookieStore.set('access-token', token, {
  maxAge: 2592000, // Too long!
});

// ✅ CORRECT: Short-lived access, long-lived refresh
cookieStore.set('__Host-access-token', accessToken, {
  maxAge: 900, // 15 minutes
});
cookieStore.set('__Host-refresh-token', refreshToken, {
  maxAge: 604800, // 7 days
  path: '/api/auth/refresh',
});
```

---

## References

1. [Secure cookie configuration - Security | MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies)
2. [Cookie Security Guide | HttpOnly, Secure, SameSite Examples](https://barrion.io/blog/cookie-security-best-practices)
3. [Using HTTP cookies - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)
4. [Set-Cookie - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
5. [Cookie attributes | Privacy Sandbox](https://privacysandbox.google.com/cookies/basics/cookie-attributes)
6. [OWASP Testing for Cookies Attributes](https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing-for-Cookies-Attributes)
7. [What are cookie prefixes?](https://inventivehq.com/blog/what-are-cookie-prefixes)
8. [Understanding Secure Cookies | BrowserStack](https://www.browserstack.com/guide/cookie-secure)
