#!/usr/bin/env node

/**
 * ADMIN AUTHENTICATION MONITORING SCRIPT
 *
 * Server-side monitoring for admin authentication activity
 * Tracks login attempts, rate limiting, and session management
 *
 * Usage:
 *   node monitor-auth.js [options]
 *
 * Options:
 *   --watch       Watch mode (continuous monitoring)
 *   --interval N  Check every N seconds (default: 5)
 *   --verbose     Show detailed output
 *   --alerts      Show only alerts/warnings
 *
 * Examples:
 *   node monitor-auth.js --watch
 *   node monitor-auth.js --watch --interval 10 --verbose
 *   node monitor-auth.js --alerts
 */

const http = require('http');
const https = require('https');
const readline = require('readline');

// Configuration
const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  interval: 5000, // 5 seconds
  watch: false,
  verbose: false,
  alertsOnly: false,
};

// Parse command line arguments
process.argv.slice(2).forEach((arg, index, args) => {
  if (arg === '--watch') config.watch = true;
  if (arg === '--interval') config.interval = parseInt(args[index + 1]) * 1000;
  if (arg === '--verbose') config.verbose = true;
  if (arg === '--alerts') config.alertsOnly = true;
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// State tracking
const state = {
  totalRequests: 0,
  successfulLogins: 0,
  failedLogins: 0,
  rateLimitHits: 0,
  activeSessions: 0,
  lastCheckTime: null,
  alerts: [],
};

// Helper functions
function log(message, color = colors.reset) {
  if (!config.alertsOnly) {
    console.log(`${color}${message}${colors.reset}`);
  }
}

function logVerbose(message) {
  if (config.verbose && !config.alertsOnly) {
    console.log(`${colors.cyan}[VERBOSE] ${message}${colors.reset}`);
  }
}

function logAlert(message, severity = 'info') {
  const severityColors = {
    info: colors.blue,
    warning: colors.yellow,
    error: colors.red,
  };
  const color = severityColors[severity] || colors.reset;
  console.log(`${color}[${severity.toUpperCase()}] ${message}${colors.reset}`);
  state.alerts.push({
    time: new Date().toISOString(),
    severity,
    message,
  });
}

function clearLine() {
  if (process.stdout.isTTY && !config.verbose) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
  }
}

function printHeader() {
  console.log(`${colors.bright}${colors.blue}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}  ADMIN AUTHENTICATION MONITOR${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}${'='.repeat(70)}${colors.reset}`);
  console.log('');
  log(`Monitoring: ${config.baseUrl}`, colors.cyan);
  log(`Interval: ${config.interval / 1000}s`, colors.cyan);
  log(`Mode: ${config.watch ? 'Continuous' : 'Single check'}`, colors.cyan);
  console.log('');
}

function printStats() {
  console.log(`${colors.bright}Statistics:${colors.reset}`);
  console.log(`  Total Requests:      ${state.totalRequests}`);
  console.log(`  ${colors.green}Successful Logins:   ${state.successfulLogins}${colors.reset}`);
  console.log(`  ${colors.red}Failed Logins:       ${state.failedLogins}${colors.reset}`);
  console.log(`  ${colors.yellow}Rate Limit Hits:     ${state.rateLimitHits}${colors.reset}`);
  console.log(`  Active Sessions:     ${state.activeSessions}`);
  console.log('');
}

function printAlerts() {
  if (state.alerts.length > 0) {
    console.log(`${colors.bright}${colors.yellow}Recent Alerts:${colors.reset}`);
    state.alerts.slice(-5).forEach(alert => {
      const time = new Date(alert.time).toLocaleTimeString();
      console.log(`  [${time}] ${alert.severity.toUpperCase()}: ${alert.message}`);
    });
    console.log('');
  }
}

// API check functions
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, config.baseUrl);
    const protocol = url.protocol === 'https:' ? https : http;

    const requestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 5000,
    };

    const req = protocol.request(requestOptions, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function checkLoginEndpoint() {
  try {
    logVerbose('Checking login endpoint...');

    // Try a test login to check endpoint health
    const response = await makeRequest('/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'monitor-health-check@example.com',
        password: 'test',
      }),
    });

    state.totalRequests++;

    // Should return 401 (expected for wrong credentials)
    if (response.status === 401) {
      logVerbose('Login endpoint: Healthy (401 returned)');
      return { healthy: true, status: 401 };
    }

    // Rate limited
    if (response.status === 429) {
      logVerbose('Login endpoint: Rate limited (429)');
      state.rateLimitHits++;

      // Parse retry-after from response
      let retryAfter = 'unknown';
      try {
        const body = JSON.parse(response.body);
        retryAfter = body.retryAfter || 'unknown';
      } catch (e) {
        // Ignore parse errors
      }

      logAlert(
        `Rate limit active on login endpoint (retry after: ${retryAfter}s)`,
        'warning'
      );

      return { healthy: true, status: 429, rateLimited: true };
    }

    // Unexpected status
    logAlert(
      `Unexpected status from login endpoint: ${response.status}`,
      'warning'
    );

    return { healthy: false, status: response.status };
  } catch (error) {
    logAlert(`Login endpoint check failed: ${error.message}`, 'error');
    return { healthy: false, error: error.message };
  }
}

