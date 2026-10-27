const DirectChat = require('../models/DirectChat');
const User = require('../models/User');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get or create a 1-on-1 direct chat between two users.
 */
const getOrCreateDirectChat = async (userId, targetUserId) => {
  if (userId.toString() === targetUserId.toString()) {
    throw createError('Cannot initiate direct chat with yourself', 400);
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) throw createError('Target user not found', 404);

  let chat = await DirectChat.findOne({
    isGroup: false,
    participants: { $all: [userId, targetUserId], $size: 2 },
  }).populate('participants', 'fullName username avatar role isInstructor');

  if (!chat) {
    chat = await DirectChat.create({
      participants: [userId, targetUserId],
      isGroup: false,
      unreadCounts: {
        [userId.toString()]: 0,
        [targetUserId.toString()]: 0,
      },
    });

    chat = await chat.populate('participants', 'fullName username avatar role isInstructor');
  }

  return chat;
};

/**
 * Get all direct conversations for a user.
 */
const getUserDirectChats = async (userId) => {
  const chats = await DirectChat.find({
    participants: userId,
  })
    .populate('participants', 'fullName username avatar role isInstructor')
    .sort({ updatedAt: -1 })
    .lean();

  return chats.map((chat) => {
    const otherParticipant = chat.isGroup
      ? null
      : chat.participants.find((p) => p._id.toString() !== userId.toString());

    return {
      ...chat,
      recipient: otherParticipant,
      unreadCount: chat.unreadCounts ? chat.unreadCounts[userId.toString()] || 0 : 0,
    };
  });
};

/**
 * Create a new private group chat.
 */
const createGroupChat = async (userId, { name, participantIds = [], avatar = '' }) => {
  if (!name?.trim()) throw createError('Group name is required', 400);

  const uniqueParticipants = Array.from(new Set([userId.toString(), ...participantIds]));
  if (uniqueParticipants.length < 2) {
    throw createError('Group must have at least 2 participants', 400);
  }

  const unreadMap = {};
  uniqueParticipants.forEach((id) => {
    unreadMap[id] = 0;
  });

  let groupChat = await DirectChat.create({
    participants: uniqueParticipants,
    isGroup: true,
    groupName: name.trim(),
    groupAvatar: avatar,
    groupAdmin: userId,
    unreadCounts: unreadMap,
  });

  return groupChat.populate('participants', 'fullName username avatar role');
};

/**
 * Reset unread count for user in chat
 */
const markChatAsRead = async (chatId, userId) => {
  const chat = await DirectChat.findById(chatId);
  if (!chat) return null;

  if (chat.unreadCounts) {
    chat.unreadCounts.set(userId.toString(), 0);
    await chat.save();
  }

  return { success: true };
};

module.exports = {
  getOrCreateDirectChat,
  getUserDirectChats,
  createGroupChat,
  markChatAsRead,
};
