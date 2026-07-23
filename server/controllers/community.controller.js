const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const communityService    = require('../services/community.service');

// GET /api/communities
const getAllCommunities = asyncHandler(async (req, res) => {
  const data = await communityService.getAllCommunities(req.query);
  return successResponse(res, 200, 'Communities fetched successfully', data);
});

// GET /api/communities/:id
const getCommunityById = asyncHandler(async (req, res) => {
  const data = await communityService.getCommunityById(req.params.id);
  return successResponse(res, 200, 'Community fetched successfully', data);
});

// POST /api/communities
const createCommunity = asyncHandler(async (req, res) => {
  const data = await communityService.createCommunity(req.body, req.user._id);
  return successResponse(res, 201, 'Community created successfully', data);
});

// PUT /api/communities/:id
const updateCommunity = asyncHandler(async (req, res) => {
  const data = await communityService.updateCommunity(req.params.id, req.body, req.user._id, req.user.role);
  return successResponse(res, 200, 'Community updated successfully', data);
});

// DELETE /api/communities/:id
const deleteCommunity = asyncHandler(async (req, res) => {
  await communityService.deleteCommunity(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Community deleted successfully');
});

// POST /api/communities/:id/join
const joinCommunity = asyncHandler(async (req, res) => {
  const data = await communityService.joinCommunity(req.params.id, req.user._id);
  return successResponse(res, 200, 'Joined community successfully', data);
});

// DELETE /api/communities/:id/leave
const leaveCommunity = asyncHandler(async (req, res) => {
  const data = await communityService.leaveCommunity(req.params.id, req.user._id);
  return successResponse(res, 200, 'Left community successfully', data);
});

// GET /api/communities/:id/members
const getMembers = asyncHandler(async (req, res) => {
  const data = await communityService.getMembers(req.params.id, req.query);
  return successResponse(res, 200, 'Members fetched successfully', data);
});

// POST /api/communities/:id/moderators/:userId
const promoteModerator = asyncHandler(async (req, res) => {
  const data = await communityService.promoteModerator(req.params.id, req.params.userId, req.user._id);
  return successResponse(res, 200, 'Moderator promoted successfully', data);
});

// DELETE /api/communities/:id/moderators/:userId
const removeModerator = asyncHandler(async (req, res) => {
  const data = await communityService.removeModerator(req.params.id, req.params.userId, req.user._id);
  return successResponse(res, 200, 'Moderator removed successfully', data);
});

module.exports = {
  getAllCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  getMembers,
  promoteModerator,
  removeModerator,
};
