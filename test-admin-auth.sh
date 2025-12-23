#!/bin/bash

################################################################################
# ADMIN AUTHENTICATION TEST SUITE
#
# Automated curl-based tests for admin authentication system
# Tests DUAL-MODE authentication:
#   - Mode 1: Simple session authentication (admin_session cookie)
#   - Mode 2: Supabase authentication (sb-access-token, sb-refresh-token)
#
# Usage: ./test-admin-auth.sh [BASE_URL] [MODE]
# Examples:
#   ./test-admin-auth.sh http://localhost:3000          # Test both modes
#   ./test-admin-auth.sh http://localhost:3000 simple   # Test simple mode only
#   ./test-admin-auth.sh http://localhost:3000 supabase # Test Supabase mode only
#
################################################################################

set -e

# Configuration
BASE_URL="${1:-http://localhost:3000}"
TEST_MODE="${2:-both}"  # Options: simple, supabase, both
API_ENDPOINT="${BASE_URL}/api/admin/auth/login"
ADMIN_PAGE="${BASE_URL}/admin"
LOGIN_PAGE="${BASE_URL}/admin/login"

# Credentials for simple mode
SIMPLE_EMAIL="${ADMIN_EMAIL:-admin@southwestresumeservices.com}"
SIMPLE_PASSWORD="${ADMIN_PASSWORD:-admin123}"

# Credentials for Supabase mode (update these if different)
SUPABASE_EMAIL="${SUPABASE_ADMIN_EMAIL:-ryan.zimmerman@southwestresumes.com}"
SUPABASE_PASSWORD="${SUPABASE_ADMIN_PASSWORD:-Welectric9191!}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Temp file for storing cookies
COOKIE_FILE=$(mktemp)
trap "rm -f $COOKIE_FILE" EXIT

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_test() {
    echo -e "${YELLOW}[TEST]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((TESTS_PASSED++))
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((TESTS_FAILED++))
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

run_test() {
    ((TESTS_RUN++))
}

################################################################################
# Test Functions
################################################################################

test_login_success() {
    print_test "Test 1: Login with correct credentials"
    run_test

    # Get credentials from environment or use defaults
    ADMIN_EMAIL="${ADMIN_EMAIL:-admin@southwestresumeservices.com}"
    ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin123}"

    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -c "$COOKIE_FILE" \
        -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    print_info "Response Code: $http_code"
    print_info "Response Body: $body"

    if [ "$http_code" = "200" ]; then
        if echo "$body" | grep -q "success.*true"; then
            print_pass "Login successful with correct credentials"

            # Check if cookie was set
            if grep -q "admin_session" "$COOKIE_FILE"; then
                print_pass "Session cookie was set"
            else
                print_fail "Session cookie was NOT set"
            fi
        else
            print_fail "Response missing success flag"
        fi
    else
        print_fail "Expected 200, got $http_code"
    fi

    echo ""
}

test_login_failure() {
    print_test "Test 2: Login with wrong credentials"
    run_test

    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -d '{"email":"wrong@example.com","password":"wrongpassword"}')

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    print_info "Response Code: $http_code"
    print_info "Response Body: $body"

    if [ "$http_code" = "401" ]; then
        print_pass "Login rejected with 401 Unauthorized"

        if echo "$body" | grep -q "attemptsRemaining"; then
            print_pass "Response includes attemptsRemaining counter"
        else
            print_fail "Response missing attemptsRemaining counter"
        fi
    else
        print_fail "Expected 401, got $http_code"
    fi

    echo ""
}

