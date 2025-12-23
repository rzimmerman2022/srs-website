# Session Management Best Practices

**Last Updated:** December 2025
**Target Audience:** Developers implementing secure session management for admin applications

---

## Table of Contents
- [JWT vs Opaque Tokens](#jwt-vs-opaque-tokens)
- [Access Token + Refresh Token Pattern](#access-token--refresh-token-pattern)
- [Token Rotation Strategies](#token-rotation-strategies)
- [Session Storage Options](#session-storage-options)
- [Multi-Device Session Management](#multi-device-session-management)
- [Session Timeout & UX](#session-timeout--ux)
- [Implementation Recommendations](#implementation-recommendations)

---

## JWT vs Opaque Tokens

### Comparison Overview

| Feature | JWT Tokens | Opaque Tokens |
|---------|-----------|---------------|
| **Structure** | Self-contained, readable JSON | Random string, no information |
| **Validation** | Stateless (no DB lookup) | Stateful (requires DB lookup) |
| **Performance** | Fast (no DB calls) | Slower (DB query per request) |
| **Revocation** | Difficult (delayed until expiry) | Immediate (delete from DB) |
| **Token Size** | Larger (contains claims) | Small (random string) |
| **Information Exposure** | Readable by anyone | No information exposed |
| **Use Case** | Microservices, APIs | High security, frequent updates |

### JWT Tokens: Deep Dive

**What They Are:**
JWTs are self-contained tokens that carry user information and claims. Anyone with the public key can validate them without contacting the authorization server.

**Structure:**
```
header.payload.signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Pros:**
- Stateless architecture - no server-side storage required
- Decentralized validation - any service can verify
- Fast performance - no database calls needed
- Scalable for microservices
- Contains user data directly

**Cons:**
- Hard to revoke before expiration
- Larger size than opaque tokens
- Information readable by anyone (don't store secrets)
- Requires careful expiration management
- Cannot immediately update permissions

**When to Use JWTs:**
- Stateless, scalable systems
- Microservices architecture
- High-performance applications
- When revocation is less critical
- API authentication across services

**Security Concerns:**
- JWTs are a bad choice for storing long-lasting authorization and session data
- Can be read by anyone who gets ahold of the token (information leakage)
- When using cookies for JWT, CSRF attacks must be prevented
- Should use short expiration times (15-30 minutes)

### Opaque Tokens: Deep Dive

**What They Are:**
Random strings that map to session data stored securely on the server. Carry no readable information.

**Structure:**
```
Example: a1b2c3d4e5f6g7h8i9j0
```

**Pros:**
- No information exposure
- Immediate revocation capability
- Permissions update instantly
- Smaller token size
- Better for sensitive data

**Cons:**
- Requires database lookup per request
- Slower performance
- Server-side storage needed
- Not suitable for stateless architectures
- Single point of failure (session store)

**When to Use Opaque Tokens:**
- High security requirements
- Frequent permission updates needed
- Transmitting sensitive information
- When immediate revocation is critical
- Centralized authentication systems

### Hybrid Approach (Recommended for Most Applications)

Many production systems use both:

**Pattern: Short-lived JWT + Opaque Refresh Token**

```typescript
// Access token: JWT (short-lived, 15 minutes)
const accessToken: JWT = {
  sub: userId,
  email: user.email,
  role: user.role,
  exp: Date.now() + 15 * 60 * 1000, // 15 minutes
};

// Refresh token: Opaque (long-lived, 7 days, stored in DB)
const refreshToken = crypto.randomBytes(32).toString('hex');
await db.refreshTokens.create({
  token: refreshToken,
  userId,
  expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
});
```

**Benefits:**
- Fast API access with JWT
- Secure, revocable sessions with refresh tokens
- Balance between performance and security
- Standard OAuth 2.0 pattern

### Phantom Token Pattern (Advanced)

The authorization server issues opaque tokens to OAuth clients, preventing information leakage. An API gateway performs token introspection, converting the opaque token to a JWT for internal services.

**Flow:**
```
Client → [Opaque Token] → API Gateway
API Gateway → [Token Introspection] → Auth Server
Auth Server → [JWT] → API Gateway
API Gateway → [JWT] → Internal Services
```

**Benefits:**
- External security (opaque) + Internal performance (JWT)
- No token information leaked to clients
- Immediate revocation capability
- Fast internal service communication

**Sources:**
- [A Guide to Bearer Tokens: JWT vs. Opaque Tokens](https://www.permit.io/blog/a-guide-to-bearer-tokens-jwt-vs-opaque-tokens)
- [JWT vs Opaque Tokens: All You Need to Know](https://medium.com/identity-beyond-borders/jwt-vs-opaque-tokens-all-you-need-to-know-307bf19bade8)
- [JWT vs. Opaque Tokens](https://zitadel.com/blog/jwt-vs-opaque-tokens)
- [How Should You Serve Your Access Tokens](https://curity.io/blog/how-should-you-serve-your-access-tokens-jwts-phantom-or-split/)

---

## Access Token + Refresh Token Pattern

### Why Use This Pattern?

**Problem:** Long-lived access tokens are a security risk if compromised.
**Solution:** Short-lived access tokens + long-lived refresh tokens.

**Benefits:**
- Limits damage from stolen access tokens
- Maintains good user experience
- Enables secure revocation
- Industry standard (OAuth 2.0)

### Token Lifetime Recommendations

**Access Tokens:**
- **Duration:** 15-30 minutes
- **Type:** JWT (for performance)
- **Storage:** Memory or httpOnly cookie
- **Revocation:** Not necessary (expires quickly)

**Refresh Tokens:**
- **Duration:** 7-14 days maximum
- **Type:** Opaque (for security)
- **Storage:** Database + httpOnly cookie
- **Revocation:** Required capability

### Implementation Example

**1. Login Flow**

```typescript
// app/actions/login.ts
'use server';

import { generateAccessToken, generateRefreshToken } from '@/lib/auth/tokens';
import { cookies } from 'next/headers';

export async function login(email: string, password: string) {
  // Verify credentials
  const user = await verifyCredentials(email, password);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const accessToken = await generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = await generateRefreshToken(user.id);

  // Set cookies
  const cookieStore = await cookies();

  cookieStore.set('access-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  cookieStore.set('refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/api/auth/refresh',
  });

  return { success: true };
}
```

**2. Token Generation**

```typescript
// lib/auth/tokens.ts
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '@/lib/db';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export async function generateAccessToken(payload: {
  userId: string;
  email: string;
  role: string;
}): Promise<string> {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
    algorithm: 'HS256',
  });
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');

  // Store in database
  await db.refreshTokens.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return token;
}

export async function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };
  } catch (error) {
    throw new Error('Invalid access token');
  }
}

export async function verifyRefreshToken(token: string) {
  const refreshToken = await db.refreshTokens.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!refreshToken || refreshToken.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  return refreshToken;
}
```

**3. Refresh Token Endpoint**

```typescript
// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from '@/lib/auth/tokens';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh-token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const tokenData = await verifyRefreshToken(refreshToken);

    // Generate new tokens
    const newAccessToken = await generateAccessToken({
      userId: tokenData.user.id,
      email: tokenData.user.email,
      role: tokenData.user.role,
    });

    const newRefreshToken = await generateRefreshToken(tokenData.user.id);

    // Delete old refresh token
    await db.refreshTokens.delete({
      where: { token: refreshToken },
    });

    // Set new cookies
    cookieStore.set('access-token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60,
      path: '/',
    });

    cookieStore.set('refresh-token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/api/auth/refresh',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid refresh token' },
      { status: 401 }
    );
  }
}
```

**4. Middleware to Refresh Tokens**

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/tokens';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access-token')?.value;

  if (!accessToken) {
    // Try to refresh
    return NextResponse.redirect(new URL('/api/auth/refresh', request.url));
  }

  try {
    await verifyAccessToken(accessToken);
    return NextResponse.next();
  } catch (error) {
    // Access token expired, try refresh
    return NextResponse.redirect(new URL('/api/auth/refresh', request.url));
  }
}
```

