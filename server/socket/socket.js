const { Server } = require('socket.io');

const { socketAuth }        = require('../middlewares/socketAuth.middleware');
const socketService         = require('../services/socket.service');
const presenceService       = require('../services/presence.service');
const activityService       = require('../services/activity.service');

const { handleCommunity }   = require('./community.socket');
const { handleCodex }       = require('./codex.socket');
const { handleSession }     = require('./session.socket');
const { handleNotification } = require('./notification.socket');
const { handlePresence, broadcastOnline, broadcastOffline } = require('./presence.socket');
const { handleTyping }      = require('./typing.socket');
const { handleActivity }    = require('./activity.socket');
const { handleEventSocket } = require('./event.socket');
const { handleAnalyticsSocket } = require('./analytics.socket');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Ping/pong settings for connection health
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ─── Authentication middleware ─────────────────────────────────────────────
  io.use(socketAuth);

  // ─── Connection handler ────────────────────────────────────────────────────
  io.on('connection', async (socket) => {
    const user = socket.user;
    console.log(`[Socket] ${user.fullName} (${user._id}) connected — ${socket.id}`);

    try {
      // Persist connection record
      await socketService.registerConnection(socket);

      // Mark user online and broadcast
      await presenceService.setOnline(user._id, socket.id);
      broadcastOnline(io, user);

      // Auto-join personal notification room
      socket.join(`user:${user._id}`);

      // Log connection activity
      await activityService.log({
        userId: user._id,
        module: 'General',
        action: 'connected',
        socketId: socket.id,
      });
    } catch (err) {
      console.error('[Socket] Connection setup error:', err.message);
    }

    // ─── Attach domain handlers ──────────────────────────────────────────────
    handleCommunity(socket, io);
    handleCodex(socket, io);
    handleSession(socket, io);
    handleNotification(socket, io);
    handlePresence(socket, io);
    handleTyping(socket, io);
    handleActivity(socket, io);
    handleEventSocket(socket, io);
    handleAnalyticsSocket(socket, io);

    // ─── Disconnect handler ──────────────────────────────────────────────────
    socket.on('disconnect', async (reason) => {
      console.log(`[Socket] ${user.fullName} disconnected — ${socket.id} (${reason})`);

      try {
        await socketService.removeConnection(socket.id);
        const presence = await presenceService.setOffline(user._id, socket.id);

        // Only broadcast offline if the user has no remaining active sockets
        if (presence && !presence.isOnline) {
          broadcastOffline(io, user._id);
        }

        await activityService.log({
          userId: user._id,
          module: 'General',
          action: 'disconnected',
          metadata: { reason },
          socketId: socket.id,
        });
      } catch (err) {
        console.error('[Socket] Disconnect cleanup error:', err.message);
      }
    });
  });

  console.log('[Socket] Socket.IO server initialized');
  return io;
};

/**
 * Get the initialized Socket.IO server instance.
 * Use this from any service to emit events server-side.
 */
const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { initSocket, getIO };
