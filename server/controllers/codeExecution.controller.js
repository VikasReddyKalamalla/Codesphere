/**
 * Code Execution Controller
 * Handles code compilation and execution via Judge0
 */

const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const judge0Service = require('../services/judge0.service');
const SandboxSubmission = require('../models/SandboxSubmission');
const logger = require('../utils/logger');

/**
 * Run code and get execution result
 * POST /api/execute/run
 * Body: { code, language, input?, language_version? }
 */
const runCode = asyncHandler(async (req, res) => {
  const { code, language, input = '' } = req.body;

  // Validate required fields
  if (!code || !language) {
    return errorResponse(res, 400, 'Code and language are required');
  }

  // Validate syntax
  const validation = await judge0Service.validateCodeSyntax(code, language);
  if (!validation.valid) {
    return errorResponse(res, 400, validation.error);
  }

  // Execute code
  const result = await judge0Service.executeCode(code, language, input);

  logger.info(`Code executed for language: ${language}`);

  return successResponse(res, 200, 'Code executed successfully', result);
});

/**
 * Run code in a sandbox context for a specific step
 * POST /api/execute/sandbox/:projectId/:stepId
 */
const runSandboxCode = asyncHandler(async (req, res) => {
  const { projectId, stepId } = req.params;
  const { code, language, input = '', testCases = [] } = req.body;
  const userId = req.user._id;

  if (!code || !language) {
    return errorResponse(res, 400, 'Code and language are required');
  }

  // Execute code
  const result = await judge0Service.executeCode(code, language, input);

  // Run against test cases if provided
  const testResults = [];
  if (testCases && testCases.length > 0) {
    for (const testCase of testCases) {
      const testResult = await judge0Service.executeCode(code, language, testCase.input);
      testResults.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: testResult.output,
        passed: testResult.output.trim() === testCase.expectedOutput.trim(),
      });
    }
  }

  const allTestsPassed = testResults.length > 0 && testResults.every((t) => t.passed);

  // Save submission if tests passed or user manually submitted
  if (allTestsPassed || req.body.submit) {
    await SandboxSubmission.create({
      projectId,
      userId,
      submissionType: 'code',
      codeLanguage: language,
      codeContent: code,
      testsPassed: allTestsPassed,
      testResults,
      status: 'pending',
    });

    logger.info(`Code submission saved for project ${projectId}, user ${userId}`);
  }

  return successResponse(res, 200, 'Code executed successfully', {
    ...result,
    testResults,
    allTestsPassed,
  });
});

/**
 * Get supported languages
 * GET /api/execute/languages
 */
const getSupportedLanguages = asyncHandler(async (req, res) => {
  const languages = Object.keys(judge0Service.LANGUAGE_MAP).sort();
  return successResponse(res, 200, 'Supported languages retrieved', { languages });
});

/**
 * Get execution status (for polling)
 * GET /api/execute/status/:token
 */
const getExecutionStatus = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return errorResponse(res, 400, 'Execution token is required');
  }

  // In a real scenario, you'd poll Judge0 API
  // For now, return a placeholder
  return successResponse(res, 200, 'Status retrieved', { token, status: 'pending' });
});

module.exports = {
  runCode,
  runSandboxCode,
  getSupportedLanguages,
  getExecutionStatus,
};