async function checkAdminPage() {
  try {
    logVerbose('Checking admin page...');

    const response = await makeRequest('/admin', {
      method: 'GET',
    });

    // Should redirect (302/307) or show login page (200) without auth
    if (response.status === 302 || response.status === 307 || response.status === 200) {
      logVerbose(`Admin page: Protected (${response.status})`);
      return { protected: true, status: response.status };
    }

    logAlert(
      `Admin page may not be protected properly: ${response.status}`,
      'warning'
    );

    return { protected: false, status: response.status };
  } catch (error) {
    logAlert(`Admin page check failed: ${error.message}`, 'error');
    return { protected: false, error: error.message };
  }
}

async function checkServerHealth() {
  try {
    logVerbose('Checking server health...');

    const response = await makeRequest('/', {
      method: 'GET',
    });

    if (response.status === 200) {
      logVerbose('Server: Healthy (200)');
      return { healthy: true };
    }

    logAlert(`Server returned unexpected status: ${response.status}`, 'warning');
    return { healthy: false, status: response.status };
  } catch (error) {
    logAlert(`Server health check failed: ${error.message}`, 'error');
    return { healthy: false, error: error.message };
  }
}

async function testRateLimiting() {
  log('\nTesting rate limiting...', colors.yellow);

  const testEmail = `rate-limit-test-${Date.now()}@example.com`;
  let attempts = 0;
  let rateLimitTriggered = false;

  for (let i = 1; i <= 6; i++) {
    try {
      const response = await makeRequest('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: 'wrong',
        }),
      });

      attempts++;

      if (response.status === 429) {
        rateLimitTriggered = true;
        log(`  Attempt ${i}: Rate limited (429) ✓`, colors.green);
        break;
      } else if (response.status === 401) {
        log(`  Attempt ${i}: Failed (401) - ${6 - i} remaining`, colors.cyan);
      } else {
        log(`  Attempt ${i}: Unexpected (${response.status})`, colors.yellow);
      }

      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      log(`  Attempt ${i}: Error - ${error.message}`, colors.red);
    }
  }

  console.log('');

  if (rateLimitTriggered) {
    log(`✓ Rate limiting working (triggered after ${attempts} attempts)`, colors.green);
  } else {
    logAlert('Rate limiting may not be working properly', 'error');
  }
}

