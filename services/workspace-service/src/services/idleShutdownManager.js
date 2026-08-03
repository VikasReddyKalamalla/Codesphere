const { getAllTrackedWorkspaces, stopWorkspaceContainer } = require('./containerManager');

// 30 minutes idle timeout in milliseconds
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
// Check interval: every 5 minutes
const CHECK_INTERVAL_MS = 5 * 60 * 1000;

let intervalId = null;

/**
 * Start the idle shutdown monitor timer
 */
function startIdleShutdownMonitor() {
  if (intervalId) return;

  console.log('[IdleShutdownManager] Starting 30-minute idle container shutdown monitor...');

  intervalId = setInterval(async () => {
    const now = Date.now();
    const activeWorkspaces = getAllTrackedWorkspaces();

    for (const ws of activeWorkspaces) {
      if (ws.status === 'running' && ws.lastActivity) {
        const idleTime = now - ws.lastActivity;
        if (idleTime >= IDLE_TIMEOUT_MS) {
          console.log(`[IdleShutdownManager] Workspace ${ws.workspaceId} idle for ${Math.round(idleTime / 60000)} mins. Automatically stopping container...`);
          await stopWorkspaceContainer(ws.workspaceId);
        }
      }
    }
  }, CHECK_INTERVAL_MS);
}

function stopIdleShutdownMonitor() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

module.exports = {
  startIdleShutdownMonitor,
  stopIdleShutdownMonitor
};
