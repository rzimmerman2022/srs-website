/**
 * Rate Limiting Security Module
 *
 * Prevents brute force attacks on:
 * - Admin login attempts
 * - Questionnaire token verification
 * - API routes
 *
 * Uses in-memory storage with automatic cleanup
 */

export interface RateLimitRecord {
  count: number;
  resetTime: number;
  firstAttempt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// In-memory storage for rate limit tracking
const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitMap.entries()).forEach(([identifier, record]) => {
    if (now > record.resetTime) {
      rateLimitMap.delete(identifier);
    }
  });
}, 10 * 60 * 1000);

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param maxAttempts - Maximum number of attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns Object with allowed status and rate limit info
 */
export function checkRateLimit(
  identifier: string,
  maxAttempts: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // No record or expired window - allow and create new record
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime,
      firstAttempt: now,
    });

    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetTime,
    };
  }

  // Check if limit exceeded
  if (record.count >= maxAttempts) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);

    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter,
    };
  }

  // Increment count and allow
  record.count++;

  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Get IP address from request headers
 * Checks x-forwarded-for and x-real-ip headers
 *
 * @param headers - Headers object from Next.js request
 * @returns IP address or 'unknown'
 */
export function getClientIp(headers: Headers): string {
  // Check x-forwarded-for (can contain multiple IPs, take first one)
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Check x-real-ip
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return 'unknown';
}

/**
 * Clear rate limit for a specific identifier
 * Useful for resetting after successful actions
 *
 * @param identifier - The identifier to clear
 */
export function clearRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

/**
 * Get current rate limit status without incrementing
 *
 * @param identifier - Unique identifier
 * @returns Current rate limit record or null
 */
export function getRateLimitStatus(identifier: string): RateLimitRecord | null {
  const record = rateLimitMap.get(identifier);
  if (!record) {
    return null;
  }

  const now = Date.now();
  if (now > record.resetTime) {
    rateLimitMap.delete(identifier);
    return null;
  }

  return record;
}

/**
 * Format retry time for user display
 *
 * @param retryAfterSeconds - Seconds until retry allowed
 * @returns Formatted string
 */
export function formatRetryTime(retryAfterSeconds: number): string {
  if (retryAfterSeconds < 60) {
    return `${retryAfterSeconds} second${retryAfterSeconds === 1 ? '' : 's'}`;
  }

  const minutes = Math.ceil(retryAfterSeconds / 60);
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}
