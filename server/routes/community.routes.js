const express = require('express');
const router  = express.Router();
const {
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
} = require('../controllers/community.controller');

const { protect, optionalAuth } = require('../middlewares/auth.middleware');

// ─── Direct WhatsApp Messaging ────────────────────────────────────────────────
router.get ('/direct/chats',                      protect, getDirectChats);
router.post('/direct/chats',                      protect, openDirectChat);
router.post('/direct/groups',                     protect, createGroupChat);
router.get ('/direct/chats/:chatId/messages',     protect, getDirectChatMessages);

// ─── Starred Messages ─────────────────────────────────────────────────────────
router.get ('/messages/starred',                  protect, getStarredMessages);

// ─── Invite Codes ─────────────────────────────────────────────────────────────
router.post('/join-by-code/:code',                protect, joinByInviteCode);
router.post('/:id/invite-code',                   protect, generateInviteCode);

// ─── Channels ─────────────────────────────────────────────────────────────────
router.get ('/:id/channels',                      optionalAuth, getChannels);
router.post('/:id/channels',                      protect, createChannel);
router.put ('/channels/:channelId',               protect, updateChannel);
router.delete('/channels/:channelId',            protect, deleteChannel);
router.get ('/channels/:channelId/messages',      optionalAuth, getChannelMessages);

// ─── Search ───────────────────────────────────────────────────────────────────
router.get ('/:id/search',                        optionalAuth, searchCommunityMessages);

// ─── Membership ───────────────────────────────────────────────────────────────
router.post  ('/:id/join',                        protect, joinCommunity);
router.delete('/:id/leave',                       protect, leaveCommunity);
router.get   ('/:id/members',                     optionalAuth, getMembers);

// ─── Moderation ───────────────────────────────────────────────────────────────
router.post  ('/:id/moderators/:userId',          protect, promoteModerator);
router.delete('/:id/moderators/:userId',          protect, removeModerator);

// ─── Community CRUD ───────────────────────────────────────────────────────────
router.get ('/',                                  optionalAuth, getAllCommunities);
router.get ('/:id',                               optionalAuth, getCommunityById);
router.post('/',                                  protect, createCommunity);
router.put ('/:id',                               protect, updateCommunity);
router.delete('/:id',                             protect, deleteCommunity);

module.exports = router;
