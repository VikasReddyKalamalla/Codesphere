const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const leaderboardService  = require('../services/leaderboard.service');

const getLeaderboard = asyncHandler(async (req, res) => successResponse(res, 200, 'Leaderboard fetched successfully', await leaderboardService.getLeaderboard(req.params.id, req.query)));
const getMyRank      = asyncHandler(async (req, res) => successResponse(res, 200, 'Your rank fetched successfully', await leaderboardService.getMyRank(req.params.id, req.user._id)));

module.exports = { getLeaderboard, getMyRank };
