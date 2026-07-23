const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const sessionPollService = require('../services/sessionPoll.service');

const getPolls = asyncHandler(async (req, res) => {
  const data = await sessionPollService.getPolls(req.params.id);
  return successResponse(res, 200, 'Polls retrieved successfully', data);
});

const createPoll = asyncHandler(async (req, res) => {
  const data = await sessionPollService.createPoll(req.params.id, req.user._id, req.body);
  return successResponse(res, 201, 'Poll created successfully', data);
});

const votePoll = asyncHandler(async (req, res) => {
  const data = await sessionPollService.votePoll(req.params.pId, req.user._id, req.body.optionIndex);
  return successResponse(res, 200, 'Vote recorded successfully', data);
});

const closePoll = asyncHandler(async (req, res) => {
  const data = await sessionPollService.closePoll(req.params.pId, req.user._id);
  return successResponse(res, 200, 'Poll closed successfully', data);
});

module.exports = {
  getPolls,
  createPoll,
  votePoll,
  closePoll,
};
