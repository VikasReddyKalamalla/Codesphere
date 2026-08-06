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
    // Ping/pong settings for connection health & reconnection
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Attach Redis Adapter for horizontal scaling if REDIS_URL present
  if (process.env.REDIS_URL || process.env.REDIS_HOST) {
    try {
      const { createAdapter } = require('@socket.io/redis-adapter');
      const { createClient }  = require('redis');
      const pubClient = createClient({ url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:6379` });
      const subClient = pubClient.duplicate();

      Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        io.adapter(createAdapter(pubClient, subClient));
        console.log('[Socket] Redis Adapter attached for multi-instance horizontal scaling!');
      }).catch(err => {
        console.warn('[Socket] Redis connection failed, running with in-memory adapter:', err.message);
      });
    } catch (e) {
      console.log('[Socket] Operating with native in-memory adapter');
    }
  }

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
