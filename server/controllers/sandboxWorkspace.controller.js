const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const { syncDbToDisk, syncDiskToDb, getWorkspacePath } = require('../utils/workspaceSync');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const portfinder = require('portfinder'); // We can use portfinder if installed, or do a manual search for free ports

const activeServers = new Map(); // key: "projectId_userId", value: { port, process }

/**
 * Initialize workspace folder, write default files, and spawn VS Code Web server pointing to it
 * POST /api/sandbox/:projectId/workspace/init
 */
const initWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user._id;
  const key = `${projectId}_${userId}`;

  // 1. Sync files from Mongoose DB to server disk
  const workspacePath = await syncDbToDisk(projectId, userId);

  // 2. Check if a server is already running for this user/project
  if (activeServers.has(key)) {
    const existing = activeServers.get(key);
    // Double check if process is still alive
    try {
      // kill(0) checks if process is running without killing it
      process.kill(existing.proc.pid, 0);
      return successResponse(res, 200, 'Workspace VS Code server already running', {
        iframeUrl: `http://localhost:${existing.port}/`
      });
    } catch (e) {
      // Process died, remove it
      activeServers.delete(key);
    }
  }

  // 3. Find a free port starting from 9888
  let port = 9888;
  const busyPorts = Array.from(activeServers.values()).map(s => s.port);
  while (busyPorts.includes(port)) {
    port++;
  }

  // 4. Start the VS Code Web server pointing to the workspace folder
  console.log(`Starting VS Code Web server for ${key} on port ${port}...`);
  const vscodeDir = path.join(__dirname, '..', '..', 'vscode');
  const serverScript = path.join(vscodeDir, 'scripts', 'code-web.js');

  // Command: node scripts/code-web.js <workspacePath> --port <port> --host 127.0.0.1
  // We use backslashes on Windows for path formatting
  const formattedWorkspacePath = path.normalize(workspacePath);

  const proc = cp.spawn(process.execPath, [
    serverScript,
    formattedWorkspacePath,
    '--port', port.toString(),
    '--host', '127.0.0.1',
    '--browserType', 'none'
  ], {
    cwd: vscodeDir,
    stdio: 'ignore',
    detached: true
  });

  proc.unref();

  // Save server state
  activeServers.set(key, { port, proc });
  console.log(`VS Code Web server running on http://localhost:${port}/ for workspace ${formattedWorkspacePath}`);

  // Return the iframe URL
  return successResponse(res, 200, 'Workspace initialized and VS Code server started', {
    iframeUrl: `http://localhost:${port}/`
  });
});

/**
 * Sync files from disk back to Mongoose DB
 * POST /api/sandbox/:projectId/workspace/sync
 */
const syncWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user._id;

  // Sync disk -> DB
  const progress = await syncDiskToDb(projectId, userId);
  if (!progress) {
    return errorResponse(res, 404, 'Workspace files not found on disk');
  }

  return successResponse(res, 200, 'Workspace files synced to database successfully', progress);
});

module.exports = {
  initWorkspace,
  syncWorkspace
};