**Sources:**
- [What Are Refresh Tokens and How to Use Them Securely](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)
- [Token Expiry Best Practices](https://zuplo.com/learning-center/token-expiry-best-practices)
- [OAuth 2 Refresh Tokens: A Practical Guide](https://frontegg.com/blog/oauth-2-refresh-tokens)

---

## Token Rotation Strategies

### What is Token Rotation?

Refresh token rotation replaces the refresh token after every use, ensuring tokens are valid for one-time use only.

**How it works:**
1. Client sends refresh token to get new access token
2. Server validates refresh token
3. Server issues NEW access token AND NEW refresh token
4. Server invalidates OLD refresh token
5. Client stores new refresh token for next refresh

### Why Rotate Tokens?

**Security Benefits:**
- Limits window of opportunity for stolen tokens
- Enables reuse detection (security red flag)
- Reduces impact of token leakage
- Blocks replay attacks
- Simplifies session management

### Reuse Detection Pattern

**Critical Security Feature:** If a previously-used refresh token is used again, it indicates a security breach.

```typescript
// lib/auth/refresh-token-rotation.ts
import { db } from '@/lib/db';

export async function refreshTokenWithRotation(oldToken: string) {
  // Check if token exists and is valid
  const tokenRecord = await db.refreshTokens.findUnique({
    where: { token: oldToken },
    include: { user: true },
  });

  if (!tokenRecord) {
    // Token doesn't exist - could be:
    // 1. Already used (rotation happened)
    // 2. Revoked
    // 3. Never existed (attack)

    // Check if it was recently rotated
    const recentlyRotated = await db.refreshTokens.findFirst({
      where: {
        previousToken: oldToken,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // 5 min grace period
        },
      },
    });

    if (recentlyRotated) {
      // Token was just rotated - allow (handles race conditions)
      return await generateNewTokenPair(recentlyRotated.userId);
    }

    // SECURITY ALERT: Potential token reuse attack
    await handleTokenReuseDetected(oldToken);
    throw new Error('Token reuse detected - security violation');
  }

  // Check expiration
  if (tokenRecord.expiresAt < new Date()) {
    throw new Error('Refresh token expired');
  }

  // Generate new token pair
  const newTokens = await generateNewTokenPair(tokenRecord.userId);

  // Store reference to old token (for reuse detection)
  await db.refreshTokens.update({
    where: { id: newTokens.refreshTokenId },
    data: { previousToken: oldToken },
  });

  // Delete old token (rotation complete)
  await db.refreshTokens.delete({
    where: { token: oldToken },
  });

  return newTokens;
}

async function handleTokenReuseDetected(token: string) {
  // Log security event
  console.error('[SECURITY] Refresh token reuse detected', { token });

  // Find all tokens for this user and revoke them
  const oldTokenRecord = await db.refreshTokenHistory.findFirst({
    where: { token },
    orderBy: { createdAt: 'desc' },
  });

  if (oldTokenRecord) {
    // Revoke ALL tokens for this user (force re-authentication)
    await db.refreshTokens.deleteMany({
      where: { userId: oldTokenRecord.userId },
    });

    // Send security alert to user
    await sendSecurityAlert(oldTokenRecord.userId, 'token_reuse_detected');
  }
}
```

### Grace Period for Race Conditions

To handle legitimate race conditions (multiple requests trying to refresh simultaneously), implement a short grace period:

```typescript
// Allow 30-60 second grace period after rotation
const GRACE_PERIOD_MS = 60 * 1000; // 60 seconds

export async function refreshWithGracePeriod(token: string) {
  const tokenRecord = await db.refreshTokens.findUnique({
    where: { token },
  });

  if (!tokenRecord) {
    // Check if token was recently rotated
    const rotatedToken = await db.refreshTokens.findFirst({
      where: {
        previousToken: token,
        createdAt: { gte: new Date(Date.now() - GRACE_PERIOD_MS) },
      },
    });

    if (rotatedToken) {
      // Within grace period - allow refresh
      return await generateNewTokenPair(rotatedToken.userId);
    }

    // Outside grace period - potential attack
    throw new Error('Token reuse detected');
  }

  // Normal refresh flow...
}
```

### Atomic Token Operations

Ensure token rotation is atomic to prevent race conditions:

```typescript
// Use database transactions for atomicity
export async function rotateRefreshToken(oldToken: string) {
  return await db.$transaction(async (tx) => {
    // 1. Verify old token exists
    const oldTokenRecord = await tx.refreshTokens.findUniqueOrThrow({
      where: { token: oldToken },
    });

    // 2. Create new token
    const newToken = crypto.randomBytes(32).toString('hex');
    const newTokenRecord = await tx.refreshTokens.create({
      data: {
        token: newToken,
        userId: oldTokenRecord.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        previousToken: oldToken,
      },
    });

    // 3. Delete old token
    await tx.refreshTokens.delete({
      where: { token: oldToken },
    });

    return newTokenRecord;
  });
}
```

### Best Practices

- [ ] Rotate refresh tokens after every use
- [ ] Implement reuse detection
- [ ] Revoke all user tokens on reuse detection
- [ ] Use database transactions for atomicity
- [ ] Include grace period for race conditions
- [ ] Log all rotation events
- [ ] Alert users on security events
- [ ] Apply rate limiting on refresh endpoint

**Sources:**
- [Refresh Token Rotation: Best Practices for Developers](https://www.serverion.com/uncategorized/refresh-token-rotation-best-practices-for-developers/)
- [Refresh Token Rotation | Auth0](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation)
- [The Developer's Guide to Refresh Token Rotation](https://www.descope.com/blog/post/refresh-token-rotation)
- [OAuth 2.0 Refresh Token Best Practices](https://stateful.com/blog/oauth-refresh-token-best-practices)

---

## Session Storage Options

### Cookie Storage (Recommended for Web Apps)

**Pros:**
- Automatic transmission with requests
- Can be httpOnly (protected from JavaScript)
- Secure flag for HTTPS only
- SameSite for CSRF protection
- Scoped to specific domains/paths

**Cons:**
- Size limit (4KB per cookie)
- Sent with every request (bandwidth)
- Subdomain access considerations

**Best Practices:**
```typescript
cookieStore.set('session-token', token, {
  httpOnly: true,        // Prevent JavaScript access
  secure: true,          // HTTPS only
  sameSite: 'strict',    // CSRF protection
  maxAge: 60 * 60 * 24,  // 24 hours
  path: '/',             // Available on all routes
  // For maximum security, use __Host- prefix
});
```

### localStorage (Not Recommended for Tokens)

**Pros:**
- Large storage capacity (5-10MB)
- Persists across browser sessions
- Simple API

**Cons:**
- Accessible via JavaScript (XSS vulnerability)
- Not sent automatically
- Same-origin only
- No httpOnly protection

**Use Case:** Non-sensitive user preferences, not auth tokens.

### sessionStorage (Limited Use)

**Pros:**
- Cleared when tab closes
- Accessible only in same tab
- Simple API

**Cons:**
- Accessible via JavaScript (XSS vulnerability)
- Lost on page refresh in some cases
- Not sent automatically

**Use Case:** Temporary UI state, not auth tokens.

### In-Memory Storage (Access Tokens)

**Pros:**
- Most secure (not persisted)
- Cleared on page reload
- Not accessible after XSS

**Cons:**
- Lost on page refresh
- Requires refresh token flow

**Best Practice for SPAs:**
```typescript
// Store access token in memory
let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// Refresh token in httpOnly cookie
// On page load, use refresh token to get new access token
```

### Comparison Table

| Storage | Security | Persistence | Auto-Send | XSS Safe | Size Limit |
|---------|----------|-------------|-----------|----------|------------|
| httpOnly Cookie | High | Yes | Yes | Yes | 4KB |
| Regular Cookie | Low | Yes | Yes | No | 4KB |
| localStorage | Low | Yes | No | No | 5-10MB |
| sessionStorage | Low | Session | No | No | 5-10MB |
| In-Memory | Highest | No | No | Partial | Unlimited |

### Recommended Pattern for Admin Systems

```typescript
// Access token: In-memory or short-lived httpOnly cookie
cookieStore.set('access-token', accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 15 * 60, // 15 minutes
  path: '/',
});

// Refresh token: Long-lived httpOnly cookie with restricted path
cookieStore.set('refresh-token', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: '/api/auth/refresh', // Only sent to refresh endpoint
});
```

**Sources:**
- [Session management best practices](https://workos.com/blog/session-management-best-practices)
- [User Session Security: Best Practices](https://supertokens.com/blog/all-you-need-to-know-about-user-session-security)

---

## Multi-Device Session Management

### Database Schema for Sessions

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  refresh_token TEXT UNIQUE NOT NULL,
  device_name TEXT,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  ip_address INET,
  user_agent TEXT,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_revoked BOOLEAN DEFAULT false
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(refresh_token);
CREATE INDEX idx_user_sessions_active ON user_sessions(user_id, is_revoked, expires_at);
```

### Tracking Active Sessions

```typescript
// lib/auth/sessions.ts
import { db } from '@/lib/db';
import { headers } from 'next/headers';

export async function createSession(userId: string) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || 'Unknown';
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip');

  const refreshToken = crypto.randomBytes(32).toString('hex');

  const session = await db.userSessions.create({
    data: {
      userId,
      refreshToken,
      deviceType: detectDeviceType(userAgent),
      deviceName: parseDeviceName(userAgent),
      userAgent,
      ipAddress: ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return session;
}

export async function getActiveSessions(userId: string) {
  return await db.userSessions.findMany({
    where: {
      userId,
      isRevoked: false,
      expiresAt: { gte: new Date() },
    },
    orderBy: { lastActiveAt: 'desc' },
  });
}

export async function revokeSession(sessionId: string, userId: string) {
  await db.userSessions.updateMany({
    where: {
      id: sessionId,
      userId, // Ensure user owns this session
    },
    data: { isRevoked: true },
  });
}

export async function revokeAllSessions(userId: string, exceptSessionId?: string) {
  await db.userSessions.updateMany({
    where: {
      userId,
      id: exceptSessionId ? { not: exceptSessionId } : undefined,
    },
    data: { isRevoked: true },
  });
}
```

### Session Management UI

```typescript
// app/admin/settings/sessions/page.tsx
import { getActiveSessions, revokeSession } from '@/lib/auth/sessions';
import { verifySession } from '@/lib/dal';

export default async function SessionsPage() {
  const session = await verifySession();
  const sessions = await getActiveSessions(session.userId);

  return (
    <div>
      <h1>Active Sessions</h1>
      {sessions.map((s) => (
        <div key={s.id}>
          <p>
            {s.deviceName} - {s.deviceType}
          </p>
          <p>Last active: {s.lastActiveAt.toLocaleString()}</p>
          <p>IP: {s.ipAddress}</p>
          <button onClick={() => handleRevokeSession(s.id)}>
            Revoke
          </button>
        </div>
      ))}
      <button onClick={handleRevokeAllOtherSessions}>
        Sign out all other devices
      </button>
    </div>
  );
}
```

### Session Limit Enforcement

```typescript
const MAX_SESSIONS_PER_USER = 5;

export async function createSessionWithLimit(userId: string) {
  const activeSessions = await getActiveSessions(userId);

  if (activeSessions.length >= MAX_SESSIONS_PER_USER) {
    // Revoke oldest session
    const oldestSession = activeSessions[activeSessions.length - 1];
    await revokeSession(oldestSession.id, userId);
  }

  return await createSession(userId);
}
```

**Sources:**
- Previous research on session management patterns

---

## Session Timeout & UX

### Timeout Duration Guidelines

**By Application Type:**

| Application Type | Idle Timeout | Absolute Timeout |
|-----------------|--------------|------------------|
| Banking/Financial | 2-5 minutes | 15 minutes |
| Healthcare | 5-10 minutes | 30 minutes |
| Admin Dashboards | 15-30 minutes | 8 hours |
| General SaaS | 30-60 minutes | 24 hours |
| Low-Risk Apps | No timeout | 7 days |

**For Admin Systems:**
- **Idle Timeout:** 15 minutes (recommended)
- **Absolute Timeout:** 8 hours
- **Remember Me:** 30 days (with restrictions)

### UX Best Practices

**1. Warning Before Timeout**

```typescript
// components/SessionTimeoutWarning.tsx
'use client';

import { useEffect, useState } from 'react';

export function SessionTimeoutWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    // Show warning 60 seconds before timeout
    const warningTimer = setTimeout(() => {
      setShowWarning(true);
    }, 14 * 60 * 1000); // 14 minutes (15 min timeout - 1 min warning)

    return () => clearTimeout(warningTimer);
  }, []);

  useEffect(() => {
    if (showWarning) {
      const countdown = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Redirect to login
            window.location.href = '/admin/login?reason=timeout';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [showWarning]);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 p-4 rounded shadow-lg">
      <p className="font-semibold">Your session is about to expire</p>
      <p>You will be logged out in {secondsLeft} seconds</p>
      <button
        onClick={async () => {
          await fetch('/api/auth/extend-session', { method: 'POST' });
          setShowWarning(false);
          setSecondsLeft(60);
        }}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Stay Logged In
      </button>
    </div>
  );
}
```

**2. Activity Tracking**

```typescript
// lib/auth/activity-tracker.ts
'use client';

import { useEffect } from 'react';
import { debounce } from 'lodash';

export function useActivityTracking() {
  useEffect(() => {
    const updateActivity = debounce(async () => {
      await fetch('/api/auth/activity', { method: 'POST' });
    }, 30000); // Update every 30 seconds max

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

**3. Graceful Session Extension**

```typescript
// app/api/auth/extend-session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth/session';

export async function POST() {
  try {
    const session = await verifySession();

    // Extend access token
    const newAccessToken = await generateAccessToken(session);

    const cookieStore = await cookies();
    cookieStore.set('access-token', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60, // Reset to 15 minutes
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

### "Remember Me" Security

**Implementation:**

```typescript
export async function loginWithRememberMe(
  email: string,
  password: string,
  rememberMe: boolean
) {
  const user = await verifyCredentials(email, password);

  const accessToken = await generateAccessToken(user);

  // Refresh token duration based on remember me
  const refreshTokenDuration = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 7 * 24 * 60 * 60 * 1000; // 7 days

  const refreshToken = await generateRefreshToken(
    user.id,
    refreshTokenDuration
  );

  const cookieStore = await cookies();

  // Access token always short-lived
  cookieStore.set('access-token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 15 * 60,
    path: '/',
  });

  // Refresh token duration varies
  cookieStore.set('refresh-token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: refreshTokenDuration / 1000,
    path: '/api/auth/refresh',
  });
}
```

**Security Considerations:**

- [ ] Only offer for low-risk operations
- [ ] Never for financial/healthcare data
- [ ] Use device recognition
- [ ] Enable session revocation
- [ ] Log all "remember me" authentications
- [ ] Require re-auth for sensitive actions
- [ ] Send notification when used

**Risk-Based Authentication:**

```typescript
export async function requireReauthForSensitiveAction(userId: string) {
  const session = await getSession();

  // Check how long ago user authenticated
  const authAge = Date.now() - session.authenticatedAt;

  // Require re-auth if > 5 minutes for sensitive actions
  if (authAge > 5 * 60 * 1000) {
    throw new Error('REAUTH_REQUIRED');
  }

  // Also check if session came from "remember me"
  if (session.isRememberMe) {
    throw new Error('REAUTH_REQUIRED');
  }
}
```

**Sources:**
- [Session Timeout Best Practices](https://www.descope.com/learn/post/session-timeout-best-practices)
- [Session Timeout Best Practices - Security Boulevard](https://securityboulevard.com/2025/10/session-timeout-best-practices/)
- [Mastering Session Timeout in UX](https://www.numberanalytics.com/blog/ultimate-guide-session-timeout-ux-accessibility)

---

## Implementation Recommendations

### For SRS Admin System

**Recommended Architecture:**

1. **Token Strategy:** Hybrid (JWT access + Opaque refresh)
   - Access tokens: JWT, 15 minutes
   - Refresh tokens: Opaque, 7 days
   - Refresh token rotation: Yes

2. **Storage:**
   - Access token: httpOnly cookie with `__Host-` prefix
   - Refresh token: httpOnly cookie, path-restricted

3. **Session Timeout:**
   - Idle timeout: 15 minutes
   - Absolute timeout: 8 hours
   - Warning: 60 seconds before expiry

4. **Multi-Device:**
   - Track all active sessions
   - Allow manual revocation
   - Limit to 5 concurrent sessions
   - "Sign out all other devices" option

5. **Remember Me:**
   - Not recommended for admin system
   - If implemented: 7 days max, require MFA

### Implementation Priority

| Feature | Priority | Difficulty | Time |
|---------|----------|-----------|------|
| Basic JWT auth | Critical | Low | 2-4h |
| Refresh tokens | Critical | Medium | 4-6h |
| Token rotation | High | Medium | 4-6h |
| Session tracking | High | Medium | 4-6h |
| Timeout warnings | Medium | Low | 2-4h |
| Multi-device mgmt | Medium | Medium | 6-8h |
| Reuse detection | High | High | 4-6h |
| Remember me | Low | Low | 2-3h |

---

## References

1. [A Guide to Bearer Tokens: JWT vs. Opaque Tokens](https://www.permit.io/blog/a-guide-to-bearer-tokens-jwt-vs-opaque-tokens)
2. [Using JWTs for Sessions? Avoid These Mistakes](https://supertokens.com/blog/are-you-using-jwts-for-user-sessions-in-the-correct-way)
3. [JWT vs Opaque Tokens: All You Need to Know](https://medium.com/identity-beyond-borders/jwt-vs-opaque-tokens-all-you-need-to-know-307bf19bade8)
4. [Refresh Token Rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation)
5. [Session Timeout Best Practices](https://www.descope.com/learn/post/session-timeout-best-practices)
6. [Session management best practices](https://workos.com/blog/session-management-best-practices)
