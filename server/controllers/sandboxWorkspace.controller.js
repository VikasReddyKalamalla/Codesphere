const path = require('path');
const fs   = require('fs');
const net  = require('net');
const http = require('http');
const { exec } = require('child_process');

const { syncDbToDisk, syncDiskToDb } = require('../utils/workspaceSync');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ─── Paths ────────────────────────────────────────────────────────────────────
const VSCODE_DIR         = path.join(__dirname, '..', '..', 'vscode');
const TEST_WEB_DATA_DIR  = path.join(__dirname, '..', '..', '.vscode-test-web');
const BASE_PORT          = 9888;
const MAX_PORT           = 9999;

// ─── Lazy-load @vscode/test-web from the official vscode folder ───────────────
const getTestWebModules = () => {
  const outDir = path.join(VSCODE_DIR, 'node_modules', '@vscode', 'test-web', 'out', 'server');
  return {
    runServer:              require(path.join(outDir, 'main.js')).runServer,
    downloadAndUnzipVSCode: require(path.join(outDir, 'download.js')).downloadAndUnzipVSCode,
  };
};

// ─── In-memory server registry ────────────────────────────────────────────────
// key: "projectId_userId"  value: { port, server, buildLocation }
const activeServers = new Map();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * TCP port liveness check with configurable timeout.
 */
const isPortListening = (port, timeoutMs = 800) =>
  new Promise((resolve) => {
    const socket = new net.Socket();
    let alive = false;
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => { alive = true; socket.destroy(); });
    socket.once('timeout', ()  => socket.destroy());
    socket.once('error',   ()  => socket.destroy());
    socket.once('close',   ()  => resolve(alive));
    socket.connect(port, '127.0.0.1');
  });

/**
 * Find the first free port in [BASE_PORT, MAX_PORT] not already used by activeServers.
 */
const findFreePort = async () => {
  const used = new Set(Array.from(activeServers.values()).map(s => s.port));
  for (let p = BASE_PORT; p <= MAX_PORT; p++) {
    if (!used.has(p) && !(await isPortListening(p, 200))) {
      return p;
    }
  }
  throw new Error('No free port available in range 9888–9999');
};

/**
 * Helper to execute docker exec commands inside container 8aaeaec7c507
 */
const execInContainer = (cmd) => {
  return new Promise((resolve) => {
    exec(`docker exec 8aaeaec7c507 sh -c "${cmd}"`, (err, stdout, stderr) => {
      resolve({ err, stdout, stderr });
    });
  });
};

// ─── Controller Actions ───────────────────────────────────────────────────────

/**
 * POST /api/sandbox/:id/workspace/init
 *
 * Initializes a per-user, per-project isolated directory inside Docker container:
 * Path: /home/coder/workspaces/${userId}/${projectId}
 */
const initWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user._id.toString();
  const repoUrl = req.body?.repoUrl;

  const folderName = `${userId}_${projectId}`;
  const isolatedContainerPath = `/home/coder/workspaces/${folderName}`;
  const iframeUrl = `http://localhost:8107/?folder=${isolatedContainerPath}`;

  // 1 ── Create isolated folder inside Docker container
  await execInContainer(`mkdir -p ${isolatedContainerPath}`);

  // 2 ── If user provided GitHub Repo URL, clone it into the isolated directory
  if (repoUrl && repoUrl.startsWith('http')) {
    console.log(`[workspace] Cloning ${repoUrl} into ${isolatedContainerPath}`);
    await execInContainer(`if [ ! -d "${isolatedContainerPath}/.git" ]; then git clone ${repoUrl} ${isolatedContainerPath}; fi`);
  } else {
    // Write a clean starter index.html if empty
    await execInContainer(`if [ ! -f "${isolatedContainerPath}/index.html" ]; then echo '<!DOCTYPE html><html><head><title>CodeSphere Workspace</title></head><body><h1>Welcome to CodeSphere</h1><p>Start coding in real-time!</p></body></html>' > ${isolatedContainerPath}/index.html; fi`);
  }

  return successResponse(res, 200, 'User isolated VS Code workspace active', {
    iframeUrl,
    folderPath: isolatedContainerPath,
    port: 8107,
  });
});

/**
 * POST /api/sandbox/:id/workspace/terminate
 *
 * Completely deletes temporary container workspace storage or pushes to Git
 */
const terminateWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user._id.toString();
  const { pushToGit, repoUrl } = req.body || {};

  const folderName = `${userId}_${projectId}`;
  const isolatedContainerPath = `/home/coder/workspaces/${folderName}`;

  if (pushToGit && repoUrl) {
    console.log(`[workspace] Pushing changes from ${isolatedContainerPath} to ${repoUrl}`);
    await execInContainer(`cd ${isolatedContainerPath} && git add . && git commit -m "Update from CodeSphere Web Studio" && git push || true`);
  }

  // Wipe temporary directory from cloud container storage
  console.log(`[workspace] Cleaning up storage path: ${isolatedContainerPath}`);
  await execInContainer(`rm -rf ${isolatedContainerPath}`);

  return successResponse(res, 200, 'Session terminated and cloud storage cleaned', { terminated: true });
});

/**
 * POST /api/sandbox/:id/workspace/sync
 */
const syncWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user._id;

  const progress = await syncDiskToDb(projectId, userId);
  return successResponse(res, 200, 'Workspace synced', progress || {});
});

/**
 * DELETE /api/sandbox/:id/workspace/stop
 */
const stopWorkspace = asyncHandler(async (req, res) => {
  return successResponse(res, 200, 'Workspace stopped', { stopped: true });
});

/**
 * GET /api/sandbox/workspace/status
 */
const listActiveWorkspaces = asyncHandler(async (_req, res) => {
  return successResponse(res, 200, 'Active workspaces', { count: 0, servers: [] });
});

module.exports = {
  initWorkspace,
  terminateWorkspace,
  syncWorkspace,
  stopWorkspace,
  listActiveWorkspaces,
};
