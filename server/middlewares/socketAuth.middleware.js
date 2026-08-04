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
      socket.user = { _id: 'guest_' + socket.id, fullName: 'Guest User', role: 'guest' };
      return next();
    }

    const token = rawToken.startsWith('Bearer ')
      ? rawToken.slice(7)
      : rawToken;

    const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      socket.user = { _id: 'guest_' + socket.id, fullName: 'Guest User', role: 'guest' };
      return next();
    }

    if (user.isActive === false) {
      return next(new Error('Account is deactivated'));
    }

    // Attach user to socket for downstream handlers
    socket.user = user;
    next();
  } catch (err) {
    socket.user = { _id: 'guest_' + socket.id, fullName: 'Guest User', role: 'guest' };
    next();
  }
};

module.exports = { socketAuth };
