/**
 * Code Execution Controller Tests
 * Integration tests for code execution endpoints
 */

const request = require('supertest');

// Mock auth middleware
jest.mock('../../middlewares/auth.middleware', () => ({
  protect: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
    req.user = { _id: '507f1f77bcf86cd799439011', isActive: true };
    next();
  },
  optionalAuth: (req, res, next) => next(),
}));

const app = require('../../app');
const judge0Service = require('../../services/judge0.service');

// Mock Judge0 service
jest.mock('../../services/judge0.service');

// Mock SandboxSubmission model
jest.mock('../../models/SandboxSubmission', () => ({
  create: jest.fn().mockResolvedValue({}),
}));

describe('Code Execution Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/execute/run', () => {
    it('should execute code with valid language and code', async () => {
      const mockResult = {
        success: true,
        status: { id: 3, description: 'Accepted' },
        output: 'Hello World',
        error: '',
        exitCode: 0,
      };

      judge0Service.validateCodeSyntax.mockResolvedValue({ valid: true });
      judge0Service.executeCode.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/execute/run')
        .set('Authorization', 'Bearer valid_token')
        .send({
          code: 'console.log("Hello World")',
          language: 'javascript',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResult);
    });

    it('should reject request without code', async () => {
      const response = await request(app)
        .post('/api/execute/run')
        .set('Authorization', 'Bearer valid_token')
        .send({
          language: 'javascript',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject request without language', async () => {
      const response = await request(app)
        .post('/api/execute/run')
        .set('Authorization', 'Bearer valid_token')
        .send({
          code: 'console.log("test")',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should validate code syntax before execution', async () => {
      judge0Service.validateCodeSyntax.mockResolvedValue({ valid: false, error: 'Invalid syntax' });

      const response = await request(app)
        .post('/api/execute/run')
        .set('Authorization', 'Bearer valid_token')
        .send({
          code: 'invalid_code',
          language: 'javascript',
        });

      expect(response.status).toBe(400);
      expect(judge0Service.validateCodeSyntax).toHaveBeenCalled();
    });
  });

  describe('GET /api/execute/languages', () => {
    it('should return list of supported languages', async () => {
      const response = await request(app)
        .get('/api/execute/languages');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.languages)).toBe(true);
      expect(response.body.data.languages).toContain('javascript');
      expect(response.body.data.languages).toContain('python');
    });
  });

  describe('POST /api/execute/sandbox/:projectId/:stepId', () => {
    it('should execute code and run test cases', async () => {
      const mockResult = {
        success: true,
        output: '5',
        error: '',
        exitCode: 0,
      };

      judge0Service.validateCodeSyntax.mockResolvedValue({ valid: true });
      judge0Service.executeCode.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/execute/sandbox/507f1f77bcf86cd799439012/507f1f77bcf86cd799439013')
        .set('Authorization', 'Bearer valid_token')
        .send({
          code: 'console.log(2 + 3)',
          language: 'javascript',
          testCases: [
            { input: '', expectedOutput: '5' },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject without authentication', async () => {
      const response = await request(app)
        .post('/api/execute/sandbox/507f1f77bcf86cd799439012/507f1f77bcf86cd799439013')
        .send({
          code: 'console.log("test")',
          language: 'javascript',
        });

      expect(response.status).toBe(401);
    });
  });
});
