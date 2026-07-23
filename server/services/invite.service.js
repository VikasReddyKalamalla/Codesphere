const CommunityInvite = require('../models/CommunityInvite');
const Community       = require('../models/Community');
const User            = require('../models/User');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── SEND INVITE ──────────────────────────────────────────────────────────────
const sendInvite = async (body, userId) => {
  const { communityId, invitedUser, message } = body;

  if (!communityId)  throw createError('Community ID is required', 400);
  if (!invitedUser)  throw createError('Invited user ID is required', 400);

  const community = await Community.findById(communityId);
  if (!community) throw createError('Community not found', 404);

  // Only owner/moderators can invite
  const isOwner     = community.owner.toString() === userId.toString();
  const isModerator = community.moderators.some((m) => m.toString() === userId.toString());

  if (!isOwner && !isModerator) {
    throw createError('Only owner or moderators can send invites', 403);
  }

  // Check if user already a member
  if (community.members.includes(invitedUser)) {
    throw createError('User is already a member', 409);
  }

  // Check if already invited
  const existing = await CommunityInvite.findOne({ communityId, invitedUser, status: 'pending' });
  if (existing) throw createError('Invite already sent', 409);

  return CommunityInvite.create({ communityId, invitedBy: userId, invitedUser, message, status: 'pending' });
};

// ─── ACCEPT INVITE ────────────────────────────────────────────────────────────
const acceptInvite = async (inviteId, userId) => {
  const invite = await CommunityInvite.findById(inviteId);
  if (!invite) throw createError('Invite not found', 404);

  if (invite.invitedUser.toString() !== userId.toString()) {
    throw createError('This invite is not for you', 403);
  }

  if (invite.status !== 'pending') {
    throw createError('This invite is no longer valid', 400);
  }

  invite.status      = 'accepted';
  invite.respondedAt = new Date();
  await invite.save();

  // Add user to community
  await Community.findByIdAndUpdate(invite.communityId, {
    $addToSet: { members: userId },
    $inc:      { memberCount: 1 },
  });

  return { message: 'Invite accepted successfully' };
};

// ─── REJECT INVITE ────────────────────────────────────────────────────────────
const rejectInvite = async (inviteId, userId) => {
  const invite = await CommunityInvite.findById(inviteId);
  if (!invite) throw createError('Invite not found', 404);

  if (invite.invitedUser.toString() !== userId.toString()) {
    throw createError('This invite is not for you', 403);
  }

  if (invite.status !== 'pending') {
    throw createError('This invite is no longer valid', 400);
  }

  invite.status      = 'rejected';
  invite.respondedAt = new Date();
  await invite.save();

  return { message: 'Invite rejected successfully' };
};

// ─── GET USER INVITES ─────────────────────────────────────────────────────────
const getUserInvites = async (userId) => {
  return CommunityInvite.find({ invitedUser: userId, status: 'pending' })
    .populate('communityId', 'name logo')
    .populate('invitedBy',   'fullName avatar')
    .sort({ createdAt: -1 });
};

module.exports = { sendInvite, acceptInvite, rejectInvite, getUserInvites };
