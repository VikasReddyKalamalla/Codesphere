const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const testAttemptService  = require('../services/testAttempt.service');

const startTest       = asyncHandler(async (req, res) => successResponse(res, 201, 'Test started successfully', await testAttemptService.startTest(req.params.id, req.user._id)));
const pauseTest       = asyncHandler(async (req, res) => successResponse(res, 200, 'Test paused successfully', await testAttemptService.pauseTest(req.params.id, req.user._id)));
const resumeTest      = asyncHandler(async (req, res) => successResponse(res, 200, 'Test resumed successfully', await testAttemptService.resumeTest(req.params.id, req.user._id)));
const saveAnswer      = asyncHandler(async (req, res) => successResponse(res, 200, 'Answer saved successfully', await testAttemptService.saveAnswer(req.params.id, req.user._id, req.body)));
const submitTest      = asyncHandler(async (req, res) => successResponse(res, 200, 'Test submitted successfully', await testAttemptService.submitTest(req.params.id, req.user._id)));
const getMyAttempts   = asyncHandler(async (req, res) => successResponse(res, 200, 'Your attempts fetched successfully', await testAttemptService.getMyAttempts(req.user._id, req.query)));
const getAttemptResult= asyncHandler(async (req, res) => successResponse(res, 200, 'Result fetched successfully', await testAttemptService.getAttemptResult(req.params.id, req.user._id, req.user.role)));
const getTestResults  = asyncHandler(async (req, res) => successResponse(res, 200, 'Test results fetched successfully', await testAttemptService.getTestResults(req.params.id, req.user._id, req.user.role, req.query)));

module.exports = { startTest, pauseTest, resumeTest, saveAnswer, submitTest, getMyAttempts, getAttemptResult, getTestResults };
