/**
 * Utility functions for questionnaire validation and processing
 */

/**
 * Checks if a value is a valid answer (not empty, null, or undefined)
 */
export function isValidAnswer(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
  return true;
}
