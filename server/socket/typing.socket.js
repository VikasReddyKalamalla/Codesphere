const TypingStatus = require('../models/TypingStatus');

/**
 * Generic typing indicator — works for any room type.
 *
 * Client events:
 *   typing:start   { room }
 *   typing:stop    { room }
 *
 * Server events emitted (to room):
 *   typing:started { user, room }
 *   typing:stopped { userId, room }
 */
const handleTyping = (socket, io) => {
  socket.on('typing:start', async ({ room }) => {
    if (!room) return;

    try {
      await TypingStatus.findOneAndUpdate(
        { user: socket.user._id, room },
        { user: socket.user._id, room, isTyping: true, startedAt: new Date() },
        { upsert: true, new: true }
      );
    } catch {
      // Non-critical; ignore DB errors
    }

    socket.to(room).emit('typing:started', {
      user: {
        _id: socket.user._id,
        fullName: socket.user.fullName,
        username: socket.user.username,
        avatar: socket.user.avatar,
      },
      room,
    });
  });

  socket.on('typing:stop', async ({ room }) => {
    if (!room) return;

    try {
      await TypingStatus.findOneAndUpdate(
        { user: socket.user._id, room },
        { isTyping: false, stoppedAt: new Date() }
      );
    } catch {
      // Non-critical
    }

    socket.to(room).emit('typing:stopped', {
      userId: socket.user._id,
      room,
    });
  });
};

module.exports = { handleTyping };
