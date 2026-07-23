const Workspace       = require('../models/Workspace');
const WorkspaceMember = require('../models/WorkspaceMember');
const WorkspaceInvite = require('../models/WorkspaceInvite');
const User            = require('../models/User');
const activityService = require('./workspaceActivity.service');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── INVITE MEMBER ────────────────────────────────────────────────────────────
const inviteMember = async (workspaceId, invitedUserId, inviterId, role = 'member', invitedEmail = null) => {
  let userId = invitedUserId;
  if (!userId && invitedEmail) {
    const user = await User.findOne({ email: invitedEmail });
    if (!user) throw createError('User with this email not found', 404);
    userId = user._id;
  }

  if (!userId) throw createError('User ID or email is required to invite', 400);

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw createError('Workspace not found', 404);

  // Only owner or admin members can invite
  const inviter = await WorkspaceMember.findOne({ workspaceId, userId: inviterId });
  if (!inviter || (inviter.role !== 'owner' && inviter.role !== 'admin')) {
    throw createError('Only workspace owners or admins can invite members', 403);
  }

  // Check if target is already a member
  const alreadyMember = await WorkspaceMember.findOne({ workspaceId, userId });
  if (alreadyMember) throw createError('User is already a member of this workspace', 409);

  // Check for existing pending invite
  const existingInvite = await WorkspaceInvite.findOne({ workspaceId, invitedUserId: userId, status: 'pending' });
  if (existingInvite) throw createError('User already has a pending invitation', 409);

  const invite = await WorkspaceInvite.create({
    workspaceId,
    invitedUserId: userId,
    invitedBy: inviterId,
    role,
  });

  return invite;
};

// ─── ACCEPT INVITATION ────────────────────────────────────────────────────────
const acceptInvitation = async (workspaceId, userId) => {
  const invite = await WorkspaceInvite.findOne({ workspaceId, invitedUserId: userId, status: 'pending' });
  if (!invite) throw createError('Pending invitation not found', 404);

  invite.status      = 'accepted';
  invite.respondedAt = new Date();
  await invite.save();

  // Add user to workspace members
  await WorkspaceMember.create({ workspaceId, userId, role: invite.role });

  // Increment member count
  await Workspace.findByIdAndUpdate(workspaceId, { $inc: { memberCount: 1 } });

  await activityService.log(workspaceId, userId, 'member_joined', `A new member joined the workspace`, 'member', userId);

  return { message: 'Invitation accepted. Welcome to the workspace!' };
};

// ─── REJECT INVITATION ────────────────────────────────────────────────────────
const rejectInvitation = async (workspaceId, userId) => {
  const invite = await WorkspaceInvite.findOne({ workspaceId, invitedUserId: userId, status: 'pending' });
  if (!invite) throw createError('Pending invitation not found', 404);

  invite.status      = 'rejected';
  invite.respondedAt = new Date();
  await invite.save();

  return { message: 'Invitation rejected' };
};

// ─── REMOVE MEMBER ────────────────────────────────────────────────────────────
const removeMember = async (workspaceId, targetUserId, requesterId, userRole) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw createError('Workspace not found', 404);

  // Cannot remove the owner
  if (workspace.owner.toString() === targetUserId.toString()) {
    throw createError('Cannot remove the workspace owner', 400);
  }

  const requester = await WorkspaceMember.findOne({ workspaceId, userId: requesterId });
  const isAdmin = userRole === 'admin';
  const isOwnerOrAdmin = requester && (requester.role === 'owner' || requester.role === 'admin');

  if (!isAdmin && !isOwnerOrAdmin) {
    throw createError('Only workspace owners or admins can remove members', 403);
  }

  const member = await WorkspaceMember.findOneAndDelete({ workspaceId, userId: targetUserId });
  if (!member) throw createError('Member not found in this workspace', 404);

  // Decrement member count
  await Workspace.findByIdAndUpdate(workspaceId, { $inc: { memberCount: -1 } });

  await activityService.log(workspaceId, requesterId, 'member_removed', 'A member was removed from the workspace', 'member', targetUserId);

  return { message: 'Member removed successfully' };
};

// ─── LEAVE WORKSPACE ──────────────────────────────────────────────────────────
const leaveWorkspace = async (workspaceId, userId) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw createError('Workspace not found', 404);

  if (workspace.owner.toString() === userId.toString()) {
    throw createError('Workspace owner cannot leave. Transfer ownership first.', 400);
  }

  const member = await WorkspaceMember.findOneAndDelete({ workspaceId, userId });
  if (!member) throw createError('You are not a member of this workspace', 404);

  await Workspace.findByIdAndUpdate(workspaceId, { $inc: { memberCount: -1 } });

  await activityService.log(workspaceId, userId, 'member_left', 'A member left the workspace', 'member', userId);

  return { message: 'Left workspace successfully' };
};

// ─── TRANSFER OWNERSHIP ───────────────────────────────────────────────────────
const transferOwnership = async (workspaceId, newOwnerId, currentOwnerId) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw createError('Workspace not found', 404);

  if (workspace.owner.toString() !== currentOwnerId.toString()) {
    throw createError('Only the current owner can transfer ownership', 403);
  }

  // New owner must already be a member
  const newOwnerMember = await WorkspaceMember.findOne({ workspaceId, userId: newOwnerId });
  if (!newOwnerMember) throw createError('New owner must be an existing member', 400);

  // Demote current owner to admin
  await WorkspaceMember.findOneAndUpdate(
    { workspaceId, userId: currentOwnerId },
    { role: 'admin' }
  );

  // Promote new owner
  await WorkspaceMember.findOneAndUpdate(
    { workspaceId, userId: newOwnerId },
    { role: 'owner' }
  );

  workspace.owner = newOwnerId;
  await workspace.save();

  await activityService.log(workspaceId, currentOwnerId, 'settings_updated', 'Workspace ownership was transferred', 'settings', workspaceId);

  return { message: 'Ownership transferred successfully' };
};

// ─── GET MEMBERS ──────────────────────────────────────────────────────────────
const getMembers = async (workspaceId, userId, { page = 1, limit = 20 }) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw createError('Workspace not found', 404);

  if (workspace.visibility === 'private') {
    const isMember = await WorkspaceMember.findOne({ workspaceId, userId });
    if (!isMember) throw createError('Access denied', 403);
  }

  const total = await WorkspaceMember.countDocuments({ workspaceId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const members = await WorkspaceMember.find({ workspaceId })
    .populate('userId', 'fullName avatar bio email')
    .sort({ joinedAt: 1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, members };
};

// ─── GET PENDING INVITES (for workspace admin) ────────────────────────────────
const getPendingInvites = async (workspaceId, requesterId) => {
  const member = await WorkspaceMember.findOne({ workspaceId, userId: requesterId });
  if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
    throw createError('Only workspace owners or admins can view invitations', 403);
  }

  return WorkspaceInvite.find({ workspaceId, status: 'pending' })
    .populate('invitedUserId', 'fullName avatar email')
    .populate('invitedBy', 'fullName avatar')
    .sort({ invitedAt: -1 });
};

// ─── GET MY INVITES (for current user) ───────────────────────────────────────
const getMyInvites = async (userId) => {
  return WorkspaceInvite.find({ invitedUserId: userId, status: 'pending' })
    .populate({
      path:   'workspaceId',
      select: 'name description logo visibility status technologyStack',
      populate: { path: 'owner', select: 'fullName avatar' },
    })
    .populate('invitedBy', 'fullName avatar')
    .sort({ invitedAt: -1 });
};

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
