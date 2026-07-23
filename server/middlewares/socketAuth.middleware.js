const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Socket.IO authentication middleware.
 *
 * Clients must send their JWT in the handshake:
 *   socket = io(URL, { auth: { token: 'Bearer <jwt>' } })
 *   — or —
 *   socket = io(URL, { extraHeaders: { authorization: 'Bearer <jwt>' } })
 *
 * On success, attaches `socket.user` (full User document, no password).
 * On failure, calls next() with an Error so the connection is rejected.
 */
const socketAuth = async (socket, next) => {
  try {
    // Accept token from auth object or Authorization header
    const rawToken =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization;

    if (!rawToken) {
      return next(new Error('Authentication required'));
    }

    const token = rawToken.startsWith('Bearer ')
      ? rawToken.slice(7)
      : rawToken;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new Error('User not found'));
    }

    if (!user.isActive) {
      return next(new Error('Account is deactivated'));
    }

    // Attach user to socket for downstream handlers
    socket.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new Error('Token expired'));
    }
    return next(new Error('Invalid token'));
  }
};

module.exports = { socketAuth };
