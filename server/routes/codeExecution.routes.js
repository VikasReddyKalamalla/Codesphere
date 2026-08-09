/**
 * Code Execution Routes
 * Endpoints for running and executing code via Judge0
 */

const express = require('express');
const router = express.Router();

const {
  runCode,
  runSandboxCode,
  getSupportedLanguages,
  getExecutionStatus,
} = require('../controllers/codeExecution.controller');

const { protect } = require('../middlewares/auth.middleware');
const rateLimit = require('express-rate-limit');

// Rate limiting for code execution (60 requests per minute per user)
const executionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: 'Too many code execution requests, please wait a moment before trying again',
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Code Execution ───────────────────────────────────────────────────────
router.post('/run', protect, executionLimiter, runCode);
router.get('/languages', getSupportedLanguages);
router.get('/status/:token', getExecutionStatus);

// ─── Sandbox Code Execution ───────────────────────────────────────────────
router.post('/sandbox/:projectId/:stepId', protect, executionLimiter, runSandboxCode);

module.exports = router;
