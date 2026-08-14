const Presence = require('../models/Presence');

// In-memory presence cache for fast synchronous socket lookups
const inMemoryPresence = new Map();

// Deferred MongoDB write queue to batch database operations
const pendingDbFlushes = new Set();

let isFlushTimerScheduled = false;
const scheduleLazyFlush = () => {
  if (isFlushTimerScheduled) return;
  isFlushTimerScheduled = true;
  setTimeout(async () => {
    isFlushTimerScheduled = false;
    if (pendingDbFlushes.size === 0) return;

    const userIdsToFlush = Array.from(pendingDbFlushes);
    pendingDbFlushes.clear();

    for (const userId of userIdsToFlush) {
      const state = inMemoryPresence.get(String(userId));
      if (state) {
        try {
          await Presence.findOneAndUpdate(
            { user: userId },
            {
              isOnline: state.isOnline,
              status: state.status,
              lastActiveAt: new Date(state.lastActiveAt),
              currentRoom: state.currentRoom || null,
              socketIds: Array.from(state.socketIds || []),
            },
            { upsert: true, new: true }
          ).catch(() => {});
        } catch (_) {}
      }
    }
  }, 30000); // Batch flush presence state to MongoDB every 30 seconds
};

/**
 * Mark a user as online and register their socketId.
 */
const setOnline = async (userId, socketId, room) => {
  const uidStr = String(userId);
  let record = inMemoryPresence.get(uidStr);
  if (!record) {
    record = {
      user: userId,
      isOnline: true,
      status: 'online',
      lastActiveAt: Date.now(),
      currentRoom: room || null,
      socketIds: new Set(),
    };
  }

  record.isOnline = true;
  record.status = 'online';
  record.lastActiveAt = Date.now();
  if (room) record.currentRoom = room;
  record.socketIds.add(socketId);

  inMemoryPresence.set(uidStr, record);
  pendingDbFlushes.add(uidStr);
  scheduleLazyFlush();

  return record;
};

/**
 * Mark a user as offline (remove socketId; if none left, set offline).
 */
const setOffline = async (userId, socketId) => {
  const uidStr = String(userId);
  let record = inMemoryPresence.get(uidStr);
  if (!record) return null;

  record.socketIds.delete(socketId);
  record.lastActiveAt = Date.now();

  if (record.socketIds.size === 0) {
    record.isOnline = false;
    record.status = 'offline';
    record.currentRoom = null;
    record.currentWorkspace = null;
    record.currentSession = null;
  }

  inMemoryPresence.set(uidStr, record);
  pendingDbFlushes.add(uidStr);
  scheduleLazyFlush();

  return record;
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
