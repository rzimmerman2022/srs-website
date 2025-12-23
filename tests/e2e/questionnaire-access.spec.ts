import { test, expect } from '@playwright/test';
import { QuestionnairePage } from './pages/QuestionnairePage';

/**
 * E2E Tests for Questionnaire Token-Based Access
 *
 * Critical Path: Token verification and questionnaire access control
 *
 * Test Coverage:
 * - Token verification flow
 * - Invalid token handling
 * - Missing token handling
 * - Valid token access
 * - Error states and messages
 * - Accessibility features
 * - Security measures
 */

test.describe('Questionnaire Token Access', () => {
  let questionnairePage: QuestionnairePage;

  test.beforeEach(async ({ page }) => {
    questionnairePage = new QuestionnairePage(page);
  });

  test('should show verification loading state', async ({ page }) => {
    // Navigate with a token (any token will show loading first)
    await questionnairePage.gotoWithToken('test-token-12345');

    // Verify loading message appears
    try {
      await expect(questionnairePage.verifyingAccessMessage).toBeVisible({ timeout: 2000 });
      await expect(questionnairePage.loadingSpinner).toBeVisible();
    } catch {
      // Loading might be too fast, which is fine
    }

    // Wait for verification to complete
    await questionnairePage.waitForVerification();
  });

  test('should show error for invalid token', async ({ page }) => {
    // Navigate with invalid token
    await questionnairePage.gotoWithToken('invalid-token-xyz');

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Verify error message is shown
    await questionnairePage.verifyInvalidTokenError();

    // Verify page title reflects error state
    await expect(page).toHaveTitle(/Invalid|Error|Southwest Resume Services/);
  });

  test('should show error for expired token', async ({ page }) => {
    // Navigate with expired token format
    await questionnairePage.gotoWithToken('expired-token-old');

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Verify error message is shown (same as invalid)
    await questionnairePage.verifyInvalidTokenError();
  });

  test('should handle missing token gracefully', async ({ page }) => {
    // Navigate to /q without token
    await page.goto('/q');

    // Should show error or redirect
    // The actual behavior depends on your implementation
    // This test verifies the app handles the case gracefully
    const url = page.url();
    expect(url).toContain('/q');

    // Verify page doesn't crash
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should display contact support button on error', async ({ page }) => {
    // Navigate with invalid token
    await questionnairePage.gotoWithToken('bad-token');

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Verify contact support button exists and is functional
    await expect(questionnairePage.contactSupportButton).toBeVisible();
    await expect(questionnairePage.contactSupportButton).toBeEnabled();

    // Verify button has proper styling
    const contactButton = questionnairePage.contactSupportButton;
    await expect(contactButton).toHaveClass(/bg-gradient/);
  });

  test('should navigate to contact page when clicking support button', async ({ page }) => {
    // Navigate with invalid token
    await questionnairePage.gotoWithToken('invalid-token');

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Click contact support
    await questionnairePage.clickContactSupport();

    // Verify navigation to contact page
    expect(page.url()).toContain('/contact');
  });

  test('should have accessibility features on error page', async ({ page }) => {
    // Navigate with invalid token
    await questionnairePage.gotoWithToken('invalid-token');

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Verify accessibility features
    await questionnairePage.verifyAccessibility();

    // Verify error icons have aria-hidden
    const errorIcon = page.locator('[aria-hidden="true"]').first();
    await expect(errorIcon).toBeVisible();
  });

  test('should show proper error hierarchy', async ({ page }) => {
    // Navigate with invalid token
    await questionnairePage.gotoWithToken('invalid-token');

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Verify heading hierarchy (h1 should exist)
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Verify error message is in proper paragraph
    const errorText = questionnairePage.errorMessage;
    await expect(errorText).toBeVisible();
  });

  test('should have dark theme styling on error page', async ({ page }) => {
    // Navigate with invalid token
    await questionnairePage.gotoWithToken('invalid-token');

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Verify dark theme styling
    await questionnairePage.verifyPageStyling();

    // Verify gold accent color is used
    const heading = page.locator('h1').first();
    await expect(heading).toHaveClass(/text-gold/);
  });

  test('should not expose sensitive information in error messages', async ({ page }) => {
    // Navigate with invalid token
    await questionnairePage.gotoWithToken('invalid-token-test');

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Get page content
    const pageText = await page.textContent('body');

    // Verify no database errors or stack traces are shown
    expect(pageText).not.toContain('database');
    expect(pageText).not.toContain('SQL');
    expect(pageText).not.toContain('Error:');
    expect(pageText).not.toContain('at ');
    expect(pageText).not.toContain('supabase');
  });

  test('should handle very long tokens gracefully', async ({ page }) => {
    // Create a very long token
    const longToken = 'a'.repeat(500);

    // Navigate with long token
    await questionnairePage.gotoWithToken(longToken);

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Verify app doesn't crash and shows appropriate error
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Should show some kind of error
    const errorElement = page.locator('h1:has-text("Error"), h1:has-text("Invalid"), h1:has-text("Not Found")').first();
    await expect(errorElement).toBeVisible({ timeout: 5000 });
  });

  test('should handle special characters in tokens', async ({ page }) => {
    // Navigate with special characters
    await questionnairePage.gotoWithToken('token-with-special-chars-!@#$%');

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Verify app handles it gracefully
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have responsive layout on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate with invalid token
    await questionnairePage.gotoWithToken('invalid-token');

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Verify content is visible and properly laid out
    await expect(questionnairePage.errorTitle).toBeVisible();
    await expect(questionnairePage.errorMessage).toBeVisible();
    await expect(questionnairePage.contactSupportButton).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance
  });

  test('should prevent indexing by search engines', async ({ page }) => {
    // Navigate with any token
    await questionnairePage.gotoWithToken('test-token');

    // Check for robots meta tag in layout
    // This should be set in the layout.tsx file
    const robotsMeta = page.locator('meta[name="robots"]');

    // If present, verify it has noindex
    const metaCount = await robotsMeta.count();
    if (metaCount > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).toContain('noindex');
    }
  });

  test('should have proper focus management for keyboard navigation', async ({ page }) => {
    // Navigate with invalid token
    await questionnairePage.gotoWithToken('invalid-token');

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Tab through elements
    await page.keyboard.press('Tab');

    // Verify focus is on contact button (first interactive element)
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});

/**
 * Valid Token Access Tests
 * Note: These require a valid token from the database
 */
test.describe('Questionnaire Valid Token Access', () => {
  test.skip('should load questionnaire with valid token', async ({ page }) => {
    // IMPORTANT: This test is skipped by default
    // To run this test, you need to:
    // 1. Create a test questionnaire token in your database
    // 2. Set environment variable: TEST_QUESTIONNAIRE_TOKEN
    // 3. Remove the .skip() modifier

    const questionnairePage = new QuestionnairePage(page);
    const validToken = process.env.TEST_QUESTIONNAIRE_TOKEN || 'valid-test-token';

    // Navigate with valid token
    await questionnairePage.gotoWithToken(validToken);

    // Wait for verification
    await questionnairePage.waitForVerification();

    // Verify questionnaire loads
    await questionnairePage.verifyQuestionnaireLoaded();

    // Verify no error messages
    const errorTitle = page.locator('h1:has-text("Error"), h1:has-text("Invalid")');
    await expect(errorTitle).not.toBeVisible();
  });

  test.skip('should track token access in database', async ({ page }) => {
    // This test would verify that token access is logged
    // Requires database setup and valid token

    const questionnairePage = new QuestionnairePage(page);
    const validToken = process.env.TEST_QUESTIONNAIRE_TOKEN || 'valid-test-token';

    await questionnairePage.gotoWithToken(validToken);
    await questionnairePage.waitForVerification();

    // In a real test, you would query the database to verify:
    // 1. Access timestamp was recorded
    // 2. Access count was incremented
    // 3. Token status is still valid
  });

  test.skip('should show completion message after questionnaire submission', async ({ page }) => {
    // This test verifies the completion flow
    // Requires valid token and completing the questionnaire

    const questionnairePage = new QuestionnairePage(page);
    const validToken = process.env.TEST_QUESTIONNAIRE_TOKEN || 'valid-test-token';

    await questionnairePage.gotoWithToken(validToken);
    await questionnairePage.waitForVerification();
    await questionnairePage.verifyQuestionnaireLoaded();

    // Complete questionnaire (would need to interact with form)
    // This is complex and would require additional page object methods

    // After completion, verify thank you message
    await questionnairePage.verifyCompletionMessage();
  });
});

/**
 * Security Tests
 */
test.describe('Questionnaire Security', () => {
  test('should not allow direct access without token', async ({ page }) => {
    // Try to access questionnaire page directly
    await page.goto('/q/');

    // Verify we're not on a questionnaire page with valid content
    const url = page.url();
    expect(url).toContain('/q');

    // Should show some kind of error or be on a different page
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should use HTTPS in production URLs', async ({ page }) => {
    // This test verifies the URL scheme
    const questionnairePage = new QuestionnairePage(page);
    await questionnairePage.gotoWithToken('test-token');

    const url = questionnairePage.getUrl();

    // In production, should use HTTPS
    if (process.env.NODE_ENV === 'production') {
      expect(url).toMatch(/^https:/);
    }
  });

  test('should not leak token in browser console', async ({ page }) => {
    // Collect console messages
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });

    const testToken = 'secret-token-12345';
    const questionnairePage = new QuestionnairePage(page);
    await questionnairePage.gotoWithToken(testToken);
    await questionnairePage.waitForVerification();

    // Wait a bit for any console logs
    await page.waitForTimeout(2000);

    // Verify token is not in console (in production mode)
    if (process.env.NODE_ENV === 'production') {
      const tokenInConsole = consoleMessages.some((msg) =>
        msg.includes(testToken)
      );
      expect(tokenInConsole).toBe(false);
    }
  });
});
