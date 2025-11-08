import { describe, expect, it } from 'vitest';

import { hashStringToNumber } from './hash';

describe('hashStringToNumber', () => {
  describe('basic functionality', () => {
    it('should return a number for any string input', () => {
      const result = hashStringToNumber('test');
      expect(typeof result).toBe('number');
    });

    it('should return the same hash for the same input', () => {
      const input = 'hello world';
      const hash1 = hashStringToNumber(input);
      const hash2 = hashStringToNumber(input);

      expect(hash1).toBe(hash2);
    });

    it('should return different hashes for different inputs', () => {
      const hash1 = hashStringToNumber('test1');
      const hash2 = hashStringToNumber('test2');

      expect(hash1).not.toBe(hash2);
    });

    it('should return a non-negative number (unsigned)', () => {
      const result = hashStringToNumber('test');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should return a 32-bit unsigned integer', () => {
      const result = hashStringToNumber('test');
      expect(result).toBeLessThanOrEqual(0xffffffff);
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const result = hashStringToNumber('');
      expect(result).toBe(0);
    });

    it('should handle single character', () => {
      const result = hashStringToNumber('a');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      const result = hashStringToNumber(longString);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should handle strings with special characters', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const result = hashStringToNumber(specialChars);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should handle unicode characters', () => {
      const unicode = '🚀🎉🌟💫🔥';
      const result = hashStringToNumber(unicode);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should handle strings with whitespace', () => {
      const whitespace = '  hello world  ';
      const result = hashStringToNumber(whitespace);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should handle newlines and tabs', () => {
      const newlines = 'hello\nworld\ttab';
      const result = hashStringToNumber(newlines);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe('known hash values', () => {
    it('should return consistent hash for common strings', () => {
      // These are actual computed values to ensure consistency
      expect(hashStringToNumber('hello')).toBe(99162322);
      expect(hashStringToNumber('world')).toBe(113318802);
      expect(hashStringToNumber('test')).toBe(3556498);
      expect(hashStringToNumber('javascript')).toBe(188995949);
    });

    it('should handle case sensitivity', () => {
      const lower = hashStringToNumber('test');
      const upper = hashStringToNumber('TEST');
      const mixed = hashStringToNumber('Test');

      expect(lower).not.toBe(upper);
      expect(lower).not.toBe(mixed);
      expect(upper).not.toBe(mixed);
    });

    it('should handle numeric strings', () => {
      const result1 = hashStringToNumber('123');
      const result2 = hashStringToNumber('456');
      const result3 = hashStringToNumber('0');

      expect(typeof result1).toBe('number');
      expect(typeof result2).toBe('number');
      expect(typeof result3).toBe('number');
      expect(result1).not.toBe(result2);
    });
  });

  describe('collision resistance', () => {
    it('should produce different hashes for similar strings', () => {
      const strings = [
        'test',
        'tests',
        'testing',
        'tester',
        'Test',
        'TEST',
        'test1',
        'test2',
        'test_',
        'test-',
        'test.',
        '_test',
        '-test',
        '.test',
      ];

      const hashes = strings.map((s) => hashStringToNumber(s));
      const uniqueHashes = new Set(hashes);

      // All hashes should be unique (though collisions are theoretically possible)
      expect(uniqueHashes.size).toBe(strings.length);
    });

    it('should handle permutations differently', () => {
      const hash1 = hashStringToNumber('abc');
      const hash2 = hashStringToNumber('bac');
      const hash3 = hashStringToNumber('cab');

      expect(hash1).not.toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash2).not.toBe(hash3);
    });
  });

  describe('deterministic behavior', () => {
    it('should produce the same hash across multiple calls', () => {
      const input = 'deterministic test';
      const hashes = Array.from({ length: 100 }, () => hashStringToNumber(input));

      // All hashes should be identical
      expect(new Set(hashes).size).toBe(1);
    });

    it('should produce consistent results for complex strings', () => {
      const complexString = JSON.stringify({
        name: 'test',
        value: 123,
        nested: { array: [1, 2, 3] },
        unicode: '🚀',
        special: '!@#$%',
      });

      const hash1 = hashStringToNumber(complexString);
      const hash2 = hashStringToNumber(complexString);

      expect(hash1).toBe(hash2);
    });
  });

  describe('boundary conditions', () => {
    it('should handle maximum safe integer as string', () => {
      const maxSafeInt = Number.MAX_SAFE_INTEGER.toString();
      const result = hashStringToNumber(maxSafeInt);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should handle repeated characters', () => {
      const repeated = 'a'.repeat(1000);
      const result = hashStringToNumber(repeated);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should handle alternating patterns', () => {
      const pattern = 'abab'.repeat(250);
      const result = hashStringToNumber(pattern);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe('performance characteristics', () => {
    it('should handle strings of varying lengths consistently', () => {
      const lengths = [1, 10, 100, 1000];
      const results = lengths.map((len) => {
        const str = 'a'.repeat(len);
        return hashStringToNumber(str);
      });

      // All should be valid numbers
      results.forEach((result) => {
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThanOrEqual(0);
      });

      // Should produce different hashes for different lengths
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(lengths.length);
    });
  });
});
