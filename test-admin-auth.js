/**
 * BROWSER-BASED ADMIN AUTHENTICATION TEST SUITE
 *
 * Run this in your browser console to test admin authentication
 * Usage: Copy and paste this entire file into browser DevTools console
 *
 * Prerequisites:
 * - Must be on the admin login page or any page under the same domain
 * - Set credentials in localStorage before running (see instructions below)
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    API_ENDPOINT: '/api/admin/auth/login',
    LOGOUT_ENDPOINT: '/api/admin/logout',
    ADMIN_PAGE: '/admin',
    LOGIN_PAGE: '/admin/login',
    // Get from localStorage or use defaults
    ADMIN_EMAIL: localStorage.getItem('TEST_ADMIN_EMAIL') || 'admin@southwestresumeservices.com',
    ADMIN_PASSWORD: localStorage.getItem('TEST_ADMIN_PASSWORD') || 'admin123',
  };

  // Test state
  const state = {
    testsRun: 0,
    testsPassed: 0,
    testsFailed: 0,
    results: [],
  };

  // Styling for console output
  const styles = {
    header: 'color: #3B82F6; font-weight: bold; font-size: 16px; padding: 10px 0;',
    test: 'color: #F59E0B; font-weight: bold;',
    pass: 'color: #10B981; font-weight: bold;',
    fail: 'color: #EF4444; font-weight: bold;',
    info: 'color: #6B7280;',
    code: 'background: #F3F4F6; padding: 2px 6px; border-radius: 3px; font-family: monospace;',
  };

  // Helper Functions
  function printHeader(text) {
    console.log(`\n${'━'.repeat(70)}`);
    console.log(`%c${text}`, styles.header);
    console.log('━'.repeat(70) + '\n');
  }

  function printTest(text) {
    console.log(`%c[TEST] ${text}`, styles.test);
  }

  function printPass(text) {
    console.log(`%c✓ PASS: ${text}`, styles.pass);
    state.testsPassed++;
  }

  function printFail(text) {
    console.log(`%c✗ FAIL: ${text}`, styles.fail);
    state.testsFailed++;
  }

  function printInfo(text) {
    console.log(`%c[INFO] ${text}`, styles.info);
  }

  function printCode(label, value) {
    console.log(`${label}: %c${JSON.stringify(value, null, 2)}`, styles.code);
  }

  function runTest() {
    state.testsRun++;
  }

  function addResult(testName, passed, message, details = {}) {
    state.results.push({
      testName,
      passed,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  // Cookie inspection helpers
  function getAllCookies() {
    return document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {});
  }

  function getCookie(name) {
    const cookies = getAllCookies();
    return cookies[name];
  }

  function clearAuthCookies() {
    // Clear auth-related cookies
    const cookieNames = ['admin_session', 'sb-access-token', 'sb-refresh-token'];
    cookieNames.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  }

  // Test Functions
  async function test1_LoginSuccess() {
    printTest('Test 1: Login with correct credentials');
    runTest();

    try {
      clearAuthCookies();

      const response = await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: CONFIG.ADMIN_EMAIL,
          password: CONFIG.ADMIN_PASSWORD,
        }),
      });

      const data = await response.json();

      printInfo(`Response Status: ${response.status}`);
      printCode('Response Body', data);

      if (response.status === 200 && data.success === true) {
        printPass('Login successful with correct credentials');
        addResult('Login Success', true, 'Login succeeded with valid credentials', { response: data });

        // Check cookies
        const cookies = getAllCookies();
        printCode('Cookies After Login', cookies);

        if (cookies['admin_session'] || cookies['sb-access-token']) {
          printPass('Session cookie was set');
          addResult('Cookie Set', true, 'Session cookie present after login', { cookies });
        } else {
          printFail('Session cookie was NOT set');
          addResult('Cookie Set', false, 'No session cookie after login', { cookies });
        }
      } else {
        printFail(`Expected 200 with success=true, got ${response.status}`);
        addResult('Login Success', false, 'Login failed', { response: data });
      }
    } catch (error) {
      printFail(`Error during test: ${error.message}`);
      addResult('Login Success', false, 'Exception thrown', { error: error.message });
    }

    console.log('');
  }

  async function test2_LoginFailure() {
    printTest('Test 2: Login with wrong credentials');
    runTest();

    try {
      clearAuthCookies();

      const response = await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        }),
      });

      const data = await response.json();

      printInfo(`Response Status: ${response.status}`);
      printCode('Response Body', data);

      if (response.status === 401) {
        printPass('Login rejected with 401 Unauthorized');
        addResult('Login Failure', true, 'Invalid credentials rejected', { response: data });

        if (data.attemptsRemaining !== undefined) {
          printPass(`Response includes attemptsRemaining: ${data.attemptsRemaining}`);
          addResult('Attempts Counter', true, 'attemptsRemaining present', { value: data.attemptsRemaining });
        } else {
          printFail('Response missing attemptsRemaining counter');
          addResult('Attempts Counter', false, 'attemptsRemaining missing', { response: data });
        }
      } else {
        printFail(`Expected 401, got ${response.status}`);
        addResult('Login Failure', false, 'Wrong status code', { response: data });
      }
    } catch (error) {
      printFail(`Error during test: ${error.message}`);
      addResult('Login Failure', false, 'Exception thrown', { error: error.message });
    }

    console.log('');
  }

  async function test3_RateLimiting() {
    printTest('Test 3: Rate limiting (5 attempts per 15 min)');
    runTest();

    try {
      printInfo('Making 5 failed login attempts...');

      // Make 5 failed attempts
      for (let i = 1; i <= 5; i++) {
        const response = await fetch(CONFIG.API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: `ratelimit-test-${Date.now()}@example.com`,
            password: 'wrong',
          }),
        });

        const data = await response.json();
        printInfo(`Attempt ${i}: HTTP ${response.status}, Remaining: ${data.attemptsRemaining || 'N/A'}`);
      }

      // 6th attempt should be rate limited
      printInfo('Making 6th attempt (should be rate limited)...');

      const response = await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `ratelimit-test-${Date.now()}@example.com`,
          password: 'wrong',
        }),
      });

      const data = await response.json();

      printInfo(`Response Status: ${response.status}`);
      printCode('Response Body', data);

      if (response.status === 429) {
        printPass('Rate limiting triggered after 5 attempts');
        addResult('Rate Limiting', true, '429 returned after 5 attempts', { response: data });

        if (data.retryAfter !== undefined) {
          printPass(`Response includes retryAfter: ${data.retryAfter}s`);
          addResult('RetryAfter', true, 'retryAfter value present', { value: data.retryAfter });
        } else {
          printFail('Response missing retryAfter value');
          addResult('RetryAfter', false, 'retryAfter missing', { response: data });
        }

        // Check headers
        const headers = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        printCode('Response Headers', headers);

        if (headers['x-ratelimit-limit']) {
          printPass(`X-RateLimit-Limit header: ${headers['x-ratelimit-limit']}`);
        } else {
          printFail('X-RateLimit-Limit header missing');
        }

        if (headers['retry-after']) {
          printPass(`Retry-After header: ${headers['retry-after']}`);
        } else {
          printFail('Retry-After header missing');
        }
      } else {
        printFail(`Expected 429, got ${response.status}`);
        addResult('Rate Limiting', false, 'Rate limit not triggered', { response: data });
      }
    } catch (error) {
      printFail(`Error during test: ${error.message}`);
      addResult('Rate Limiting', false, 'Exception thrown', { error: error.message });
    }

    console.log('');
  }

  async function test4_SessionPersistence() {
    printTest('Test 4: Session persistence across requests');
    runTest();

    try {
      clearAuthCookies();

      // Login first
      printInfo('Logging in...');
      const loginResponse = await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: CONFIG.ADMIN_EMAIL,
          password: CONFIG.ADMIN_PASSWORD,
        }),
      });

      if (loginResponse.status !== 200) {
        printFail('Login failed, cannot test session persistence');
        addResult('Session Persistence', false, 'Login prerequisite failed');
        return;
      }

      printInfo('Login successful, checking session...');

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Try to access admin page
      const adminResponse = await fetch(CONFIG.ADMIN_PAGE, {
        credentials: 'include',
      });

      printInfo(`Admin page response: ${adminResponse.status}`);

      if (adminResponse.status === 200) {
        const html = await adminResponse.text();

        // Check if we got the login page or admin dashboard
        const isLoginPage = html.includes('Admin Login') || html.includes('Sign In');

        if (!isLoginPage) {
          printPass('Session persisted - admin page accessible');
          addResult('Session Persistence', true, 'Session valid after login', { status: adminResponse.status });
        } else {
          printFail('Session not persisted - redirected to login');
          addResult('Session Persistence', false, 'Redirected to login', { status: adminResponse.status });
        }
      } else {
        printInfo(`Unexpected status: ${adminResponse.status}`);
        addResult('Session Persistence', false, 'Unexpected response', { status: adminResponse.status });
      }
    } catch (error) {
      printFail(`Error during test: ${error.message}`);
      addResult('Session Persistence', false, 'Exception thrown', { error: error.message });
    }

    console.log('');
  }

  async function test5_CookieInspection() {
    printTest('Test 5: Cookie inspection and attributes');
    runTest();

    try {
      clearAuthCookies();

      // Login
      printInfo('Logging in to inspect cookies...');
      await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: CONFIG.ADMIN_EMAIL,
          password: CONFIG.ADMIN_PASSWORD,
        }),
      });

      // Get all cookies
      const cookies = getAllCookies();
      printCode('All Cookies', cookies);

      const authCookieNames = ['admin_session', 'sb-access-token', 'sb-refresh-token'];
      const foundCookies = authCookieNames.filter(name => cookies[name]);

      if (foundCookies.length > 0) {
        printPass(`Found ${foundCookies.length} auth cookie(s): ${foundCookies.join(', ')}`);
        addResult('Cookie Inspection', true, 'Auth cookies present', { cookies: foundCookies });

        printInfo('\nNote: HttpOnly cookies cannot be read via JavaScript (this is correct for security)');
        printInfo('To inspect HttpOnly cookies, open DevTools > Application > Cookies');
      } else {
        printFail('No auth cookies found');
        addResult('Cookie Inspection', false, 'No auth cookies present', { cookies });
      }
    } catch (error) {
      printFail(`Error during test: ${error.message}`);
      addResult('Cookie Inspection', false, 'Exception thrown', { error: error.message });
    }

    console.log('');
  }

  async function test6_LocalStorage() {
    printTest('Test 6: LocalStorage inspection');
    runTest();

    try {
      printInfo('Checking localStorage for auth data...');

      const allStorage = { ...localStorage };
      printCode('LocalStorage Contents', allStorage);

      const authKeys = Object.keys(allStorage).filter(key =>
        key.includes('auth') || key.includes('session') || key.includes('token') || key.includes('supabase')
      );

      if (authKeys.length > 0) {
        printInfo(`Found ${authKeys.length} potential auth keys: ${authKeys.join(', ')}`);
        authKeys.forEach(key => {
          printCode(key, localStorage.getItem(key));
        });
        addResult('LocalStorage', true, 'Auth data in localStorage', { keys: authKeys });
      } else {
        printInfo('No auth data in localStorage (cookies-only approach)');
        addResult('LocalStorage', true, 'No auth in localStorage (expected)', { keys: [] });
      }

      printPass('LocalStorage inspection complete');
    } catch (error) {
      printFail(`Error during test: ${error.message}`);
      addResult('LocalStorage', false, 'Exception thrown', { error: error.message });
    }

    console.log('');
  }

  async function test7_NetworkMonitoring() {
    printTest('Test 7: Network request monitoring');
    runTest();

    try {
      printInfo('Making login request with network monitoring...');

      clearAuthCookies();

      const startTime = performance.now();

      const response = await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: CONFIG.ADMIN_EMAIL,
          password: CONFIG.ADMIN_PASSWORD,
        }),
      });

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      printInfo(`Response Time: ${responseTime}ms`);
      printInfo(`Response Status: ${response.status}`);
      printInfo(`Response Type: ${response.type}`);

      // Get all headers
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      printCode('Response Headers', headers);

      if (responseTime < 5000) {
        printPass(`Login API responded in ${responseTime}ms (acceptable)`);
        addResult('Network Monitoring', true, 'Response time acceptable', { responseTime });
      } else {
        printFail(`Login API took ${responseTime}ms (slow)`);
        addResult('Network Monitoring', false, 'Response time too slow', { responseTime });
      }
    } catch (error) {
      printFail(`Error during test: ${error.message}`);
      addResult('Network Monitoring', false, 'Exception thrown', { error: error.message });
    }

    console.log('');
  }

  async function test8_RedirectBehavior() {
    printTest('Test 8: Redirect behavior');
    runTest();

    try {
      printInfo('Testing redirect from protected page to login...');

      clearAuthCookies();

      // Try to access admin page without auth
      const response = await fetch(CONFIG.ADMIN_PAGE, {
        redirect: 'manual',
      });

      printInfo(`Response Status: ${response.status}`);
      printInfo(`Response Type: ${response.type}`);

      if (response.status === 302 || response.status === 307 || response.type === 'opaqueredirect') {
        printPass('Protected page redirects without auth');
        addResult('Redirect Behavior', true, 'Redirect triggered', { status: response.status });

        const location = response.headers.get('location');
        if (location) {
          printInfo(`Redirect Location: ${location}`);
          if (location.includes('login')) {
            printPass('Redirects to login page');
          }
        }
      } else if (response.status === 200) {
        // Might be showing login page directly
        const html = await response.text();
        if (html.includes('Admin Login') || html.includes('Sign In')) {
          printPass('Shows login page for protected route');
          addResult('Redirect Behavior', true, 'Login page shown', { status: response.status });
        } else {
          printFail('Protected page accessible without auth');
          addResult('Redirect Behavior', false, 'No auth check', { status: response.status });
        }
      } else {
        printInfo(`Unexpected status: ${response.status}`);
        addResult('Redirect Behavior', false, 'Unexpected behavior', { status: response.status });
      }
    } catch (error) {
      printFail(`Error during test: ${error.message}`);
      addResult('Redirect Behavior', false, 'Exception thrown', { error: error.message });
    }

    console.log('');
  }

  // Main execution
  async function runAllTests() {
    printHeader('ADMIN AUTHENTICATION TEST SUITE - BROWSER VERSION');
    printInfo(`Testing endpoint: ${CONFIG.API_ENDPOINT}`);
    printInfo(`Using credentials: ${CONFIG.ADMIN_EMAIL}`);
    console.log('');

    // Run tests sequentially
    await test1_LoginSuccess();
    await test2_LoginFailure();
    await test3_RateLimiting();
    await test4_SessionPersistence();
    await test5_CookieInspection();
    await test6_LocalStorage();
    await test7_NetworkMonitoring();
    await test8_RedirectBehavior();

    // Print summary
    printHeader('TEST SUMMARY');
    console.log(`Tests Run:    ${state.testsRun}`);
    console.log(`%cTests Passed: ${state.testsPassed}`, styles.pass);
    console.log(`%cTests Failed: ${state.testsFailed}`, styles.fail);
    console.log('');

    if (state.testsFailed === 0) {
      console.log('%c✓ All tests passed!', 'color: #10B981; font-weight: bold; font-size: 18px;');
    } else {
      console.log('%c✗ Some tests failed', 'color: #EF4444; font-weight: bold; font-size: 18px;');
    }

    console.log('');
    printInfo('Full test results available in: window.adminAuthTestResults');
    window.adminAuthTestResults = state.results;

    return state;
  }

  // Instructions
  console.log('%cADMIN AUTH TEST SUITE LOADED', 'color: #3B82F6; font-weight: bold; font-size: 16px;');
  console.log('');
  console.log('To set custom credentials:');
  console.log('%clocalStorage.setItem("TEST_ADMIN_EMAIL", "your@email.com");', styles.code);
  console.log('%clocalStorage.setItem("TEST_ADMIN_PASSWORD", "yourpassword");', styles.code);
  console.log('');
  console.log('To run tests:');
  console.log('%crunAdminAuthTests()', 'color: #10B981; font-weight: bold; font-size: 14px;');
  console.log('');

  // Expose to global scope
  window.runAdminAuthTests = runAllTests;
  window.adminAuthTestConfig = CONFIG;
})();
