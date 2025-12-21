/**
 * Type guard utilities for safe type checking of questionnaire values
 */

export function isStringValue(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumberValue(value: unknown): value is number {
  return typeof value === 'number';
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(v => typeof v === 'string');
}

export function isPercentageRecord(value: unknown): value is Record<string, number> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) &&
    Object.values(value).every(v => typeof v === 'number');
}
