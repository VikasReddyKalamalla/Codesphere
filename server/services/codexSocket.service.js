const Message = require('../models/Message');
const ActivityLog = require('../models/ActivityLog');

/**
 * Save a workspace discussion message.
 */
const saveWorkspaceMessage = async ({ senderId, workspaceId, content }) => {
  const room = `workspace:${workspaceId}`;
  const message = await Message.create({ sender: senderId, room, content, type: 'text' });
  return message.populate('sender', 'fullName username avatar');
};

/**
 * Get workspace message history.
 */
const getWorkspaceMessages = async (workspaceId, { limit = 50 } = {}) => {
  const room = `workspace:${workspaceId}`;
  const messages = await Message.find({ room, isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate('sender', 'fullName username avatar')
    .lean();
  return messages.reverse();
};

/**
 * Log a workspace activity event (task update, member join, etc.).
 */
const logWorkspaceActivity = async ({ userId, workspaceId, action, metadata, socketId }) => {
  return ActivityLog.create({
    user: userId,
    module: 'Codex',
    action,
    referenceId: workspaceId,
    referenceType: 'Workspace',
    metadata,
    socketId,
  });
};

module.exports = {
  saveWorkspaceMessage,
  getWorkspaceMessages,
  logWorkspaceActivity,
};
