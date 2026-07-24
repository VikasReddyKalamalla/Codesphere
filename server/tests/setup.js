/**
 * Jest Setup File
 * Configure test environment before running tests
 */

require('dotenv').config({ path: '.env.test' });

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/codesphere-test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JUDGE0_API_KEY = 'test-api-key'; // Will use mock

// Set default timeout
jest.setTimeout(30000);

// Suppress console logs during tests
if (process.env.SUPPRESS_LOGS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
  };
}
