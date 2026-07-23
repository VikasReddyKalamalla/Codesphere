const SessionPoll = require('../models/SessionPoll');
const LiveSession = require('../models/LiveSession');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getPolls = async (sessionId) => {
  return SessionPoll.find({ sessionId }).sort({ createdAt: -1 });
};

const createPoll = async (sessionId, creatorId, body) => {
  const { question, options, isAnonymous } = body;
  if (!question) throw createError('Poll question is required', 400);
  if (!options || options.length < 2) throw createError('At least 2 options are required', 400);

  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== creatorId.toString()) {
    throw createError('Only the host can create polls', 403);
  }

  return SessionPoll.create({
    sessionId,
    creatorId,
    question,
    options,
    isAnonymous: isAnonymous || false,
    votes: [],
  });
};

const votePoll = async (pollId, userId, optionIndex) => {
  const poll = await SessionPoll.findById(pollId);
  if (!poll) throw createError('Poll not found', 404);
  if (poll.isClosed) throw createError('Poll is already closed', 400);
  if (optionIndex < 0 || optionIndex >= poll.options.length) throw createError('Invalid option index', 400);

  // Check if already voted
  const existingVoteIndex = poll.votes.findIndex((v) => v.userId.toString() === userId.toString());
  if (existingVoteIndex > -1) {
    // Update vote option
    poll.votes[existingVoteIndex].optionIndex = optionIndex;
  } else {
    poll.votes.push({ userId, optionIndex });
  }

  await poll.save();
  return poll;
};

const closePoll = async (pollId, userId) => {
  const poll = await SessionPoll.findById(pollId);
  if (!poll) throw createError('Poll not found', 404);

  const session = await LiveSession.findById(poll.sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can close polls', 403);
  }

  poll.isClosed = true;
  await poll.save();

  return poll;
};

module.exports = {
  getPolls,
  createPoll,
  votePoll,
  closePoll,
};
