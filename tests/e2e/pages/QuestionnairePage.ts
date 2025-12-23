import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Questionnaire Token Access Page
 *
 * Encapsulates all interactions with /q/[token] page
 * Follows POM pattern for maintainability and reusability
 */
export class QuestionnairePage {
  readonly page: Page;
  readonly verifyingAccessMessage: Locator;
  readonly loadingSpinner: Locator;
  readonly errorTitle: Locator;
  readonly errorMessage: Locator;
  readonly contactSupportButton: Locator;
  readonly questionnaireContainer: Locator;
  readonly skipToContentLink: Locator;
  readonly completionMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.verifyingAccessMessage = page.locator('h1:has-text("Verifying Access")');
    this.loadingSpinner = page.locator('[role="status"][aria-label="Verifying access"]');
    this.errorTitle = page.locator('h1');
    this.errorMessage = page.locator('p.text-gray-200');
    this.contactSupportButton = page.locator('a:has-text("Contact Support")');
    this.questionnaireContainer = page.locator('#main-content');
    this.skipToContentLink = page.locator('a:has-text("Skip to main content")');
    this.completionMessage = page.locator('[role="alert"][aria-live="polite"]');
  }

  /**
   * Navigate to questionnaire page with token
   */
  async gotoWithToken(token: string) {
    await this.page.goto(`/q/${token}`);
  }

  /**
   * Wait for token verification to complete
   */
  async waitForVerification(timeout: number = 10000) {
    try {
      // Wait for loading to disappear
      await this.verifyingAccessMessage.waitFor({ state: 'visible', timeout: 2000 });
      await this.verifyingAccessMessage.waitFor({ state: 'hidden', timeout });
    } catch {
      // Loading might be too fast, continue
    }
  }

  /**
   * Verify invalid token error is shown
   */
  async verifyInvalidTokenError() {
    await expect(this.errorTitle).toContainText('Invalid or Expired Link');
    await expect(this.errorMessage).toContainText('This questionnaire link is invalid or has expired');
    await expect(this.contactSupportButton).toBeVisible();
  }

  /**
   * Verify missing token error is shown
   */
  async verifyMissingTokenError() {
    await expect(this.errorTitle).toContainText('Missing Access Token');
    await expect(this.errorMessage).toContainText('No access token was provided');
    await expect(this.contactSupportButton).toBeVisible();
  }

  /**
   * Verify questionnaire not found error
   */
  async verifyQuestionnaireNotFound() {
    await expect(this.errorTitle).toContainText('Questionnaire Not Found');
    await expect(this.errorMessage).toContainText('The requested questionnaire could not be found');
    await expect(this.contactSupportButton).toBeVisible();
  }

  /**
   * Verify questionnaire is loaded and accessible
   */
  async verifyQuestionnaireLoaded() {
    await expect(this.questionnaireContainer).toBeVisible();

    // Verify skip to content link is present (accessibility)
    await expect(this.skipToContentLink).toBeInViewport({ ratio: 0 });
  }

  /**
   * Verify verification error is shown
   */
  async verifyVerificationError() {
    await expect(this.errorTitle).toContainText('Verification Error');
    await expect(this.errorMessage).toContainText('An error occurred while verifying your access');
    await expect(this.contactSupportButton).toBeVisible();
  }

  /**
   * Click contact support button
   */
  async clickContactSupport() {
    await this.contactSupportButton.click();
    await this.page.waitForURL('**/contact', { timeout: 10000 });
  }

  /**
   * Verify completion message is shown
   */
  async verifyCompletionMessage() {
    await expect(this.completionMessage).toBeVisible();
    await expect(this.page.locator('h1:has-text("Thank You!")')).toBeVisible();
    await expect(this.page.locator('text=Your responses have been saved')).toBeVisible();
  }

  /**
   * Get current URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Verify accessibility features
   */
  async verifyAccessibility() {
    // Check for skip to content link
    await expect(this.skipToContentLink).toHaveAttribute('href', '#main-content');

    // Verify main content landmark
    await expect(this.questionnaireContainer).toHaveAttribute('id', 'main-content');
  }

  /**
   * Verify page background and styling
   */
  async verifyPageStyling() {
    const mainContent = this.questionnaireContainer;
    await expect(mainContent).toBeVisible();

    // Verify dark theme gradient background is applied
    const bgClass = await this.page.locator('body > div').first().getAttribute('class');
    expect(bgClass).toContain('bg-gradient');
  }
}
