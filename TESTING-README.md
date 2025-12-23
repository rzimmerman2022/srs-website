# Admin Auth Testing - Quick Start

Complete testing scaffolding for Southwest Resume Services admin authentication system.

## Files Overview

| File | Purpose | Usage |
|------|---------|-------|
| **test-admin-auth.sh** | Automated curl-based tests | `./test-admin-auth.sh` |
| **test-admin-auth.js** | Browser-based test suite | Copy to browser console |
| **debug-cookies.js** | Debugging utilities | Copy to browser console |
| **TESTING-GUIDE.md** | Complete documentation | Read for full details |
| **test-results.md** | Results template | Fill out during testing |

---

## Quick Start Guide

### 1. Automated Testing (5 minutes)

**Run server**:
```bash
npm run dev
```

**Run tests**:
```bash
chmod +x test-admin-auth.sh
./test-admin-auth.sh
```

**Expected output**:
```
✓ All tests passed!
```

---

### 2. Browser Testing (10 minutes)

**Load test suite**:
1. Open browser to `http://localhost:3000/admin/login`
2. Open DevTools (F12) > Console
3. Copy and paste contents of `test-admin-auth.js`
4. Run: `runAdminAuthTests()`

**View results**:
- Results shown in console with color coding
- Full details: `window.adminAuthTestResults`

---

### 3. Debug Tools (As needed)

**Load debug tools**:
1. Open browser console
2. Copy and paste contents of `debug-cookies.js`
3. Run any command:

```javascript
// Full diagnostic
debugAdminAuth()

// Inspect cookies
showCookies()

// Check session
validateSession()

// Clear auth data
clearAuth()
```

---

## Common Testing Scenarios

### Test Login Works
```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@southwestresumeservices.com","password":"admin123"}'
```

**Expected**: `{"success":true,"message":"Login successful"}`

### Test Rate Limiting
```bash
for i in {1..6}; do
  echo "Attempt $i"
  curl -X POST http://localhost:3000/api/admin/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

**Expected**: 6th attempt returns 429

### Test Protected Route
```bash
# Without auth - should redirect
curl -I http://localhost:3000/admin

# With auth - should return 200
curl -I http://localhost:3000/admin -b "admin_session=authenticated"
```

---

## Environment Setup

### Required Environment Variables

Create `.env.local`:
```env
# Admin credentials
ADMIN_EMAIL=admin@southwestresumeservices.com
ADMIN_PASSWORD=admin123

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key

# Environment
NODE_ENV=development
```

### For Testing with Different Credentials

**In terminal**:
```bash
export ADMIN_EMAIL="your@email.com"
export ADMIN_PASSWORD="yourpassword"
./test-admin-auth.sh
```

**In browser**:
```javascript
localStorage.setItem("TEST_ADMIN_EMAIL", "your@email.com");
localStorage.setItem("TEST_ADMIN_PASSWORD", "yourpassword");
runAdminAuthTests()
```

---

## Test Checklist

### Before Testing
- [ ] Server running (`npm run dev`)
- [ ] Environment variables set
- [ ] Browser cookies cleared
- [ ] DevTools open

### Automated Tests
- [ ] All 8 tests pass
- [ ] No errors in console
- [ ] Rate limiting works
- [ ] Cookies set correctly

### Manual Tests
- [ ] Can login with correct credentials
- [ ] Cannot login with wrong credentials
- [ ] Rate limited after 5 attempts
- [ ] Session persists after refresh
- [ ] Protected routes require auth
- [ ] Logout clears session

### Security Validation
- [ ] Cookies are HttpOnly
- [ ] Cookies are Secure (production)
- [ ] SameSite attribute set
- [ ] CSRF protection active
- [ ] No sensitive data in logs

---

## Expected Test Results

### Login Success
```json
{
  "success": true,
  "message": "Login successful"
}
```
**Headers**: `Set-Cookie: admin_session=...`

### Login Failure
```json
{
  "error": "Invalid email or password",
  "attemptsRemaining": 4
}
```
**Status**: 401

### Rate Limited
```json
{
  "error": "Too many login attempts. Please try again later.",
  "retryAfter": 900
}
```
**Status**: 429

### Protected Route (No Auth)
**Status**: 302 (redirect to /admin/login)

### Protected Route (With Auth)
**Status**: 200 (admin page content)

---

## Troubleshooting

### Tests Failing?

**Check environment**:
```bash
echo $ADMIN_EMAIL
echo $ADMIN_PASSWORD
```

**Restart server**:
```bash
# Stop server (Ctrl+C)
npm run dev
```

**Clear rate limits**:
```bash
# Restart server or wait 15 minutes
```

### Cookies Not Set?

**Check response headers**:
```bash
curl -i -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@southwestresumeservices.com","password":"admin123"}' \
  | grep -i "set-cookie"
```

**Expected**: `Set-Cookie: admin_session=...`

### Rate Limiting Not Working?

**Check IP detection**:
- Each test should use same IP
- Restart server to clear in-memory store
- Use consistent email address

### Session Not Persisting?

**Check cookie attributes**:
```javascript
// In browser console
document.cookie
```

**Check DevTools**:
- Application > Cookies
- Verify HttpOnly, Path, Max-Age

---

## Performance Benchmarks

| Operation | Expected | Slow Threshold |
|-----------|----------|----------------|
| Login API | < 500ms | > 2000ms |
| Middleware | < 50ms | > 200ms |
| Cookie R/W | < 10ms | > 50ms |
| Page Load | < 2s | > 5s |

**Measure performance**:
```bash
time ./test-admin-auth.sh
```

---

## Debug Commands Reference

### Browser Console

```javascript
// Load tools first (paste debug-cookies.js)

