const Presence = require('../models/Presence');

/**
 * Mark a user as online and register their socketId.
 */
const setOnline = async (userId, socketId, room) => {
  const presence = await Presence.findOneAndUpdate(
    { user: userId },
    {
      isOnline: true,
      status: 'online',
      lastActiveAt: new Date(),
      currentRoom: room || null,
      $addToSet: { socketIds: socketId },
    },
    { upsert: true, new: true }
  );
  return presence;
};

/**
 * Mark a user as offline (remove socketId; if none left, set offline).
 */
const setOffline = async (userId, socketId) => {
  const presence = await Presence.findOneAndUpdate(
    { user: userId },
    {
      $pull: { socketIds: socketId },
      lastActiveAt: new Date(),
    },
    { new: true }
  );

  if (!presence) return null;

  // If no active sockets remain, mark as offline
  if (!presence.socketIds || presence.socketIds.length === 0) {
    presence.isOnline = false;
    presence.status = 'offline';
    presence.currentRoom = null;
    presence.currentWorkspace = null;
    presence.currentSession = null;
    await presence.save();
  }

  return presence;
};

/**
 * Update the user's current context (room, workspace, session).
 */
const updateContext = async (userId, context) => {
  return Presence.findOneAndUpdate(
    { user: userId },
    { ...context, lastActiveAt: new Date() },
    { new: true }
  );
};

/**
 * Update status (online / away / busy).
 */
const updateStatus = async (userId, status) => {
  return Presence.findOneAndUpdate(
    { user: userId },
    { status, lastActiveAt: new Date() },
    { new: true }
  );
};

/**
 * Get online user IDs (optionally filtered by a list of userIds).
 */
const getOnlineUsers = async (userIds) => {
  const filter = { isOnline: true };
  if (userIds && userIds.length) filter.user = { $in: userIds };

  return Presence.find(filter)
    .populate('user', 'fullName username avatar')
    .lean();
};

/**
 * Get a single user's presence record.
 */
const getUserPresence = async (userId) => {
  return Presence.findOne({ user: userId })
    .populate('user', 'fullName username avatar')
    .lean();
};

module.exports = {
  setOnline,
  setOffline,
  updateContext,
  updateStatus,
  getOnlineUsers,
  getUserPresence,
};
