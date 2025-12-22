import { describe, it, expect } from 'vitest';
import {
  isStringValue,
  isNumberValue,
  isStringArray,
  isPercentageRecord,
} from '@/lib/questionnaire/type-guards';

describe('isStringValue', () => {
  it('returns true for strings', () => {
    expect(isStringValue('hello')).toBe(true);
    expect(isStringValue('')).toBe(true);
    expect(isStringValue('123')).toBe(true);
  });

  it('returns false for numbers', () => {
    expect(isStringValue(123)).toBe(false);
    expect(isStringValue(0)).toBe(false);
    expect(isStringValue(NaN)).toBe(false);
  });

  it('returns false for booleans', () => {
    expect(isStringValue(true)).toBe(false);
    expect(isStringValue(false)).toBe(false);
  });

  it('returns false for null and undefined', () => {
    expect(isStringValue(null)).toBe(false);
    expect(isStringValue(undefined)).toBe(false);
  });

  it('returns false for objects and arrays', () => {
    expect(isStringValue({})).toBe(false);
    expect(isStringValue([])).toBe(false);
    expect(isStringValue(['a', 'b'])).toBe(false);
  });
});

describe('isNumberValue', () => {
  it('returns true for numbers', () => {
    expect(isNumberValue(42)).toBe(true);
    expect(isNumberValue(0)).toBe(true);
    expect(isNumberValue(-5)).toBe(true);
    expect(isNumberValue(3.14)).toBe(true);
  });

  it('returns true for NaN (it is technically a number)', () => {
    expect(isNumberValue(NaN)).toBe(true);
  });

  it('returns true for Infinity', () => {
    expect(isNumberValue(Infinity)).toBe(true);
    expect(isNumberValue(-Infinity)).toBe(true);
  });

  it('returns false for strings', () => {
    expect(isNumberValue('42')).toBe(false);
    expect(isNumberValue('')).toBe(false);
  });

  it('returns false for null and undefined', () => {
    expect(isNumberValue(null)).toBe(false);
    expect(isNumberValue(undefined)).toBe(false);
  });

  it('returns false for booleans', () => {
    expect(isNumberValue(true)).toBe(false);
    expect(isNumberValue(false)).toBe(false);
  });
});

describe('isStringArray', () => {
  it('returns true for arrays of strings', () => {
    expect(isStringArray(['a', 'b', 'c'])).toBe(true);
    expect(isStringArray(['single'])).toBe(true);
    expect(isStringArray([''])).toBe(true);
  });

  it('returns true for empty array', () => {
    expect(isStringArray([])).toBe(true);
  });

  it('returns false for arrays with non-string elements', () => {
    expect(isStringArray([1, 2, 3])).toBe(false);
    expect(isStringArray(['a', 1, 'b'])).toBe(false);
    expect(isStringArray([null])).toBe(false);
    expect(isStringArray([undefined])).toBe(false);
    expect(isStringArray([{}])).toBe(false);
  });

  it('returns false for non-arrays', () => {
    expect(isStringArray('string')).toBe(false);
    expect(isStringArray(123)).toBe(false);
    expect(isStringArray(null)).toBe(false);
    expect(isStringArray(undefined)).toBe(false);
    expect(isStringArray({})).toBe(false);
  });
});

describe('isPercentageRecord', () => {
  it('returns true for records with number values', () => {
    expect(isPercentageRecord({ a: 50, b: 30, c: 20 })).toBe(true);
    expect(isPercentageRecord({ single: 100 })).toBe(true);
    expect(isPercentageRecord({ zero: 0 })).toBe(true);
  });

  it('returns true for empty object', () => {
    expect(isPercentageRecord({})).toBe(true);
  });

  it('returns false for records with non-number values', () => {
    expect(isPercentageRecord({ a: '50', b: 30 })).toBe(false);
    expect(isPercentageRecord({ a: null })).toBe(false);
    expect(isPercentageRecord({ a: undefined })).toBe(false);
    expect(isPercentageRecord({ a: true })).toBe(false);
  });

  it('returns false for arrays', () => {
    expect(isPercentageRecord([50, 30, 20])).toBe(false);
    expect(isPercentageRecord([])).toBe(false);
  });

  it('returns false for null', () => {
    expect(isPercentageRecord(null)).toBe(false);
  });

  it('returns false for primitives', () => {
    expect(isPercentageRecord('string')).toBe(false);
    expect(isPercentageRecord(123)).toBe(false);
    expect(isPercentageRecord(undefined)).toBe(false);
  });

  it('handles decimal percentages', () => {
    expect(isPercentageRecord({ a: 33.33, b: 33.33, c: 33.34 })).toBe(true);
  });

  it('handles negative numbers', () => {
    expect(isPercentageRecord({ a: -10, b: 110 })).toBe(true);
  });
});
