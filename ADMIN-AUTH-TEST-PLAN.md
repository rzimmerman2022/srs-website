# ADMIN AUTHENTICATION - COMPREHENSIVE TEST PLAN

## TEST ENVIRONMENT SETUP

### Prerequisites
```bash
# 1. Environment variables
ADMIN_EMAIL=admin@southwestresumeservices.com
ADMIN_PASSWORD=<your-secure-password>
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-key>

# 2. Start development server
npm run dev

# 3. Open browser
http://localhost:3000/admin
```

---

## TEST SUITE 1: AUTHENTICATION FLOW

### Test 1.1: Login with Valid Credentials
**Steps:**
1. Navigate to `/admin`
2. Should redirect to `/admin/login`
3. Enter valid email and password
4. Click "Login"

**Expected Results:**
- ✅ Redirect to `/admin` dashboard
- ✅ Cookie `admin_session=authenticated` is set
- ✅ Dashboard loads without errors
- ✅ No "Unauthorized" messages

**Verification:**
```javascript
// Browser DevTools Console
document.cookie.includes('admin_session=authenticated')
// Should return: true
```

---

### Test 1.2: Login with Invalid Credentials
**Steps:**
1. Navigate to `/admin/login`
2. Enter invalid email or password
3. Click "Login"

**Expected Results:**
- ✅ Error message: "Invalid email or password"
- ✅ Remains on login page
- ✅ No cookie is set
- ✅ Login attempts counter increments

**Verification:**
```javascript
// Browser DevTools Console
document.cookie.includes('admin_session')
// Should return: false
```

---

### Test 1.3: Rate Limiting
**Steps:**
1. Navigate to `/admin/login`
2. Attempt login with invalid credentials 5 times
3. Attempt 6th login

**Expected Results:**
- ✅ First 5 attempts: "Invalid email or password"
- ✅ 6th attempt: "Too many login attempts"
- ✅ HTTP 429 response
- ✅ Retry-After header present
- ✅ Must wait 15 minutes

**Verification:**
```bash
# cURL test
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/admin/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"wrong@test.com","password":"wrong"}' \
    -i | grep -E "HTTP|Retry-After"
done
```

---

### Test 1.4: Session Persistence
**Steps:**
1. Login successfully
2. Close browser tab
3. Open new tab
4. Navigate to `/admin`

**Expected Results:**
- ✅ Dashboard loads immediately
- ✅ No redirect to login
- ✅ Cookie still present
- ✅ Session valid for 8 hours

**Verification:**
```javascript
// Check cookie expiration
document.cookie.split('; ')
  .find(c => c.startsWith('admin_session='))
// Cookie should exist
```

---

### Test 1.5: Session Expiration
**Steps:**
1. Login successfully
2. Wait 8 hours (or manually expire cookie)
3. Navigate to `/admin`

**Expected Results:**
- ✅ Redirect to `/admin/login`
- ✅ Cookie expired
- ✅ Must login again

**Manual Test:**
```javascript
// Force expire cookie
document.cookie = 'admin_session=authenticated; Path=/; Max-Age=0';
// Reload page - should redirect to login
```

---

### Test 1.6: Logout
**Steps:**
1. Login successfully
2. Navigate to `/admin`
3. Click "Logout" button
4. Observe redirect

**Expected Results:**
- ✅ POST to `/api/admin/logout` succeeds
- ✅ All cookies cleared
- ✅ Redirect to `/admin/login`
- ✅ Cannot access `/admin` without re-login

**Verification:**
```javascript
// After logout
document.cookie
// Should NOT contain admin_session
```

---

## TEST SUITE 2: DASHBOARD API ENDPOINTS

### Test 2.1: GET /api/admin/stats (WITH AUTH)
**Steps:**
1. Login successfully
2. Dashboard should auto-fetch stats
3. Check browser DevTools Network tab

**Expected Results:**
- ✅ HTTP 200 response
- ✅ Response contains `stats` object
- ✅ Stats include:
  - `overview.total_questionnaires`
  - `overview.total_clients`
  - `overview.completion_rate`
  - `recent_activity` array
  - `trends` object
  - `top_performers` array

**cURL Test:**
```bash
# Get admin_session cookie first, then:
curl http://localhost:3000/api/admin/stats \
  -H "Cookie: admin_session=authenticated" \
  -v
# Should return: 200 with stats data
```

---

### Test 2.2: GET /api/admin/stats (WITHOUT AUTH)
**Steps:**
1. Clear cookies
2. Send request without admin_session cookie