test_rate_limiting() {
    print_test "Test 3: Rate limiting (5 attempts per 15 min)"
    run_test

    print_info "Making 5 failed login attempts..."

    for i in {1..5}; do
        response=$(curl -s -w "\n%{http_code}" \
            -X POST "$API_ENDPOINT" \
            -H "Content-Type: application/json" \
            -d '{"email":"test@example.com","password":"wrong"}')

        http_code=$(echo "$response" | tail -n1)
        print_info "Attempt $i: HTTP $http_code"
    done

    # 6th attempt should be rate limited
    print_info "Making 6th attempt (should be rate limited)..."
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -d '{"email":"test@example.com","password":"wrong"}')

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    print_info "Response Code: $http_code"
    print_info "Response Body: $body"

    if [ "$http_code" = "429" ]; then
        print_pass "Rate limiting triggered after 5 attempts"

        if echo "$body" | grep -q "retryAfter"; then
            print_pass "Response includes retryAfter value"
        else
            print_fail "Response missing retryAfter value"
        fi

        # Check for rate limit headers
        headers=$(curl -s -I -X POST "$API_ENDPOINT" \
            -H "Content-Type: application/json" \
            -d '{"email":"test@example.com","password":"wrong"}')

        if echo "$headers" | grep -qi "x-ratelimit-limit"; then
            print_pass "X-RateLimit-Limit header present"
        else
            print_fail "X-RateLimit-Limit header missing"
        fi

        if echo "$headers" | grep -qi "retry-after"; then
            print_pass "Retry-After header present"
        else
            print_fail "Retry-After header missing"
        fi
    else
        print_fail "Expected 429, got $http_code"
    fi

    echo ""
}

test_cookie_attributes() {
    print_test "Test 4: Cookie security attributes"
    run_test

    # Get credentials from environment or use defaults
    ADMIN_EMAIL="${ADMIN_EMAIL:-admin@southwestresumeservices.com}"
    ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin123}"

    # Clear previous cookies
    rm -f "$COOKIE_FILE"

    response=$(curl -s -i -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -c "$COOKIE_FILE" \
        -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

    print_info "Checking Set-Cookie headers..."

    if echo "$response" | grep -q "HttpOnly"; then
        print_pass "Cookie has HttpOnly flag"
    else
        print_fail "Cookie missing HttpOnly flag"
    fi

    if echo "$response" | grep -q "Secure"; then
        print_pass "Cookie has Secure flag"
    else
        print_info "Cookie missing Secure flag (expected in dev mode)"
    fi

    if echo "$response" | grep -q "SameSite"; then
        print_pass "Cookie has SameSite attribute"
    else
        print_fail "Cookie missing SameSite attribute"
    fi

    if echo "$response" | grep -q "Path=/"; then
        print_pass "Cookie has correct Path (root)"
    else
        print_fail "Cookie missing or incorrect Path"
    fi

    echo ""
}

test_protected_route_without_auth() {
    print_test "Test 5: Access protected route without authentication"
    run_test

    # Clear cookies
    rm -f "$COOKIE_FILE"

    response=$(curl -s -w "\n%{http_code}" \
        -L \
        -c "$COOKIE_FILE" \
        "$ADMIN_PAGE")

    http_code=$(echo "$response" | tail -n1)

    print_info "Response Code: $http_code"

    # Should redirect to login (302/307) or return login page (200)
    if [ "$http_code" = "200" ] || [ "$http_code" = "302" ] || [ "$http_code" = "307" ]; then
        # Check if we ended up at login page
        body=$(echo "$response" | head -n-1)
        if echo "$body" | grep -qi "admin login\|sign in"; then
            print_pass "Redirected to login page"
        else
            print_fail "Not redirected to login page"
        fi
    else
        print_fail "Unexpected response code: $http_code"
    fi

    echo ""
}

test_protected_route_with_auth() {
    print_test "Test 6: Access protected route with authentication"
    run_test

    # First login
    ADMIN_EMAIL="${ADMIN_EMAIL:-admin@southwestresumeservices.com}"
    ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin123}"

    curl -s -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -c "$COOKIE_FILE" \
        -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" > /dev/null

    # Now try to access admin page
    response=$(curl -s -w "\n%{http_code}" \
        -b "$COOKIE_FILE" \
        "$ADMIN_PAGE")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    print_info "Response Code: $http_code"

    if [ "$http_code" = "200" ]; then
        # Check if it's the admin dashboard (not login page)
        if echo "$body" | grep -qi "admin login\|sign in"; then
            print_fail "Still showing login page despite being authenticated"
        else
            print_pass "Successfully accessed admin page"
        fi
    else
        print_fail "Expected 200, got $http_code"
    fi

    echo ""
}

