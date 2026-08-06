const SocketUser = require('../models/SocketUser');
const Room = require('../models/Room');

/**
 * Register a socket connection in the database.
 */
const mongoose = require('mongoose');

/**
 * Register a socket connection in the database.
 */
const registerConnection = async (socket) => {
  if (!socket.user?._id || !mongoose.Types.ObjectId.isValid(socket.user._id)) return;
  await SocketUser.create({
    user: socket.user._id,
    socketId: socket.id,
    rooms: [],
    ipAddress: socket.handshake.address,
    userAgent: socket.handshake.headers['user-agent'] || '',
    connectedAt: new Date(),
  }).catch(() => {});
};

/**
 * Remove a socket connection record on disconnect.
 */
const removeConnection = async (socketId) => {
  await SocketUser.findOneAndDelete({ socketId }).catch(() => {});
};

/**
 * Get or create a Room document.
 */
const getOrCreateRoom = async ({ roomKey, type, name, referenceId, referenceModel, createdBy }) => {
  const refId = mongoose.Types.ObjectId.isValid(referenceId) ? referenceId : undefined;
  const creatorId = mongoose.Types.ObjectId.isValid(createdBy) ? createdBy : undefined;
  const room = await Room.findOneAndUpdate(
    { roomKey },
    { $setOnInsert: { roomKey, type, name, referenceId: refId, referenceModel, createdBy: creatorId, isActive: true } },
    { upsert: true, new: true }
  ).catch(() => null);
  return room;
};

/**
 * Add a user to a room's active users list.
 */
const addUserToRoom = async (roomKey, userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return;
  await Room.updateOne(
    { roomKey },
    { $addToSet: { activeUsers: userId } }
  ).catch(() => {});
};

/**
 * Remove a user from a room's active users list.
 */
const removeUserFromRoom = async (roomKey, userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return;
  await Room.updateOne(
    { roomKey },
    { $pull: { activeUsers: userId } }
  ).catch(() => {});
};

/**
 * Get all active users in a room.
 */
const getRoomUsers = async (roomKey) => {
  const room = await Room.findOne({ roomKey })
    .populate('activeUsers', 'fullName username avatar')
    .lean();
  return room?.activeUsers || [];
};

module.exports = {
  registerConnection,
  removeConnection,
  getOrCreateRoom,
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers,
};
