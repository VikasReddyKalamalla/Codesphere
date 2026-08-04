const path = require('path');
const fs   = require('fs');
const net  = require('net');
const http = require('http');

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
 * Locate the best available VS Code web build to serve.
 *
 * Priority:
 *  1. Pre-downloaded static build in .vscode-test-web/  (fastest, always works)
 *  2. If not found, download it via downloadAndUnzipVSCode (first run only)
 */
const resolveBuild = async () => {
  // 1 — Scan for any already-downloaded build in the test-web data dir
  if (fs.existsSync(TEST_WEB_DATA_DIR)) {
    const entries = fs.readdirSync(TEST_WEB_DATA_DIR);
    // Prefer the folder that contains an `out` directory (compiled web build)
    const match = entries.find(e => {
      const candidate = path.join(TEST_WEB_DATA_DIR, e);
      return (
        fs.statSync(candidate).isDirectory() &&
        (e.startsWith('vscode-web-') || e.startsWith('code-')) &&
        fs.existsSync(path.join(candidate, 'out'))
      );
    });
    if (match) {
      const location = path.join(TEST_WEB_DATA_DIR, match);
      console.log(`[vscode-web] Using pre-downloaded build: ${location}`);
      return { type: 'static', location };
    }
  }

  // 2 — Download stable build on first use
  console.log('[vscode-web] No cached build found – downloading VS Code stable web build...');
  const { downloadAndUnzipVSCode } = getTestWebModules();
  const build = await downloadAndUnzipVSCode(TEST_WEB_DATA_DIR, 'stable');
  console.log(`[vscode-web] Downloaded build: ${build.location}`);
  return build;
};

/**
 * Wait until the VS Code web server responds to an HTTP request.
 * Resolves (never rejects) — worst case after maxMs we return anyway.
 */
const waitForServer = (port, maxMs = 20000) =>
  new Promise((resolve) => {
    const start   = Date.now();
    const attempt = () => {
      http.get(`http://127.0.0.1:${port}/`, res => {
        res.resume();
        resolve();
      }).on('error', () => {
        if (Date.now() - start > maxMs) {
          console.warn(`[vscode-web] Readiness timeout for port ${port} after ${maxMs}ms — returning anyway`);
          resolve();
        } else {
          setTimeout(attempt, 300);
        }
      });
    };
    attempt();
  });

// ─── Controller Actions ───────────────────────────────────────────────────────

/**
 * POST /api/sandbox/:id/workspace/init
 *
 * 1. Sync project code-files from MongoDB → local disk
 * 2. Reuse an already-running VS Code server if still alive
 * 3. Otherwise spawn a new @vscode/test-web server pointing at the workspace dir
 * 4. Return { iframeUrl, port } to the client
 */
const initWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user._id; // Keep as ObjectId for DB queries
  const key    = `${projectId}_${userId.toString()}`; // Convert to string only for key

  // 1 ── Sync DB → disk  (creates workspace dir + writes code files)
  try {
    const workspacePath = await syncDbToDisk(projectId, userId);
    const normalizedPath = path.normalize(workspacePath);
    fs.mkdirSync(normalizedPath, { recursive: true });
  } catch (e) {
    console.warn(`[vscode-web] Sync DB to disk notice:`, e.message);
  }

  // 2 ── Prioritize Docker code-server (port 8107) or existing container instance
  const isDockerAlive = await isPortListening(8107);
  if (isDockerAlive) {
    console.log(`[vscode-web] Detected Docker code-server active on port 8107`);
    return successResponse(res, 200, 'Docker VS Code Web server active', {
      iframeUrl: 'http://localhost:8107/?folder=/home/coder',
      port: 8107,
    });
  }

  // 2b ── Reuse existing server if alive
  if (activeServers.has(key)) {
    const existing  = activeServers.get(key);
    const isAlive   = await isPortListening(existing.port);
    if (isAlive) {
      console.log(`[vscode-web] Reusing server for ${key} on port ${existing.port}`);
      return successResponse(res, 200, 'Workspace VS Code server already running', {
        iframeUrl: `http://localhost:8107/?folder=/home/coder`,
        port:      existing.port,
      });
    }
    // Stale entry – clean up
    activeServers.delete(key);
  }

  // 3 ── Try spawning local web server or default to Docker code-server URL
  try {
    const port = await findFreePort();
    const build = await resolveBuild();

    console.log(`[vscode-web] Starting server for ${key} on port ${port}`);

    const { runServer } = getTestWebModules();
    const server = await runServer('127.0.0.1', port, {
      build,
      folderMountPath: path.join(__dirname, '..', '..'),
      esm:             true,
      printServerLog:  false,
    });

    activeServers.set(key, { port, server });
    await waitForServer(port, 3000);

    return successResponse(res, 200, 'Workspace initialized and VS Code server started', {
      iframeUrl: 'http://localhost:8107/?folder=/home/coder',
      port: 8107,
    });
  } catch (err) {
    console.warn(`[vscode-web] Spawn notice, using Docker code-server 8107:`, err.message);
    return successResponse(res, 200, 'Docker VS Code Web server active', {
      iframeUrl: 'http://localhost:8107/?folder=/home/coder',
      port: 8107,
    });
  }
});

/**
 * POST /api/sandbox/:id/workspace/sync
 *
 * Reads files from the on-disk workspace back into MongoDB (so progress is persisted
 * even when the user edits files directly in VS Code Web).
 */
const syncWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user._id; // Keep as ObjectId for DB queries

  const progress = await syncDiskToDb(projectId, userId);
  if (!progress) {
    return errorResponse(res, 404, 'Workspace files not found on disk. Initialize workspace first.');
  }

  return successResponse(res, 200, 'Workspace files synced to database', progress);
});

/**
 * DELETE /api/sandbox/:id/workspace/stop
 *
 * Gracefully stops the per-user VS Code server and removes it from the registry.
 * Called when the user navigates away from the sandbox project page.
 */
const stopWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user._id; // Keep as ObjectId for DB queries
  const key    = `${projectId}_${userId.toString()}`; // Convert to string only for key

  if (!activeServers.has(key)) {
    return successResponse(res, 200, 'No active workspace server to stop', { stopped: false });
  }

  const { port, server } = activeServers.get(key);

  // Best-effort: sync disk → DB before shutdown
  try {
    await syncDiskToDb(projectId, userId);
  } catch (syncErr) {
    console.warn('[vscode-web] Pre-stop sync failed:', syncErr.message);
  }

  // Close the HTTP server
  try {
    await new Promise((resolve, reject) => {
      server.close(err => (err ? reject(err) : resolve()));
      // Force-kill after 3 s if still open
      setTimeout(resolve, 3000);
    });
  } catch (closeErr) {
    console.warn(`[vscode-web] Error closing server on port ${port}:`, closeErr.message);
  }

  activeServers.delete(key);
  console.log(`[vscode-web] Stopped server for ${key} (was on port ${port})`);

  return successResponse(res, 200, 'Workspace server stopped', { stopped: true, port });
});

/**
 * GET /api/sandbox/workspace/status  (admin / debug)
 *
 * Returns a list of all currently active VS Code servers.
 * Restricted to admin role in the route file.
 */
const listActiveWorkspaces = asyncHandler(async (_req, res) => {
  const list = Array.from(activeServers.entries()).map(([key, info]) => ({
    key,
    port: info.port,
    workspacePath: info.workspacePath,
  }));
  return successResponse(res, 200, 'Active workspace servers', { count: list.length, servers: list });
});

module.exports = {
  initWorkspace,
  syncWorkspace,
  stopWorkspace,
  listActiveWorkspaces,
};
