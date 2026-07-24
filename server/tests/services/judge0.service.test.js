/**
 * Judge0 Service Tests
 * Unit tests for code execution service
 */

const judge0Service = require('../../services/judge0.service');

describe('Judge0 Service', () => {
  describe('getLanguageId', () => {
    it('should return correct language ID for javascript', () => {
      const id = judge0Service.getLanguageId('javascript');
      expect(id).toBe(63);
    });

    it('should return correct language ID for python', () => {
      const id = judge0Service.getLanguageId('python');
      expect(id).toBe(71);
    });

    it('should throw error for unsupported language', () => {
      expect(() => judge0Service.getLanguageId('unsupported')).toThrow();
    });

    it('should be case-insensitive', () => {
      const id1 = judge0Service.getLanguageId('JAVASCRIPT');
      const id2 = judge0Service.getLanguageId('jAvAsCrIpT');
      expect(id1).toBe(id2);
    });
  });

  describe('validateCodeSyntax', () => {
    it('should validate non-empty code', async () => {
      const result = await judge0Service.validateCodeSyntax('console.log("hello");', 'javascript');
      expect(result.valid).toBe(true);
    });

    it('should reject empty code', async () => {
      const result = await judge0Service.validateCodeSyntax('', 'javascript');
      expect(result.valid).toBe(false);
    });

    it('should reject whitespace-only code', async () => {
      const result = await judge0Service.validateCodeSyntax('   ', 'javascript');
      expect(result.valid).toBe(false);
    });
  });

  describe('executeCode (mock)', () => {
    it('should return mock execution result when API key not set', async () => {
      // Temporarily unset API key to trigger mock
      const originalKey = process.env.JUDGE0_API_KEY;
      delete process.env.JUDGE0_API_KEY;

      const result = await judge0Service.executeCode('print("hello")', 'python');

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
      expect(result.status).toBeDefined();

      // Restore API key
      process.env.JUDGE0_API_KEY = originalKey;
    });

    it('should include execution metadata in result', async () => {
      const result = await judge0Service.executeCode('print("test")', 'python');

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('output');
      expect(result).toHaveProperty('error');
      expect(result).toHaveProperty('exitCode');
      expect(result).toHaveProperty('executionTime');
      expect(result).toHaveProperty('memory');
    });
  });

  describe('LANGUAGE_MAP', () => {
    it('should contain common programming languages', () => {
      expect(judge0Service.LANGUAGE_MAP).toHaveProperty('javascript');
      expect(judge0Service.LANGUAGE_MAP).toHaveProperty('python');
      expect(judge0Service.LANGUAGE_MAP).toHaveProperty('java');
      expect(judge0Service.LANGUAGE_MAP).toHaveProperty('cpp');
      expect(judge0Service.LANGUAGE_MAP).toHaveProperty('c');
    });
  });

  describe('EXECUTION_TIMEOUT', () => {
    it('should have reasonable timeout value', () => {
      expect(judge0Service.EXECUTION_TIMEOUT).toBe(15);
      expect(judge0Service.EXECUTION_TIMEOUT).toBeGreaterThan(0);
      expect(judge0Service.EXECUTION_TIMEOUT).toBeLessThan(60);
    });
  });
});
