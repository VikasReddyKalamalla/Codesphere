const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const questionService     = require('../services/question.service');

const getTestQuestions = asyncHandler(async (req, res) => {
  const includeAnswers = req.query.includeAnswers === 'true' && (req.user.role === 'instructor' || req.user.role === 'admin');
  const data = await questionService.getTestQuestions(req.params.id, req.user._id, includeAnswers);
  return successResponse(res, 200, 'Questions fetched successfully', data);
});
const getQuestionById  = asyncHandler(async (req, res) => successResponse(res, 200, 'Question fetched successfully', await questionService.getQuestionById(req.params.id)));
const createQuestion   = asyncHandler(async (req, res) => successResponse(res, 201, 'Question created successfully', await questionService.createQuestion(req.body, req.user._id, req.user.role)));
const updateQuestion   = asyncHandler(async (req, res) => successResponse(res, 200, 'Question updated successfully', await questionService.updateQuestion(req.params.id, req.body, req.user._id, req.user.role)));
const deleteQuestion   = asyncHandler(async (req, res) => { await questionService.deleteQuestion(req.params.id, req.user._id, req.user.role); return successResponse(res, 200, 'Question deleted successfully'); });

module.exports = { getTestQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion };
