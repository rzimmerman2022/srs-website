import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Admin Login Page
 *
 * Encapsulates all interactions with /admin/login page
 * Follows POM pattern for maintainability and reusability
 */
export class AdminLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly loadingSpinner: Locator;
  readonly pageHeading: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]#email');
    this.passwordInput = page.locator('input[type="password"]#password');
    this.rememberMeCheckbox = page.locator('input[type="checkbox"]#remember-me');
    this.signInButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[role="alert"]');
    this.loadingSpinner = page.locator('svg.animate-spin');
    this.pageHeading = page.locator('h1:has-text("Admin Login")');
    this.forgotPasswordLink = page.locator('button:has-text("Forgot your password?")');
  }

  /**
   * Navigate to the admin login page
   */
  async goto() {
    await this.page.goto('/admin/login');
    await this.pageHeading.waitFor({ state: 'visible' });
  }

  /**
   * Fill in login credentials
   */
  async fillCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Toggle "Remember me" checkbox
   */
  async toggleRememberMe() {
    await this.rememberMeCheckbox.click();
  }

  /**
   * Click the sign in button
   */
  async clickSignIn() {
    await this.signInButton.click();
  }

  /**
   * Perform complete login flow
   */
  async login(email: string, password: string, rememberMe: boolean = false) {
    await this.fillCredentials(email, password);
    if (rememberMe) {
      await this.toggleRememberMe();
    }
    await this.clickSignIn();
  }

  /**
   * Wait for navigation after successful login
   */
  async waitForNavigation() {
    await this.page.waitForURL('**/admin/**', { timeout: 10000 });
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await this.errorMessage.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Verify that the login page is displayed correctly
   */
  async verifyPageLoaded() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  /**
   * Verify form validation
   */
  async verifyRequiredFields() {
    // Try to submit empty form
    await this.clickSignIn();

    // Check HTML5 validation
    await expect(this.emailInput).toHaveAttribute('required');
    await expect(this.passwordInput).toHaveAttribute('required');
  }

  /**
   * Wait for loading state
   */
  async waitForLoading() {
    await this.loadingSpinner.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Verify rate limiting redirect
   */
  async verifyRateLimitRedirect() {
    await this.page.waitForURL('**/admin/login/rate-limited', { timeout: 10000 });
  }
}