**Expected Results:**
- ✅ HTTP 401 Unauthorized
- ✅ Response: `{"error": "Unauthorized - Admin access required"}`

**cURL Test:**
```bash
curl http://localhost:3000/api/admin/stats -v
# Should return: 401 Unauthorized
```

---

### Test 2.3: GET /api/admin/questionnaires (WITH AUTH)
**Steps:**
1. Login successfully
2. Navigate to `/admin/questionnaires`
3. Check browser DevTools Network tab

**Expected Results:**
- ✅ HTTP 200 response
- ✅ Response contains `questionnaires` array
- ✅ Response contains `pagination` object
- ✅ Each questionnaire has:
  - `id`, `client_id`, `questionnaire_id`
  - `completed`, `progress_percentage`
  - `points`, `created_at`, `updated_at`

**cURL Test:**
```bash
curl http://localhost:3000/api/admin/questionnaires \
  -H "Cookie: admin_session=authenticated" \
  -v
# Should return: 200 with questionnaires array
```

---

### Test 2.4: GET /api/admin/clients (WITH AUTH)
**Steps:**
1. Login successfully
2. Navigate to `/admin/clients`
3. Check browser DevTools Network tab

**Expected Results:**
- ✅ HTTP 200 response
- ✅ Response contains `clients` array
- ✅ Response contains `pagination` object
- ✅ Each client has:
  - `client_id`
  - `questionnaire_count`
  - `completed_count`, `in_progress_count`
  - `total_points`
  - `first_activity`, `last_activity`

**cURL Test:**
```bash
curl http://localhost:3000/api/admin/clients \
  -H "Cookie: admin_session=authenticated" \
  -v
# Should return: 200 with clients array
```

---

### Test 2.5: GET /api/admin/settings (WITH AUTH)
**Steps:**
1. Login successfully
2. Navigate to `/admin/settings`
3. Check browser DevTools Network tab

**Expected Results:**
- ✅ HTTP 200 response
- ✅ Response contains `settings` object
- ✅ Settings categories:
  - `general` (company_name, admin_email)
  - `questionnaire` (default_points, auto_save_interval)
  - `security` (session_timeout, ip_allowlist, 2fa)
  - `email` (smtp config)

**cURL Test:**
```bash
curl http://localhost:3000/api/admin/settings \
  -H "Cookie: admin_session=authenticated" \
  -v
# Should return: 200 with settings object
```

---

## TEST SUITE 3: MIDDLEWARE PROTECTION

### Test 3.1: Access /admin Without Auth
**Steps:**
1. Clear all cookies
2. Navigate to `/admin`

**Expected Results:**
- ✅ Redirect to `/admin/login`
- ✅ URL changes to `/admin/login`
- ✅ Login form displayed

---

### Test 3.2: Access /admin/questionnaires Without Auth
**Steps:**
1. Clear all cookies
2. Navigate to `/admin/questionnaires`

**Expected Results:**
- ✅ Redirect to `/admin/login`
- ✅ Cannot view questionnaires page

---

### Test 3.3: Access /admin/login (Always Allowed)
**Steps:**
1. Clear all cookies
2. Navigate to `/admin/login`

**Expected Results:**
- ✅ Login page displays
- ✅ No redirect
- ✅ Can submit login form

---

### Test 3.4: Security Headers
**Steps:**
1. Navigate to any `/admin` page
2. Check response headers in DevTools

**Expected Results:**
- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, nocache`

**cURL Test:**
```bash
curl -I http://localhost:3000/admin \
  -H "Cookie: admin_session=authenticated"
# Check for security headers
```

---

## TEST SUITE 4: CSRF PROTECTION

### Test 4.1: POST Request with Valid Origin
**Steps:**
1. Login successfully
2. Make POST request from same domain

**Expected Results:**
- ✅ Request succeeds
- ✅ Origin header matches host
- ✅ No CSRF error

---

### Test 4.2: POST Request with Invalid Origin
**Steps:**
1. Try POST from different origin

**Expected Results:**
- ✅ HTTP 403 Forbidden
- ✅ Error: "Cross-origin request not allowed"
- ✅ CSRF violation logged

**cURL Test:**
```bash
curl -X POST http://localhost:3000/api/admin/settings \
  -H "Origin: https://evil.com" \
  -H "Content-Type: application/json" \
  -d '{"settings":{}}' \
  -v
