const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const communityService    = require('../services/community.service');
const channelService      = require('../services/channel.service');
const directChatService   = require('../services/directChat.service');
const communitySocketService = require('../services/communitySocket.service');
const Message             = require('../models/Message');
const Community           = require('../models/Community');
const crypto              = require('crypto');

// GET /api/community
const getAllCommunities = asyncHandler(async (req, res) => {
  const data = await communityService.getAllCommunities(req.query);
  return successResponse(res, 200, 'Communities fetched successfully', data);
});

// GET /api/community/:id
const getCommunityById = asyncHandler(async (req, res) => {
  const data = await communityService.getCommunityById(req.params.id);
  // Also ensure default channels are ready for this community
  await channelService.ensureDefaultChannels(req.params.id);
  return successResponse(res, 200, 'Community fetched successfully', data);
});

// POST /api/community
const createCommunity = asyncHandler(async (req, res) => {
  const data = await communityService.createCommunity(req.body, req.user._id);
  // Auto-generate default channels
  await channelService.ensureDefaultChannels(data._id);
  return successResponse(res, 201, 'Community created successfully', data);
});

// PUT /api/community/:id
const updateCommunity = asyncHandler(async (req, res) => {
  const data = await communityService.updateCommunity(req.params.id, req.body, req.user._id, req.user.role);
  return successResponse(res, 200, 'Community updated successfully', data);
});

// DELETE /api/community/:id
const deleteCommunity = asyncHandler(async (req, res) => {
  await communityService.deleteCommunity(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Community deleted successfully');
});

const { getIO } = require('../socket/socket');

// POST /api/community/:id/join
const joinCommunity = asyncHandler(async (req, res) => {
  const data = await communityService.joinCommunity(req.params.id, req.user._id);
  try {
    getIO().emit('community:membershipUpdated', data);
  } catch (err) {
    console.warn('[Socket] Could not emit membership update:', err.message);
  }
  return successResponse(res, 200, 'Joined community successfully', data);
});

// DELETE /api/community/:id/leave
const leaveCommunity = asyncHandler(async (req, res) => {
  const data = await communityService.leaveCommunity(req.params.id, req.user._id);
  try {
    getIO().emit('community:membershipUpdated', data);
  } catch (err) {
    console.warn('[Socket] Could not emit membership update:', err.message);
  }
  return successResponse(res, 200, 'Left community successfully', data);
});

// GET /api/community/:id/members
const getMembers = asyncHandler(async (req, res) => {
  const data = await communityService.getMembers(req.params.id, req.query);
  return successResponse(res, 200, 'Members fetched successfully', data);
});

// POST /api/community/:id/moderators/:userId
const promoteModerator = asyncHandler(async (req, res) => {
  const data = await communityService.promoteModerator(req.params.id, req.params.userId, req.user._id);
  return successResponse(res, 200, 'Moderator promoted successfully', data);
});

// DELETE /api/community/:id/moderators/:userId
const removeModerator = asyncHandler(async (req, res) => {
  const data = await communityService.removeModerator(req.params.id, req.params.userId, req.user._id);
  return successResponse(res, 200, 'Moderator removed successfully', data);
});

// ─── Channels Controller Endpoints ──────────────────────────────────────────

// GET /api/community/:id/channels
const getChannels = asyncHandler(async (req, res) => {
  const data = await channelService.getCommunityChannels(req.params.id);
  return successResponse(res, 200, 'Channels fetched successfully', data);
});

// POST /api/community/:id/channels
const createChannel = asyncHandler(async (req, res) => {
  const data = await channelService.createChannel(req.params.id, req.body, req.user._id);
  return successResponse(res, 201, 'Channel created successfully', data);
});

// PUT /api/community/channels/:channelId
const updateChannel = asyncHandler(async (req, res) => {
  const data = await channelService.updateChannel(req.params.channelId, req.body, req.user._id);
  return successResponse(res, 200, 'Channel updated successfully', data);
});

// DELETE /api/community/channels/:channelId
const deleteChannel = asyncHandler(async (req, res) => {
  const data = await channelService.deleteChannel(req.params.channelId, req.user._id);
  return successResponse(res, 200, 'Channel deleted successfully', data);
});

// GET /api/community/channels/:channelId/messages
const getChannelMessages = asyncHandler(async (req, res) => {
  const { before, limit = 50 } = req.query;
  const roomKey = `channel:${req.params.channelId}`;
  const messages = await communitySocketService.getMessageHistory(roomKey, { before, limit });
  return successResponse(res, 200, 'Messages fetched successfully', { messages });
});

// ─── Direct Messaging (WhatsApp Style) ───────────────────────────────────────

// GET /api/community/direct/chats
const getDirectChats = asyncHandler(async (req, res) => {
  const chats = await directChatService.getUserDirectChats(req.user._id);
  return successResponse(res, 200, 'Direct chats fetched successfully', chats);
});

// POST /api/community/direct/chats
const openDirectChat = asyncHandler(async (req, res) => {
  const { targetUserId } = req.body;
  if (!targetUserId) {
    return res.status(400).json({ success: false, message: 'targetUserId is required' });
  }
  const chat = await directChatService.getOrCreateDirectChat(req.user._id, targetUserId);
  return successResponse(res, 200, 'Direct chat ready', chat);
});

// POST /api/community/direct/groups
const createGroupChat = asyncHandler(async (req, res) => {
  const group = await directChatService.createGroupChat(req.user._id, req.body);
  return successResponse(res, 201, 'Group chat created', group);
});

// GET /api/community/direct/chats/:chatId/messages
const getDirectChatMessages = asyncHandler(async (req, res) => {
  const { before, limit = 50 } = req.query;
  const roomKey = `direct:${req.params.chatId}`;
  const messages = await communitySocketService.getMessageHistory(roomKey, { before, limit });
  await directChatService.markChatAsRead(req.params.chatId, req.user._id);
  return successResponse(res, 200, 'Messages fetched', { messages });
});

// ─── Search & Starred Messages ──────────────────────────────────────────────

// GET /api/community/:id/search
const searchCommunityMessages = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return successResponse(res, 200, 'Empty search query', []);
  const results = await communitySocketService.searchMessages({
    query: q,
    communityId: req.params.id,
  });
  return successResponse(res, 200, 'Search results', results);
});

// GET /api/community/messages/starred
const getStarredMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    starredBy: req.user._id,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .populate('sender', 'fullName username avatar')
    .lean();
  return successResponse(res, 200, 'Starred messages', messages);
});

// POST /api/community/:id/invite-code
const generateInviteCode = asyncHandler(async (req, res) => {
  const code = crypto.randomBytes(4).toString('hex').toUpperCase();
  const community = await Community.findByIdAndUpdate(
    req.params.id,
    { inviteCode: code },
    { new: true }
  );
  return successResponse(res, 200, 'Invite code generated', { inviteCode: community.inviteCode });
});

// POST /api/community/join-by-code/:code
const joinByInviteCode = asyncHandler(async (req, res) => {
  const community = await Community.findOne({ inviteCode: req.params.code.trim().toUpperCase() });
  if (!community) {
    return res.status(404).json({ success: false, message: 'Invalid or expired invite code' });
  }
  const data = await communityService.joinCommunity(community._id, req.user._id);
  return successResponse(res, 200, `Successfully joined ${community.name}`, data);
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
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  getChannelMessages,
  getDirectChats,
  openDirectChat,
  createGroupChat,
  getDirectChatMessages,
  searchCommunityMessages,
  getStarredMessages,
  generateInviteCode,
  joinByInviteCode,
};
