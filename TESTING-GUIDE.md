# Admin Authentication Testing Guide

Complete testing documentation for the Southwest Resume Services admin authentication system.

## Table of Contents

1. [Overview](#overview)
2. [Testing Tools](#testing-tools)
3. [Automated Testing](#automated-testing)
4. [Manual Testing Checklist](#manual-testing-checklist)
5. [Browser-Based Testing](#browser-based-testing)
6. [Debug Tools](#debug-tools)
7. [Performance Benchmarks](#performance-benchmarks)
8. [Security Testing](#security-testing)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The admin authentication system uses:
- **Simple password-based authentication** with environment variables
- **Rate limiting**: 5 attempts per 15 minutes per IP
- **HttpOnly cookies** for session management
- **CSRF protection** via middleware
- **Secure cookie attributes**: HttpOnly, Secure (production), SameSite

### Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/auth/login` | POST | Authenticate admin user |
| `/api/admin/logout` | POST | Sign out admin user |
| `/admin/login` | GET | Login page |
| `/admin/*` | GET | Protected admin pages |

### Authentication Flow

```
User → Login Page → POST credentials → API validates → Set cookie → Redirect to /admin
                                    ↓
                            Middleware checks cookie
                                    ↓
                            Allow/Deny access
```

---

## Testing Tools

### 1. test-admin-auth.sh
Automated curl-based test suite for server-side validation.

**Location**: `/test-admin-auth.sh`

**Features**:
- Login success/failure tests
- Rate limiting validation
- Cookie security checks
- Protected route testing
- CSRF protection validation

### 2. test-admin-auth.js
Browser-based test suite for client-side validation.

**Location**: `/test-admin-auth.js`

**Features**:
- Interactive testing in browser console
- Network monitoring
- Session persistence testing
- Real-time results

### 3. debug-cookies.js
Comprehensive debugging toolkit.

**Location**: `/debug-cookies.js`

**Features**:
- Cookie inspection
- Storage analysis
- Request monitoring
- Session validation
- Redirect tracing

---

## Automated Testing

### Setup

1. **Ensure server is running**:
   ```bash
   npm run dev
   ```

2. **Set environment variables** (optional):
   ```bash
   export ADMIN_EMAIL="your-email@example.com"
   export ADMIN_PASSWORD="your-password"
   ```

3. **Make test script executable**:
   ```bash
   chmod +x test-admin-auth.sh
   ```

### Run Tests

```bash
# Test against local development server
./test-admin-auth.sh

# Test against specific URL
./test-admin-auth.sh http://localhost:3000

# Test against production
./test-admin-auth.sh https://your-domain.com
```

### Expected Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ADMIN AUTHENTICATION TEST SUITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[INFO] Testing endpoint: http://localhost:3000/api/admin/auth/login
[PASS] Server is reachable at http://localhost:3000

[TEST] Test 1: Login with correct credentials
[INFO] Response Code: 200
[PASS] Login successful with correct credentials
[PASS] Session cookie was set

[TEST] Test 2: Login with wrong credentials
[INFO] Response Code: 401
[PASS] Login rejected with 401 Unauthorized
[PASS] Response includes attemptsRemaining counter

... (more tests)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TEST SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tests Run:    8
Tests Passed: 24
Tests Failed: 0

✓ All tests passed!
```

### Understanding Test Results

- **PASS**: Test succeeded, behavior is correct
- **FAIL**: Test failed, indicates a problem
- **INFO**: Informational message about test execution

### Common Test Failures

| Test | Failure Reason | Solution |
|------|---------------|----------|
| Login Success | Wrong credentials | Check environment variables |
| Rate Limiting | Not triggering | Check rate limit configuration |
| Cookie Set | No cookie | Check Set-Cookie headers |
| Protected Route | Accessible without auth | Check middleware configuration |

---

## Manual Testing Checklist

Use this checklist for manual QA testing.

### Pre-Test Setup

- [ ] Clear browser cookies (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- [ ] Clear localStorage (DevTools > Application > Local Storage > Clear)
- [ ] Open browser DevTools (F12)
- [ ] Open Network tab in DevTools

### Test 1: Login Flow - Success

**Objective**: Verify successful login with correct credentials

1. **Navigate to login page**
   - [ ] Visit `http://localhost:3000/admin/login`
   - [ ] Page loads without errors
   - [ ] Form displays correctly

2. **Enter credentials**
   - [ ] Enter email: `admin@southwestresumeservices.com` (or your configured email)
   - [ ] Enter password: `admin123` (or your configured password)
   - [ ] Click "Sign In"

3. **Verify response**
   - [ ] Network tab shows POST to `/api/admin/auth/login`
   - [ ] Response status: 200 OK
   - [ ] Response includes `{"success":true}`
   - [ ] Set-Cookie header present

4. **Verify redirect**
   - [ ] Redirected to `/admin` page
   - [ ] Admin dashboard loads
   - [ ] No login page shown

5. **Verify cookies**
   - [ ] Open DevTools > Application > Cookies
   - [ ] Cookie `admin_session` exists
   - [ ] Cookie has HttpOnly flag
   - [ ] Cookie has Path=/
   - [ ] Cookie has Max-Age set

**Expected Result**: ✅ User is logged in and can access admin pages

---

### Test 2: Login Flow - Failure

**Objective**: Verify login rejection with wrong credentials

1. **Navigate to login page**
   - [ ] Visit `http://localhost:3000/admin/login`

2. **Enter wrong credentials**
   - [ ] Enter email: `wrong@example.com`
   - [ ] Enter password: `wrongpassword`
   - [ ] Click "Sign In"

3. **Verify response**
   - [ ] Response status: 401 Unauthorized
   - [ ] Error message shown: "Invalid email or password"
   - [ ] Response includes `attemptsRemaining` field
   - [ ] Headers include `X-RateLimit-Remaining`

4. **Verify no cookies set**
   - [ ] Open DevTools > Application > Cookies
   - [ ] No `admin_session` cookie

5. **Verify still on login page**
   - [ ] URL is still `/admin/login`
   - [ ] Form is still visible

**Expected Result**: ✅ User remains on login page with error message

---

### Test 3: Rate Limiting

**Objective**: Verify rate limiting after 5 failed attempts

1. **Make 5 failed login attempts**
   - [ ] Attempt 1: Wrong password → 401 (4 remaining)
   - [ ] Attempt 2: Wrong password → 401 (3 remaining)
   - [ ] Attempt 3: Wrong password → 401 (2 remaining)
   - [ ] Attempt 4: Wrong password → 401 (1 remaining)
   - [ ] Attempt 5: Wrong password → 401 (0 remaining)

2. **Make 6th attempt**
   - [ ] Enter credentials (any)
   - [ ] Click "Sign In"

3. **Verify rate limit response**
   - [ ] Response status: 429 Too Many Requests
   - [ ] Error message includes "Too many login attempts"
   - [ ] Response includes `retryAfter` field
   - [ ] Redirected to `/admin/login/rate-limited` page

4. **Verify rate limit headers**
   - [ ] Header `X-RateLimit-Limit: 5`
   - [ ] Header `X-RateLimit-Remaining: 0`
   - [ ] Header `Retry-After` present

5. **Verify lockout duration**
   - [ ] Wait 1 minute, try again → Still blocked
   - [ ] Wait 15 minutes, try again → Should work

**Expected Result**: ✅ Account locked for 15 minutes after 5 failed attempts

---

### Test 4: Session Persistence

**Objective**: Verify session persists across page loads

1. **Login successfully**
   - [ ] Log in with correct credentials
   - [ ] Verify redirect to `/admin`

2. **Navigate to different page**
   - [ ] Click a link or navigate to another route
   - [ ] Verify still authenticated

3. **Refresh the page**
   - [ ] Press F5 or Ctrl+R
   - [ ] Verify still on admin page (not redirected to login)

4. **Open in new tab**
   - [ ] Open new tab
   - [ ] Navigate to `http://localhost:3000/admin`
   - [ ] Verify can access without login

5. **Close and reopen browser**
   - [ ] Close all browser windows
   - [ ] Reopen browser
   - [ ] Navigate to `http://localhost:3000/admin`
   - [ ] Verify session persists (if within cookie Max-Age)

**Expected Result**: ✅ Session persists across page loads and browser restarts

---

### Test 5: Cookie Expiration

**Objective**: Verify cookie expiration and session timeout

1. **Check cookie Max-Age**
   - [ ] Login successfully
   - [ ] Open DevTools > Application > Cookies
   - [ ] Check `admin_session` cookie
   - [ ] Verify Max-Age: 28800 (8 hours)

2. **Manually expire cookie** (for testing)
   - [ ] Open browser console
   - [ ] Run: `document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"`
   - [ ] Refresh page

3. **Verify redirect to login**
   - [ ] Should redirect to `/admin/login`
   - [ ] Should not have access to admin pages

**Expected Result**: ✅ Expired cookies redirect to login page

---

### Test 6: Protected Routes

**Objective**: Verify middleware protects admin routes

1. **Test without authentication**
   - [ ] Clear all cookies
   - [ ] Navigate to `http://localhost:3000/admin`

2. **Verify redirect**
   - [ ] Should redirect to `/admin/login`
   - [ ] Should not see admin content

3. **Test with authentication**
   - [ ] Login successfully
   - [ ] Navigate to `http://localhost:3000/admin`

4. **Verify access granted**
   - [ ] Should see admin dashboard
   - [ ] Should not redirect

5. **Test nested routes**
   - [ ] Test `/admin/dashboard`
   - [ ] Test `/admin/settings`
   - [ ] All should require authentication

**Expected Result**: ✅ All admin routes protected by middleware

---

### Test 7: Logout Flow

**Objective**: Verify logout functionality

1. **Login first**
   - [ ] Login with correct credentials
   - [ ] Verify authenticated

2. **Perform logout**
   - [ ] Click logout button
   - [ ] Or POST to `/api/admin/logout`

3. **Verify logout response**
   - [ ] Response status: 200 OK
   - [ ] Response includes `{"success":true}`

4. **Verify cookies cleared**
   - [ ] Open DevTools > Application > Cookies
   - [ ] `admin_session` cookie should be deleted
   - [ ] All auth cookies should be cleared

5. **Verify redirect to login**
   - [ ] Should redirect to `/admin/login`
   - [ ] Try accessing `/admin` → Should redirect

**Expected Result**: ✅ User is logged out and redirected to login page

---

### Test 8: CSRF Protection

**Objective**: Verify CSRF protection on API endpoints

1. **Test from external domain** (use curl or Postman)
   ```bash
   curl -X POST http://localhost:3000/api/admin/auth/login \
     -H "Content-Type: application/json" \
     -H "Origin: https://evil-site.com" \
     -d '{"email":"test@example.com","password":"test"}'
   ```

2. **Verify response**
   - [ ] In production: Should return 403 Forbidden
   - [ ] In development: May allow (for testing)

3. **Test without Origin/Referer headers**
   ```bash
   curl -X POST http://localhost:3000/api/admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test"}'
   ```

4. **Verify response**
   - [ ] Production: Should return 403
   - [ ] Development: Warning logged, but may allow

**Expected Result**: ✅ CSRF protection blocks cross-origin requests in production

---

### Test 9: Cookie Security Attributes

**Objective**: Verify cookies have correct security flags

1. **Login successfully**
   - [ ] Login with correct credentials

2. **Inspect cookies in DevTools**
   - [ ] Open DevTools > Application > Cookies
   - [ ] Select your domain

3. **Verify `admin_session` cookie**
   - [ ] **HttpOnly**: ✅ (cannot be read by JavaScript)
   - [ ] **Secure**: ✅ (production only, HTTP in dev)
   - [ ] **SameSite**: ✅ (Strict or Lax)
   - [ ] **Path**: / (accessible on all routes)
   - [ ] **Domain**: Your domain or localhost

4. **Test HttpOnly** (should fail)
   - [ ] Open browser console
   - [ ] Try: `console.log(document.cookie)`
   - [ ] Verify `admin_session` not visible (correct)

**Expected Result**: ✅ All security flags properly set

---

### Test 10: Malformed Requests

**Objective**: Verify API handles malformed requests gracefully

1. **Missing email**
   ```bash
   curl -X POST http://localhost:3000/api/admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{"password":"test"}'
   ```
   - [ ] Should return 400 Bad Request

2. **Missing password**
   ```bash
   curl -X POST http://localhost:3000/api/admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```
   - [ ] Should return 400 Bad Request

3. **Invalid JSON**
   ```bash
   curl -X POST http://localhost:3000/api/admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{invalid json'
   ```
   - [ ] Should return 400 or 500 with error message

4. **Empty body**
   ```bash
   curl -X POST http://localhost:3000/api/admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{}'
   ```
   - [ ] Should return 400 Bad Request

**Expected Result**: ✅ All malformed requests return appropriate error codes

---

## Browser-Based Testing

### Setup

1. Open your browser to the admin login page
2. Open browser DevTools (F12)
3. Go to the Console tab
4. Copy and paste the contents of `test-admin-auth.js`
5. Press Enter

### Run Tests

```javascript
// Run all tests
runAdminAuthTests()

// Or run individual tests
window.adminAuthTestConfig
```

### View Results

After tests complete:
- Results displayed in console with color coding
- Full results available in: `window.adminAuthTestResults`
- Each test shows pass/fail status

### Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ADMIN AUTHENTICATION TEST SUITE - BROWSER VERSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[TEST] Test 1: Login with correct credentials
[INFO] Response Status: 200
✓ PASS: Login successful with correct credentials
✓ PASS: Session cookie was set

[TEST] Test 2: Login with wrong credentials
[INFO] Response Status: 401
✓ PASS: Login rejected with 401 Unauthorized
✓ PASS: Response includes attemptsRemaining: 4

... (more tests)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TEST SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tests Run:    8
Tests Passed: 18
Tests Failed: 0

✓ All tests passed!
```

---

## Debug Tools

### Loading Debug Tools

1. Open browser console
2. Copy and paste contents of `debug-cookies.js`
3. Available commands will be listed

### Available Commands

#### debugAdminAuth()
Run full diagnostic of authentication system.

```javascript
debugAdminAuth()
```

**Output**:
- Current location
- Session validation
- Cookie inspection
- Storage contents
- Endpoint availability
- Authentication status summary

#### showCookies()
Display all cookies with details.

```javascript
showCookies()
```

**Output**:
- All cookies in table format
- Auth cookies highlighted
- JWT token analysis
- Token expiration status

#### showStorage()
Display localStorage and sessionStorage.

```javascript
showStorage()
```

**Output**:
- All localStorage items
- All sessionStorage items
- Auth-related items highlighted

#### monitorRequests()
Monitor all fetch requests in real-time.

```javascript
monitorRequests()

// To stop monitoring
stopMonitoring()
```

**Output**:
- Request URL, method, headers, body
- Response status, headers, body
- Request duration

#### traceRedirects()
Trace redirect chain for admin routes.

```javascript
traceRedirects()
```

**Output**:
- Tests multiple admin URLs
- Shows redirect behavior
- Identifies redirect loops

#### validateSession()
Check if current session is valid.

```javascript
validateSession()
```

**Output**:
- Auth cookie presence
- JWT expiration status
- Time remaining
- Overall validity

#### testLoginEndpoint()
Interactive login endpoint tester.

```javascript
testLoginEndpoint()
```

**Prompts for**:
- Email
- Password

**Output**:
- Response status and body
- Headers
- Cookie updates

#### clearAuth()
Clear all authentication data.

```javascript
clearAuth()
```

**Clears**:
- All auth cookies
- Auth-related localStorage
- All sessionStorage

---

## Performance Benchmarks

### Expected Response Times

| Operation | Expected Time | Acceptable Range | Slow Threshold |
|-----------|---------------|------------------|----------------|
| Login API | < 500ms | 100-1000ms | > 2000ms |
| Middleware Check | < 50ms | 10-100ms | > 200ms |
| Cookie Read | < 10ms | 1-20ms | > 50ms |
| Cookie Write | < 10ms | 1-20ms | > 50ms |
| Session Validation | < 200ms | 50-500ms | > 1000ms |
| Page Load (authenticated) | < 2000ms | 500-3000ms | > 5000ms |

### Measuring Performance

#### Using Browser DevTools

1. Open DevTools > Network tab
2. Perform login
3. Check timing for `/api/admin/auth/login`
4. Look at:
   - **Waiting (TTFB)**: Time to first byte
   - **Content Download**: Data transfer time
   - **Total**: Overall request time

#### Using test-admin-auth.js

The browser test suite automatically measures response times:

```javascript
runAdminAuthTests()

// Check results
window.adminAuthTestResults.filter(r => r.testName === 'Network Monitoring')
```

#### Using curl

```bash
# Measure login endpoint
time curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@southwestresumeservices.com","password":"admin123"}'
```

### Performance Optimization Tips

If experiencing slow performance:

1. **Check database connection**
   - Supabase query times
   - Connection pool status

2. **Check rate limiting overhead**
   - In-memory map performance
   - Cleanup interval

3. **Check middleware overhead**
   - Cookie parsing time
   - Redirect logic

4. **Check network latency**
   - API to client
   - API to database

---

## Security Testing

### Security Checklist

- [ ] **Passwords not in plain text**: Check environment variables
- [ ] **Cookies are HttpOnly**: Cannot be accessed via JavaScript
- [ ] **Cookies are Secure**: In production (HTTPS only)
- [ ] **SameSite attribute**: Prevents CSRF
- [ ] **Rate limiting works**: Blocks brute force
- [ ] **CSRF protection**: Blocks cross-origin requests
- [ ] **No sensitive data in logs**: Check console output
- [ ] **No tokens in URL**: Check query parameters
- [ ] **Session timeout**: Cookies expire after inactivity
- [ ] **Logout clears session**: All cookies removed

### Common Security Issues

| Issue | Risk | Solution |
|-------|------|----------|
| Missing HttpOnly | XSS attacks can steal cookies | Set HttpOnly flag |
| No rate limiting | Brute force attacks | Implement rate limiting |
| Weak passwords | Easy to guess | Use strong passwords |
| No CSRF protection | Cross-site attacks | Validate Origin/Referer |
| Long session duration | Increased exposure | Reduce Max-Age |
| Plain text credentials | Interception | Use HTTPS in production |

### Security Testing Tools

#### Test Rate Limiting
```bash
# Should block after 5 attempts
for i in {1..6}; do
  echo "Attempt $i"
  curl -X POST http://localhost:3000/api/admin/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
  echo ""
done
```

#### Test CSRF Protection
```bash
# Should return 403 in production
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://evil-site.com" \
  -d '{"email":"test@example.com","password":"test"}'
```

#### Test Cookie Attributes
```bash
# Check Set-Cookie header
curl -i -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@southwestresumeservices.com","password":"admin123"}' \
  | grep -i "set-cookie"
```

---

## Troubleshooting

### Login Not Working

**Symptoms**:
- 401 Unauthorized on login
- "Invalid credentials" error
- Correct credentials rejected

**Possible Causes**:
1. Wrong email or password
2. Environment variables not set
3. Database connection issue
4. Rate limit active

**Solutions**:
1. Check environment variables:
   ```bash
   echo $ADMIN_EMAIL
   echo $ADMIN_PASSWORD
   ```

2. Check `.env.local` file:
   ```
   ADMIN_EMAIL=admin@southwestresumeservices.com
   ADMIN_PASSWORD=admin123
   ```

3. Restart development server:
   ```bash
   npm run dev
   ```

4. Clear rate limit (wait 15 minutes or restart server)

---

### Cookies Not Being Set

**Symptoms**:
- Login succeeds but no cookie
- Redirect to login after successful login
- Cannot access admin pages

**Possible Causes**:
1. Set-Cookie header missing
2. Browser blocking cookies
3. SameSite attribute issue
4. Domain mismatch

**Solutions**:
1. Check Set-Cookie header in Network tab

2. Check browser cookie settings:
   - Allow cookies for localhost
   - Check third-party cookie settings

3. Check cookie domain:
   ```javascript
   // In browser console
   document.cookie
   ```

4. Check middleware configuration

---

### Rate Limiting Not Working

**Symptoms**:
- Can make unlimited login attempts
- No 429 response after 5 attempts
- No rate limit headers

**Possible Causes**:
1. Rate limit check not running
2. IP address detection failing
3. In-memory store cleared (server restart)

**Solutions**:
1. Check rate limit code in `/app/api/admin/auth/login/route.ts`

2. Check IP detection:
   ```javascript
   // In API route
   console.log('Client IP:', getClientIp(request.headers))
   ```

3. Test with consistent IP:
   ```bash
   # Use same email for all attempts
   EMAIL="test@example.com"
   for i in {1..6}; do
     curl -X POST http://localhost:3000/api/admin/auth/login \
       -H "Content-Type: application/json" \
       -d "{\"email\":\"$EMAIL\",\"password\":\"wrong\"}"
   done
   ```

---

### Middleware Not Protecting Routes

**Symptoms**:
- Can access /admin without login
- No redirect to login page
- Protected routes accessible

**Possible Causes**:
1. Middleware not configured
2. Matcher not matching routes
3. Cookie check not working

**Solutions**:
1. Check `middleware.ts` exists at project root

2. Check matcher configuration:
   ```typescript
   export const config = {
     matcher: [
       '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
     ],
   };
   ```

3. Check cookie check logic:
   ```typescript
   const accessToken = request.cookies.get('sb-access-token');
   const refreshToken = request.cookies.get('sb-refresh-token');
   ```

4. Verify cookie names match:
   - Middleware: `admin_session` or `sb-access-token`
   - API: Same names when setting

---

### Session Not Persisting

**Symptoms**:
- Login works but redirect fails
- Logged out after page refresh
- Session expires immediately

**Possible Causes**:
1. Cookie not being saved
2. Cookie expired
3. Browser clearing cookies
4. SameSite attribute issue

**Solutions**:
1. Check cookie Max-Age:
   ```javascript
   // Should be 28800 (8 hours)
   showCookies()
   ```

2. Check cookie expiration:
   ```javascript
   validateSession()
   ```

3. Check browser settings:
   - Cookies enabled
   - Not in Incognito mode
   - Not clearing on exit

4. Check SameSite attribute:
   - Should be 'lax' or 'strict'
   - 'none' requires Secure flag

---

### CSRF Protection Blocking Legitimate Requests

**Symptoms**:
- 403 Forbidden on login
- "Cross-origin request not allowed"
- Requests blocked in production

**Possible Causes**:
1. Origin header missing
2. Domain mismatch
3. Proxy/load balancer stripping headers
4. Development vs production config

**Solutions**:
1. Check Origin header in request:
   ```bash
   curl -i -X POST http://localhost:3000/api/admin/auth/login \
     -H "Content-Type: application/json" \
     -H "Origin: http://localhost:3000" \
     -d '{"email":"test@example.com","password":"test"}'
   ```

2. Check middleware logs:
   ```
   CSRF: Request blocked - origin mismatch
   ```

3. In development, middleware allows requests without Origin

4. In production, ensure Origin matches host

---

## Test Results Template

Use this template to document test results.

### Test Execution Report

**Date**: YYYY-MM-DD
**Tester**: Name
**Environment**: Development / Staging / Production
**Browser**: Chrome 120 / Firefox 121 / Safari 17
**Test Suite Version**: 1.0

### Automated Tests

| Test Name | Status | Details |
|-----------|--------|---------|
| Login Success | ✅ PASS | Response 200, cookie set |
| Login Failure | ✅ PASS | Response 401, error shown |
| Rate Limiting | ✅ PASS | Blocked after 5 attempts |
| Cookie Security | ✅ PASS | HttpOnly, Secure flags set |
| Protected Routes | ✅ PASS | Redirect without auth |
| Session Persistence | ✅ PASS | Session valid after refresh |
| Malformed Requests | ✅ PASS | Returns 400 errors |
| CSRF Protection | ✅ PASS | Blocks cross-origin in prod |

### Manual Tests

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| M-01 | Login with valid credentials | ✅ PASS | |
| M-02 | Login with invalid credentials | ✅ PASS | |
| M-03 | Rate limiting after 5 attempts | ✅ PASS | |
| M-04 | Session persists after refresh | ✅ PASS | |
| M-05 | Cookie expiration | ✅ PASS | |
| M-06 | Protected route access | ✅ PASS | |
| M-07 | Logout functionality | ✅ PASS | |
| M-08 | CSRF protection | ✅ PASS | |
| M-09 | Cookie security attributes | ✅ PASS | |
| M-10 | Malformed request handling | ✅ PASS | |

### Performance Metrics

| Operation | Time (ms) | Status |
|-----------|-----------|--------|
| Login API | 345 | ✅ |
| Middleware Check | 23 | ✅ |
| Session Validation | 156 | ✅ |
| Page Load | 1234 | ✅ |

### Issues Found

| Issue ID | Description | Severity | Status |
|----------|-------------|----------|--------|
| ISS-001 | Example issue | Low | Open |

### Summary

- **Total Tests**: 18
- **Passed**: 18
- **Failed**: 0
- **Blocked**: 0
- **Pass Rate**: 100%

### Recommendations

1. All tests passing
2. Performance within acceptable range
3. Security measures functioning correctly
4. Ready for deployment

---

## Appendix

### Environment Variables

```env
# Admin credentials
ADMIN_EMAIL=admin@southwestresumeservices.com
ADMIN_PASSWORD=admin123

# Supabase (if using Supabase auth)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Node environment
NODE_ENV=development
```

### Rate Limit Configuration

```typescript
// In /app/api/admin/auth/login/route.ts
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
```

### Cookie Configuration

```typescript
// In /lib/auth/admin-auth.ts
cookieStore.set('admin_session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
});
```

### Useful Commands

```bash
# Start development server
npm run dev

# Run automated tests
./test-admin-auth.sh

# Check server logs
npm run dev | grep "Login"

# Monitor cookies
watch -n 1 'curl -I http://localhost:3000/admin'
```

### Additional Resources

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [HTTP Cookie Security](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

---

## Changelog

### Version 1.0 (2025-12-22)
- Initial testing guide created
- Automated test suite (curl-based)
- Browser-based test suite
- Debug tools
- Manual testing checklist
- Performance benchmarks
- Security testing procedures
- Troubleshooting guide
