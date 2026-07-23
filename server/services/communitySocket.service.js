const Message = require('../models/Message');
const Room = require('../models/Room');

/**
 * Persist a chat message and return the saved document with sender info.
 */
const saveMessage = async ({ senderId, room, content, type = 'text', replyTo }) => {
  const message = await Message.create({
    sender: senderId,
    room,
    content,
    type,
    replyTo: replyTo || null,
  });

  return message.populate('sender', 'fullName username avatar');
};

/**
 * Get recent message history for a room (newest last, paginated).
 */
const getMessageHistory = async (roomKey, { page = 1, limit = 50 } = {}) => {
  const skip = (Number(page) - 1) * Number(limit);

  const messages = await Message.find({ room: roomKey, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('sender', 'fullName username avatar')
    .populate('replyTo', 'content sender')
    .lean();

  // Return in chronological order
  return messages.reverse();
};

/**
 * Edit a message – only the original sender may edit.
 */
const editMessage = async (messageId, senderId, newContent) => {
  const message = await Message.findOneAndUpdate(
    { _id: messageId, sender: senderId, isDeleted: false },
    { content: newContent, isEdited: true, editedAt: new Date() },
    { new: true }
  ).populate('sender', 'fullName username avatar');

  if (!message) throw Object.assign(new Error('Message not found or not authorized'), { statusCode: 403 });
  return message;
};

/**
 * Soft-delete a message.
 */
const deleteMessage = async (messageId, senderId, userRole) => {
  // Admin can delete any message; regular users only their own
  const filter = { _id: messageId, isDeleted: false };
  if (userRole !== 'admin') filter.sender = senderId;

  const message = await Message.findOneAndUpdate(
    filter,
    { isDeleted: true, deletedAt: new Date(), content: '[Message deleted]' },
    { new: true }
  );

  if (!message) throw Object.assign(new Error('Message not found or not authorized'), { statusCode: 403 });
  return message;
};

/**
 * Toggle a reaction on a message.
 * Returns the updated reactions map.
 */
const reactToMessage = async (messageId, userId, emoji) => {
  const message = await Message.findById(messageId);
  if (!message || message.isDeleted) {
    throw Object.assign(new Error('Message not found'), { statusCode: 404 });
  }

  const reactions = message.reactions || new Map();
  const users = reactions.get(emoji) || [];
  const idx = users.findIndex((id) => id.toString() === userId.toString());

  if (idx === -1) {
    users.push(userId);
  } else {
    users.splice(idx, 1);
  }

  reactions.set(emoji, users);
  message.reactions = reactions;
  await message.save();

  return Object.fromEntries(message.reactions);
};

/**
 * Pin / unpin a message in a room.
 */
const pinMessage = async (messageId, roomKey, pin = true) => {
  const message = await Message.findOneAndUpdate(
    { _id: messageId, room: roomKey },
    { isPinned: pin },
    { new: true }
  ).populate('sender', 'fullName username avatar');

  if (!message) throw Object.assign(new Error('Message not found'), { statusCode: 404 });
  return message;
};

/**
 * Mark a message as read by a user.
 */
const markMessageRead = async (messageId, userId) => {
  await Message.updateOne(
    { _id: messageId, 'readBy.user': { $ne: userId } },
    { $push: { readBy: { user: userId, readAt: new Date() } } }
  );
};

module.exports = {
  saveMessage,
  getMessageHistory,
  editMessage,
  deleteMessage,
  reactToMessage,
  pinMessage,
  markMessageRead,
};
