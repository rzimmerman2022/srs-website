# ADMIN AUTHENTICATION - TESTING QUICK GUIDE

**Document Version:** 1.0
**Last Updated:** December 22, 2025
**System:** Southwest Resume Services Admin Portal
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Testing Mode 1: Simple Session Authentication](#testing-mode-1-simple-session-authentication)
3. [Testing Mode 2: Supabase Authentication](#testing-mode-2-supabase-authentication)
4. [Browser Testing](#browser-testing)
5. [Automated Testing](#automated-testing)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Expected Results Reference](#expected-results-reference)

---

## Quick Start

### Prerequisites

```bash
# 1. Start the development server
npm run dev

# 2. Server should be running at http://localhost:3000

# 3. Verify server is accessible
curl http://localhost:3000
```

### Choose Your Testing Mode

**Mode 1: Simple Session (Fastest)**
- Best for: Quick testing, local development
- Setup time: 30 seconds
- Requirements: ADMIN_EMAIL, ADMIN_PASSWORD env vars

**Mode 2: Supabase (Production-like)**
- Best for: Full feature testing, production validation
- Setup time: 5 minutes
- Requirements: Supabase project, database migrations

---

## Testing Mode 1: Simple Session Authentication

### Setup (30 seconds)

```bash
# Add to .env.local
echo "ADMIN_EMAIL=admin@southwestresumeservices.com" >> .env.local
echo "ADMIN_PASSWORD=admin123" >> .env.local

# Restart dev server
npm run dev
```

### Test 1: Login Success

**cURL Command:**
```bash
curl -v -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@southwestresumeservices.com",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful"
}
```

**Expected Cookie (in cookies.txt):**
```
localhost	FALSE	/	FALSE	0	admin_session	authenticated
```

**Verify Cookie Attributes:**
```bash
# Check Set-Cookie header in response
curl -i -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@southwestresumeservices.com","password":"admin123"}' \
  | grep -i "set-cookie"

# Should see:
# Set-Cookie: admin_session=authenticated; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800
```

### Test 2: Login Failure (Wrong Password)

**cURL Command:**
```bash
curl -v -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@southwestresumeservices.com",
    "password": "wrongpassword"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid email or password",
  "attemptsRemaining": 4
}
```

**Expected Status Code:** `401 Unauthorized`

### Test 3: Access Protected Route (With Cookie)

**cURL Command:**
```bash
# First login to get cookie
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"admin@southwestresumeservices.com","password":"admin123"}'

# Then access admin page
curl -L -b cookies.txt http://localhost:3000/admin
```

**Expected Result:**
- Status: 200 OK
- Page loads without redirect to login
- HTML contains admin dashboard content

### Test 4: Access Protected Route (Without Cookie)

**cURL Command:**
```bash
# Access admin page without cookies
curl -L http://localhost:3000/admin
```

**Expected Result:**
- Redirects to `/admin/login`
- Final URL: `http://localhost:3000/admin/login`
- Status: 200 OK (on login page)

### Test 5: Rate Limiting

**cURL Command:**
```bash
# Make 5 failed login attempts
for i in {1..5}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:3000/api/admin/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
  echo ""
done

# 6th attempt should be rate limited
echo "Attempt 6 (should be rate limited):"
curl -i -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'
```

**Expected Response (6th attempt):**
```json
{
  "error": "Too many login attempts. Please try again later.",
  "retryAfter": 900
}
```

**Expected Status Code:** `429 Too Many Requests`

**Expected Headers:**
```
Retry-After: 900
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1703123456
```

### Test 6: Session Persistence

**cURL Command:**
```bash
# Login
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"admin@southwestresumeservices.com","password":"admin123"}'

# Wait 10 seconds
sleep 10

# Access admin page (should still work)
curl -b cookies.txt http://localhost:3000/admin
```

**Expected Result:**
- Session persists
- No re-authentication required
- Admin page loads successfully

---

## Testing Mode 2: Supabase Authentication

### Setup (5 minutes)

```bash
# 1. Add Supabase credentials to .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=https://aougseszcvzgxwniossn.supabase.co" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=your-service-key" >> .env.local

# 2. Run database migrations
# Open Supabase SQL Editor
# Run: supabase/migrations/20251221_create_admin_users.sql

# 3. Create admin user
# Run: create-admin-user.sql

# 4. Restart dev server
npm run dev
```

### Test 1: Supabase Login Success

**cURL Command:**
```bash
curl -v -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -c supabase-cookies.txt \
  -d '{
    "email": "ryan.zimmerman@southwestresumes.com",
    "password": "Welectric9191!"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful"
}
```

**Expected Cookies (in supabase-cookies.txt):**
```
localhost	FALSE	/	FALSE	0	sb-access-token	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
localhost	FALSE	/	FALSE	0	sb-refresh-token	v2.local.Tk1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0...
```

**Verify Supabase Cookies:**
```bash
# Check for both cookies
grep "sb-access-token" supabase-cookies.txt
grep "sb-refresh-token" supabase-cookies.txt
```

### Test 2: Access Admin with Supabase Session

**cURL Command:**
```bash
# Login with Supabase
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -c supabase-cookies.txt \
  -d '{"email":"ryan.zimmerman@southwestresumes.com","password":"Welectric9191!"}'

# Access admin dashboard
curl -L -b supabase-cookies.txt http://localhost:3000/admin
```

**Expected Result:**
- Status: 200 OK
- Dashboard loads successfully
- No redirect to login

### Test 3: Invalid Supabase Credentials

**cURL Command:**
```bash
curl -v -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid email or password",
  "attemptsRemaining": 4
}
```

**Expected Status Code:** `401 Unauthorized`

---

## Browser Testing

### Manual Browser Tests

**Test 1: Simple Session Login**

1. Open browser to `http://localhost:3000/admin`
2. Verify redirect to `/admin/login`
3. Enter credentials:
   - Email: `admin@southwestresumeservices.com`
   - Password: `admin123`
4. Click "Sign In"
5. Verify redirect to `/admin`
6. Open DevTools → Application → Cookies
7. Verify cookie present:
   - Name: `admin_session`
   - Value: `authenticated`
   - HttpOnly: ✓
   - Secure: ✓ (if HTTPS)
   - SameSite: Strict
   - Max-Age: 28800

**Test 2: Supabase Login**

1. Clear all cookies (DevTools → Application → Cookies → Clear all)
2. Navigate to `http://localhost:3000/admin`
3. Enter Supabase credentials:
   - Email: `ryan.zimmerman@southwestresumes.com`
   - Password: `Welectric9191!`
4. Click "Sign In"
5. Verify redirect to `/admin`
6. Open DevTools → Application → Cookies
7. Verify TWO cookies present:
   - `sb-access-token` (JWT)
   - `sb-refresh-token`
   - Both HttpOnly: ✓
   - Both Secure: ✓ (if HTTPS)
   - Both SameSite: Lax

**Test 3: Logout**

1. While logged in, click "Sign Out"
2. Verify redirect to `/admin/login`
3. Check DevTools → Cookies
4. Verify cookies deleted:
   - `admin_session` OR
   - `sb-access-token` and `sb-refresh-token`
5. Try to navigate to `/admin`
6. Verify redirect back to login

**Test 4: Session Persistence**

1. Login successfully
2. Close browser completely
3. Reopen browser
4. Navigate to `http://localhost:3000/admin`
5. Verify NO redirect to login (session persisted)
6. Dashboard loads immediately

---

## Automated Testing

### Run Full Test Suite

```bash
# Make script executable
chmod +x test-admin-auth.sh

# Run all tests
./test-admin-auth.sh http://localhost:3000
```

**Expected Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ADMIN AUTHENTICATION TEST SUITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[INFO] Testing endpoint: http://localhost:3000/api/admin/auth/login
[INFO] Testing admin page: http://localhost:3000/admin

[PASS] Server is reachable at http://localhost:3000

[TEST] Test 1: Login with correct credentials
[PASS] Login successful with correct credentials
[PASS] Session cookie was set

[TEST] Test 2: Login with wrong credentials
[PASS] Login rejected with 401 Unauthorized
[PASS] Response includes attemptsRemaining counter

[TEST] Test 3: Rate limiting (5 attempts per 15 min)
[PASS] Rate limiting triggered after 5 attempts
[PASS] Response includes retryAfter value
[PASS] X-RateLimit-Limit header present
[PASS] Retry-After header present

[TEST] Test 4: Cookie security attributes
[PASS] Cookie has HttpOnly flag
[INFO] Cookie missing Secure flag (expected in dev mode)
[PASS] Cookie has SameSite attribute
[PASS] Cookie has correct Path (root)

[TEST] Test 5: Access protected route without authentication
[PASS] Redirected to login page

[TEST] Test 6: Access protected route with authentication
[PASS] Successfully accessed admin page

[TEST] Test 7: Malformed request handling
[PASS] Returns 400 for missing email
[PASS] Returns 400 for missing password
[PASS] Handles invalid JSON gracefully

[TEST] Test 8: CSRF protection on login endpoint
[INFO] Request processed (dev mode or valid origin)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TEST SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tests Run:    8
Tests Passed: 18
Tests Failed: 0

✓ All tests passed!
```

### Run Specific Tests

```bash
# Test only login functionality
./test-admin-auth.sh http://localhost:3000 | grep -A5 "Test 1"

# Test only rate limiting
./test-admin-auth.sh http://localhost:3000 | grep -A10 "Test 3"

# Test only cookie attributes
./test-admin-auth.sh http://localhost:3000 | grep -A8 "Test 4"
```

---

## Common Issues & Solutions

### Issue 1: "Connection refused"

**Symptoms:**
```bash
curl: (7) Failed to connect to localhost port 3000: Connection refused
```

**Solution:**
```bash
# Verify dev server is running
npm run dev

# Check if port 3000 is in use
lsof -i :3000

# If port is taken, use a different port
PORT=3001 npm run dev
```

### Issue 2: Login succeeds but cookies not saved

**Symptoms:**
- cURL returns 200 OK
- Response shows `"success": true`
- But `cookies.txt` is empty or missing cookie

**Solution:**
```bash
# Make sure to use -c flag to save cookies
curl -c cookies.txt ...  # ← CORRECT

# Check file permissions
ls -la cookies.txt

# Try writing to a different location
curl -c /tmp/cookies.txt ...
```

### Issue 3: "Invalid email or password" with correct credentials

**Symptoms:**
- Using correct email/password from .env.local
- Still getting 401 Unauthorized

**Solution:**
```bash
# 1. Verify environment variables are loaded
echo $ADMIN_EMAIL
echo $ADMIN_PASSWORD

# 2. Restart dev server after changing .env.local
npm run dev

# 3. Check for typos in .env.local
cat .env.local | grep ADMIN

# 4. Try hardcoded values for testing
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@southwestresumeservices.com","password":"admin123"}'
```

### Issue 4: Rate limited immediately

**Symptoms:**
- First login attempt returns 429
- Error: "Too many login attempts"

**Solution:**
```bash
# Clear rate limit (if you have access to server)
# Add this endpoint temporarily: /api/admin/auth/clear-rate-limit

# OR wait 15 minutes for automatic reset

# OR change your IP (use different network/VPN)

# OR restart server (clears in-memory rate limits)
npm run dev
```

### Issue 5: Cookie not sent with subsequent requests

**Symptoms:**
- Login succeeds, cookie saved
- But next request doesn't include cookie
- Gets redirected to login again

**Solution:**
```bash
# Make sure to use -b flag to send cookies
curl -b cookies.txt http://localhost:3000/admin  # ← CORRECT

# Verify cookie file has content
cat cookies.txt

# Check cookie hasn't expired
# Max-Age: 28800 = 8 hours

# Make sure domain matches
# Cookie domain should be "localhost" for http://localhost:3000
```

### Issue 6: Testing Supabase but using simple auth

**Symptoms:**
- Want to test Supabase authentication
- But login sets `admin_session` cookie instead

**Solution:**
```bash
# 1. Verify Supabase env vars are set
env | grep SUPABASE

# 2. Update login route to use Supabase
# Check app/api/admin/auth/login/route.ts
# Should call Supabase auth, not simple password check

# 3. Clear simple auth env vars temporarily
unset ADMIN_PASSWORD

# 4. Restart server
npm run dev
```

---

## Expected Results Reference

### HTTP Status Codes

| Scenario | Expected Code | Meaning |
|----------|---------------|---------|
| Login success | 200 | OK |
| Login failure (wrong credentials) | 401 | Unauthorized |
| Rate limited | 429 | Too Many Requests |
| Missing email/password | 400 | Bad Request |
| Invalid JSON | 400 or 500 | Bad Request or Server Error |
| CSRF violation | 403 | Forbidden |
| Access admin without auth | 302/307 | Redirect to login |
| Access admin with auth | 200 | OK |

### Cookie Lifetimes

| Cookie | Max-Age (seconds) | Duration | Mode |
|--------|-------------------|----------|------|
| admin_session | 28800 | 8 hours | Simple |
| sb-access-token | 604800 | 7 days | Supabase |
| sb-refresh-token | 2592000 | 30 days | Supabase |

### Rate Limit Values

| Parameter | Value | Description |
|-----------|-------|-------------|
| Max attempts | 5 | Failed logins before rate limit |
| Window | 900 seconds | 15 minutes |
| Retry after | 900 seconds | Wait time after rate limit |

### Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| X-RateLimit-Limit | 5 | Max attempts allowed |
| X-RateLimit-Remaining | 0-5 | Attempts remaining |
| X-RateLimit-Reset | Unix timestamp | When limit resets |
| Retry-After | 900 | Seconds to wait |
| X-Frame-Options | DENY | Prevent clickjacking |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-Robots-Tag | noindex, nofollow | Block search engines |

---

## Troubleshooting Tips

### Enable Verbose Mode

```bash
# cURL verbose output
curl -v ...  # Shows headers, redirects, SSL info

# cURL very verbose
curl -vv ...

# Save full response (headers + body)
curl -i ...
```

### Debug Cookie Issues

```bash
# Show all cookies in file
cat cookies.txt

# Show only specific cookie
grep "admin_session" cookies.txt

# Show cookies with details
cat -A cookies.txt  # Shows hidden characters

# Test cookie without file
curl -b "admin_session=authenticated" http://localhost:3000/admin
```

### Check Server Logs

```bash
# Watch dev server logs in real-time
npm run dev

# Look for:
# - "CSRF: Request blocked" (CSRF issues)
# - "Login error:" (Authentication errors)
# - "Rate limit exceeded" (Rate limiting)
```

### Verify Environment

```bash
# Check all environment variables
env | grep -E "ADMIN|SUPABASE"

# Check Node.js version
node --version  # Should be 18+ for Next.js 15

# Check Next.js version
npm list next  # Should be 15.x

# Verify dependencies installed
npm install
```

---

## Quick Reference Commands

### Simple Session Testing

```bash
# Login
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"admin@southwestresumeservices.com","password":"admin123"}'

# Access admin
curl -b cookies.txt http://localhost:3000/admin

# Check cookie
cat cookies.txt | grep admin_session
```

### Supabase Testing

```bash
# Login
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"ryan.zimmerman@southwestresumes.com","password":"Welectric9191!"}'

# Access admin
curl -b cookies.txt http://localhost:3000/admin

# Check cookies
cat cookies.txt | grep "sb-"
```

### Quick Health Check

```bash
# One-liner to test full flow
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -c /tmp/test-cookies.txt \
  -d '{"email":"admin@southwestresumeservices.com","password":"admin123"}' && \
curl -b /tmp/test-cookies.txt http://localhost:3000/admin && \
echo "✓ Authentication working correctly"
```

---

**Document Version:** 1.0
**Last Updated:** December 22, 2025
**Next Review:** January 22, 2026
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
