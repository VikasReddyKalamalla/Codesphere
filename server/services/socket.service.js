const SocketUser = require('../models/SocketUser');
const Room = require('../models/Room');

/**
 * Register a socket connection in the database.
 */
const registerConnection = async (socket) => {
  await SocketUser.create({
    user: socket.user._id,
    socketId: socket.id,
    rooms: [],
    ipAddress: socket.handshake.address,
    userAgent: socket.handshake.headers['user-agent'] || '',
    connectedAt: new Date(),
  });
};

/**
 * Remove a socket connection record on disconnect.
 */
const removeConnection = async (socketId) => {
  await SocketUser.findOneAndDelete({ socketId });
};

/**
 * Get or create a Room document.
 */
const getOrCreateRoom = async ({ roomKey, type, name, referenceId, referenceModel, createdBy }) => {
  const room = await Room.findOneAndUpdate(
    { roomKey },
    { $setOnInsert: { roomKey, type, name, referenceId, referenceModel, createdBy, isActive: true } },
    { upsert: true, new: true }
  );
  return room;
};

/**
 * Add a user to a room's active users list.
 */
const addUserToRoom = async (roomKey, userId) => {
  await Room.updateOne(
    { roomKey },
    { $addToSet: { activeUsers: userId } }
  );
};

/**
 * Remove a user from a room's active users list.
 */
const removeUserFromRoom = async (roomKey, userId) => {
  await Room.updateOne(
    { roomKey },
    { $pull: { activeUsers: userId } }
  );
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