// Full diagnostic
debugAdminAuth()

// Cookie inspection
showCookies()

// Storage inspection
showStorage()

// Monitor requests
monitorRequests()
// ... make some requests ...
stopMonitoring()

// Test redirects
traceRedirects()

// Check session validity
validateSession()

// Test login
testLoginEndpoint()

// Clear everything
clearAuth()
```

### Terminal

```bash
# Run all tests
./test-admin-auth.sh

# Run against specific URL
./test-admin-auth.sh http://localhost:3000

# Test single endpoint
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@southwestresumeservices.com","password":"admin123"}'

# Check rate limit
for i in {1..6}; do curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'; done

# Monitor cookies
watch -n 1 'curl -I http://localhost:3000/admin'
```

---

## Security Testing

### CSRF Protection
```bash
# Should fail in production
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://evil-site.com" \
  -d '{"email":"test@example.com","password":"test"}'
```

### Cookie Security
```bash
# Check security flags
curl -i -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@southwestresumeservices.com","password":"admin123"}' \
  | grep -i "set-cookie"
```

**Should include**:
- `HttpOnly`
- `Secure` (production)
- `SameSite=Strict` or `SameSite=Lax`
- `Path=/`
- `Max-Age=28800`

---

## Documentation

### Full Documentation
- **TESTING-GUIDE.md** - Complete testing procedures, manual checklists, troubleshooting
- **test-results.md** - Template for documenting test results
- **TESTING-README.md** - This file (quick reference)

### Code Files
- **test-admin-auth.sh** - Automated curl tests
- **test-admin-auth.js** - Browser test suite
- **debug-cookies.js** - Debug utilities

---

## Support

### Getting Help

1. **Check TESTING-GUIDE.md** for detailed instructions
2. **Check test output** for specific error messages
3. **Check browser console** for JavaScript errors
4. **Check server logs** for API errors

### Common Issues

| Issue | Solution |
|-------|----------|
| "Connection refused" | Start dev server: `npm run dev` |
| "Invalid credentials" | Check environment variables |
| "Rate limited" | Wait 15 min or restart server |
| "Cookies not set" | Check response headers |
| "Tests failing" | Clear cookies and retry |

---

## Test Execution Workflow

### Pre-Release Testing

1. **Run automated tests**
   ```bash
   ./test-admin-auth.sh
   ```

2. **Run browser tests**
   - Load test-admin-auth.js
   - Run `runAdminAuthTests()`

3. **Manual testing**
   - Follow checklist in TESTING-GUIDE.md
   - Document in test-results.md

4. **Security validation**
   - Verify all security flags
   - Test CSRF protection
   - Check rate limiting

5. **Performance check**
   - Measure response times
   - Verify within benchmarks

6. **Browser compatibility**
   - Test Chrome, Firefox, Safari
   - Test mobile browsers

7. **Sign-off**
   - Complete test-results.md
   - Review with team
   - Approve for deployment

### Regression Testing

Run before each deployment:
```bash
./test-admin-auth.sh
```

All tests should pass before deploying.

---

## Version History

**v1.0** (2025-12-22)
- Initial testing scaffolding
- Automated test suite
- Browser test suite
- Debug tools
- Documentation

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│ ADMIN AUTH TESTING - QUICK REFERENCE                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ RUN AUTOMATED TESTS:                                        │
│   ./test-admin-auth.sh                                      │
│                                                              │
│ BROWSER TESTS:                                              │
│   1. Paste test-admin-auth.js in console                   │
│   2. Run: runAdminAuthTests()                               │
│                                                              │
│ DEBUG TOOLS:                                                │
│   1. Paste debug-cookies.js in console                     │
│   2. Run: debugAdminAuth()                                  │
│                                                              │
│ TEST LOGIN:                                                 │
│   curl -X POST http://localhost:3000/api/admin/auth/login \ │
│     -H "Content-Type: application/json" \                   │
│     -d '{"email":"admin@southwestresumeservices.com", \     │
│          "password":"admin123"}'                            │
│                                                              │
│ CREDENTIALS:                                                │
│   Default: admin@southwestresumeservices.com / admin123    │
│   Custom: Set ADMIN_EMAIL and ADMIN_PASSWORD env vars      │
│                                                              │
│ ENDPOINTS:                                                  │
│   Login:  POST /api/admin/auth/login                        │
│   Logout: POST /api/admin/logout                            │
│   Admin:  GET  /admin (protected)                           │
│                                                              │
│ RATE LIMIT:                                                 │
│   5 attempts per 15 minutes per IP                          │
│                                                              │
│ SECURITY:                                                   │
│   ✓ HttpOnly cookies                                        │
│   ✓ Secure flag (production)                                │
│   ✓ SameSite=Lax                                            │
│   ✓ CSRF protection                                         │
│   ✓ Rate limiting                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**For full documentation, see TESTING-GUIDE.md**
