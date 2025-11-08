import { beforeEach, describe, expect, it, vi } from 'vitest';

import { slugifyName } from './format';
import * as nanoidModule from './nanoid';

// Mock the nanoid module
vi.mock('./nanoid', () => ({
  cnanoid: vi.fn(),
}));

describe('slugifyName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('without nanoid', () => {
    it('should convert a simple string to lowercase', () => {
      const result = slugifyName({ name: 'Hello World' });
      expect(result).toBe('hello-world');
    });

    it('should replace spaces with hyphens', () => {
      const result = slugifyName({ name: 'My Project Name' });
      expect(result).toBe('my-project-name');
    });

    it('should remove special characters', () => {
      const result = slugifyName({ name: 'Test@#$%^&*()Project!' });
      expect(result).toBe('test-project');
    });

    it('should handle multiple consecutive spaces', () => {
      const result = slugifyName({ name: 'Test    Multiple    Spaces' });
      expect(result).toBe('test-multiple-spaces');
    });

    it('should handle mixed case with numbers', () => {
      const result = slugifyName({ name: 'Project123Version2' });
      expect(result).toBe('project123version2');
    });

    it('should remove leading and trailing hyphens', () => {
      const result = slugifyName({ name: '  Test Project  ' });
      expect(result).toBe('test-project');
    });

    it('should handle strings with only special characters', () => {
      const result = slugifyName({ name: '@#$%^&*()' });
      expect(result).toBe('');
    });

    it('should handle empty string', () => {
      const result = slugifyName({ name: '' });
      expect(result).toBe('');
    });

    it('should handle alphanumeric characters correctly', () => {
      const result = slugifyName({ name: 'Test123ABC' });
      expect(result).toBe('test123abc');
    });

    it('should handle strings with underscores', () => {
      const result = slugifyName({ name: 'test_project_name' });
      expect(result).toBe('test-project-name');
    });

    it('should handle strings with dots', () => {
      const result = slugifyName({ name: 'my.project.name' });
      expect(result).toBe('my-project-name');
    });

    it('should handle unicode characters', () => {
      const result = slugifyName({ name: 'Héllo Wörld' });
      expect(result).toBe('h-llo-w-rld');
    });

    it('should handle strings with consecutive special characters', () => {
      const result = slugifyName({ name: 'test---project___name' });
      expect(result).toBe('test-project-name');
    });
  });

  describe('with nanoid', () => {
    it('should append nanoid when withNanoId is true', () => {
      const mockNanoid = 'abc123';
      vi.mocked(nanoidModule.cnanoid).mockReturnValue(mockNanoid);

      const result = slugifyName({ name: 'Test Project', withNanoId: true });

      expect(nanoidModule.cnanoid).toHaveBeenCalledWith(6);
      expect(result).toBe('test-project-abc123');
    });

    it('should handle special characters in name with nanoid', () => {
      const mockNanoid = 'xyz789';
      vi.mocked(nanoidModule.cnanoid).mockReturnValue(mockNanoid);

      const result = slugifyName({ name: 'Test@#$Project!', withNanoId: true });

      expect(result).toBe('test-project-xyz789');
    });

    it('should handle empty name with nanoid', () => {
      const mockNanoid = 'def456';
      vi.mocked(nanoidModule.cnanoid).mockReturnValue(mockNanoid);

      const result = slugifyName({ name: '', withNanoId: true });

      expect(result).toBe('def456');
    });

    it('should handle spaces in name with nanoid', () => {
      const mockNanoid = 'ghi789';
      vi.mocked(nanoidModule.cnanoid).mockReturnValue(mockNanoid);

      const result = slugifyName({ name: 'My Amazing Project', withNanoId: true });

      expect(result).toBe('my-amazing-project-ghi789');
    });

    it('should not call nanoid when withNanoId is false', () => {
      const result = slugifyName({ name: 'Test Project', withNanoId: false });

      expect(nanoidModule.cnanoid).not.toHaveBeenCalled();
      expect(result).toBe('test-project');
    });

    it('should not call nanoid when withNanoId is undefined', () => {
      const result = slugifyName({ name: 'Test Project' });

      expect(nanoidModule.cnanoid).not.toHaveBeenCalled();
      expect(result).toBe('test-project');
    });

    it('should handle nanoid with special characters', () => {
      const mockNanoid = 'A1b2C3';
      vi.mocked(nanoidModule.cnanoid).mockReturnValue(mockNanoid);

      const result = slugifyName({ name: 'Test', withNanoId: true });

      expect(result).toBe('test-a1b2c3');
    });
  });

  describe('edge cases', () => {
    it('should handle very long strings', () => {
      const longName = 'a'.repeat(1000);
      const result = slugifyName({ name: longName });
      expect(result).toBe(longName);
    });

    it('should handle string with only numbers', () => {
      const result = slugifyName({ name: '123456789' });
      expect(result).toBe('123456789');
    });

    it('should handle string with mixed hyphens and spaces', () => {
      const result = slugifyName({ name: 'test - project - name' });
      expect(result).toBe('test-project-name');
    });

    it('should handle string starting and ending with special characters', () => {
      const result = slugifyName({ name: '!!!test project!!!' });
      expect(result).toBe('test-project');
    });
  });
});
