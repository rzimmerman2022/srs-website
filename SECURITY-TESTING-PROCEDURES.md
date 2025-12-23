# SECURITY TESTING PROCEDURES

**Project:** Southwest Resume Services - Admin Authentication System
**Version:** 1.0
**Last Updated:** December 22, 2025
**Purpose:** Comprehensive security testing guide for validation and regression testing

---

## TABLE OF CONTENTS

1. [Authentication Testing](#1-authentication-testing)
2. [Authorization Testing](#2-authorization-testing)
3. [Session Management Testing](#3-session-management-testing)
4. [Rate Limiting Testing](#4-rate-limiting-testing)
5. [Input Validation Testing](#5-input-validation-testing)
6. [CSRF Protection Testing](#6-csrf-protection-testing)
7. [XSS Protection Testing](#7-xss-protection-testing)
8. [Security Headers Testing](#8-security-headers-testing)
9. [Token Security Testing](#9-token-security-testing)
10. [Automated Security Testing](#10-automated-security-testing)

---

## 1. AUTHENTICATION TESTING

### 1.1 Valid Login Test

**Objective:** Verify legitimate users can authenticate

**Steps:**
1. Navigate to `/admin/login`
2. Enter valid credentials:
   - Email: `ryan.zimmerman@southwestresumes.com`
   - Password: `[valid password]`
3. Click "Sign In"

**Expected Results:**
- ✅ Status 200 response
- ✅ Redirect to `/admin` dashboard
- ✅ Cookies set: `sb-access-token`, `sb-refresh-token`
- ✅ Cookies have HttpOnly, Secure, SameSite attributes
- ✅ Login event logged in `security_audit_log`
- ✅ `last_login_at` updated in `admin_users` table
- ✅ Failed login counter reset to 0

**Tools:**
```bash
# Browser DevTools Network tab
# OR curl:
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ryan.zimmerman@southwestresumes.com","password":"[password]"}' \
  -v
```

---

### 1.2 Invalid Password Test

**Objective:** Verify incorrect passwords are rejected

**Steps:**
1. Navigate to `/admin/login`
2. Enter valid email with invalid password
3. Click "Sign In"

**Expected Results:**
- ✅ Status 401 Unauthorized
- ✅ Error message: "Invalid email or password"
- ✅ Failed login counter incremented
- ✅ Rate limit counter incremented
- ✅ Failed login event logged
- ✅ No cookies set
- ✅ User remains on login page

**SQL Verification:**
```sql
SELECT failed_login_attempts, last_failed_login
FROM admin_users
WHERE email = 'ryan.zimmerman@southwestresumes.com';
```

---

### 1.3 Non-Existent User Test

**Objective:** Verify non-existent users cannot authenticate

**Steps:**
1. Attempt login with email not in database
2. Use any password

**Expected Results:**
- ✅ Status 401 Unauthorized
- ✅ Same error message as invalid password (no user enumeration)
- ✅ Response time similar to valid user (no timing attack)
- ✅ Failed attempt logged

**Security Note:** Response should not reveal whether email exists

---

### 1.4 Password Brute Force Test

**Objective:** Verify rate limiting prevents brute force

**Steps:**
1. Attempt 5 failed logins from same IP
2. Wait for 15 minutes
3. Attempt 5 more failed logins

**Expected Results:**
- ✅ First 5 attempts: 401 responses
- ✅ After 5 attempts: 429 Too Many Requests
- ✅ Response includes `Retry-After` header
- ✅ After 15 minutes: counter resets
- ✅ All attempts logged with IP address

**Test Script:**
```bash
# Automated brute force test
for i in {1..6}; do
  echo "Attempt $i"
  curl -X POST http://localhost:3000/api/admin/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n"
  sleep 1
done
```

---

### 1.5 Account Lockout Test

**Objective:** Verify account lockout after threshold

**Steps:**
1. Perform 20 failed login attempts on same account from different IPs
2. Attempt login with correct password

**Expected Results:**
- ✅ After 20 attempts: account locked
- ✅ Status 403 Forbidden on lockout
- ✅ Error message includes time remaining
- ✅ `locked_until` timestamp set in database
- ✅ Email sent to user about lockout
- ✅ Email sent to super admins
- ✅ Correct password also blocked

**SQL Verification:**
```sql
SELECT failed_login_attempts, locked_until
FROM admin_users
WHERE email = 'test@example.com';
```

---

### 1.6 Session Cookie Security Test

**Objective:** Verify cookie attributes are secure

**Steps:**
1. Login successfully
2. Inspect cookies in browser DevTools

**Expected Results:**
```
sb-access-token:
  ✅ HttpOnly: true
  ✅ Secure: true (production only)
  ✅ SameSite: Lax
  ✅ Path: /
  ✅ Domain: .southwestresumes.com
  ✅ Max-Age: 604800 (7 days)

sb-refresh-token:
  ✅ HttpOnly: true
  ✅ Secure: true (production only)
  ✅ SameSite: Lax
  ✅ Path: /
  ✅ Domain: .southwestresumes.com
  ✅ Max-Age: 2592000 (30 days)
```

**Browser Console Test:**
```javascript
// Should not be accessible
document.cookie.includes('sb-access-token') // Should be false (HttpOnly)
```

---

## 2. AUTHORIZATION TESTING

### 2.1 Role-Based Access Control Test

**Objective:** Verify each role has correct permissions

**Test Matrix:**

| Action | Viewer | Admin | Super Admin |
|--------|--------|-------|-------------|
| View Questionnaires | ✅ | ✅ | ✅ |
| Edit Questionnaires | ❌ | ✅ | ✅ |
| Delete Questionnaires | ❌ | ❌ | ✅ |
| View Clients | ✅ | ✅ | ✅ |
| Edit Clients | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| View Settings | ✅ | ✅ | ✅ |
| Edit Settings | ❌ | ❌ | ✅ |

**Test Procedure for Each Role:**

1. **Setup Test Users:**
```sql
-- Create test users with different roles
INSERT INTO admin_users (user_id, email, full_name, role, active)
VALUES
  ('uuid-viewer', 'viewer@test.com', 'Test Viewer', 'viewer', true),
  ('uuid-admin', 'admin@test.com', 'Test Admin', 'admin', true),
  ('uuid-super', 'super@test.com', 'Test Super Admin', 'super_admin', true);
```

2. **Test Each Permission:**
```bash
# Login as viewer
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"viewer@test.com","password":"[password]"}' \
  -c cookies.txt

# Attempt to delete questionnaire (should fail)
curl -X DELETE http://localhost:3000/api/admin/questionnaires/123 \
  -b cookies.txt

# Expected: 403 Forbidden
```

3. **Verify Each Action:**
- ✅ Allowed actions return 200/201
- ✅ Denied actions return 403
- ✅ Denied attempts logged in audit log
- ✅ Error message: "Insufficient permissions"

---

### 2.2 Horizontal Privilege Escalation Test

**Objective:** Verify users cannot access other users' data

**Steps:**
1. Login as User A
2. Attempt to view/edit User B's profile
3. Attempt to view User B's sessions

**API Tests:**
```bash
# Login as user A
USER_A_TOKEN="[token from login]"

# Try to access user B's data
curl http://localhost:3000/api/admin/users/[user-b-id] \
  -H "Authorization: Bearer $USER_A_TOKEN"

# Expected: 403 Forbidden
```

**Expected Results:**
- ✅ Status 403 Forbidden
- ✅ No data returned
- ✅ Attempt logged in audit log
- ✅ User A cannot modify User B's data

---

### 2.3 Vertical Privilege Escalation Test

**Objective:** Verify lower roles cannot perform higher role actions

**Steps:**
1. Login as admin (not super_admin)
2. Attempt to:
   - Delete questionnaires
   - Manage users
   - Edit system settings

**Expected Results:**
- ✅ All attempts return 403
- ✅ Operations not executed
- ✅ Database unchanged
- ✅ All denials logged

**Test Script:**
```bash
# Login as admin
ADMIN_TOKEN="[admin token]"

# Try super_admin actions
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"new@user.com","role":"super_admin"}'

# Expected: 403 Forbidden
```

---

### 2.4 Direct API Access Test

**Objective:** Verify API routes enforce permissions

**Steps:**
1. Login with viewer role
2. Bypass UI and call API directly

**Test Cases:**
```bash
# Get viewer token
VIEWER_TOKEN="[viewer token]"

# Test 1: Try to create client (requires edit_clients)
curl -X POST http://localhost:3000/api/admin/clients \
  -H "Authorization: Bearer $VIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Client","email":"test@test.com"}'
# Expected: 403 Forbidden

# Test 2: Try to delete questionnaire (requires delete_questionnaires)
curl -X DELETE http://localhost:3000/api/admin/questionnaires/123 \
  -H "Authorization: Bearer $VIEWER_TOKEN"
# Expected: 403 Forbidden

# Test 3: Try to edit settings (requires edit_settings)
curl -X PUT http://localhost:3000/api/admin/settings \
  -H "Authorization: Bearer $VIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"value"}'
# Expected: 403 Forbidden
```

---

## 3. SESSION MANAGEMENT TESTING

### 3.1 Session Timeout Test

**Objective:** Verify sessions expire correctly

**Steps:**
1. Login successfully
2. Wait for token expiration (7 days for access token)
3. Attempt to access protected resource

**Expected Results:**
- ✅ After 7 days: access token expires
- ✅ If refresh token valid: new access token generated
- ✅ If refresh token expired: redirect to login
- ✅ No access to protected resources with expired token

**Simulated Test:**
```typescript
// Manually expire token in database
UPDATE admin_sessions
SET expires_at = NOW() - INTERVAL '1 day'
WHERE id = '[session-id]';

// Then try to access admin page
// Expected: Redirect to /admin/login
```

---

### 3.2 Logout Test

**Objective:** Verify logout invalidates session

**Steps:**
1. Login successfully
2. Note session token
3. Click logout
4. Attempt to use old session token

**Expected Results:**
- ✅ Logout returns status 200
- ✅ Cookies cleared from browser
- ✅ Session removed from database
- ✅ Old token no longer valid
- ✅ Redirect to login page
- ✅ Logout event logged

**Test Script:**
```bash
# Login
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"[password]"}' \
  -c cookies.txt

# Logout
curl -X POST http://localhost:3000/api/admin/logout \
  -b cookies.txt

# Try to access admin with old cookies
curl http://localhost:3000/api/admin/stats \
  -b cookies.txt

# Expected: 401 Unauthorized or redirect
```

---

### 3.3 Concurrent Session Test

**Objective:** Verify session limit enforcement

**Steps:**
1. Login from Browser 1
2. Login from Browser 2
3. Login from Browser 3
4. Login from Browser 4 (should remove oldest)

**Expected Results:**
- ✅ Maximum 3 concurrent sessions
- ✅ 4th login removes oldest session
- ✅ Browser 1 session invalidated
- ✅ Browsers 2, 3, 4 still valid
- ✅ All sessions visible in admin settings

**SQL Verification:**
```sql
SELECT COUNT(*) FROM admin_sessions
WHERE admin_user_id = '[user-id]'
AND expires_at > NOW();
-- Should never be more than 3
```

---

### 3.4 Session Hijacking Test

**Objective:** Verify session binding prevents hijacking

**Steps:**
1. Login from IP A with User Agent X
2. Copy session token
3. Attempt to use token from IP B with User Agent Y

**Expected Results:**
- ✅ Request from different IP + different UA: rejected
- ✅ Request from different UA only: rejected
- ✅ Request from different IP (same subnet): allowed with warning
- ✅ Suspicious activity logged
- ✅ Email notification sent to user

**Manual Test:**
```bash
# Login and get token
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows)" \
  -d '{"email":"test@test.com","password":"[password]"}' \
  -c cookies.txt

# Use token with different user agent
curl http://localhost:3000/api/admin/stats \
  -H "User-Agent: curl/7.0" \
  -b cookies.txt

# Expected: 403 Forbidden or re-authentication required
```

---

### 3.5 Session Fixation Test

**Objective:** Verify session ID regenerated on login

**Steps:**
1. Visit `/admin/login` (no session)
2. Note any session identifier
3. Login successfully
4. Check if session identifier changed

**Expected Results:**
- ✅ New session token generated on login
- ✅ Old session identifier invalid
- ✅ No session fixation possible

---

### 3.6 Password Change Session Invalidation Test

**Objective:** Verify all sessions invalidated on password change

**Steps:**
1. Login from 3 different browsers
2. Change password from Browser 1
3. Verify other sessions invalidated

**Expected Results:**
- ✅ Password change successful
- ✅ All sessions invalidated immediately
- ✅ All browsers redirect to login
- ✅ Email notification sent
- ✅ Event logged in audit log
- ✅ Can login with new password

**SQL Verification:**
```sql
-- Before password change
SELECT COUNT(*) FROM admin_sessions
WHERE admin_user_id = '[user-id]';
-- Should be 3

-- After password change
SELECT COUNT(*) FROM admin_sessions
WHERE admin_user_id = '[user-id]';
-- Should be 0
```

---

## 4. RATE LIMITING TESTING

### 4.1 IP-Based Rate Limit Test

**Objective:** Verify IP-based rate limiting works

**Steps:**
1. Make 5 failed login attempts from IP A
2. Make 1 more attempt from IP A
3. Make 1 attempt from IP B

**Expected Results:**
- ✅ First 5 attempts: 401 responses
- ✅ 6th attempt from IP A: 429 Too Many Requests
- ✅ 1st attempt from IP B: 401 (not rate limited)
- ✅ Response includes Retry-After header
- ✅ Rate limit resets after 15 minutes

**Test Script:**
```bash
# Simulate from IP A
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/admin/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n"
done
```

---

### 4.2 Account-Based Rate Limit Test

**Objective:** Verify account-based rate limiting works

**Steps:**
1. Make 5 failed attempts from IP A on account X
2. Make 5 failed attempts from IP B on account X
3. Make 1 more attempt from IP C on account X

**Expected Results:**
- ✅ 10 attempts allowed (5 per IP)
- ✅ 11th attempt: 429 Too Many Requests
- ✅ Error message indicates account-level limit
- ✅ Different account from same IP: not limited

---

### 4.3 Rate Limit Bypass Test

**Objective:** Verify rate limits cannot be bypassed

**Bypass Attempts:**
1. X-Forwarded-For header spoofing
2. VPN/Tor IP rotation
3. User agent rotation
4. Cookie manipulation

**Expected Results:**
- ✅ X-Forwarded-For validated against trusted proxies
- ✅ Untrusted headers ignored
- ✅ Fallback to connection IP
- ✅ Account-based limiting catches IP rotation
- ✅ User agent changes don't reset limit

**Test Script:**
```bash
# Try to spoof X-Forwarded-For
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/admin/auth/login \
    -H "Content-Type: application/json" \
    -H "X-Forwarded-For: 1.2.3.$i" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n"
done

# Should still be rate limited (header not trusted)
```

---

### 4.4 Token Verification Rate Limit Test

**Objective:** Verify questionnaire token verification is rate limited

**Steps:**
1. Make 10 token verification attempts with invalid tokens
2. Make 11th attempt

**Expected Results:**
- ✅ 10 attempts per minute allowed
- ✅ 11th attempt: 429 Too Many Requests
- ✅ Rate limit key: `token_verify:{ip}`
- ✅ Resets after 1 minute

**Test Script:**
```bash
# Rapid invalid token attempts
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/questionnaire/verify-token \
    -H "Content-Type: application/json" \
    -d '{"token":"invalid-token-'$i'"}' \
    -w "\nStatus: %{http_code}\n"
  sleep 0.5
done
```

---

## 5. INPUT VALIDATION TESTING

### 5.1 SQL Injection Test

**Objective:** Verify input is sanitized against SQL injection

**Test Cases:**
```bash
# Login form SQL injection attempts
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com'\'' OR '\''1'\''='\''1","password":"anything"}'

# Expected: 401 Unauthorized (not SQL error)

# Email field injection
curl -X POST http://localhost:3000/api/admin/clients \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com; DROP TABLE admin_users;--","name":"Test"}'

# Expected: 400 Bad Request (validation error)
```

**Expected Results:**
- ✅ No SQL errors returned
- ✅ Parameterized queries prevent injection
- ✅ Input validation rejects malicious input
- ✅ Database unchanged

---

### 5.2 XSS Injection Test

**Objective:** Verify XSS payloads are sanitized

**Test Cases:**
```bash
# Script tag injection
curl -X POST http://localhost:3000/api/admin/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","email":"test@test.com"}'

# Event handler injection
curl -X POST http://localhost:3000/api/admin/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"<img src=x onerror=alert(1)>","email":"test@test.com"}'

# JavaScript URL
curl -X POST http://localhost:3000/api/admin/clients \
  -H "Content-Type: application/json" \
  -d '{"website":"javascript:alert(1)","email":"test@test.com"}'
```

**Expected Results:**
- ✅ Payloads sanitized or rejected
- ✅ When rendered, scripts don't execute
- ✅ CSP blocks inline scripts
- ✅ Output encoding applied

---

### 5.3 Email Validation Test

**Objective:** Verify email inputs are properly validated

**Test Cases:**
```typescript
// Invalid email formats
const testEmails = [
  'not-an-email',
  '@test.com',
  'test@',
  'test @test.com',
  'test@test',
  '<script>@test.com',
];

testEmails.forEach(email => {
  // Submit to API
  // Expected: 400 Bad Request
});
```

**Expected Results:**
- ✅ Invalid formats rejected
- ✅ Error message: "Invalid email format"
- ✅ XSS payloads in emails rejected
- ✅ Valid emails accepted

---

## 6. CSRF PROTECTION TESTING

### 6.1 CSRF Token Validation Test

**Objective:** Verify CSRF protection on state-changing requests

**Steps:**
1. Create malicious page on different domain
2. Attempt to submit form to admin API

**Malicious HTML:**
```html
<!-- evil.com/attack.html -->
<form action="https://southwestresumes.com/api/admin/clients" method="POST">
  <input type="hidden" name="email" value="hacker@evil.com">
  <input type="hidden" name="name" value="Hacker">
</form>
<script>document.forms[0].submit();</script>
```

**Expected Results:**
- ✅ Request blocked by middleware
- ✅ Status 403 Forbidden
- ✅ Error: "Cross-origin request not allowed"
- ✅ Origin header validation works
- ✅ Referer header validation works
- ✅ CSRF attempt logged

---

### 6.2 Origin Header Validation Test

**Objective:** Verify Origin header is validated

**Test Cases:**
```bash
# Missing Origin header
curl -X POST http://localhost:3000/api/admin/clients \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'
# Expected in prod: 403 Forbidden

# Wrong Origin header
curl -X POST http://localhost:3000/api/admin/clients \
  -H "Content-Type: application/json" \
  -H "Origin: https://evil.com" \
  -d '{"email":"test@test.com"}'
# Expected: 403 Forbidden

# Correct Origin header
curl -X POST http://localhost:3000/api/admin/clients \
  -H "Content-Type: application/json" \
  -H "Origin: https://southwestresumes.com" \
  -d '{"email":"test@test.com"}'
# Expected: 200 OK (if authorized)
```

---

### 6.3 SameSite Cookie Test

**Objective:** Verify SameSite attribute prevents CSRF

**Steps:**
1. Login to admin panel
2. Visit attacker page on different domain
3. Attacker page attempts to make request with credentials

**Expected Results:**
- ✅ SameSite=Lax prevents cookie from being sent
- ✅ Request fails due to missing authentication
- ✅ No CSRF vulnerability

**Browser Console Test:**
```javascript
// From evil.com, attempt to fetch with credentials
fetch('https://southwestresumes.com/api/admin/stats', {
  credentials: 'include'
})
.then(r => console.log(r.status))
.catch(e => console.log(e));

// Expected: No cookies sent, request fails
```

---

## 7. XSS PROTECTION TESTING

### 7.1 Reflected XSS Test

**Objective:** Verify reflected XSS is prevented

**Test Cases:**
```bash
# URL parameter injection
curl "http://localhost:3000/admin?name=<script>alert(1)</script>"

# Search query injection
curl "http://localhost:3000/admin/search?q=<img src=x onerror=alert(1)>"
```

**Expected Results:**
- ✅ Scripts encoded or sanitized
- ✅ CSP blocks inline scripts
- ✅ No script execution in browser
- ✅ Output properly escaped

---

### 7.2 Stored XSS Test

**Objective:** Verify stored XSS is prevented

**Steps:**
1. Create client with XSS payload in name
2. View client list page
3. Check if script executes

**Test Payload:**
```bash
curl -X POST http://localhost:3000/api/admin/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"<img src=x onerror=alert(document.cookie)>","email":"test@test.com"}'
```

**Expected Results:**
- ✅ Payload stored as plain text
- ✅ When rendered, HTML is escaped
- ✅ No script execution
- ✅ CSP provides defense-in-depth

**Manual Verification:**
- View page source: should see `&lt;img src=x...&gt;`
- JavaScript console: no errors, no alerts

---

### 7.3 DOM-Based XSS Test

**Objective:** Verify client-side rendering is safe

**Test Cases:**
```javascript
// Check for dangerous DOM manipulation
// Search for: innerHTML, outerHTML, document.write, eval

// Test component with user input
const userInput = '<img src=x onerror=alert(1)>';
// Render in React component
// Expected: Text content, not HTML
```

**Expected Results:**
- ✅ React auto-escapes content
- ✅ No `dangerouslySetInnerHTML` with user input
- ✅ No `eval()` or `Function()` with user input
- ✅ URL parameters sanitized before DOM use

---

## 8. SECURITY HEADERS TESTING

### 8.1 Header Presence Test

**Objective:** Verify all security headers are present

**Test Script:**
```bash
# Test all routes
curl -I https://southwestresumes.com/
curl -I https://southwestresumes.com/admin
curl -I https://southwestresumes.com/q/test-token
curl -I https://southwestresumes.com/api/admin/stats
```

**Expected Headers:**
```
✅ X-Frame-Options: DENY
✅ X-Content-Type-Options: nosniff
✅ X-Robots-Tag: noindex, nofollow (admin/q routes only)
✅ Content-Security-Policy: [restrictive policy]
✅ Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
✅ Referrer-Policy: strict-origin-when-cross-origin
✅ Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

### 8.2 CSP Violation Test

**Objective:** Verify CSP blocks unauthorized scripts

**Steps:**
1. Login to admin panel
2. Open browser console
3. Attempt to inject inline script

**Browser Console Test:**
```javascript
// Should be blocked by CSP
const script = document.createElement('script');
script.innerHTML = 'alert(1)';
document.body.appendChild(script);

// Check console for CSP violation report
```

**Expected Results:**
- ✅ Script blocked
- ✅ Console shows CSP violation
- ✅ No alert displayed
- ✅ CSP report logged (if report-uri configured)

---

### 8.3 Clickjacking Test

**Objective:** Verify X-Frame-Options prevents embedding

**Test HTML:**
```html
<!-- attacker.com/embed.html -->
<iframe src="https://southwestresumes.com/admin/login"></iframe>
```

**Expected Results:**
- ✅ Browser refuses to render iframe
- ✅ Console error: "Refused to display ... in a frame"
- ✅ X-Frame-Options: DENY header present
- ✅ CSP frame-ancestors directive enforced

---

## 9. TOKEN SECURITY TESTING

### 9.1 Token Randomness Test

**Objective:** Verify tokens are cryptographically random

**Test Script:**
```typescript
// Generate 1000 tokens
const tokens = new Set();
for (let i = 0; i < 1000; i++) {
  const token = await generateQuestionnaireToken('test-client', 'test-questionnaire');
  tokens.add(token);
}

// Check uniqueness
console.log('Unique tokens:', tokens.size);
// Expected: 1000 (no collisions)

// Check randomness (chi-square test)
// All tokens should pass randomness test
```

**Expected Results:**
- ✅ No duplicate tokens
- ✅ Tokens pass randomness test
- ✅ 32 characters hexadecimal
- ✅ No predictable patterns

---

### 9.2 Token Expiration Test

**Objective:** Verify expired tokens are rejected

**Steps:**
1. Create questionnaire token
2. Manually set expiration to past
3. Attempt to use token

**SQL:**
```sql
UPDATE questionnaire_access_tokens
SET expires_at = NOW() - INTERVAL '1 day'
WHERE token = 'test-token';
```

**Test:**
```bash
curl http://localhost:3000/q/test-token
```

**Expected Results:**
- ✅ Access denied
- ✅ Error page: "This link has expired"
- ✅ No questionnaire content shown
- ✅ Token validation logged

---

### 9.3 Token Revocation Test

**Objective:** Verify revoked tokens are rejected

**Steps:**
1. Create questionnaire token
2. Revoke token
3. Attempt to use token

**Test:**
```typescript
// Revoke token
await revokeToken('test-token');

// Try to use it
const result = await verifyQuestionnaireToken('test-token');
// Expected: null
```

**Expected Results:**
- ✅ Token verification fails
- ✅ Access denied
- ✅ Error logged
- ✅ Revocation event logged

---

### 9.4 Token Enumeration Test

**Objective:** Verify tokens cannot be enumerated

**Steps:**
1. Attempt to guess token patterns
2. Try sequential tokens
3. Try common patterns

**Test Script:**
```bash
# Try to enumerate tokens
for i in {1..100}; do
  TOKEN=$(printf '%032d' $i) # Sequential
  curl -s http://localhost:3000/q/$TOKEN | grep -q "Verifying"
  if [ $? -eq 0 ]; then
    echo "Found token: $TOKEN"
  fi
done
```

**Expected Results:**
- ✅ No valid tokens found
- ✅ Rate limiting triggers
- ✅ 128-bit entropy makes guessing impossible
- ✅ Enumeration attempts logged

---

## 10. AUTOMATED SECURITY TESTING

### 10.1 npm audit

**Objective:** Check for known vulnerabilities in dependencies

**Command:**
```bash
npm audit

# Fix automatically
npm audit fix

# Force fix breaking changes (caution)
npm audit fix --force
```

**Expected Results:**
- ✅ No high or critical vulnerabilities
- ✅ All dependencies up to date
- ✅ Run weekly in CI/CD

---

### 10.2 OWASP ZAP Scan

**Objective:** Automated vulnerability scanning

**Setup:**
```bash
# Install OWASP ZAP
# https://www.zaproxy.org/download/

# Run baseline scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://southwestresumes.com \
  -r zap-report.html
```

**Review:**
- ✅ No high-risk vulnerabilities
- ✅ Review medium and low findings
- ✅ Generate report for compliance

---

### 10.3 Integration Tests

**Objective:** Automated security test suite

**Test File:**
```typescript
// tests/security/auth.test.ts
describe('Authentication Security', () => {
  test('blocks login after 5 failed attempts', async () => {
    // Make 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'test@test.com', password: 'wrong' })
        .expect(401);
    }

    // 6th attempt should be rate limited
    const response = await request(app)
      .post('/api/admin/auth/login')
      .send({ email: 'test@test.com', password: 'wrong' });

    expect(response.status).toBe(429);
    expect(response.body.error).toContain('Too many');
  });

  test('invalidates sessions on password change', async () => {
    // Login and get session
    const session = await loginAsAdmin();

    // Change password
    await changePassword(session.userId, 'new-password');

    // Old session should be invalid
    const response = await request(app)
      .get('/api/admin/stats')
      .set('Cookie', session.cookies);

    expect(response.status).toBe(401);
  });
});
```

**Run Tests:**
```bash
npm test -- tests/security/

# With coverage
npm test -- tests/security/ --coverage
```

---

### 10.4 CI/CD Security Checks

**GitHub Actions Workflow:**
```yaml
# .github/workflows/security.yml
name: Security Checks

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run npm audit
        run: npm audit --audit-level=moderate

      - name: Run security tests
        run: npm test -- tests/security/

      - name: Check for secrets
        uses: trufflesecurity/trufflehog@main

      - name: Dependency check
        uses: dependency-check/Dependency-Check_Action@main

      - name: SAST scan
        uses: github/codeql-action/analyze@v2
```

---

## TESTING SCHEDULE

### Before Every Deployment
- [ ] Run all authentication tests
- [ ] Run all authorization tests
- [ ] Run npm audit
- [ ] Run security integration tests
- [ ] Manual smoke test of critical paths

### Weekly
- [ ] Full regression test suite
- [ ] Review security audit logs
- [ ] Check for dependency updates
- [ ] Review failed login attempts

### Monthly
- [ ] OWASP ZAP scan
- [ ] Manual penetration testing
- [ ] Review and update test procedures
- [ ] Security training for team

### Quarterly
- [ ] Third-party penetration test
- [ ] Full security audit
- [ ] Compliance review
- [ ] Incident response drill

---

## REPORTING SECURITY ISSUES

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Email: security@southwestresumes.com
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (optional)
4. Allow 48 hours for initial response
5. Coordinated disclosure after fix deployed

---

**Document Version:** 1.0
**Last Updated:** December 22, 2025
**Next Review:** March 22, 2026
