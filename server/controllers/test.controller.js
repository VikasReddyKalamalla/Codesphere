const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const testService         = require('../services/test.service');
const { broadcastDataChange } = require('../utils/realtimeBroadcast');

const getAllTests      = asyncHandler(async (req, res) => successResponse(res, 200, 'Tests fetched successfully', await testService.getAllTests(req.query)));
const getMyTests       = asyncHandler(async (req, res) => successResponse(res, 200, 'My tests fetched successfully', await testService.getMyTests(req.user._id, req.query)));
const getTestById      = asyncHandler(async (req, res) => successResponse(res, 200, 'Test fetched successfully', await testService.getTestById(req.params.id)));
const getTestBySlug    = asyncHandler(async (req, res) => successResponse(res, 200, 'Test fetched successfully', await testService.getTestBySlug(req.params.slug)));

const createTest       = asyncHandler(async (req, res) => {
  const data = await testService.createTest(req.body, req.user._id);
  broadcastDataChange('test', 'created', data);
  return successResponse(res, 201, 'Test created successfully', data);
});

const updateTest       = asyncHandler(async (req, res) => {
  const data = await testService.updateTest(req.params.id, req.body, req.user._id, req.user.role);
  broadcastDataChange('test', 'updated', data);
  return successResponse(res, 200, 'Test updated successfully', data);
});

const deleteTest       = asyncHandler(async (req, res) => {
  await testService.deleteTest(req.params.id, req.user._id, req.user.role);
  broadcastDataChange('test', 'deleted', { id: req.params.id });
  return successResponse(res, 200, 'Test deleted successfully');
});

const publishTest      = asyncHandler(async (req, res) => {
  const data = await testService.publishTest(req.params.id, req.user._id, req.user.role);
  broadcastDataChange('test', 'published', data);
  return successResponse(res, 200, 'Test published successfully', data);
});

const archiveTest      = asyncHandler(async (req, res) => {
  const data = await testService.archiveTest(req.params.id, req.user._id, req.user.role);
  broadcastDataChange('test', 'archived', data);
  return successResponse(res, 200, 'Test archived successfully', data);
});

const getTestAnalytics = asyncHandler(async (req, res) => successResponse(res, 200, 'Test analytics fetched successfully', await testService.getTestAnalytics(req.params.id, req.user._id, req.user.role)));
const getLeaderboard    = asyncHandler(async (req, res) => successResponse(res, 200, 'Leaderboard fetched successfully', await testService.getLeaderboard()));
const getContests       = asyncHandler(async (req, res) => successResponse(res, 200, 'Contests fetched successfully', await testService.getContests()));
const submitTestAttempt = asyncHandler(async (req, res) => successResponse(res, 200, 'Test submitted successfully', await testService.submitTestAttempt(req.params.id, req.user._id, req.body)));
const generateAssessmentCertificate = asyncHandler(async (req, res) => successResponse(res, 200, 'Assessment certificate generated', await testService.generateAssessmentCertificate(req.params.id, req.user._id)));

module.exports = {
  getAllTests,
  getMyTests,
  getTestById,
  getTestBySlug,
  createTest,
  updateTest,
  deleteTest,
  publishTest,
  archiveTest,
  getTestAnalytics,
  getLeaderboard,
  getContests,
  submitTestAttempt,
  generateAssessmentCertificate,
};
