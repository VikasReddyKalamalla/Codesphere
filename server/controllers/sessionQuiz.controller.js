const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const sessionQuizService = require('../services/sessionQuiz.service');

const getQuizzes = asyncHandler(async (req, res) => {
  const data = await sessionQuizService.getQuizzes(req.params.id, req.user._id);
  return successResponse(res, 200, 'Quizzes retrieved successfully', data);
});

const createQuiz = asyncHandler(async (req, res) => {
  const data = await sessionQuizService.createQuiz(req.params.id, req.user._id, req.body);
  return successResponse(res, 201, 'Quiz created successfully', data);
});

const startQuiz = asyncHandler(async (req, res) => {
  const data = await sessionQuizService.startQuiz(req.params.qzId, req.user._id);
  return successResponse(res, 200, 'Quiz started successfully', data);
});

const submitQuizAttempt = asyncHandler(async (req, res) => {
  const data = await sessionQuizService.submitQuizAttempt(req.params.qzId, req.user._id, req.body.answers);
  return successResponse(res, 201, 'Quiz attempt submitted successfully', data);
});

module.exports = {
  getQuizzes,
  createQuiz,
  startQuiz,
  submitQuizAttempt,
};
