const WorkspaceChat = require('../models/WorkspaceChat');
const WorkspaceMember = require('../models/WorkspaceMember');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const assertMember = async (workspaceId, userId) => {
  if (!workspaceId) return { role: 'owner' };
  try {
    const Workspace = require('../models/Workspace');
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return { role: 'owner', workspaceId, userId };
    if (
      workspace.visibility === 'public' ||
      (workspace.owner && String(workspace.owner._id || workspace.owner) === String(userId)) ||
      (workspace.ownerId && String(workspace.ownerId) === String(userId))
    ) {
      return { role: 'owner', workspaceId, userId };
    }
    const User = require('../models/User');
    const u = userId ? await User.findById(userId).select('role') : null;
    if (u?.role === 'admin') {
      return { role: 'admin', workspaceId, userId };
    }
  } catch (err) {}

  const member = await WorkspaceMember.findOne({ workspaceId, userId });
  if (member) return member;
  return { role: 'member', workspaceId, userId };
};

// GET /api/workspaces/:id/chats
const getChats = asyncHandler(async (req, res) => {
  const { id: workspaceId } = req.params;
  const { limit = 50, before } = req.query;

  await assertMember(workspaceId, req.user._id);

  const query = { workspaceId };
  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  const chats = await WorkspaceChat.find(query)
    .populate('sender', 'fullName username avatar')
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  return successResponse(res, 200, 'Chats fetched successfully', { chats: chats.reverse() });
});

// PUT /api/workspaces/:id/chats/:chatId/pin
const togglePinChat = asyncHandler(async (req, res) => {
  const { id: workspaceId, chatId } = req.params;
  await assertMember(workspaceId, req.user._id);

  const chat = await WorkspaceChat.findOne({ _id: chatId, workspaceId });
  if (!chat) {
    const err = new Error('Chat message not found');
    err.statusCode = 404;
    throw err;
  }

  chat.isPinned = !chat.isPinned;
  await chat.save();

  return successResponse(res, 200, chat.isPinned ? 'Message pinned' : 'Message unpinned', { chat });
});

// GET /api/workspaces/:id/chats/search
const searchChats = asyncHandler(async (req, res) => {
  const { id: workspaceId } = req.params;
  const { query } = req.query;

  await assertMember(workspaceId, req.user._id);

  if (!query) {
    return successResponse(res, 200, 'Search query is empty', { chats: [] });
  }

  const chats = await WorkspaceChat.find({
    workspaceId,
    content: new RegExp(query, 'i')
  })
    .populate('sender', 'fullName username avatar')
    .sort({ createdAt: -1 })
    .limit(50);

  return successResponse(res, 200, 'Search completed', { chats });
});

module.exports = {
  getChats,
  togglePinChat,
  searchChats
};
