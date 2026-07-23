const Leaderboard      = require('../models/Leaderboard');
const Test             = require('../models/Test');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getLeaderboard = async (testId, { page = 1, limit = 50 }) => {
  const test = await Test.findById(testId);
  if (!test) throw createError('Test not found', 404);

  const total = await Leaderboard.countDocuments({ testId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const entries = await Leaderboard.find({ testId })
    .populate('userId', 'fullName avatar')
    .sort({ score: -1, timeTaken: 1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, leaderboard: entries };
};

const getMyRank = async (testId, userId) => {
  const test = await Test.findById(testId);
  if (!test) throw createError('Test not found', 404);

  const entry = await Leaderboard.findOne({ testId, userId });
  if (!entry) return { rank: null, score: 0, percentage: 0, message: 'You have not submitted this test yet' };

  return { rank: entry.rank, score: entry.score, percentage: entry.percentage, timeTaken: entry.timeTaken };
};

module.exports = { getLeaderboard, getMyRank };
