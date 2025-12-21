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
 * Checks if a value is a valid answer (not empty, null, or undefined)
 */
export function isValidAnswer(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
  return true;
}