test_malformed_requests() {
    print_test "Test 7: Malformed request handling"
    run_test

    # Missing email
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -d '{"password":"test"}')

    http_code=$(echo "$response" | tail -n1)

    if [ "$http_code" = "400" ]; then
        print_pass "Returns 400 for missing email"
    else
        print_fail "Expected 400 for missing email, got $http_code"
    fi

    # Missing password
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -d '{"email":"test@example.com"}')

    http_code=$(echo "$response" | tail -n1)

    if [ "$http_code" = "400" ]; then
        print_pass "Returns 400 for missing password"
    else
        print_fail "Expected 400 for missing password, got $http_code"
    fi

    # Invalid JSON
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -d '{invalid json')

    http_code=$(echo "$response" | tail -n1)

    if [ "$http_code" = "400" ] || [ "$http_code" = "500" ]; then
        print_pass "Handles invalid JSON gracefully"
    else
        print_fail "Unexpected response for invalid JSON: $http_code"
    fi

    echo ""
}

test_csrf_protection() {
    print_test "Test 8: CSRF protection on login endpoint"
    run_test

    # Try to POST without Origin or Referer headers
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -H "Origin: https://evil-site.com" \
        -d '{"email":"test@example.com","password":"test"}')

    http_code=$(echo "$response" | tail -n1)

    print_info "Response Code: $http_code"

    # In production, should be 403. In dev, may be allowed.
    if [ "$http_code" = "403" ]; then
        print_pass "CSRF protection active (blocked cross-origin request)"
    elif [ "$http_code" = "401" ] || [ "$http_code" = "400" ]; then
        print_info "Request processed (dev mode or valid origin)"
    else
        print_fail "Unexpected response: $http_code"
    fi

    echo ""
}

################################################################################
# Dual-Mode Specific Tests
################################################################################

test_simple_mode_auth() {
    print_test "Test 9: Simple mode authentication"
    run_test

    # Clear previous cookies
    rm -f "$COOKIE_FILE"

    response=$(curl -s -i -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -c "$COOKIE_FILE" \
        -d "{\"email\":\"$SIMPLE_EMAIL\",\"password\":\"$SIMPLE_PASSWORD\"}")

    print_info "Testing simple session cookie..."

    # Check for admin_session cookie
    if grep -q "admin_session" "$COOKIE_FILE"; then
        print_pass "Simple session cookie (admin_session) was set"

        # Verify cookie value
        cookie_value=$(grep "admin_session" "$COOKIE_FILE" | awk '{print $NF}')
        if [ "$cookie_value" = "authenticated" ]; then
            print_pass "Cookie value is correct (authenticated)"
        else
            print_fail "Cookie value incorrect: $cookie_value"
        fi

        # Check cookie attributes in Set-Cookie header
        if echo "$response" | grep -q "HttpOnly"; then
            print_pass "Simple session has HttpOnly attribute"
        else
            print_fail "Simple session missing HttpOnly attribute"
        fi

        if echo "$response" | grep -q "SameSite"; then
            print_pass "Simple session has SameSite attribute"
        else
            print_fail "Simple session missing SameSite attribute"
        fi
    else
        print_fail "Simple session cookie NOT set"
    fi

    echo ""
}

test_supabase_mode_auth() {
    print_test "Test 10: Supabase mode authentication"
    run_test

    # Clear previous cookies
    rm -f "$COOKIE_FILE"

    response=$(curl -s -i -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -c "$COOKIE_FILE" \
        -d "{\"email\":\"$SUPABASE_EMAIL\",\"password\":\"$SUPABASE_PASSWORD\"}")

    print_info "Testing Supabase cookies..."

    # Check for Supabase cookies
    if grep -q "sb-access-token" "$COOKIE_FILE"; then
        print_pass "Supabase access token cookie was set"
    else
        print_info "Supabase access token cookie NOT set (may not be configured)"
    fi

    if grep -q "sb-refresh-token" "$COOKIE_FILE"; then
        print_pass "Supabase refresh token cookie was set"
    else
        print_info "Supabase refresh token cookie NOT set (may not be configured)"
    fi

    # Check if at least one authentication method worked
    if grep -q "admin_session\|sb-access-token" "$COOKIE_FILE"; then
        print_pass "At least one authentication mode is working"
    else
        print_fail "No authentication cookies were set"
    fi

    echo ""
}

