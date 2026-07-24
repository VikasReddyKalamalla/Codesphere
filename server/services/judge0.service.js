/**
 * Judge0 Code Compilation Service
 * Integrates with Judge0 API for executing code submissions
 * Docs: https://judge0.com/
 */

const axios = require('axios');
const logger = require('../utils/logger');

const JUDGE0_API_BASE = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_HOST = process.env.JUDGE0_HOST || 'judge0-ce.p.rapidapi.com';

// Language ID mappings for Judge0
const LANGUAGE_MAP = {
  'javascript': 63,
  'python': 71,
  'java': 62,
  'cpp': 54,
  'c': 50,
  'csharp': 51,
  'php': 68,
  'ruby': 72,
  'go': 60,
  'rust': 73,
};

// Maximum execution time (seconds)
const EXECUTION_TIMEOUT = 15;

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get language ID from language name
 */
const getLanguageId = (language) => {
  const langId = LANGUAGE_MAP[language.toLowerCase()];
  if (!langId) {
    throw createError(`Language '${language}' is not supported`, 400);
  }
  return langId;
};

/**
 * Submit code to Judge0 for compilation and execution
 * @param {string} code - Source code to execute
 * @param {string} language - Programming language
 * @param {string} input - Standard input (optional)
 * @param {number} timeLimit - Execution time limit in seconds (default: 15)
 * @returns {Promise<Object>} Execution result with stdout, stderr, status
 */
const executeCode = async (code, language, input = '', timeLimit = EXECUTION_TIMEOUT) => {
  try {
    if (!JUDGE0_API_KEY) {
      logger.warn('Judge0 API key not configured, returning mock result');
      return getMockExecutionResult(code, language);
    }

    const languageId = getLanguageId(language);

    // Step 1: Submit code for execution
    const submissionResponse = await axios.post(
      `${JUDGE0_API_BASE}/submissions?base64_encoded=false&wait=false`,
      {
        language_id: languageId,
        source_code: code,
        stdin: input || '',
        cpu_time_limit: timeLimit,
        wall_time_limit: timeLimit * 2,
        memory_limit: 128000, // 128 MB
      },
      {
        headers: {
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': JUDGE0_HOST,
          'Content-Type': 'application/json',
        },
      }
    );

    const token = submissionResponse.data.token;
    logger.info(`Code submission token: ${token}`);

    // Step 2: Poll for result (with timeout)
    const result = await pollJudge0Result(token, timeLimit * 3);
    return result;
  } catch (error) {
    logger.error(`Judge0 execution error: ${error.message}`);
    throw createError(`Code execution failed: ${error.message}`, 500);
  }
};

/**
 * Poll Judge0 for execution result
 */
const pollJudge0Result = async (token, maxWaitTime = 30) => {
  const startTime = Date.now();
  const pollInterval = 500; // 500ms

  while (Date.now() - startTime < maxWaitTime * 1000) {
    try {
      const response = await axios.get(
        `${JUDGE0_API_BASE}/submissions/${token}?base64_encoded=false`,
        {
          headers: {
            'X-RapidAPI-Key': JUDGE0_API_KEY,
            'X-RapidAPI-Host': JUDGE0_HOST,
          },
        }
      );

      const submission = response.data;

      // Check if execution is complete
      if (submission.status.id !== 1 && submission.status.id !== 2) {
        // Status 1 = In Queue, 2 = Processing
        return {
          success: true,
          status: submission.status,
          statusText: submission.status.description,
          output: submission.stdout || '',
          error: submission.stderr || '',
          exitCode: submission.exit_code,
          executionTime: submission.time,
          memory: submission.memory,
        };
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (error) {
      logger.error(`Judge0 polling error: ${error.message}`);
      throw error;
    }
  }

  throw createError('Code execution timed out', 504);
};

/**
 * Mock execution result for development/testing
 */
const getMockExecutionResult = (code, language) => {
  // Simple mock: just return success with a generic message
  return {
    success: true,
    status: { id: 3, description: 'Accepted' },
    statusText: 'Accepted',
    output: `Code executed successfully (Mock - ${language})\n`,
    error: '',
    exitCode: 0,
    executionTime: 0.012,
    memory: 512,
  };
};

/**
 * Validate code syntax (optional, basic check)
 */
const validateCodeSyntax = async (code, language) => {
  try {
    const languageId = getLanguageId(language);
    // Most basic validation: check if code is not empty
    if (!code || code.trim().length === 0) {
      throw createError('Code cannot be empty', 400);
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

module.exports = {
  executeCode,
  getLanguageId,
  validateCodeSyntax,
  LANGUAGE_MAP,
  EXECUTION_TIMEOUT,
};
