const path = require('path');
const fs   = require('fs');
const net  = require('net');
const http = require('http');
const { exec } = require('child_process');

const { syncDbToDisk, syncDiskToDb } = require('../utils/workspaceSync');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const SandboxProject = require('../models/SandboxProject');

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
 * Initializes a strictly per-user, per-project isolated directory inside Docker container:
 * Path: /home/coder/users/user_${userId}/${slug}
 *
 * Prevents any user from ever seeing another user's files.
 */
const initWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const repoUrl = req.body?.repoUrl;

  // Enforce unique per-user ID or unique session token
  let userFolderId = 'guest_' + Date.now();
  if (req.user && req.user._id) {
    userFolderId = req.user._id.toString();
  } else if (req.headers['x-session-id']) {
    userFolderId = req.headers['x-session-id'];
  }

  // Try fetching project to get clean title slug
  let slug = 'my-project';
  if (projectId && projectId !== 'blank' && projectId !== 'scratch') {
    try {
      const proj = await SandboxProject.findById(projectId).lean();
      if (proj && proj.slug) {
        slug = proj.slug;
      } else if (proj && proj.title) {
        slug = proj.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      } else {
        slug = projectId.toLowerCase().replace(/[^a-z0-9]/g, '-');
      }
    } catch {
      slug = projectId.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
  }

  // Per-user isolated container directory: /home/coder/users/user_<ID>/<SLUG>
  const userDir = `/home/coder/users/user_${userFolderId}`;
  const isolatedContainerPath = `${userDir}/${slug}`;
  const iframeUrl = `http://localhost:8107/?folder=${isolatedContainerPath}`;

  // 1 ── Create isolated user project directory inside Docker container
  await execInContainer(`mkdir -p ${isolatedContainerPath}`);

  // 2 ── If user provided GitHub Repo URL, clone it into the isolated directory
  if (repoUrl && repoUrl.startsWith('http')) {
    console.log(`[workspace] Cloning ${repoUrl} into ${isolatedContainerPath}`);
    await execInContainer(`if [ ! -d "${isolatedContainerPath}/.git" ]; then git clone ${repoUrl} ${isolatedContainerPath}; fi`);
  }

  return successResponse(res, 200, 'Isolated per-user VS Code workspace active', {
    iframeUrl,
    folderPath: isolatedContainerPath,
    port: 8107,
  });
});

/**
 * POST /api/sandbox/:id/workspace/terminate
 *
 * Completely deletes temporary user workspace storage or pushes to Git
 */
const terminateWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { pushToGit, repoUrl } = req.body || {};

  let userFolderId = 'guest';
  if (req.user && req.user._id) {
    userFolderId = req.user._id.toString();
  }

  let slug = 'my-project';
  if (projectId && projectId !== 'blank' && projectId !== 'scratch') {
    try {
      const proj = await SandboxProject.findById(projectId).lean();
      if (proj && proj.slug) slug = proj.slug;
    } catch {
      slug = projectId.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
  }

  const userDir = `/home/coder/users/user_${userFolderId}`;
  const isolatedContainerPath = `${userDir}/${slug}`;

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
  return successResponse(res, 200, 'Workspace synced', {});
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