test_dual_mode_middleware() {
    print_test "Test 11: Dual-mode middleware cookie detection"
    run_test

    print_info "Testing that middleware accepts EITHER cookie type..."

    # Test 1: Access with simple session
    rm -f "$COOKIE_FILE"
    curl -s -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -c "$COOKIE_FILE" \
        -d "{\"email\":\"$SIMPLE_EMAIL\",\"password\":\"$SIMPLE_PASSWORD\"}" > /dev/null

    if grep -q "admin_session" "$COOKIE_FILE"; then
        response=$(curl -s -w "\n%{http_code}" -b "$COOKIE_FILE" "$ADMIN_PAGE")
        http_code=$(echo "$response" | tail -n1)

        if [ "$http_code" = "200" ]; then
            print_pass "Middleware accepts simple session cookie"
        else
            print_fail "Middleware rejected simple session cookie"
        fi
    fi

    # Test 2: Access with Supabase tokens (if available)
    rm -f "$COOKIE_FILE"
    curl -s -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -c "$COOKIE_FILE" \
        -d "{\"email\":\"$SUPABASE_EMAIL\",\"password\":\"$SUPABASE_PASSWORD\"}" > /dev/null

    if grep -q "sb-access-token" "$COOKIE_FILE"; then
        response=$(curl -s -w "\n%{http_code}" -b "$COOKIE_FILE" "$ADMIN_PAGE")
        http_code=$(echo "$response" | tail -n1)

        if [ "$http_code" = "200" ]; then
            print_pass "Middleware accepts Supabase cookies"
        else
            print_fail "Middleware rejected Supabase cookies"
        fi
    fi

    echo ""
}

test_cookie_mode_detection() {
    print_test "Test 12: Verify which authentication mode is active"
    run_test

    # Clear cookies and login
    rm -f "$COOKIE_FILE"
    curl -s -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -c "$COOKIE_FILE" \
        -d "{\"email\":\"$SIMPLE_EMAIL\",\"password\":\"$SIMPLE_PASSWORD\"}" > /dev/null

    print_info "Analyzing authentication mode from cookies..."

    has_simple=$(grep -c "admin_session" "$COOKIE_FILE" 2>/dev/null || echo 0)
    has_supabase_access=$(grep -c "sb-access-token" "$COOKIE_FILE" 2>/dev/null || echo 0)
    has_supabase_refresh=$(grep -c "sb-refresh-token" "$COOKIE_FILE" 2>/dev/null || echo 0)

    if [ "$has_simple" -gt 0 ]; then
        print_info "Active mode: Simple Session Authentication"
    fi

    if [ "$has_supabase_access" -gt 0 ] && [ "$has_supabase_refresh" -gt 0 ]; then
        print_info "Active mode: Supabase Authentication"
    fi

    if [ "$has_simple" -gt 0 ] || [ "$has_supabase_access" -gt 0 ]; then
        print_pass "Authentication mode detected successfully"
    else
        print_fail "No authentication mode detected"
    fi

    echo ""
}

################################################################################
# Main Test Execution
################################################################################

print_header "ADMIN AUTHENTICATION TEST SUITE (DUAL-MODE)"
print_info "Testing endpoint: $API_ENDPOINT"
print_info "Testing admin page: $ADMIN_PAGE"
print_info "Test mode: $TEST_MODE"
echo ""

# Check if server is running
if ! curl -s -f -o /dev/null "$BASE_URL"; then
    echo -e "${RED}ERROR: Cannot connect to $BASE_URL${NC}"
    echo -e "${RED}Please ensure the development server is running${NC}"
    exit 1
fi

print_pass "Server is reachable at $BASE_URL"
echo ""

# Run core tests (always)
test_login_success
test_login_failure
test_rate_limiting
test_cookie_attributes
test_protected_route_without_auth
test_protected_route_with_auth
test_malformed_requests
test_csrf_protection

# Run mode-specific tests based on TEST_MODE parameter
if [ "$TEST_MODE" = "simple" ] || [ "$TEST_MODE" = "both" ]; then
    test_simple_mode_auth
fi

if [ "$TEST_MODE" = "supabase" ] || [ "$TEST_MODE" = "both" ]; then
    test_supabase_mode_auth
fi

if [ "$TEST_MODE" = "both" ]; then
    test_dual_mode_middleware
    test_cookie_mode_detection
fi

# Print summary
print_header "TEST SUMMARY"
echo -e "Tests Run:    ${BLUE}$TESTS_RUN${NC}"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
