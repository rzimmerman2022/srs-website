/**
 * Utility functions for questionnaire validation and processing
 */

// ============================================================================
// SECURITY: Input Sanitization (Q-SEC-07)
// ============================================================================
// Sanitizes user input to prevent XSS attacks by escaping HTML special characters
// Use this for any user-provided data that will be displayed in the UI
// ============================================================================

/**
 * Sanitizes a string by escaping HTML special characters
 * @param input - The string to sanitize
 * @returns Sanitized string safe for HTML display
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes user input values (handles strings, arrays, and objects)
 * @param value - The value to sanitize
 * @returns Sanitized value
 */
export function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitizeInput(value);
  }
  if (Array.isArray(value)) {
    return value.map(item =>
      typeof item === 'string' ? sanitizeInput(item) : item
    );
  }
  if (typeof value === 'object' && value !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = typeof val === 'string' ? sanitizeInput(val) : val;
    }
    return sanitized;
  }
  return value;
}

/**
 * Checks if a value is a valid answer (not empty, null, undefined, or whitespace-only)
 *
 * FIX: Added whitespace trimming (QA-2026-01-02)
 * Previously, "   " (spaces only) would count as a valid answer,
 * allowing users to "complete" required fields with just whitespace.
 */
export function isValidAnswer(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return false;

  // String values: trim whitespace before checking if empty
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
  return true;
}
