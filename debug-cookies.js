/**
 * ADMIN AUTH DEBUG TOOLS
 *
 * Browser console debugging utilities for admin authentication
 * Usage: Copy and paste this file into browser DevTools console
 *
 * Available commands after loading:
 * - debugAdminAuth()      - Run full diagnostic
 * - showCookies()         - Display all cookies
 * - showStorage()         - Display localStorage and sessionStorage
 * - monitorRequests()     - Monitor network requests
 * - traceRedirects()      - Trace redirect chain
 * - clearAuth()           - Clear all auth data
 */

(function() {
  'use strict';

  // Styling
  const styles = {
    header: 'background: #3B82F6; color: white; padding: 4px 8px; font-weight: bold; border-radius: 3px;',
    subheader: 'color: #3B82F6; font-weight: bold; font-size: 14px;',
    success: 'color: #10B981; font-weight: bold;',
    warning: 'color: #F59E0B; font-weight: bold;',
    error: 'color: #EF4444; font-weight: bold;',
    info: 'color: #6B7280;',
    code: 'background: #F3F4F6; padding: 2px 6px; border-radius: 3px; font-family: monospace;',
    table: 'font-family: monospace; font-size: 12px;',
  };

  // Cookie utilities
  function getAllCookies() {
    const cookies = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name) cookies[name] = value;
    });
    return cookies;
  }

  function getCookie(name) {
    return getAllCookies()[name];
  }

  function showCookies() {
    console.log('%c📦 COOKIES INSPECTOR', styles.header);
    console.log('');

    const cookies = getAllCookies();
    const cookieCount = Object.keys(cookies).length;

    if (cookieCount === 0) {
      console.log('%c⚠ No cookies found', styles.warning);
      return;
    }

    console.log(`%cFound ${cookieCount} cookie(s)`, styles.info);
    console.log('');

    // Display as table
    const cookieTable = Object.entries(cookies).map(([name, value]) => ({
      Name: name,
      Value: value.length > 50 ? value.substring(0, 50) + '...' : value,
      Length: value.length,
    }));

    console.table(cookieTable);

    // Highlight auth-related cookies
    const authCookies = ['admin_session', 'sb-access-token', 'sb-refresh-token'];
    const foundAuthCookies = authCookies.filter(name => cookies[name]);

    if (foundAuthCookies.length > 0) {
      console.log('%c✓ Auth cookies found:', styles.success, foundAuthCookies.join(', '));
    } else {
      console.log('%c⚠ No auth cookies found', styles.warning);
    }

    // Try to parse JWT tokens
    console.log('');
    console.log('%cJWT Token Analysis:', styles.subheader);

    foundAuthCookies.forEach(cookieName => {
      const token = cookies[cookieName];
      if (token && token.includes('.')) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            // JWT format
            const payload = JSON.parse(atob(parts[1]));
            console.log(`\n%c${cookieName}:`, styles.code);
            console.table({
              'Token Type': 'JWT',
              'Issued At': payload.iat ? new Date(payload.iat * 1000).toLocaleString() : 'N/A',
              'Expires At': payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'N/A',
              'Subject': payload.sub || 'N/A',
              'Email': payload.email || 'N/A',
              'Role': payload.role || 'N/A',
            });

            // Check if expired
            if (payload.exp) {
              const now = Date.now() / 1000;
              if (now > payload.exp) {
                console.log('%c⚠ Token is EXPIRED', styles.error);
              } else {
                const timeLeft = Math.round((payload.exp - now) / 60);
                console.log(`%c✓ Token is valid (${timeLeft} minutes remaining)`, styles.success);
              }
            }
          }
        } catch (e) {
          console.log(`%c${cookieName}: Not a valid JWT or cannot parse`, styles.info);
        }
      }
    });

    console.log('');
    console.log('%cNote:', styles.info, 'HttpOnly cookies cannot be read via JavaScript (this is normal for security)');
    console.log('%cTo see HttpOnly cookies:', styles.info, 'Open DevTools > Application > Cookies');
    console.log('');

    return cookies;
  }

  function showStorage() {
    console.log('%c💾 STORAGE INSPECTOR', styles.header);
    console.log('');

    // LocalStorage
    console.log('%cLocalStorage:', styles.subheader);
    if (localStorage.length === 0) {
      console.log('%c  Empty', styles.info);
    } else {
      const localData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        localData[key] = value;
      }
      console.table(localData);

      // Highlight auth-related items
      const authKeys = Object.keys(localData).filter(key =>
        key.toLowerCase().includes('auth') ||
        key.toLowerCase().includes('session') ||
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('supabase')
      );

      if (authKeys.length > 0) {
        console.log('%c  Auth-related keys:', styles.success, authKeys.join(', '));
      }
    }

    console.log('');

    // SessionStorage
    console.log('%cSessionStorage:', styles.subheader);
    if (sessionStorage.length === 0) {
      console.log('%c  Empty', styles.info);
    } else {
      const sessionData = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        sessionData[key] = value;
      }
      console.table(sessionData);
    }

    console.log('');
  }

  function monitorRequests() {
    console.log('%c🔍 REQUEST MONITOR', styles.header);
    console.log('');
    console.log('%cMonitoring all fetch requests...', styles.info);
    console.log('%cTo stop:', styles.info, 'Call stopMonitoring()');
    console.log('');

    // Store original fetch
    const originalFetch = window.fetch;
    let requestCount = 0;

    // Override fetch
    window.fetch = async function(...args) {
      requestCount++;
      const requestId = requestCount;
      const [url, options = {}] = args;

      console.log(`%c[${requestId}] → REQUEST`, styles.info);
      console.log(`  URL: ${url}`);
      console.log(`  Method: ${options.method || 'GET'}`);
      if (options.headers) {
        console.log('  Headers:', options.headers);
      }
      if (options.body) {
        console.log('  Body:', options.body);
      }

      const startTime = performance.now();

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        console.log(`%c[${requestId}] ← RESPONSE (${duration}ms)`, response.ok ? styles.success : styles.error);
        console.log(`  Status: ${response.status} ${response.statusText}`);

        // Show response headers
        const headers = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        console.log('  Headers:', headers);

        // Try to clone and read body
        const clonedResponse = response.clone();
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await clonedResponse.json();
            console.log('  Body:', data);
          }
        } catch (e) {
          // Body not JSON or already consumed
        }

        console.log('');

        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        console.log(`%c[${requestId}] ✗ ERROR (${duration}ms)`, styles.error);
        console.log(`  ${error.message}`);
        console.log('');

        throw error;
      }
    };

    // Store stop function
    window.stopMonitoring = function() {
      window.fetch = originalFetch;
      console.log('%c✓ Request monitoring stopped', styles.success);
      delete window.stopMonitoring;
    };
  }

  async function traceRedirects() {
    console.log('%c🔀 REDIRECT TRACER', styles.header);
    console.log('');

    const testUrls = [
      '/admin',
      '/admin/login',
      '/admin/dashboard',
    ];

    for (const url of testUrls) {
      console.log(`%cTesting: ${url}`, styles.subheader);

      try {
        const response = await fetch(url, {
          redirect: 'manual',
        });

        console.log(`  Status: ${response.status} ${response.statusText}`);
        console.log(`  Type: ${response.type}`);

        if (response.status === 302 || response.status === 307 || response.type === 'opaqueredirect') {
          const location = response.headers.get('location');
          console.log(`  %c→ Redirects to: ${location}`, styles.warning);
        } else if (response.status === 200) {
          console.log(`  %c✓ Direct access`, styles.success);
        } else {
          console.log(`  %c⚠ Unexpected status`, styles.error);
        }
      } catch (error) {
        console.log(`  %c✗ Error: ${error.message}`, styles.error);
      }

      console.log('');
    }
  }

  function clearAuth() {
    console.log('%c🗑️ CLEAR AUTH DATA', styles.header);
    console.log('');

    let cleared = [];

    // Clear cookies
    const cookieNames = ['admin_session', 'sb-access-token', 'sb-refresh-token'];
    cookieNames.forEach(name => {
      if (getCookie(name)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        cleared.push(`Cookie: ${name}`);
      }
    });

    // Clear localStorage auth items
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('auth') ||
        key.includes('session') ||
        key.includes('token') ||
        key.includes('supabase')
      )) {
        localStorage.removeItem(key);
        cleared.push(`LocalStorage: ${key}`);
      }
    }

    // Clear sessionStorage
    sessionStorage.clear();
    if (sessionStorage.length > 0) {
      cleared.push('SessionStorage: all items');
    }

    if (cleared.length > 0) {
      console.log('%c✓ Cleared:', styles.success);
      cleared.forEach(item => console.log(`  - ${item}`));
    } else {
      console.log('%c⚠ No auth data found to clear', styles.warning);
    }

    console.log('');
    console.log('%cReload the page to apply changes', styles.info);
  }

  function validateSession() {
    console.log('%c✅ SESSION VALIDATOR', styles.header);
    console.log('');

    const cookies = getAllCookies();
    const authCookies = ['admin_session', 'sb-access-token', 'sb-refresh-token'];
    const foundCookies = authCookies.filter(name => cookies[name]);

    console.log('%cAuth Status:', styles.subheader);
    console.log('');

    if (foundCookies.length === 0) {
      console.log('%c✗ NOT AUTHENTICATED', styles.error);
      console.log('%c  No auth cookies found', styles.info);
      return false;
    }

    console.log(`%c✓ Auth cookies present: ${foundCookies.join(', ')}`, styles.success);
    console.log('');

    // Check JWT expiry
    const accessToken = cookies['sb-access-token'];
    if (accessToken && accessToken.includes('.')) {
      try {
        const parts = accessToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));

          if (payload.exp) {
            const now = Date.now() / 1000;
            const timeLeft = payload.exp - now;

            if (timeLeft > 0) {
              const minutes = Math.round(timeLeft / 60);
              console.log(`%c✓ Session valid (expires in ${minutes} minutes)`, styles.success);
              return true;
            } else {
              console.log('%c✗ Session EXPIRED', styles.error);
              return false;
            }
          }
        }
      } catch (e) {
        console.log('%c⚠ Could not parse token', styles.warning);
      }
    }

    console.log('%c✓ Session appears valid', styles.success);
    return true;
  }

  async function testLoginEndpoint() {
    console.log('%c🔐 LOGIN ENDPOINT TESTER', styles.header);
    console.log('');

    const email = prompt('Enter email:', 'admin@southwestresumeservices.com');
    if (!email) return;

    const password = prompt('Enter password:', 'admin123');
    if (!password) return;

    console.log(`%cTesting login with ${email}...`, styles.info);
    console.log('');

    try {
      const startTime = performance.now();

      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const data = await response.json();

      console.log(`%cResponse (${duration}ms):`, styles.subheader);
      console.log(`  Status: ${response.status} ${response.statusText}`);
      console.log('  Body:', data);

      // Show headers
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('  Headers:', headers);

      console.log('');

      if (response.ok) {
        console.log('%c✓ Login successful!', styles.success);

        // Show updated cookies
        console.log('');
        showCookies();
      } else {
        console.log('%c✗ Login failed', styles.error);
      }
    } catch (error) {
      console.log(`%c✗ Error: ${error.message}`, styles.error);
    }

    console.log('');
  }

  async function debugAdminAuth() {
    console.log('%c🔧 FULL DIAGNOSTIC', styles.header);
    console.log('');
    console.log('%cRunning comprehensive admin auth diagnostic...', styles.info);
    console.log('');

    // 1. Check current page
    console.log('%c1. Current Location:', styles.subheader);
    console.log(`   URL: ${window.location.href}`);
    console.log(`   Path: ${window.location.pathname}`);
    console.log('');

    // 2. Validate session
    console.log('%c2. Session Validation:', styles.subheader);
    const isValid = validateSession();
    console.log('');

    // 3. Show cookies
    console.log('%c3. Cookies:', styles.subheader);
    showCookies();

    // 4. Show storage
    console.log('%c4. Storage:', styles.subheader);
    showStorage();

    // 5. Test endpoints
    console.log('%c5. Endpoint Availability:', styles.subheader);
    const endpoints = [
      '/api/admin/auth/login',
      '/api/admin/logout',
      '/admin',
      '/admin/login',
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, { method: 'HEAD' });
        const status = response.status;
        const icon = status < 400 ? '✓' : '✗';
        const style = status < 400 ? styles.success : styles.error;
        console.log(`%c  ${icon} ${endpoint}: ${status}`, style);
      } catch (error) {
        console.log(`%c  ✗ ${endpoint}: ${error.message}`, styles.error);
      }
    }

    console.log('');

    // 6. Summary
    console.log('%c6. Summary:', styles.subheader);
    if (isValid) {
      console.log('%c  ✓ Authenticated', styles.success);
      console.log('%c  You should have access to admin pages', styles.info);
    } else {
      console.log('%c  ✗ Not authenticated', styles.error);
      console.log('%c  You need to log in to access admin pages', styles.info);
    }

    console.log('');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.info);
    console.log('');
  }

  // Export to global scope
  window.debugAdminAuth = debugAdminAuth;
  window.showCookies = showCookies;
  window.showStorage = showStorage;
  window.monitorRequests = monitorRequests;
  window.traceRedirects = traceRedirects;
  window.clearAuth = clearAuth;
  window.validateSession = validateSession;
  window.testLoginEndpoint = testLoginEndpoint;

  // Show instructions
  console.log('%c🔧 ADMIN AUTH DEBUG TOOLS LOADED', 'background: #3B82F6; color: white; padding: 8px 16px; font-weight: bold; font-size: 16px; border-radius: 4px;');
  console.log('');
  console.log('%cAvailable Commands:', 'color: #3B82F6; font-weight: bold; font-size: 14px;');
  console.log('');
  console.log('%c  debugAdminAuth()     ', styles.code, '- Run full diagnostic');
  console.log('%c  showCookies()        ', styles.code, '- Display all cookies');
  console.log('%c  showStorage()        ', styles.code, '- Display localStorage and sessionStorage');
  console.log('%c  monitorRequests()    ', styles.code, '- Monitor network requests');
  console.log('%c  traceRedirects()     ', styles.code, '- Trace redirect chain');
  console.log('%c  validateSession()    ', styles.code, '- Check if session is valid');
  console.log('%c  testLoginEndpoint()  ', styles.code, '- Test login with credentials');
  console.log('%c  clearAuth()          ', styles.code, '- Clear all auth data');
  console.log('');
  console.log('%cQuick Start:', 'color: #10B981; font-weight: bold;');
  console.log('%c  debugAdminAuth()', 'background: #10B981; color: white; padding: 4px 8px; border-radius: 3px; font-weight: bold;');
  console.log('');

})();
