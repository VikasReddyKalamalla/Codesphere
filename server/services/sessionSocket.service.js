const LiveTracking = require('../models/LiveTracking');
const Message = require('../models/Message');

/**
 * Get or create a LiveTracking record for a session.
 */
const getOrCreateTracking = async (sessionId) => {
  const tracking = await LiveTracking.findOneAndUpdate(
    { session: sessionId },
    { $setOnInsert: { session: sessionId, participants: [], participantCount: 0, isLive: false } },
    { upsert: true, new: true }
  );
  return tracking;
};

/**
 * Add a participant to live tracking.
 */
const addParticipant = async (sessionId, userId, socketId, role = 'participant') => {
  const tracking = await LiveTracking.findOneAndUpdate(
    { session: sessionId, 'participants.user': { $ne: userId } },
    {
      $push: { participants: { user: userId, socketId, joinedAt: new Date(), role } },
      $inc: { participantCount: 1 },
    },
    { new: true }
  );

  if (!tracking) return;

  // Update peak count
  if (tracking.participantCount > (tracking.peakParticipantCount || 0)) {
    await LiveTracking.updateOne(
      { session: sessionId },
      { peakParticipantCount: tracking.participantCount }
    );
  }

  return tracking;
};

/**
 * Remove a participant from live tracking.
 */
const removeParticipant = async (sessionId, userId) => {
  const tracking = await LiveTracking.findOneAndUpdate(
    { session: sessionId },
    {
      $pull: { participants: { user: userId } },
      $inc: { participantCount: -1 },
    },
    { new: true }
  );
  return tracking;
};

/**
 * Mark a session as live / ended.
 */
const setSessionLive = async (sessionId, isLive) => {
  const update = { isLive };
  if (isLive) update.startedAt = new Date();
  else update.endedAt = new Date();

  return LiveTracking.findOneAndUpdate({ session: sessionId }, update, { new: true });
};

/**
 * Save a session chat message.
 */
const saveSessionMessage = async ({ senderId, sessionId, content }) => {
  const room = `session:${sessionId}`;
  const message = await Message.create({ sender: senderId, room, content, type: 'text' });
  return message.populate('sender', 'fullName username avatar');
};

/**
 * Get session chat history.
 */
const getSessionMessages = async (sessionId, { limit = 50 } = {}) => {
  const room = `session:${sessionId}`;
  const messages = await Message.find({ room, isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate('sender', 'fullName username avatar')
    .lean();
  return messages.reverse();
};

/**
 * Get full live tracking info with populated participants.
 */
const getTrackingInfo = async (sessionId) => {
  return LiveTracking.findOne({ session: sessionId })
    .populate('participants.user', 'fullName username avatar');
};

module.exports = {
  getOrCreateTracking,
  addParticipant,
  removeParticipant,
  setSessionLive,
  saveSessionMessage,
  getSessionMessages,
  getTrackingInfo,
};
