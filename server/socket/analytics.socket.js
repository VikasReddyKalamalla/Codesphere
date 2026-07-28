const analyticsRealtimeService = require('../services/analyticsRealtime.service');

const activeAdminSockets = new Set();
let telemetryInterval = null;

/**
 * Handle Analytics Socket events
 */
const handleAnalyticsSocket = (socket, io) => {
  // Join real-time analytics room
  socket.on('analytics:join', async () => {
    try {
      socket.join('admin:analytics');
      activeAdminSockets.add(socket.id);
      console.log(`[Socket] Admin ${socket.user?.fullName || socket.id} joined admin:analytics room`);

      // Immediately send current realtime snapshot
      const snapshot = await analyticsRealtimeService.getRealtimeAnalyticsSnapshot();
      socket.emit('analytics:snapshot', snapshot);

      // Start periodic telemetry broadcast if not running
      ensureTelemetryInterval(io);
    } catch (err) {
      console.error('[Socket] Analytics join error:', err.message);
    }
  });

  // Leave real-time analytics room
  socket.on('analytics:leave', () => {
    socket.leave('admin:analytics');
    activeAdminSockets.delete(socket.id);
    if (activeAdminSockets.size === 0 && telemetryInterval) {
      clearInterval(telemetryInterval);
      telemetryInterval = null;
    }
  });

  // Client requests manual refresh
  socket.on('analytics:request_refresh', async () => {
    try {
      const snapshot = await analyticsRealtimeService.getRealtimeAnalyticsSnapshot();
      socket.emit('analytics:snapshot', snapshot);
    } catch (err) {
      socket.emit('analytics:error', { message: 'Failed to refresh analytics' });
    }
  });

  // Client triggers simulated real-time event
  socket.on('analytics:trigger_simulation', async (data) => {
    try {
      const category = typeof data === 'object' ? data?.category : data;
      const newEvent = await analyticsRealtimeService.simulateTrafficEvent(category);
      console.log(`[Socket] Simulated real-time analytics event (${newEvent.category}): ${newEvent.title}`);
    } catch (err) {
      console.error('[Socket] Simulation error:', err.message);
    }
  });

  // Clean up on disconnect
  socket.on('disconnect', () => {
    activeAdminSockets.delete(socket.id);
    if (activeAdminSockets.size === 0 && telemetryInterval) {
      clearInterval(telemetryInterval);
      telemetryInterval = null;
    }
  });
};

/**
 * Start periodic 3-second telemetry tick if admins are connected
 */
const ensureTelemetryInterval = (io) => {
  if (telemetryInterval) return;

  telemetryInterval = setInterval(async () => {
    if (activeAdminSockets.size === 0) {
      clearInterval(telemetryInterval);
      telemetryInterval = null;
      return;
    }

    try {
      const telemetry = await analyticsRealtimeService.getSystemHealthTelemetry();
      const activeSocketCount = activeAdminSockets.size;
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const Presence = require('../models/Presence');
      const onlineUsersCount = await Presence.countDocuments({ isOnline: true }).catch(() => 0);
      const realActiveUsers = Math.max(onlineUsersCount, activeAdminSockets.size);

      // Emitted tick data point
      const tickData = {
        timestamp: new Date(),
        timeStr: nowStr,
        telemetry,
        liveMetrics: {
          activeUsers: realActiveUsers,
          apiThroughput: Number((realActiveUsers * 0.5).toFixed(1)),
          latencyMs: telemetry.api.avgLatencyMs,
          cpuUsage: telemetry.cpu.usagePercent,
          memoryUsage: telemetry.memory.usagePercent,
        },
      };

      io.to('admin:analytics').emit('analytics:telemetry_tick', tickData);
    } catch (err) {
      console.error('[Socket] Telemetry tick error:', err.message);
    }
  }, 3000);
};

module.exports = { handleAnalyticsSocket };
