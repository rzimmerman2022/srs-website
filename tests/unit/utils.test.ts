import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeValue, isValidAnswer } from '@/lib/questionnaire/utils';

describe('sanitizeInput', () => {
  it('escapes ampersands', () => {
    expect(sanitizeInput('AT&T')).toBe('AT&amp;T');
  });

  it('escapes less-than signs', () => {
    expect(sanitizeInput('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes greater-than signs', () => {
    expect(sanitizeInput('5 > 3')).toBe('5 &gt; 3');
  });

  it('escapes double quotes', () => {
    expect(sanitizeInput('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(sanitizeInput("it's fine")).toBe('it&#039;s fine');
  });

  it('escapes all special characters together', () => {
    const malicious = '<script>alert("xss")</script>';
    const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
    expect(sanitizeInput(malicious)).toBe(expected);
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('returns same string if no special characters', () => {
    expect(sanitizeInput('Hello World 123')).toBe('Hello World 123');
  });

  it('handles multiple occurrences of same character', () => {
    expect(sanitizeInput('<<<')).toBe('&lt;&lt;&lt;');
  });
});

describe('sanitizeValue', () => {
  it('sanitizes string values', () => {
    expect(sanitizeValue('<script>')).toBe('&lt;script&gt;');
  });

  it('sanitizes arrays of strings', () => {
    const input = ['<b>bold</b>', 'normal', '<i>italic</i>'];
    const expected = ['&lt;b&gt;bold&lt;/b&gt;', 'normal', '&lt;i&gt;italic&lt;/i&gt;'];
    expect(sanitizeValue(input)).toEqual(expected);
  });

  it('does not modify numbers in arrays', () => {
    const input = ['text', 42, '<tag>'];
    const expected = ['text', 42, '&lt;tag&gt;'];
    expect(sanitizeValue(input)).toEqual(expected);
  });

  it('sanitizes object string values', () => {
    const input = { name: '<script>evil</script>', count: 5 };
    const expected = { name: '&lt;script&gt;evil&lt;/script&gt;', count: 5 };
    expect(sanitizeValue(input)).toEqual(expected);
  });

  it('returns numbers unchanged', () => {
    expect(sanitizeValue(42)).toBe(42);
  });

  it('returns booleans unchanged', () => {
    expect(sanitizeValue(true)).toBe(true);
    expect(sanitizeValue(false)).toBe(false);
  });

  it('returns null unchanged', () => {
    expect(sanitizeValue(null)).toBe(null);
  });

  it('returns undefined unchanged', () => {
    expect(sanitizeValue(undefined)).toBe(undefined);
  });

  it('handles empty objects', () => {
    expect(sanitizeValue({})).toEqual({});
  });

  it('handles empty arrays', () => {
    expect(sanitizeValue([])).toEqual([]);
  });
});

describe('isValidAnswer', () => {
  it('returns false for undefined', () => {
    expect(isValidAnswer(undefined)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidAnswer(null)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidAnswer('')).toBe(false);
  });

  it('returns false for empty array', () => {
    expect(isValidAnswer([])).toBe(false);
  });

  it('returns false for empty object', () => {
    expect(isValidAnswer({})).toBe(false);
  });

  it('returns true for non-empty string', () => {
    expect(isValidAnswer('hello')).toBe(true);
  });

  it('returns true for number (including 0)', () => {
    expect(isValidAnswer(0)).toBe(true);
    expect(isValidAnswer(42)).toBe(true);
  });

  it('returns true for non-empty array', () => {
    expect(isValidAnswer(['item'])).toBe(true);
  });

  it('returns true for non-empty object', () => {
    expect(isValidAnswer({ key: 'value' })).toBe(true);
  });

  it('returns true for boolean true', () => {
    expect(isValidAnswer(true)).toBe(true);
  });

  it('returns true for boolean false', () => {
    expect(isValidAnswer(false)).toBe(true);
  });

  it('returns false for whitespace-only string', () => {
    // FIX (QA-2026-01-02): Whitespace-only strings are now trimmed and considered invalid
    // This prevents users from "completing" required fields with just spaces
    expect(isValidAnswer('   ')).toBe(false);
  });
});
