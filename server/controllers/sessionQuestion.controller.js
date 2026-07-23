const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const sessionQuestionService = require('../services/sessionQuestion.service');

const getQuestions = asyncHandler(async (req, res) => {
  const data = await sessionQuestionService.getQuestions(req.params.id);
  return successResponse(res, 200, 'Questions retrieved successfully', data);
});

const askQuestion = asyncHandler(async (req, res) => {
  const data = await sessionQuestionService.askQuestion(req.params.id, req.user._id, req.body.questionText);
  return successResponse(res, 201, 'Question asked successfully', data);
});

const postAnswer = asyncHandler(async (req, res) => {
  const data = await sessionQuestionService.postAnswer(req.params.qId, req.user._id, req.body.answerText);
  return successResponse(res, 201, 'Answer posted successfully', data);
});

const voteQuestion = asyncHandler(async (req, res) => {
  const data = await sessionQuestionService.voteQuestion(req.params.qId, req.user._id);
  return successResponse(res, 200, 'Vote updated successfully', data);
});

const pinQuestion = asyncHandler(async (req, res) => {
  const data = await sessionQuestionService.pinQuestion(req.params.qId, req.user._id);
  return successResponse(res, 200, 'Question pin toggled', data);
});

const markAnswered = asyncHandler(async (req, res) => {
  const data = await sessionQuestionService.markAnswered(req.params.qId, req.user._id);
  return successResponse(res, 200, 'Question answered status toggled', data);
});

module.exports = {
  getQuestions,
  askQuestion,
  postAnswer,
  voteQuestion,
  pinQuestion,
  markAnswered,
};
