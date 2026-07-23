const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const inviteService       = require('../services/invite.service');

// POST /api/invites
const sendInvite = asyncHandler(async (req, res) => {
  const data = await inviteService.sendInvite(req.body, req.user._id);
  return successResponse(res, 201, 'Invite sent successfully', data);
});

// PUT /api/invites/:id/accept
const acceptInvite = asyncHandler(async (req, res) => {
  const data = await inviteService.acceptInvite(req.params.id, req.user._id);
  return successResponse(res, 200, 'Invite accepted successfully', data);
});

// PUT /api/invites/:id/reject
const rejectInvite = asyncHandler(async (req, res) => {
  const data = await inviteService.rejectInvite(req.params.id, req.user._id);
  return successResponse(res, 200, 'Invite rejected successfully', data);
});

// GET /api/invites
const getUserInvites = asyncHandler(async (req, res) => {
  const data = await inviteService.getUserInvites(req.user._id);
  return successResponse(res, 200, 'Invites fetched successfully', data);
});

module.exports = { sendInvite, acceptInvite, rejectInvite, getUserInvites };