# Should return: 403 Forbidden
```

---

## TEST SUITE 5: RATE LIMITING

### Test 5.1: API Rate Limit
**Steps:**
1. Login successfully
2. Make 100+ requests to `/api/admin/stats`

**Expected Results:**
- ✅ First 100 requests: HTTP 200
- ✅ Request 101+: HTTP 429 Too Many Requests
- ✅ Retry-After header: 3600 seconds
- ✅ Rate limit resets after 1 hour

**Bash Test:**
```bash
for i in {1..105}; do
  curl http://localhost:3000/api/admin/stats \
    -H "Cookie: admin_session=authenticated" \
    -s -o /dev/null -w "%{http_code}\n"
done | tail -10
# Last 5 should be 429
```

---

## TEST SUITE 6: INPUT VALIDATION

### Test 6.1: Invalid Query Parameters
**Steps:**
1. Make request with invalid parameters

**Expected Results:**
- ✅ HTTP 400 Bad Request
- ✅ Error: "Invalid query parameters"

**cURL Test:**
```bash
# Invalid limit (too large)
curl "http://localhost:3000/api/admin/questionnaires?limit=999" \
  -H "Cookie: admin_session=authenticated" \
  -v
# Should return: 400 Bad Request

# Invalid sortBy
curl "http://localhost:3000/api/admin/questionnaires?sortBy=invalid" \
  -H "Cookie: admin_session=authenticated" \
  -v
# Should return: 400 Bad Request
```

---

### Test 6.2: Invalid Path Parameters
**Steps:**
1. Request invalid client ID

**Expected Results:**
- ✅ HTTP 400 Bad Request
- ✅ Error: "Invalid client ID format"

**cURL Test:**
```bash
curl "http://localhost:3000/api/admin/clients/invalid%20id" \
  -H "Cookie: admin_session=authenticated" \
  -v
# Should return: 400 Bad Request
```

---

## TEST SUITE 7: ERROR HANDLING

### Test 7.1: Database Connection Error
**Steps:**
1. Disconnect from Supabase (invalid credentials)
2. Try to fetch dashboard stats

**Expected Results:**
- ✅ HTTP 503 Service Unavailable
- ✅ Error: "Supabase not configured"
- ✅ No sensitive information leaked

---

### Test 7.2: Not Found Error
**Steps:**
1. Request non-existent questionnaire ID

**Expected Results:**
- ✅ HTTP 404 Not Found
- ✅ Error: "Questionnaire not found"

**cURL Test:**
```bash
curl "http://localhost:3000/api/admin/questionnaires/00000000-0000-0000-0000-000000000000" \
  -H "Cookie: admin_session=authenticated" \
  -v
# Should return: 404 Not Found
```

---

## TEST SUITE 8: INTEGRATION TESTS

### Test 8.1: Complete User Journey
**Steps:**
1. Navigate to `/admin`
2. Redirected to `/admin/login`
3. Login with valid credentials
4. Dashboard loads with stats
5. Click "Questionnaires" link
6. Questionnaires page loads
7. Click "Clients" link
8. Clients page loads
9. Click "Settings" link
10. Settings page loads
11. Click "Logout"
12. Redirected to `/admin/login`

**Expected Results:**
- ✅ All steps complete without errors
- ✅ No 401 Unauthorized errors
- ✅ All data loads correctly
- ✅ Logout clears session

---

### Test 8.2: Concurrent Sessions
**Steps:**
1. Login in Chrome
2. Login in Firefox (same credentials)
3. Both sessions should work
4. Logout in Chrome
5. Firefox session should still work

**Expected Results:**
- ✅ Multiple sessions allowed
- ✅ Each session independent
- ✅ Logout only affects current session

---

### Test 8.3: Session Hijacking Prevention
**Steps:**
1. Login successfully
2. Copy admin_session cookie value
3. Open incognito/private window
4. Manually set cookie with copied value
5. Try to access dashboard

**Expected Results:**
- ✅ Cookie is HttpOnly (cannot copy via JS)
- ✅ Cookie is Secure (HTTPS only in production)
- ✅ Cookie is SameSite=Strict (prevents CSRF)

---

## TEST SUITE 9: BROWSER COMPATIBILITY

### Test 9.1: Chrome
- ✅ Login works
- ✅ Dashboard loads
- ✅ All API calls succeed
- ✅ Logout works

### Test 9.2: Firefox
- ✅ Login works
- ✅ Dashboard loads
- ✅ All API calls succeed
- ✅ Logout works

### Test 9.3: Safari
- ✅ Login works
- ✅ Dashboard loads
- ✅ All API calls succeed
- ✅ Logout works

### Test 9.4: Edge
- ✅ Login works
- ✅ Dashboard loads
- ✅ All API calls succeed
- ✅ Logout works

---

## TEST SUITE 10: PERFORMANCE

### Test 10.1: Dashboard Load Time
**Steps:**
1. Login
2. Measure time to interactive

**Expected Results:**
- ✅ Dashboard loads < 2 seconds
- ✅ API call completes < 500ms
- ✅ No unnecessary re-renders

**Browser DevTools:**
```javascript
// Performance timing
performance.getEntriesByType('navigation')[0].loadEventEnd
// Should be < 2000ms
```

---

### Test 10.2: API Response Time
**Steps:**
1. Measure API endpoint response times

**Expected Results:**
- ✅ /api/admin/stats < 500ms
- ✅ /api/admin/questionnaires < 500ms
- ✅ /api/admin/clients < 500ms
- ✅ /api/admin/settings < 200ms

**cURL Test:**
```bash
curl -w "@curl-format.txt" -o /dev/null -s \
  http://localhost:3000/api/admin/stats \
  -H "Cookie: admin_session=authenticated"

