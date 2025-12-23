# Rate Limiting & Admin UX Best Practices

**Last Updated:** December 2025
**Target Audience:** Developers implementing rate limiting and admin UX

---

## Table of Contents
- [Rate Limiting Algorithms](#rate-limiting-algorithms)
- [Authentication-Specific Rate Limiting](#authentication-specific-rate-limiting)
- [Distributed Rate Limiting with Redis](#distributed-rate-limiting-with-redis)
- [Admin Login Form Best Practices](#admin-login-form-best-practices)
- [Error Message Best Practices](#error-message-best-practices)
- [Accessibility Requirements](#accessibility-requirements)
- [Admin Invitation UX](#admin-invitation-ux)

---

## Rate Limiting Algorithms

### Algorithm Comparison

| Algorithm | Description | Pros | Cons | Best For |
|-----------|-------------|------|------|----------|
| **Fixed Window** | Count requests in discrete time windows | Simple, low memory | Burst at boundaries | Low-variance traffic |
| **Sliding Window** | Continuous rolling time period | Smooth, accurate | Complex, more storage | High-precision needs |
| **Token Bucket** | Refills tokens at fixed rate | Allows bursts | Moderate complexity | Mixed traffic patterns |
| **Leaky Bucket** | Processes requests at constant rate | Smooth output | Strict, may drop requests | Queue-based systems |

**Recommendation for Admin Auth:** Sliding Window for login, Fixed Window for API endpoints.

### Fixed Window Implementation

**How it works:**
- Divide time into fixed windows (e.g., 1 minute)
- Count requests in each window
- Reset counter at window boundary

**Pros:**
- Simple to implement
- Low memory usage (one counter per key)
- Fast lookups

**Cons:**
- Burst vulnerability at window edges
- Example: 100 req/min limit
  - User makes 100 requests at 00:59
  - User makes 100 more at 01:00
  - Result: 200 requests in 2 seconds

**Implementation:**
```typescript
// Fixed window using Supabase
interface RateLimit {
  identifier: string;
  window_start: Date;
  count: number;
}

async function checkFixedWindow(
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / (windowSeconds * 1000)) * (windowSeconds * 1000));

  const { data } = await supabase
    .from('rate_limits')
    .select('count')
    .eq('identifier', identifier)
    .eq('window_start', windowStart.toISOString())
    .single();

  if (!data) {
    // First request in window
    await supabase.from('rate_limits').insert({
      identifier,
      window_start: windowStart,
      count: 1,
    });
    return true;
  }

  if (data.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  // Increment counter
  await supabase
    .from('rate_limits')
    .update({ count: data.count + 1 })
    .eq('identifier', identifier)
    .eq('window_start', windowStart.toISOString());

  return true;
}
```

### Sliding Window Implementation

**How it works:**
- Maintains continuous rolling time window
- Weights requests based on time position
- Smooths boundary artifacts

**Formula:**
```
allowed = (previousWindowCount * (windowSize - timeSinceWindowStart) / windowSize) + currentWindowCount < limit
```

**Pros:**
- Accurate rate limiting
- No boundary bursts
- Fair distribution

**Cons:**
- More complex
- Higher memory usage
- Requires timestamp tracking

**Implementation with Redis:**
```typescript
import { Redis } from '@upstash/redis';

async function checkSlidingWindow(
  redis: Redis,
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<boolean> {
  const now = Date.now();
  const windowStart = now - windowMs;
  const key = `ratelimit:${identifier}`;

  // Remove old entries
  await redis.zremrangebyscore(key, 0, windowStart);

  // Count requests in window
  const count = await redis.zcard(key);

  if (count >= maxRequests) {
    return false;
  }

  // Add current request
  await redis.zadd(key, { score: now, member: `${now}` });

  // Set expiry
  await redis.expire(key, Math.ceil(windowMs / 1000));

  return true;
}
```

### Token Bucket Implementation

**How it works:**
- Bucket holds tokens
- Tokens added at fixed rate
- Request consumes token
- No token = request denied

**Pros:**
- Allows controlled bursts
- Flexible rate control
- Good for varying loads

**Cons:**
- Moderate complexity
- Requires state management

**Implementation:**
```typescript
interface TokenBucket {
  tokens: number;
  lastRefill: number;
  capacity: number;
  refillRate: number; // tokens per second
}

async function checkTokenBucket(
  identifier: string,
  capacity: number,
  refillRate: number
): Promise<boolean> {
  const now = Date.now();

  // Get or create bucket
  let bucket = await getBucket(identifier);

  if (!bucket) {
    bucket = {
      tokens: capacity,
      lastRefill: now,
      capacity,
      refillRate,
    };
  }

  // Refill tokens based on time passed
  const timePassed = (now - bucket.lastRefill) / 1000; // seconds
  const tokensToAdd = timePassed * refillRate;
  bucket.tokens = Math.min(capacity, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;

  // Check if token available
  if (bucket.tokens < 1) {
    await saveBucket(identifier, bucket);
    return false;
  }

  // Consume token
  bucket.tokens -= 1;
  await saveBucket(identifier, bucket);

  return true;
}
```

**Sources:**
- [From Token Bucket to Sliding Window](https://api7.ai/blog/rate-limiting-guide-algorithms-best-practices)
- [API Rate Limiting: Implementation Strategies](https://medium.com/@inni.chang/api-rate-limiting-implementation-strategies-and-best-practices-8a35572ed62c)

---

## Authentication-Specific Rate Limiting

### Login Endpoint

**Recommended limits:**
- 5 attempts per 15 minutes per email address
- 10 attempts per 15 minutes per IP address
- Exponential backoff after 3 failures

**Why dual limits (email + IP):**
- Email limit prevents credential stuffing
- IP limit prevents distributed attacks
- Together provide defense-in-depth

**Implementation:**
```typescript
'use server';

import { checkSlidingWindow } from '@/lib/rate-limit';

export async function loginAction(email: string, password: string) {
  const ip = await getClientIP();

  // Check email-based rate limit
  const emailAllowed = await checkSlidingWindow(
    redis,
    `login:email:${email}`,
    5, // max attempts
    15 * 60 * 1000 // 15 minutes
  );

  if (!emailAllowed) {
    return {
      error: 'Too many login attempts for this email. Please try again in 15 minutes or use the password reset link.',
      retryAfter: 900,
    };
  }

  // Check IP-based rate limit
  const ipAllowed = await checkSlidingWindow(
    redis,
    `login:ip:${ip}`,
    10,
    15 * 60 * 1000
  );

  if (!ipAllowed) {
    return {
      error: 'Too many login attempts from your location. Please try again in 15 minutes.',
      retryAfter: 900,
    };
  }

  // Attempt login
  const user = await verifyCredentials(email, password);

  if (!user) {
    // Increment failure counters
    await incrementFailureCount(email, ip);

    // Check if account should be locked
    const failureCount = await getFailureCount(email);
    if (failureCount >= 5) {
      await sendAccountLockEmail(email);
    }

    return {
      error: 'Invalid email or password.',
    };
  }

  // Success - reset counters
  await resetFailureCount(email, ip);

  return { success: true, user };
}
```

### Password Reset

**Recommended limits:**
- 3 requests per hour per email
- 10 requests per hour per IP

**Why strict limits:**
- Prevents email enumeration attacks
- Limits abuse of email system
- Protects against DoS via email flooding

**Implementation:**
```typescript
export async function requestPasswordReset(email: string) {
  const ip = await getClientIP();

  // Email-based limit
  const emailAllowed = await checkFixedWindow(
    `reset:email:${email}`,
    3,
    60 * 60 // 1 hour
  );

  if (!emailAllowed) {
    // Don't reveal if email exists (security)
    return {
      success: true,
      message: 'If this email exists, a reset link has been sent.',
    };
  }

  // IP-based limit
  const ipAllowed = await checkFixedWindow(
    `reset:ip:${ip}`,
    10,
    60 * 60
  );

  if (!ipAllowed) {
    return {
      error: 'Too many password reset requests. Please try again later.',
    };
  }

  // Send reset email (if user exists)
  await sendPasswordResetEmail(email);

  return {
    success: true,
    message: 'If this email exists, a reset link has been sent.',
  };
}
```

### Refresh Token Endpoint

**Recommended limits:**
- 10 requests per minute per token
- Prevents token refresh abuse

**Implementation:**
```typescript
export async function refreshTokenAction(refreshToken: string) {
  const allowed = await checkFixedWindow(
    `refresh:${refreshToken}`,
    10,
    60 // 1 minute
  );

  if (!allowed) {
    return {
      error: 'Too many refresh requests. Please wait before trying again.',
      retryAfter: 60,
    };
  }

  // Process token refresh...
}
```

### MFA Verification

**Recommended limits:**
- 3 attempts per 5 minutes per session
- Account lock after 10 failed attempts

**Implementation:**
```typescript
export async function verifyMFA(sessionId: string, code: string) {
  const allowed = await checkFixedWindow(
    `mfa:${sessionId}`,
    3,
    5 * 60 // 5 minutes
  );

  if (!allowed) {
    return {
      error: 'Too many verification attempts. Please wait 5 minutes.',
      retryAfter: 300,
    };
  }

  // Verify MFA code...
  const valid = await verifyMFACode(sessionId, code);

  if (!valid) {
    // Track total failures
    const totalFailures = await incrementMFAFailures(sessionId);

    if (totalFailures >= 10) {
      // Lock account, require admin intervention
      await lockAccount(sessionId);
      await sendSecurityAlert(sessionId);

      return {
        error: 'Account locked due to too many failed MFA attempts. Please contact support.',
      };
    }
  }

  return { success: valid };
}
```

### Rate Limit Headers

**Always return rate limit info:**
```typescript
export async function POST(request: NextRequest) {
  const identifier = await getIdentifier(request);
  const limit = 5;
  const windowSeconds = 900; // 15 minutes

  const { allowed, remaining, resetTime } = await checkRateLimitWithInfo(
    identifier,
    limit,
    windowSeconds
  );

  if (!allowed) {
    return new Response('Rate limit exceeded', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': resetTime.toString(),
        'Retry-After': windowSeconds.toString(),
      },
    });
  }

  // Process request...

  return new Response('Success', {
    status: 200,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': resetTime.toString(),
    },
  });
}
```

**Sources:**
- [10 Best Practices for API Rate Limiting in 2025](https://zuplo.com/blog/2025/01/06/10-best-practices-for-api-rate-limiting-in-2025)
- [Rate Limit | Better Auth](https://www.better-auth.com/docs/concepts/rate-limit)

---

## Distributed Rate Limiting with Redis

### Why Redis for Rate Limiting?

**Benefits:**
- Centralized state across all instances
- Atomic operations (Lua scripts)
- Built-in expiration (TTL)
- Fast in-memory operations
- Scales horizontally

### Upstash Redis Setup (Recommended)

**Why Upstash:**
- Serverless (no infrastructure management)
- Global edge network
- REST API (works in Edge Runtime)
- Generous free tier

**Setup:**
```bash
npm install @upstash/redis @upstash/ratelimit
```

**Environment variables:**
```bash
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=Axxxxx
```

**Basic implementation:**
```typescript
// lib/rate-limit.ts
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = Redis.fromEnv();

// Login rate limit
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  prefix: 'ratelimit:login',
  analytics: true, // Track usage
});

// API rate limit
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(100, '1 m'),
  prefix: 'ratelimit:api',
});

// Password reset rate limit
export const resetRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, '1 h'),
  prefix: 'ratelimit:reset',
});
```

**Usage in Server Action:**
```typescript
'use server';

import { loginRateLimit } from '@/lib/rate-limit';

export async function loginAction(email: string, password: string) {
  // Check rate limit
  const { success, limit, remaining, reset } = await loginRateLimit.limit(email);

  if (!success) {
    const waitTime = Math.ceil((reset - Date.now()) / 1000 / 60);

    return {
      error: `Too many login attempts. Please try again in ${waitTime} minutes.`,
      retryAfter: Math.ceil((reset - Date.now()) / 1000),
    };
  }

  // Continue with login...
  console.log(`Remaining attempts: ${remaining}/${limit}`);
}
```

### Advanced: Multi-Tier Rate Limiting

**Different limits for different user types:**
```typescript
export async function getRateLimitForUser(userId: string) {
  const user = await getUser(userId);

  if (user.role === 'super_admin') {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(1000, '1 m'), // Higher limit
      prefix: `ratelimit:${userId}`,
    });
  }

  if (user.role === 'admin') {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      prefix: `ratelimit:${userId}`,
    });
  }

  // Default/unauthenticated users
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    prefix: `ratelimit:${userId}`,
  });
}
```

### Atomic Operations with Lua

**Why Lua scripts:**
- All operations execute atomically
- Prevents race conditions
- More efficient (single round trip)

**Example: Custom rate limit with Lua**
```typescript
const luaScript = `
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local current = tonumber(redis.call('GET', key) or '0')

if current >= limit then
  return 0
end

redis.call('INCR', key)
if current == 0 then
  redis.call('EXPIRE', key, window)
end

return 1
`;

export async function checkRateLimitLua(
  redis: Redis,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const result = await redis.eval(
    luaScript,
    [`ratelimit:${identifier}`],
    [limit, windowSeconds]
  );

  return result === 1;
}
```

### Cleanup Strategy

**Automatic cleanup:**
- Use TTL on all keys (Redis auto-deletes)
- Set appropriate expiration times

**Manual cleanup (backup):**
```typescript
// Scheduled job (daily)
export async function cleanupExpiredRateLimits() {
  const pattern = 'ratelimit:*';
  let cursor = 0;

  do {
    const result = await redis.scan(cursor, {
      match: pattern,
      count: 100,
    });

    cursor = result[0];
    const keys = result[1];

    for (const key of keys) {
      const ttl = await redis.ttl(key);
      if (ttl === -1) {
        // No expiration set, delete
        await redis.del(key);
      }
    }
  } while (cursor !== 0);
}
```

**Sources:**
- [Rate Limiting with Redis](https://redis.io/glossary/rate-limiting/)
- [How to build a Rate Limiter using Redis](https://redis.io/learn/howtos/ratelimiting)
- [Building a Production-Ready Distributed Rate Limiter](https://bnacar.dev/2025/09/18/distributed-rate-limiter-spring-boot-redis.html)

---

## Admin Login Form Best Practices

### Accessibility Requirements (WCAG 2.1 AA)

**1. Label all inputs properly:**
```tsx
<div>
  <label htmlFor="email" className="block text-sm font-medium">
    Email Address <span aria-label="required">*</span>
  </label>
  <input
    id="email"
    name="email"
    type="email"
    required
    aria-required="true"
    aria-invalid={errors.email ? 'true' : 'false'}
    aria-describedby={errors.email ? 'email-error' : undefined}
    autoComplete="email"
  />
  {errors.email && (
    <p id="email-error" role="alert" className="text-red-600 text-sm mt-1">
      {errors.email}
    </p>
  )}
</div>
```

**2. Required field indicators:**
```tsx
// ❌ WRONG: Asterisk alone (screen reader reads "Username star")
<label htmlFor="username">Username *</label>

// ✅ CORRECT: Explicit text or ARIA
<label htmlFor="username">
  Username <span className="text-red-600">(required)</span>
</label>

// OR
<label htmlFor="username">Username</label>
<input
  id="username"
  aria-required="true"
  required
/>
```

**3. Error announcements:**
```tsx
function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form>
      {/* Error summary (announced by screen reader) */}
      {Object.keys(errors).length > 0 && (
        <div role="alert" aria-live="polite" className="error-summary">
          <h2>Please correct the following errors:</h2>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Form fields... */}
    </form>
  );
}
```

**4. Focus management:**
```tsx
'use client';

import { useEffect, useRef } from 'react';

export default function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus first field on mount
    emailRef.current?.focus();
  }, []);

  async function handleSubmit(formData: FormData) {
    const result = await loginAction(formData);

    if (result.errors) {
      // Focus error summary
      errorRef.current?.focus();
    }
  }

  return (
    <form action={handleSubmit}>
      <div ref={errorRef} tabIndex={-1}>
        {/* Error messages */}
      </div>

      <input ref={emailRef} type="email" name="email" />
      {/* Rest of form */}
    </form>
  );
}
```

### Autofill Support

**Use standard autocomplete values:**
```tsx
<form>
  <input
    type="email"
    name="email"
    autoComplete="email" // Standard value
  />

  <input
    type="password"
    name="password"
    autoComplete="current-password" // For login
    // Use "new-password" for signup/reset
  />

  <input
    type="text"
    name="otp"
    autoComplete="one-time-code" // For MFA codes
  />
</form>
```

**Standard autocomplete values:**
- `email` - Email address
- `username` - Username
- `current-password` - Login password
- `new-password` - New password (signup, reset)
- `one-time-code` - MFA/OTP codes

**Benefits:**
- Browsers can autofill saved credentials
- Password managers work correctly
- Mobile keyboards show appropriate type
- Better user experience

### Password Field UX

**Show/Hide password toggle:**
```tsx
'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export function PasswordField() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute right-2 top-8"
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
```

**Password strength indicator:**
```tsx
function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = calculateStrength(password);

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded ${
              level <= strength
                ? strength === 1
                  ? 'bg-red-500'
                  : strength === 2
                  ? 'bg-orange-500'
                  : strength === 3
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-sm mt-1">
        {strength === 1 && 'Weak password'}
        {strength === 2 && 'Fair password'}
        {strength === 3 && 'Good password'}
        {strength === 4 && 'Strong password'}
      </p>
    </div>
  );
}

function calculateStrength(password: string): number {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  return Math.min(4, strength);
}
```

### Keyboard Navigation

**Ensure all interactive elements are keyboard accessible:**
```tsx
<form>
  {/* All inputs naturally keyboard accessible */}
  <input type="email" />

  {/* Buttons keyboard accessible by default */}
  <button type="submit">Sign In</button>

  {/* Custom elements need tabindex */}
  <div
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleClick();
      }
    }}
  >
    Custom button
  </div>
</form>
```

**Tab order:**
1. Email field
2. Password field
3. Show password button (if present)
4. Remember me checkbox
5. Submit button
6. Forgot password link
7. Sign up link (if present)

**Sources:**
- [Login & Signup UX Guide](https://www.authgear.com/post/login-signup-ux-guide)
- [Form Accessibility Best Practices](https://ivyforms.com/blog/form-accessibility-best-practices/)
- [Accessibility in a Login Form](https://www.netguru.com/blog/accessibility-in-a-login-form)

---

## Error Message Best Practices

### Clarity vs Security Balance

**Specific for usability, vague for security:**

**Login errors:**
```tsx
// ❌ TOO SPECIFIC (security risk)
if (!userExists) {
  return { error: 'No account found with this email' }; // Email enumeration!
}
if (!passwordMatch) {
  return { error: 'Incorrect password' }; // Tells attacker email exists!
}

// ✅ CORRECT (secure and clear enough)
if (!userExists || !passwordMatch) {
  return { error: 'Invalid email or password' };
}
```

**Password reset:**
```tsx
// ✅ CORRECT (doesn't reveal if email exists)
return {
  message: 'If an account exists with this email, you will receive a password reset link.',
};
```

**Validation errors (can be specific):**
```tsx
// ✅ CORRECT (helpful, no security risk)
if (password.length < 12) {
  return { error: 'Password must be at least 12 characters long' };
}

if (!/[A-Z]/.test(password)) {
  return { error: 'Password must contain at least one uppercase letter' };
}
```

### Error Message Positioning

**Inline errors (preferred):**
```tsx
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    name="email"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <p id="email-error" role="alert" className="text-red-600 text-sm mt-1">
      {errors.email}
    </p>
  )}
</div>
```

**Error summary (for multiple errors):**
```tsx
{Object.keys(errors).length > 0 && (
  <div
    role="alert"
    className="bg-red-50 border border-red-200 rounded p-4 mb-4"
  >
    <h2 className="text-red-800 font-semibold mb-2">
      Please fix the following errors:
    </h2>
    <ul className="list-disc list-inside text-red-700">
      {Object.entries(errors).map(([field, message]) => (
        <li key={field}>{message}</li>
      ))}
    </ul>
  </div>
)}
```

### Validation Timing

**When to show errors:**

**❌ WRONG: Validate on every keystroke**
```tsx
// Annoying - user hasn't finished typing
<input onChange={(e) => validateEmail(e.target.value)} />
```

**✅ CORRECT: Validate on blur or submit**
```tsx
<input
  onBlur={(e) => validateEmail(e.target.value)}
  // OR wait for form submit
/>
```

**✅ ALSO CORRECT: Show success immediately, errors on blur**
```tsx
function EmailField() {
  const [touched, setTouched] = useState(false);
  const [value, setValue] = useState('');

  const isValid = validateEmail(value);

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
      />
      {/* Show error only after blur */}
      {touched && !isValid && <p className="error">Invalid email</p>}
      {/* Show success immediately */}
      {isValid && <p className="success">✓</p>}
    </div>
  );
}
```

### Rate Limit Error Messages

**Clear, actionable messages:**
```tsx
// ✅ CORRECT
{
  error: 'Too many login attempts. Please try again in 15 minutes.',
  action: 'Use the "Forgot Password" link below if you need to reset your password.',
  retryAfter: 900, // seconds
}

// Display:
<div className="bg-yellow-50 border border-yellow-400 p-4 rounded">
  <p className="font-semibold text-yellow-900">
    Too many login attempts
  </p>
  <p className="text-yellow-800 mt-1">
    For security, please wait 15 minutes before trying again.
  </p>
  <p className="text-yellow-800 mt-2">
    Need help? <a href="/admin/forgot-password" className="underline">
      Reset your password
    </a>
  </p>
</div>
```

### Loading States

**Show progress for better UX:**
```tsx
'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      await loginAction(formData);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      {/* Form fields */}

      <button
        type="submit"
        disabled={isLoading}
        className="relative"
      >
        {isLoading ? (
          <>
            <span className="opacity-0">Sign In</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            </div>
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
}
```

**Sources:**
- [A Guide To Accessible Form Validation](https://www.smashingmagazine.com/2023/02/guide-accessible-form-validation/)
- [13 Best Practices for Designing Error-Friendly Forms](https://www.bunnyfoot.com/2024/01/13-best-practices-to-design-error-friendly-forms/)

---

## Admin Invitation UX

### Multi-Step Invitation Flow

**Step 1: Admin sends invitation**
```tsx
// Admin dashboard
async function sendInvitation(email: string, role: string) {
  const result = await inviteAdminAction(email, role);

  if (result.success) {
    toast.success(`Invitation sent to ${email}`);
  }
}
```

**Step 2: User receives email**
```html
Subject: You've been invited to SRS Admin

Hi there,

You've been invited to join the SRS Admin dashboard as an [ROLE].

Click the link below to accept your invitation and set up your account:

[Accept Invitation] (https://admin.srs.com/accept-invite?token=xxx)

This link expires in 7 days.

Questions? Contact the admin who invited you: admin@srs.com

---
SRS Admin Team
```

**Step 3: Acceptance page (pre-filled)**
```tsx
// app/admin/accept-invite/page.tsx
export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const invitation = await verifyInvitationToken(searchParams.token);

  if (!invitation) {
    return <div>Invalid or expired invitation</div>;
  }

  return (
    <div>
      <h1>Accept Admin Invitation</h1>
      <p>You've been invited to join as {invitation.role}</p>

      <InviteAcceptForm
        email={invitation.email} // Pre-filled, read-only
        role={invitation.role}
        token={searchParams.token}
      />
    </div>
  );
}
```

**Step 4: Set password + MFA**
```tsx
function InviteAcceptForm({ email, role, token }) {
  return (
    <form>
      {/* Email (read-only) */}
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="bg-gray-100"
        />
      </div>

      {/* Password */}
      <div>
        <label>Create Password</label>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          required
        />
        <PasswordStrengthIndicator password={password} />
      </div>

      {/* Confirm password */}
      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          required
        />
      </div>

      {/* MFA setup (required) */}
      <div className="bg-blue-50 p-4 rounded mt-4">
        <h3 className="font-semibold mb-2">
          Multi-Factor Authentication (Required)
        </h3>
        <p className="text-sm mb-3">
          Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
        </p>
        <QRCode value={mfaSecret} />
      </div>

      <button type="submit">Create Account</button>
    </form>
  );
}
```

### Onboarding After Acceptance

**Role-specific onboarding:**
```tsx
// After account creation, show role-specific guidance
function AdminOnboarding({ role }: { role: string }) {
  const steps = {
    super_admin: [
      'Manage admin users',
      'Configure system settings',
      'View all audit logs',
    ],
    admin: [
      'Manage questionnaires',
      'Invite new admins',
      'View reports',
    ],
    editor: [
      'Create and edit content',
      'Review submissions',
    ],
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Welcome to SRS Admin!
      </h2>
      <p className="mb-4">
        As a {role}, you can:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        {steps[role].map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
      <a
        href="/admin/dashboard"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
```

### Invitation Management UI

**Pending invitations table:**
```tsx
function PendingInvitations() {
  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Invited By</th>
          <th>Sent</th>
          <th>Expires</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {invitations.map((inv) => (
          <tr key={inv.id}>
            <td>{inv.email}</td>
            <td>{inv.role}</td>
            <td>{inv.invited_by_email}</td>
            <td>{inv.created_at.toLocaleDateString()}</td>
            <td>{inv.expires_at.toLocaleDateString()}</td>
            <td>
              <button onClick={() => resendInvitation(inv.id)}>
                Resend
              </button>
              <button onClick={() => revokeInvitation(inv.id)}>
                Revoke
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Sources:**
- [User Onboarding Strategies in B2B SaaS](https://auth0.com/blog/user-onboarding-strategies-b2b-saas/)
- [How to Onboard Invited Users to your SaaS Product](https://userpilot.com/blog/onboard-invited-users-saas/)

---

## Complete Login Form Example

**Production-ready admin login:**
```tsx
// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/actions/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setErrors({});

    try {
      const result = await loginAction(formData);

      if (result.errors) {
        setErrors(result.errors);
        return;
      }

      if (result.requiresMFA) {
        router.push('/admin/login/mfa');
        return;
      }

      router.push('/admin/dashboard');
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h1 className="text-3xl font-bold text-center">
            SRS Admin Login
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Sign in to your admin account
          </p>
        </div>

        {/* Error summary */}
        {errors.general && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 rounded p-4"
          >
            <p className="text-red-800">{errors.general}</p>
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-red-600 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`block w-full px-3 py-2 border rounded-md ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" role="alert" className="text-red-600 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot password link */}
          <div className="text-right">
            <a
              href="/admin/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## References

1. [From Token Bucket to Sliding Window](https://api7.ai/blog/rate-limiting-guide-algorithms-best-practices)
2. [10 Best Practices for API Rate Limiting in 2025](https://zuplo.com/blog/2025/01/06/10-best-practices-for-api-rate-limiting-in-2025)
3. [Rate Limiting with Redis](https://redis.io/glossary/rate-limiting/)
4. [Login & Signup UX Guide](https://www.authgear.com/post/login-signup-ux-guide)
5. [Form Accessibility Best Practices](https://ivyforms.com/blog/form-accessibility-best-practices/)
6. [A Guide To Accessible Form Validation](https://www.smashingmagazine.com/2023/02/guide-accessible-form-validation/)
7. [User Onboarding Strategies in B2B SaaS](https://auth0.com/blog/user-onboarding-strategies-b2b-saas/)