async function testAuthentication() {
  log('\nTesting authentication flow...', colors.yellow);

  // Test 1: Invalid credentials
  log('  Test 1: Invalid credentials...', colors.cyan);
  try {
    const response = await makeRequest('/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'wrong@example.com',
        password: 'wrong',
      }),
    });

    if (response.status === 401) {
      log('    ✓ Correctly rejected (401)', colors.green);
    } else {
      log(`    ✗ Unexpected status: ${response.status}`, colors.red);
    }
  } catch (error) {
    log(`    ✗ Error: ${error.message}`, colors.red);
  }

  // Test 2: Valid credentials (if env vars set)
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    log('  Test 2: Valid credentials...', colors.cyan);
    try {
      const response = await makeRequest('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      });

      if (response.status === 200) {
        log('    ✓ Login successful (200)', colors.green);
        state.successfulLogins++;

        // Check for Set-Cookie header
        if (response.headers['set-cookie']) {
          log('    ✓ Cookie set', colors.green);
        } else {
          log('    ✗ No cookie in response', colors.red);
        }
      } else {
        log(`    ✗ Login failed: ${response.status}`, colors.red);
        state.failedLogins++;
      }
    } catch (error) {
      log(`    ✗ Error: ${error.message}`, colors.red);
    }
  } else {
    log('  Test 2: Skipped (no credentials in env)', colors.yellow);
  }

  // Test 3: Malformed request
  log('  Test 3: Malformed request...', colors.cyan);
  try {
    const response = await makeRequest('/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        // Missing password
      }),
    });

    if (response.status === 400) {
      log('    ✓ Correctly rejected malformed request (400)', colors.green);
    } else {
      log(`    ✗ Unexpected status: ${response.status}`, colors.red);
    }
  } catch (error) {
    log(`    ✗ Error: ${error.message}`, colors.red);
  }

  console.log('');
}

async function runChecks() {
  if (!config.alertsOnly) {
    clearLine();
    log(`[${new Date().toLocaleTimeString()}] Running checks...`, colors.cyan);
  }

  state.lastCheckTime = new Date();

  // Run all checks in parallel
  const [serverHealth, loginHealth, adminPage] = await Promise.all([
    checkServerHealth(),
    checkLoginEndpoint(),
    checkAdminPage(),
  ]);

  // Analyze results
  if (!serverHealth.healthy) {
    logAlert('Server is not responding', 'error');
  }

  if (!loginHealth.healthy && !loginHealth.rateLimited) {
    logAlert('Login endpoint is not responding correctly', 'error');
  }

  if (!adminPage.protected) {
    logAlert('Admin page may not be properly protected', 'error');
  }

  // Update stats
  if (loginHealth.rateLimited) {
    state.rateLimitHits++;
  }

  if (!config.watch && !config.alertsOnly) {
    console.log('');
    printStats();
    printAlerts();
  }
}

async function watchMode() {
  log('Starting continuous monitoring...', colors.green);
  log('Press Ctrl+C to stop', colors.yellow);
  console.log('');

  // Run initial check
  await runChecks();

  // Set up interval
  const intervalId = setInterval(async () => {
    await runChecks();
  }, config.interval);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('');
    log('\nStopping monitor...', colors.yellow);
    clearInterval(intervalId);

    console.log('');
    printStats();
    printAlerts();

    log('Monitor stopped', colors.green);
    process.exit(0);
  });
}

// Main execution
async function main() {
  printHeader();

  // Check if server is reachable
  try {
    const health = await checkServerHealth();
    if (!health.healthy) {
      logAlert(`Cannot connect to ${config.baseUrl}`, 'error');
      log('Please ensure the development server is running', colors.yellow);
      process.exit(1);
    }
  } catch (error) {
    logAlert(`Cannot connect to ${config.baseUrl}`, 'error');
    log('Please ensure the development server is running', colors.yellow);
    process.exit(1);
  }

  log(`✓ Server is reachable at ${config.baseUrl}`, colors.green);
  console.log('');

  if (config.watch) {
    await watchMode();
  } else {
    // Single check mode - run all tests
    await runChecks();
    await testAuthentication();
    await testRateLimiting();

    console.log('');
    log('Monitoring complete', colors.green);
  }
}

// Run
main().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