# curl-format.txt:
# time_total: %{time_total}
```

---

## AUTOMATED TEST SCRIPT

### Quick Smoke Test
```bash
#!/bin/bash

# Admin Auth Test Script
# Tests all critical endpoints

COOKIE="admin_session=authenticated"
BASE_URL="http://localhost:3000"

echo "Testing Admin Authentication..."

# Test 1: Stats endpoint
echo "1. Testing /api/admin/stats"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "$BASE_URL/api/admin/stats" -H "Cookie: $COOKIE")
if [ "$STATUS" = "200" ]; then
  echo "✅ Stats endpoint working"
else
  echo "❌ Stats endpoint failed ($STATUS)"
fi

# Test 2: Questionnaires endpoint
echo "2. Testing /api/admin/questionnaires"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "$BASE_URL/api/admin/questionnaires" -H "Cookie: $COOKIE")
if [ "$STATUS" = "200" ]; then
  echo "✅ Questionnaires endpoint working"
else
  echo "❌ Questionnaires endpoint failed ($STATUS)"
fi

# Test 3: Clients endpoint
echo "3. Testing /api/admin/clients"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "$BASE_URL/api/admin/clients" -H "Cookie: $COOKIE")
if [ "$STATUS" = "200" ]; then
  echo "✅ Clients endpoint working"
else
  echo "❌ Clients endpoint failed ($STATUS)"
fi

# Test 4: Settings endpoint
echo "4. Testing /api/admin/settings"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "$BASE_URL/api/admin/settings" -H "Cookie: $COOKIE")
if [ "$STATUS" = "200" ]; then
  echo "✅ Settings endpoint working"
else
  echo "❌ Settings endpoint failed ($STATUS)"
fi

# Test 5: Unauthorized access
echo "5. Testing unauthorized access"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "$BASE_URL/api/admin/stats")
if [ "$STATUS" = "401" ]; then
  echo "✅ Auth protection working"
else
  echo "❌ Auth protection failed ($STATUS)"
fi

echo "Test suite complete!"
```

---

## CHECKLIST: PRE-DEPLOYMENT

- [ ] All login flows tested
- [ ] All dashboard pages load
- [ ] All API endpoints return data
- [ ] Rate limiting works
- [ ] CSRF protection works
- [ ] Input validation works
- [ ] Error handling works
- [ ] Security headers present
- [ ] Session management works
- [ ] Logout works correctly
- [ ] Build succeeds without errors
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] All tests pass

---

## MONITORING AFTER DEPLOYMENT

### Metrics to Track
1. **Authentication failures** (should be minimal)
2. **401 errors on API routes** (should be zero after login)
3. **Rate limit hits** (monitor for abuse)
4. **CSRF violations** (should be zero in normal use)
5. **Dashboard load times** (should be < 2s)
6. **API response times** (should be < 500ms)

### Alerts to Configure
1. **High 401 error rate** (possible auth issue)
2. **High 429 rate** (possible DDoS or bug)
3. **High 403 rate** (possible CSRF attack)
4. **Slow API responses** (performance issue)

---

## ROLLBACK PLAN

If issues occur after deployment:

1. **Immediate**: Revert `lib/auth/admin-auth.ts` to previous version
2. **Verify**: Test login and dashboard access
3. **Investigate**: Check logs for errors
4. **Fix**: Address root cause
5. **Re-deploy**: After testing fix

### Rollback Command
```bash
git revert <commit-hash>
git push
```

---

**Test plan prepared by:** Claude Code (Anthropic)
**Last updated:** 2025-12-22
**Status:** Ready for execution
