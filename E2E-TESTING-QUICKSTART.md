# E2E Testing Quick Start Guide

## Overview

This project now includes comprehensive E2E testing using Playwright for Next.js 15.

## Installation

### 1. Install Playwright Browsers (One-Time Setup)

```bash
npm run playwright:install
```

This downloads Chromium, Firefox, and WebKit browsers (~400MB).

## Running Tests

### Quick Test Commands

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with visual UI (recommended for development)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug tests step-by-step
npm run test:e2e:debug
```

### Browser-Specific Tests

```bash
# Test in Chrome only
npm run test:e2e:chromium

# Test in Firefox only
npm run test:e2e:firefox

# Test in Safari/WebKit only
npm run test:e2e:webkit

# Test mobile viewports
npm run test:e2e:mobile
```

### View Test Reports

```bash
# Open HTML test report
npm run test:e2e:report
```

## Test Coverage

### 1. Admin Login Tests (`admin-login.spec.ts`)

- Page load and rendering
- Form validation (required fields, email format)
- Invalid credentials handling
- Loading states and UI feedback
- Rate limiting behavior
- Accessibility compliance (ARIA, labels, keyboard navigation)
- Touch target sizes for mobile
- Security notices

**Test Count**: 14 tests

### 2. Questionnaire Access Tests (`questionnaire-access.spec.ts`)

- Token verification flow
- Invalid/expired token handling
- Missing token handling
- Error state messaging
- Security validation (no data leaks)
- Accessibility features
- Mobile responsiveness
- Special character handling

**Test Count**: 19 tests

### Total: 33 E2E Tests

## Project Structure

```
/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/
├── playwright.config.ts              # Playwright configuration
├── tests/
│   └── e2e/
│       ├── README.md                 # Detailed documentation
│       ├── .env.example              # Environment variables template
│       ├── admin-login.spec.ts       # Admin login tests
│       ├── questionnaire-access.spec.ts  # Questionnaire tests
│       └── pages/
│           ├── AdminLoginPage.ts     # Admin login Page Object
│           └── QuestionnairePage.ts  # Questionnaire Page Object
└── package.json                      # Updated with E2E scripts
```

## Configuration Highlights

- **Browsers**: Tests run on Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Parallel Execution**: Tests run in parallel for speed
- **Auto-retry**: 2 retries on CI, 0 locally
- **Screenshots**: Captured automatically on failure
- **Videos**: Recorded and kept on failure
- **Dev Server**: Automatically starts Next.js dev server on port 3000

## Development Workflow

### 1. Write Tests

Use Page Object Model pattern:

```typescript
import { test, expect } from '@playwright/test';
import { AdminLoginPage } from './pages/AdminLoginPage';

test('my new test', async ({ page }) => {
  const loginPage = new AdminLoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  // assertions...
});
```

### 2. Run in UI Mode

```bash
npm run test:e2e:ui
```

Benefits:
- Visual feedback
- Time-travel debugging
- Watch mode
- DOM inspector

### 3. Debug Failures

```bash
npm run test:e2e:debug
```

Features:
- Step through tests
- Inspect elements
- Record actions

## CI/CD Integration

Tests are configured for CI environments:

```yaml
# GitHub Actions example
- name: Install dependencies
  run: npm ci

- name: Install Playwright
  run: npm run playwright:install

- name: Run E2E tests
  run: npm run test:e2e
  env:
    CI: true

- name: Upload report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Optional: Running Successful Authentication Tests

Some tests are skipped by default because they require valid credentials:

1. Create test admin user in Supabase
2. Create `.env.local` in project root:

```bash
TEST_ADMIN_EMAIL=admin@test.com
TEST_ADMIN_PASSWORD=TestPassword123!
TEST_QUESTIONNAIRE_TOKEN=your-valid-token
```

3. Remove `.skip()` from tests in:
   - `admin-login.spec.ts` → "Admin Login Success Flow" describe block
   - `questionnaire-access.spec.ts` → "Questionnaire Valid Token Access" describe block

## Best Practices

1. **Test Isolation**: Each test runs in fresh browser context
2. **Page Objects**: Keep selectors and actions in page objects
3. **Auto-waiting**: Playwright waits automatically, avoid manual waits
4. **Accessibility**: Tests include ARIA, keyboard navigation checks
5. **Mobile**: Tests run on desktop and mobile viewports

## Troubleshooting

### Tests fail with "Cannot find base URL"

Make sure dev server is running:
```bash
npm run dev
```

Or let Playwright start it automatically (default behavior).

### Browsers not installed

Run:
```bash
npm run playwright:install
```

### Tests are flaky

- Check for race conditions
- Use Playwright's auto-waiting locators
- Review trace files: `npx playwright show-trace trace.zip`

### Element not found

- Verify selector in UI mode
- Check if element is in shadow DOM
- Ensure element is actually rendered

## Performance

- **Parallel execution**: Tests run concurrently for speed
- **Test isolation**: Each test gets fresh browser context
- **Smart waiting**: No arbitrary timeouts

Typical run time: 30-60 seconds for all 33 tests (parallel execution)

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Full E2E README](./tests/e2e/README.md)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

## Next Steps

1. Install browsers: `npm run playwright:install`
2. Run tests: `npm run test:e2e:ui`
3. Review test reports
4. Add more tests as needed
5. Integrate with CI/CD pipeline

## Support

For issues or questions:
1. Check `tests/e2e/README.md` for detailed documentation
2. Review Playwright docs
3. Check test output and traces
4. Contact development team
