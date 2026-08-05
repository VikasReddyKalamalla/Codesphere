/**
 * Realtime Broadcast Utility
 * Emits socket events across all connected clients for instant UI updates.
 */

const broadcastDataChange = (entity, action, payload = {}) => {
  try {
    const { getIO } = require('../socket/socket');
    const io = getIO();
    if (io) {
      io.emit('admin:data_changed', { entity, action, payload, timestamp: Date.now() });
      io.emit(`${entity}:changed`, { action, payload, timestamp: Date.now() });
    }
  } catch (err) {
    // Ignore socket error if server disconnected or initial startup
  }
};

module.exports = { broadcastDataChange };
