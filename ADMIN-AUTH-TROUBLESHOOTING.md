# ADMIN AUTHENTICATION - TROUBLESHOOTING GUIDE

**Document Version:** 1.0
**Last Updated:** December 22, 2025
**System:** Southwest Resume Services Admin Portal
**Status:** Production Ready

---

## Quick Reference

### Common Issues Quick Links
- [Cannot Login - Invalid Credentials](#cannot-login---invalid-credentials)
- [Redirect Loop (Login → Admin → Login)](#redirect-loop)
- [Session Expires Too Quickly](#session-expires-too-quickly)
- [Rate Limited - Too Many Attempts](#rate-limited---too-many-attempts)
- [Admin Routes Return 404](#admin-routes-return-404)
- [Changes Not Reflecting](#changes-not-reflecting)
- [Cookie Not Persisting](#cookie-not-persisting)
- [CORS Errors](#cors-errors)

---

## Cannot Login - Invalid Credentials

### Symptoms
- User enters email and password
- Form shows "Invalid email or password"
- Login fails consistently

### Diagnostic Steps

**Step 1: Verify Credentials**
```bash
# Email: ryan.zimmerman@southwestresumes.com
# Password: Welectric9191!
# Common mistake: Lowercase 'w' → Should be uppercase 'W'
# Common mistake: Missing exclamation mark at end
```

**Step 2: Check User Exists in Supabase**
```sql
-- Run in Supabase SQL Editor
SELECT email, confirmed_at
FROM auth.users
WHERE email = 'ryan.zimmerman@southwestresumes.com';

-- Expected: 1 row returned
-- If 0 rows: User doesn't exist → Run create-admin-user.sql
```

**Step 3: Check User in admin_users Table**
```sql
SELECT email, role, active
FROM admin_users
WHERE email = 'ryan.zimmerman@southwestresumes.com';

-- Expected: 1 row with active = true
-- If active = false: Account disabled
-- If 0 rows: Missing admin_users record
```

**Step 4: Verify user_id Matches**
```sql
SELECT
  au.email as admin_email,
  au.active,
  u.email as auth_email,
  u.confirmed_at
FROM admin_users au
LEFT JOIN auth.users u ON au.user_id = u.id
WHERE au.email = 'ryan.zimmerman@southwestresumes.com';

-- Expected: Both emails match, active = true, confirmed_at not null
```

### Solutions

**Solution 1: User Missing from auth.users**
```bash
# Navigate to project root
cd "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website"

# Find and run create-admin-user.sql
# 1. Open Supabase SQL Editor
# 2. Copy contents of create-admin-user.sql
# 3. Run the query
# 4. Verify user created
```

**Solution 2: User Missing from admin_users**
```sql
-- Get user_id first
SELECT id FROM auth.users
WHERE email = 'ryan.zimmerman@southwestresumes.com';

-- Insert admin_users record (replace USER_ID)
INSERT INTO admin_users (user_id, email, name, role, active)
VALUES (
  'USER_ID_FROM_ABOVE',  -- Replace with actual UUID
  'ryan.zimmerman@southwestresumes.com',
  'Ryan Zimmerman',
  'super_admin',
  true
);
```

**Solution 3: Account Disabled (active = false)**
```sql
UPDATE admin_users
SET active = true
WHERE email = 'ryan.zimmerman@southwestresumes.com';
```

**Solution 4: Email Not Confirmed**
```sql
UPDATE auth.users
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'ryan.zimmerman@southwestresumes.com';
```

---

## Redirect Loop

### Symptoms
- User logs in successfully
- Redirected to /admin
- Immediately redirected back to /admin/login
- Infinite loop between login and admin

### Root Cause
Cookies are being set but not sent back to server on subsequent requests

### Diagnostic Steps

**Step 1: Check Browser DevTools**
```javascript
// Open DevTools → Console
// After successful login, check cookies
document.cookie;
// Note: HTTP-only cookies won't show here (expected)

// Open DevTools → Application → Cookies
// Look for domain: southwestresumes.com (or localhost:3000)
// Should see:
// - sb-access-token
// - sb-refresh-token
```

**Step 2: Check Network Tab**
```
// DevTools → Network tab
// Navigate to /admin
// Click the /admin request
// Headers → Request Headers → Cookie
// Should include: sb-access-token=...; sb-refresh-token=...

// If cookies missing from request:
// → Cookie setting/sending issue
```

**Step 3: Check Cookie Attributes**
```
// DevTools → Application → Cookies → sb-access-token
// Verify attributes:
// ✓ Domain: .southwestresumes.com (or localhost)
// ✓ Path: /
// ✓ Secure: true (production) or false (localhost)
// ✓ HttpOnly: true
// ✓ SameSite: Lax
// ✓ Expires: Future date (7 days from now)
```

### Solutions

**Solution 1: Secure Flag Incorrect for Environment**
```typescript
// File: lib/auth/admin-auth.ts
// Line ~212

// WRONG (causes issues in localhost):
cookieStore.set('sb-access-token', token, {
  secure: true,  // ← Always true
  ...
});

// CORRECT (environment-aware):
cookieStore.set('sb-access-token', token, {
  secure: process.env.NODE_ENV === 'production',  // ← Dynamic
  ...
});
```

**Solution 2: SameSite Too Restrictive**
```typescript
// WRONG:
sameSite: 'strict'  // ← Blocks some legitimate requests

// CORRECT:
sameSite: 'lax'  // ← Allows same-site navigations
```

**Solution 3: Domain Mismatch**
```typescript
// For localhost development, DON'T set domain explicitly
// Let it default to current domain

// WRONG (in localhost):
domain: 'southwestresumes.com'

// CORRECT (omit domain in dev):
// Don't set domain attribute for localhost
```

**Solution 4: Clear All Cookies and Re-Login**
```
1. Open DevTools → Application → Cookies
2. Right-click domain → Clear
3. Close all browser tabs
4. Open new tab → Navigate to /admin/login
5. Login again
6. Check if cookies persist
```

---

## Session Expires Too Quickly

### Symptoms
- User logs in
- Within hours (not days), session expires
- Expected: 7 days, Actual: < 1 day

### Diagnostic Steps

**Step 1: Check Cookie Expiration**
```
DevTools → Application → Cookies → sb-access-token
Expires / Max-Age column should show:
Date 7 days from now

If showing shorter time:
→ Max-Age set incorrectly
```

**Step 2: Check Code**
```typescript
// File: lib/auth/admin-auth.ts
// Line ~214

cookieStore.set('sb-access-token', token, {
  maxAge: 60 * 60 * 24 * 7,  // Should be 604800 seconds (7 days)
  ...
});
```

### Solutions

**Solution 1: Fix Max-Age**
```typescript
// WRONG:
maxAge: 60 * 60,  // Only 1 hour

// CORRECT:
maxAge: 60 * 60 * 24 * 7,  // 7 days
```

**Solution 2: Check Supabase JWT Expiry**
```
1. Go to Supabase Dashboard
2. Settings → Authentication
3. JWT Expiry → Should be 604800 (7 days in seconds)
4. If different, update and save
5. Re-login to test
```

---

## Rate Limited - Too Many Attempts

### Symptoms
- User tries to login
- Error: "Too many login attempts. Please try again later."
- Cannot login even with correct credentials
- Redirected to /admin/login/rate-limited

### Root Cause
- 5+ failed login attempts in 15 minutes from same IP
- Rate limit protection activated

### Diagnostic Steps

**Step 1: Check Rate Limit Status**
```typescript
// This requires code access - for developers only
import { getRateLimitStatus } from '@/lib/security/rate-limit';

const status = getRateLimitStatus('admin_login:192.168.1.1');
console.log(status);
// Output: { count: 5, resetTime: 1703123456789, firstAttempt: 1703122556789 }
```

**Step 2: Calculate Time Until Reset**
```javascript
const resetTime = 1703123456789;  // From status above
const now = Date.now();
const secondsUntilReset = Math.ceil((resetTime - now) / 1000);
const minutesUntilReset = Math.ceil(secondsUntilReset / 60);
console.log(`Reset in ${minutesUntilReset} minutes`);
```

### Solutions

**Solution 1: Wait for Automatic Reset**
- Rate limit resets after 15 minutes
- No action required
- User can try again after reset time

**Solution 2: Clear Rate Limit Manually (Emergency Only)**
```typescript
// File: lib/security/rate-limit.ts
// Add temporary endpoint or use Node.js console

import { clearRateLimit } from '@/lib/security/rate-limit';
clearRateLimit('admin_login:192.168.1.1');  // Replace with actual IP
```

**Solution 3: Adjust Rate Limit Settings (If Needed)**
```typescript
// File: app/api/admin/auth/login/route.ts
// Line ~8-9

// CURRENT:
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;  // 15 minutes

// IF NEEDED (be cautious - reduces security):
const MAX_LOGIN_ATTEMPTS = 10;  // Allow more attempts
const LOGIN_WINDOW_MS = 10 * 60 * 1000;  // Shorter window
```

---

## Admin Routes Return 404

### Symptoms
- Navigate to /admin
- Page shows 404 Not Found
- Or blank page with no content

### Diagnostic Steps

**Step 1: Verify Files Exist**
```bash
# Check admin routes exist
ls -la "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/app/admin/"

# Should see:
# - layout.tsx
# - layout-client.tsx
# - page.tsx
# - login/

ls -la "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/app/admin/login/"
# Should see:
# - page.tsx
```

**Step 2: Check Build Errors**
```bash
cd "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website"
npm run build

# Look for errors related to /app/admin
# Common errors:
# - TypeScript type errors
# - Missing imports
# - Syntax errors
```

**Step 3: Check Browser Console**
```
Open DevTools → Console
Look for errors like:
- "Module not found"
- "Cannot find module '@/lib/auth/admin-auth'"
- Import errors
```

### Solutions

**Solution 1: Fix Missing Files**
```bash
# If files are missing, check git status
git status

# If files not committed:
git add app/admin/
git commit -m "Add admin routes"

# If deployed to Vercel without files:
git push origin main
# Wait for Vercel to redeploy
```

**Solution 2: Fix Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

**Solution 3: Fix TypeScript Errors**
```bash
# Run type check
npm run type-check

# Fix any type errors in /app/admin files
# Common issues:
# - Missing type imports
# - Incorrect prop types
# - Missing async/await
```

---

## Changes Not Reflecting

### Symptoms
- Edit admin component code
- Save file
- No changes visible in browser
- Old version still appears

### Root Cause
- Next.js cache not cleared
- Browser cache
- Server-side rendering cache (Vercel)

### Solutions

**Solution 1: Clear Next.js Cache**
```bash
cd "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website"
rm -rf .next
npm run dev
```

**Solution 2: Hard Refresh Browser**
```
Chrome/Edge: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
Firefox: Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)
Safari: Cmd+Option+R
```

**Solution 3: Disable Browser Cache (DevTools)**
```
1. Open DevTools
2. Network tab
3. Check "Disable cache" checkbox
4. Keep DevTools open
5. Refresh page
```

**Solution 4: Clear Vercel Cache (Production)**
```
1. Go to Vercel Dashboard
2. Select project
3. Deployments tab
4. Click latest deployment → "..." menu
5. Click "Redeploy"
6. Check "Use existing Build Cache" → UNCHECK
7. Click "Redeploy"
```

---

## Cookie Not Persisting

### Symptoms
- Login succeeds
- Cookies set
- Close browser tab
- Reopen → Cookies gone
- Must login again

### Diagnostic Steps

**Step 1: Check Cookie Expiration**
```
DevTools → Application → Cookies → sb-access-token
Expires / Max-Age: Should be future date (not "Session")
```

**Step 2: Check Browser Settings**
```
Chrome:
Settings → Privacy and security → Cookies and other site data
Should NOT be "Clear cookies and site data when you close all windows"

Firefox:
Settings → Privacy & Security → Cookies and Site Data
Should NOT be "Delete cookies and site data when Firefox is closed"
```

### Solutions

**Solution 1: Fix Session Cookie**
```typescript
// File: lib/auth/admin-auth.ts

// WRONG (session cookie - deleted when browser closes):
cookieStore.set('sb-access-token', token, {
  // Missing maxAge → defaults to session cookie
});

// CORRECT (persistent cookie):
cookieStore.set('sb-access-token', token, {
  maxAge: 60 * 60 * 24 * 7,  // ← Add maxAge
  ...
});
```

**Solution 2: Change Browser Settings**
```
1. Open browser settings
2. Disable "Clear cookies on exit"
3. Restart browser
4. Login again
5. Test by closing and reopening browser
```

---

## CORS Errors

### Symptoms
- Login request fails
- Console shows CORS error:
  "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

### Root Cause
- Middleware blocking cross-origin requests
- Origin/Referer header mismatch

### Diagnostic Steps

**Step 1: Check Request Origin**
```
DevTools → Network → Login request → Headers
Request Headers:
- origin: https://southwestresumes.com
- referer: https://southwestresumes.com/admin/login

If origin and host don't match → CORS issue
```

**Step 2: Check Middleware Logs**
```bash
# In terminal running dev server, look for:
"CSRF: Request blocked - origin mismatch"
{
  origin: 'https://evil.com',
  host: 'southwestresumes.com',
  path: '/api/admin/auth/login'
}
```

### Solutions

**Solution 1: Development Mode Origin**
```typescript
// File: middleware.ts
// Line ~126

const isDevelopment = process.env.NODE_ENV === 'development';

// In development, localhost variations are allowed:
const isOriginValid = isDevelopment
  ? originHost.includes('localhost') || originHost.includes('127.0.0.1')
  : originHost === host;
```

**Solution 2: Check Environment Variable**
```bash
# Verify NODE_ENV is set correctly
echo $NODE_ENV

# Development:
NODE_ENV=development npm run dev

# Production (Vercel sets automatically):
NODE_ENV=production npm start
```

**Solution 3: Add Allowed Origins (If Needed)**
```typescript
// File: middleware.ts
// Only if you have multiple valid domains

const allowedOrigins = [
  'https://southwestresumes.com',
  'https://www.southwestresumes.com',
];

const isOriginValid = allowedOrigins.includes(origin);
```

---

## Emergency Reset Procedures

### Complete Admin Reset (Last Resort)

**When to Use:**
- Multiple issues compound
- Cannot identify root cause
- Need fresh start

**Steps:**

```bash
# 1. Stop development server
# Ctrl+C in terminal

# 2. Clear all caches
cd "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website"
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json

# 3. Reinstall dependencies
npm install

# 4. Reset Supabase (if needed)
# Go to Supabase Dashboard → SQL Editor
# Run: DROP TABLE IF EXISTS admin_users CASCADE;
# Then re-run create-admin-user.sql

# 5. Clear browser data
# DevTools → Application → Clear site data

# 6. Restart development
npm run dev

# 7. Login fresh
# Navigate to /admin/login
# Enter credentials
# Verify cookies set
# Verify /admin accessible
```

### Database Reset

```sql
-- WARNING: This deletes all admin users!
-- Only run if admin_users table is corrupted

-- Step 1: Drop and recreate admin_users table
DROP TABLE IF EXISTS admin_users CASCADE;

-- Step 2: Recreate table (copy from migration file)
-- File: supabase/migrations/20251221_create_admin_users.sql

-- Step 3: Recreate admin user
-- Run create-admin-user.sql
```

---

## Diagnostic Commands

### Quick Diagnostics Checklist

```bash
# 1. Check files exist
ls app/admin/layout.tsx app/admin/page.tsx app/admin/login/page.tsx

# 2. Check for syntax errors
npm run build

# 3. Check for type errors
npm run type-check

# 4. Check environment variables
cat .env.local | grep SUPABASE

# 5. Test Supabase connection
# Create temp file: test-supabase.ts
# Run: npx ts-node test-supabase.ts
```

### Browser Console Diagnostics

```javascript
// Run in browser console after login attempt

// 1. Check cookies (won't show HTTP-only)
document.cookie;

// 2. Check local storage
localStorage.getItem('sb-access-token');  // Should be null (we use cookies)

// 3. Check session storage
sessionStorage.getItem('sb-access-token');  // Should be null

// 4. Check current pathname
window.location.pathname;  // Should be /admin or /admin/login

// 5. Force reload without cache
location.reload(true);
```

---

## Getting Help

### Before Requesting Help

1. Check this troubleshooting guide first
2. Review error messages in:
   - Browser console (DevTools → Console)
   - Terminal (development server logs)
   - Vercel logs (production)
3. Try emergency reset procedures
4. Collect diagnostic information:
   - Exact error message
   - Steps to reproduce
   - Browser and version
   - Environment (dev/production)
   - Screenshots

### Support Resources

**Documentation:**
- ADMIN-AUTH-SOP.md - Standard operating procedures
- ADMIN-AUTH-ARCHITECTURE.md - Technical architecture
- ADMIN-ONBOARDING.md - Developer onboarding
- SECURITY-IMPLEMENTATION-GUIDE.md - Security details

**External Resources:**
- Supabase Auth Documentation: https://supabase.com/docs/guides/auth
- Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
- HTTP Cookies: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

---

**Document Version:** 1.0
**Last Updated:** December 22, 2025
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
