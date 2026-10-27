const Message = require('../models/Message');
const Channel = require('../models/Channel');
const DirectChat = require('../models/DirectChat');
const Community = require('../models/Community');

/**
 * Persist an enterprise chat message and update channel/directChat statistics.
 */
const saveMessage = async ({
  senderId,
  room,
  content,
  type = 'text',
  channelId,
  communityId,
  directChatId,
  codeSnippet,
  attachments,
  replyTo,
  mentions,
}) => {
  const messageData = {
    sender: senderId,
    room,
    content,
    type,
    replyTo: replyTo || null,
    mentions: mentions || [],
    deliveryStatus: 'sent',
    deliveredTo: [{ user: senderId, deliveredAt: new Date() }],
    readBy: [{ user: senderId, readAt: new Date() }],
  };

  if (channelId) messageData.channel = channelId;
  if (communityId) messageData.community = communityId;
  if (directChatId) messageData.directChat = directChatId;
  if (codeSnippet && codeSnippet.code) messageData.codeSnippet = codeSnippet;
  if (attachments && Array.isArray(attachments)) messageData.attachments = attachments;

  const message = await Message.create(messageData);

  // Asynchronously update Channel or DirectChat metadata
  if (channelId) {
    Channel.findByIdAndUpdate(channelId, {
      $inc: { messageCount: 1 },
      lastMessage: {
        content: type === 'code' ? `[Code Snippet: ${codeSnippet?.language || 'Code'}]` : content.slice(0, 100),
        sender: senderId,
        timestamp: new Date(),
      },
    }).catch(() => {});
  }

  if (directChatId) {
    DirectChat.findById(directChatId).then(async (chat) => {
      if (chat) {
        chat.lastMessage = {
          content: type === 'code' ? `[Code: ${codeSnippet?.language || 'code'}]` : content.slice(0, 100),
          sender: senderId,
          timestamp: new Date(),
          isRead: false,
        };
        // Increment unread for all other participants
        if (chat.unreadCounts) {
          chat.participants.forEach((p) => {
            const pId = p.toString();
            if (pId !== senderId.toString()) {
              const cur = chat.unreadCounts.get(pId) || 0;
              chat.unreadCounts.set(pId, cur + 1);
            }
          });
        }
        await chat.save();
      }
    }).catch(() => {});
  }

  if (communityId) {
    Community.findByIdAndUpdate(communityId, {
      $inc: { messageCount: 1 },
    }).catch(() => {});
  }

  return message.populate([
    { path: 'sender', select: 'fullName username avatar role isInstructor' },
    { path: 'replyTo', select: 'content sender codeSnippet type', populate: { path: 'sender', select: 'fullName username' } },
  ]);
};

/**
 * Get message history using cursor-based pagination (ideal for high-concurrency chatting).
 */
const getMessageHistory = async (roomKey, { before, limit = 50 } = {}) => {
  const query = { room: roomKey, isDeleted: false };

  if (before) {
    const beforeMsg = await Message.findById(before);
    if (beforeMsg) {
      query.createdAt = { $lt: beforeMsg.createdAt };
    }
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate('sender', 'fullName username avatar role isInstructor')
    .populate({
      path: 'replyTo',
      select: 'content sender codeSnippet type',
      populate: { path: 'sender', select: 'fullName username' },
    })
    .lean();

  // Return in chronological order
  return messages.reverse();
};

/**
 * Mark message as delivered to user (WhatsApp double tick).
 */
const markDelivered = async (messageId, userId) => {
  const msg = await Message.findById(messageId);
  if (!msg) return null;

  const alreadyDelivered = msg.deliveredTo?.some((d) => d.user.toString() === userId.toString());
  if (!alreadyDelivered) {
    msg.deliveredTo.push({ user: userId, deliveredAt: new Date() });
    if (msg.deliveryStatus === 'sent') {
      msg.deliveryStatus = 'delivered';
    }
    await msg.save();
  }

  return { messageId, deliveryStatus: msg.deliveryStatus, userId };
};

/**
 * Mark message as read by user (WhatsApp blue double ticks).
 */
const markMessageRead = async (messageId, userId) => {
  const msg = await Message.findById(messageId);
  if (!msg) return null;

  const alreadyRead = msg.readBy?.some((r) => r.user.toString() === userId.toString());
  if (!alreadyRead) {
    msg.readBy.push({ user: userId, readAt: new Date() });
    msg.deliveryStatus = 'read';
    await msg.save();
  }

  return { messageId, deliveryStatus: 'read', userId };
};

/**
 * Edit a message
 */
const editMessage = async (messageId, senderId, newContent) => {
  const message = await Message.findOneAndUpdate(
    { _id: messageId, sender: senderId, isDeleted: false },
    { content: newContent, isEdited: true, editedAt: new Date() },
    { new: true }
  )
    .populate('sender', 'fullName username avatar role isInstructor')
    .populate({
      path: 'replyTo',
      select: 'content sender codeSnippet type',
      populate: { path: 'sender', select: 'fullName username' },
    });

  if (!message) throw Object.assign(new Error('Message not found or not authorized'), { statusCode: 403 });
  return message;
};

/**
 * Soft-delete a message
 */
const deleteMessage = async (messageId, senderId, userRole) => {
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
 * Toggle reaction on a message
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
 * Star / Unstar a message (WhatsApp saved message)
 */
const toggleStarMessage = async (messageId, userId) => {
  const message = await Message.findById(messageId);
  if (!message) throw Object.assign(new Error('Message not found'), { statusCode: 404 });

  const idx = message.starredBy?.findIndex((id) => id.toString() === userId.toString()) ?? -1;
  let isStarred = false;

  if (idx === -1) {
    message.starredBy.push(userId);
    isStarred = true;
  } else {
    message.starredBy.splice(idx, 1);
    isStarred = false;
  }

  await message.save();
  return { messageId, isStarred };
};

/**
 * Search messages in room or community
 */
const searchMessages = async ({ query, room, communityId, limit = 20 }) => {
  const filter = { isDeleted: false, $text: { $search: query } };
  if (room) filter.room = room;
  if (communityId) filter.community = communityId;

  return Message.find(filter)
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .limit(limit)
    .populate('sender', 'fullName username avatar')
    .lean();
};

/**
 * Pin / unpin a message
 */
const pinMessage = async (messageId, roomKey, pin = true) => {
  const message = await Message.findOneAndUpdate(
    { _id: messageId, room: roomKey },
    { isPinned: pin },
    { new: true }
  ).populate('sender', 'fullName username avatar role');

  if (!message) throw Object.assign(new Error('Message not found'), { statusCode: 404 });
  return message;
};

module.exports = {
  saveMessage,
  getMessageHistory,
  markDelivered,
  markMessageRead,
  editMessage,
  deleteMessage,
  reactToMessage,
  toggleStarMessage,
  searchMessages,
  pinMessage,
};
