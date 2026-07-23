const asyncHandler           = require('../utils/asyncHandler');
const { successResponse }    = require('../utils/apiResponse');
const workspaceMemberService = require('../services/workspaceMember.service');

// POST /api/workspaces/:id/invite
const inviteMember = asyncHandler(async (req, res) => {
  const data = await workspaceMemberService.inviteMember(req.params.id, req.body.userId, req.user._id, req.body.role, req.body.email);
  return successResponse(res, 201, 'Invitation sent successfully', data);
});

// PUT /api/workspaces/:id/accept
const acceptInvitation = asyncHandler(async (req, res) => {
  const data = await workspaceMemberService.acceptInvitation(req.params.id, req.user._id);
  return successResponse(res, 200, 'Invitation accepted', data);
});

// PUT /api/workspaces/:id/reject
const rejectInvitation = asyncHandler(async (req, res) => {
  const data = await workspaceMemberService.rejectInvitation(req.params.id, req.user._id);
  return successResponse(res, 200, 'Invitation rejected', data);
});

// DELETE /api/workspaces/:id/members/:memberId
const removeMember = asyncHandler(async (req, res) => {
  const data = await workspaceMemberService.removeMember(req.params.id, req.params.memberId, req.user._id, req.user.role);
  return successResponse(res, 200, 'Member removed successfully', data);
});

// DELETE /api/workspaces/:id/leave
const leaveWorkspace = asyncHandler(async (req, res) => {
  const data = await workspaceMemberService.leaveWorkspace(req.params.id, req.user._id);
  return successResponse(res, 200, 'Left workspace successfully', data);
});

// PUT /api/workspaces/:id/transfer
const transferOwnership = asyncHandler(async (req, res) => {
  const data = await workspaceMemberService.transferOwnership(req.params.id, req.body.newOwnerId, req.user._id);
  return successResponse(res, 200, 'Ownership transferred successfully', data);
});

// GET /api/workspaces/:id/members
const getMembers = asyncHandler(async (req, res) => {
  const data = await workspaceMemberService.getMembers(req.params.id, req.user._id, req.query);
  return successResponse(res, 200, 'Members fetched successfully', data);
});

// GET /api/workspaces/:id/invites
const getPendingInvites = asyncHandler(async (req, res) => {
  const data = await workspaceMemberService.getPendingInvites(req.params.id, req.user._id);
  return successResponse(res, 200, 'Pending invites fetched successfully', data);
});

// GET /api/workspaces/my/invites
const getMyInvites = asyncHandler(async (req, res) => {
  const data = await workspaceMemberService.getMyInvites(req.user._id);
  return successResponse(res, 200, 'Your invitations fetched successfully', data);
});

module.exports = {
  inviteMember,
  acceptInvitation,
  rejectInvitation,
  removeMember,
  leaveWorkspace,
  transferOwnership,
  getMembers,
  getPendingInvites,
  getMyInvites,
};
