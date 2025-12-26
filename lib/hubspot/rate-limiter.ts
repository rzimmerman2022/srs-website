/**
 * HubSpot Rate Limiter - Token Bucket Implementation
 *
 * SUBAGENT-2: claude-opus-4-5/SUBAGENT-2/hubspot-integration/2025-12-23T-implementation
 * Fortune 50 / World-Class Client Onboarding System
 *
 * Implements token bucket algorithm to respect HubSpot's rate limits:
 * - Private Apps: 500 requests per 10 seconds
 * - Daily limit: 500,000 requests
 */

import { RateLimitState } from './types';
import { getHubSpotConfig } from './config';

// ============================================================================
// Rate Limit Error
// ============================================================================

export class RateLimitError extends Error {
  public readonly retryAfter: number;

  constructor(message: string, retryAfter: number = 1000) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

// ============================================================================
// Token Bucket Rate Limiter
// ============================================================================

export class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private requestsToday: number;
  private lastResetDate: string;

  private readonly capacity: number;
  private readonly refillRatePerMs: number;
  private readonly dailyLimit: number;

  constructor() {
    const config = getHubSpotConfig();
    this.capacity = config.rateLimitPerTenSeconds;
    this.refillRatePerMs = config.rateLimitPerTenSeconds / 10000; // tokens per millisecond
    this.dailyLimit = config.dailyLimit;

    this.tokens = this.capacity;
    this.lastRefill = Date.now();
    this.requestsToday = 0;
    this.lastResetDate = this.getDateString();
  }

  /**
   * Acquire tokens before making API requests
   * @param count Number of tokens to acquire (default 1)
   * @throws RateLimitError if daily limit exceeded
   */
  async acquireToken(count: number = 1): Promise<void> {
    // Check and reset daily counter if needed
    this.checkDailyReset();

    // Check daily limit
    if (this.requestsToday + count > this.dailyLimit) {
      throw new RateLimitError(
        `Daily rate limit exceeded: ${this.requestsToday}/${this.dailyLimit}`,
        this.getMillisecondsUntilMidnight()
      );
    }

    // Refill tokens based on elapsed time
    this.refill();

    // Wait if not enough tokens
    while (this.tokens < count) {
      const waitTime = Math.ceil((count - this.tokens) / this.refillRatePerMs);
      await this.sleep(Math.min(waitTime, 1000));
      this.refill();
    }

    // Consume tokens
    this.tokens -= count;
    this.requestsToday += count;
  }

  /**
   * Get current rate limit state for monitoring
   */
  getState(): RateLimitState {
    this.refill();
    return {
      tokens: Math.floor(this.tokens),
      lastRefill: this.lastRefill,
      requestsToday: this.requestsToday,
      lastResetDate: this.lastResetDate,
    };
  }

  /**
   * Get remaining daily requests
   */
  getRemainingDailyRequests(): number {
    this.checkDailyReset();
    return this.dailyLimit - this.requestsToday;
  }

  /**
   * Check if we're approaching rate limits
   */
  isApproachingLimit(threshold: number = 0.8): boolean {
    const state = this.getState();
    const tokenUsage = 1 - state.tokens / this.capacity;
    const dailyUsage = state.requestsToday / this.dailyLimit;
    return tokenUsage > threshold || dailyUsage > threshold;
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = elapsed * this.refillRatePerMs;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  private checkDailyReset(): void {
    const today = this.getDateString();
    if (today !== this.lastResetDate) {
      this.requestsToday = 0;
      this.lastResetDate = today;
    }
  }

  private getDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getMillisecondsUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - now.getTime();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let rateLimiterInstance: TokenBucket | null = null;

export function getRateLimiter(): TokenBucket {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new TokenBucket();
  }
  return rateLimiterInstance;
}

// ============================================================================
// Exponential Backoff Retry Wrapper
// ============================================================================

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 5,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    backoffMultiplier = 2,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Check if it's a rate limit error (429)
      const isRateLimitError =
        error instanceof RateLimitError ||
        (error as { statusCode?: number }).statusCode === 429;

      if (!isRateLimitError && attempt === maxRetries - 1) {
        throw error;
      }

      // Calculate delay with exponential backoff + jitter
      const baseDelay = initialDelayMs * Math.pow(backoffMultiplier, attempt);
      const jitter = Math.random() * 1000;
      const delay = Math.min(baseDelay + jitter, maxDelayMs);

      console.log(
        `[HubSpot] Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms`,
        { error: lastError.message }
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
