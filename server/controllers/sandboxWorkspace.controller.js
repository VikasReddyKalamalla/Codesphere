const path = require('path');
const fs = require('fs');
const { syncDbToDisk, syncDiskToDb } = require('../utils/workspaceSync');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Require test-web server modules directly
const vscodeDir = path.join(__dirname, '..', '..', 'vscode');
const testWebMain = require(path.join(vscodeDir, 'node_modules', '@vscode', 'test-web', 'out', 'server', 'main.js'));
const testWebDownload = require(path.join(vscodeDir, 'node_modules', '@vscode', 'test-web', 'out', 'server', 'download.js'));

const activeServers = new Map(); // key: "projectId_userId", value: { port, server }

/**
 * Initialize workspace folder, write default files, and run VS Code Web server pointing to it
 * POST /api/sandbox/:id/workspace/init
 */
const initWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user._id;
  const key = `${projectId}_${userId}`;

  // 1. Sync files from Mongoose DB to server disk
  const workspacePath = await syncDbToDisk(projectId, userId);
  const formattedWorkspacePath = path.normalize(workspacePath);
  if (!fs.existsSync(formattedWorkspacePath)) {
    fs.mkdirSync(formattedWorkspacePath, { recursive: true });
  }

  // 2. Check if a server is already running for this user/project
  if (activeServers.has(key)) {
    const existing = activeServers.get(key);
    return successResponse(res, 200, 'Workspace VS Code server already running', {
      iframeUrl: `http://localhost:${existing.port}/`
    });
  }

  // 3. Find a free port starting from 9888
  let port = 9888;
  const busyPorts = Array.from(activeServers.values()).map(s => s.port);
  while (busyPorts.includes(port)) {
    port++;
  }

  // 4. Run VS Code Web server in Node process
  console.log(`Starting VS Code Web server for ${key} on port ${port}...`);
  const testDataDir = path.join(__dirname, '..', '..', '.vscode-test-web');
  
  let buildLocation = null;
  if (fs.existsSync(testDataDir)) {
    const entries = fs.readdirSync(testDataDir);
    const vscodeFolder = entries.find(e => e.startsWith('vscode-web-'));
    if (vscodeFolder) {
      buildLocation = path.join(testDataDir, vscodeFolder);
    }
  }

  let build;
  if (buildLocation) {
    build = { type: 'static', location: buildLocation };
  } else {
    try {
      build = await testWebDownload.downloadAndUnzipVSCode(testDataDir, 'stable');
    } catch (e) {
      console.warn('downloadAndUnzipVSCode failed, using local fallback:', e.message);
      const fallbackDir = path.join(__dirname, '..', '..', 'vscode');
      build = { type: 'static', location: fallbackDir };
    }
  }

  const server = await testWebMain.runServer('127.0.0.1', port, {
    build,
    folderMountPath: formattedWorkspacePath,
    printServerLog: false
  });

  // Save server state
  activeServers.set(key, { port, server });
  console.log(`VS Code Web server running on http://localhost:${port}/ for workspace ${formattedWorkspacePath}`);

  // Return the iframe URL
  return successResponse(res, 200, 'Workspace initialized and VS Code server started', {
    iframeUrl: `http://localhost:${port}/`
  });
});

/**
 * Sync files from disk back to Mongoose DB
 * POST /api/sandbox/:id/workspace/sync
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
