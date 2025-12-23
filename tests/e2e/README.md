# E2E Testing with Playwright

This directory contains end-to-end tests for the SRS Website using Playwright.

## Overview

The E2E test suite covers critical user journeys and validates the application's behavior in a real browser environment.

### Test Coverage

1. **Admin Login Flow** (`admin-login.spec.ts`)
   - Page load and rendering
   - Form validation
   - Invalid credentials handling
   - Loading states
   - Rate limiting
   - Accessibility compliance

2. **Questionnaire Token Access** (`questionnaire-access.spec.ts`)
   - Token verification
   - Invalid/expired token handling
   - Error states
   - Security validation
   - Accessibility features

## Project Structure

```
tests/e2e/
├── README.md                          # This file
├── admin-login.spec.ts                # Admin login tests
├── questionnaire-access.spec.ts       # Questionnaire access tests
└── pages/                             # Page Object Models
    ├── AdminLoginPage.ts              # Admin login page POM
    └── QuestionnairePage.ts           # Questionnaire page POM
```

## Getting Started

### Prerequisites

- Node.js >= 18.17.0
- npm installed

### Installation

1. Install Playwright browsers (first time only):

```bash
npm run playwright:install
```

This will download all required browser binaries (Chromium, Firefox, WebKit).

### Running Tests

#### Run all E2E tests (headless mode):

```bash
npm run test:e2e
```

#### Run tests with UI mode (interactive):

```bash
npm run test:e2e:ui
```

#### Run tests in headed mode (see browser):

```bash
npm run test:e2e:headed
```

#### Debug tests step-by-step:

```bash
npm run test:e2e:debug
```

#### Run tests on specific browser:

```bash
npm run test:e2e:chromium    # Chrome/Chromium only
npm run test:e2e:firefox     # Firefox only
npm run test:e2e:webkit      # Safari/WebKit only
npm run test:e2e:mobile      # Mobile viewports only
```

#### View test report:

```bash
npm run test:e2e:report
```

## Page Object Model Pattern

We use the Page Object Model (POM) pattern to:

- Encapsulate page interactions
- Improve test maintainability
- Reduce code duplication
- Make tests more readable

Example:

```typescript
import { AdminLoginPage } from './pages/AdminLoginPage';

test('should login successfully', async ({ page }) => {
  const loginPage = new AdminLoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await loginPage.waitForNavigation();
});
```

## Test Isolation

Each test runs in a fresh browser context, ensuring:

- No shared state between tests
- Independent test execution
- Reliable and repeatable results

## Writing New Tests

### 1. Create or update Page Object Model

```typescript
// tests/e2e/pages/NewPage.ts
import { Page, Locator } from '@playwright/test';

export class NewPage {
  readonly page: Page;
  readonly someElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.someElement = page.locator('#element');
  }

  async performAction() {
    await this.someElement.click();
  }
}
```

### 2. Create test file

```typescript
// tests/e2e/new-feature.spec.ts
import { test, expect } from '@playwright/test';
import { NewPage } from './pages/NewPage';

test.describe('New Feature', () => {
  test('should work correctly', async ({ page }) => {
    const newPage = new NewPage(page);
    await newPage.performAction();
    // assertions...
  });
});
```

## Configuration

Test configuration is in `playwright.config.ts` at the project root.

### Key Settings

- **Base URL**: `http://localhost:3000` (configurable via `PLAYWRIGHT_TEST_BASE_URL`)
- **Timeout**: 30 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Screenshot**: Only on failure
- **Video**: Retained on failure
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

### Environment Variables

- `PLAYWRIGHT_TEST_BASE_URL`: Override base URL (default: `http://localhost:3000`)
- `CI`: Enables CI-specific settings (retries, single worker)
- `TEST_ADMIN_EMAIL`: Email for successful login tests (optional)
- `TEST_ADMIN_PASSWORD`: Password for successful login tests (optional)
- `TEST_QUESTIONNAIRE_TOKEN`: Valid token for questionnaire tests (optional)

## CI/CD Integration

Tests are configured to run in CI environments:

- Automatic retries on failure (2 attempts)
- Single worker for stability
- JUnit XML report generation
- HTML report generation

Example GitHub Actions workflow:

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npm run playwright:install

- name: Run E2E tests
  run: npm run test:e2e
  env:
    CI: true

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Debugging Tests

### Using UI Mode (Recommended)

```bash
npm run test:e2e:ui
```

Features:
- Time travel through test execution
- Watch mode
- Visual debugging
- DOM snapshots

### Using Debug Mode

```bash
npm run test:e2e:debug
```

Features:
- Playwright Inspector
- Step through tests
- Record new tests
- Generate code

### Using Trace Viewer

Traces are automatically captured on first retry. View them:

```bash
npx playwright show-trace trace.zip
```

## Best Practices

1. **Use Page Object Models**: Keep test logic separate from page interactions
2. **Test Isolation**: Each test should be independent
3. **Descriptive Names**: Use clear test and variable names
4. **Accessibility**: Test keyboard navigation and screen reader compatibility
5. **Error States**: Always test error scenarios
6. **Mobile Testing**: Include mobile viewport tests
7. **Screenshots**: Let Playwright auto-capture on failure
8. **Assertions**: Use Playwright's auto-waiting assertions

## Common Issues

### Tests timing out

- Increase timeout in test: `test.setTimeout(60000)`
- Check network requests in trace viewer
- Verify element selectors are correct

### Elements not found

- Use `waitFor()` for dynamic content
- Check selector specificity
- Verify element is actually rendered

### Flaky tests

- Use auto-waiting locators
- Avoid fixed `waitForTimeout()`
- Ensure proper test isolation

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Debugging Guide](https://playwright.dev/docs/debug)

## Support

For questions or issues with E2E tests, please:

1. Check this README
2. Review Playwright documentation
3. Check test output and traces
4. Contact the development team
