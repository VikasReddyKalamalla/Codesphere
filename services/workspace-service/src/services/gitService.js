const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const WORKSPACES_DIR = path.resolve(__dirname, '../../../../workspaces');

/**
 * Clone remote Git repository into student workspace
 */
async function cloneRepository(studentId, workspaceId, repoUrl, branch = 'main') {
  const wsDir = path.join(WORKSPACES_DIR, String(studentId), String(workspaceId));
  
  if (!fs.existsSync(wsDir)) {
    fs.mkdirSync(wsDir, { recursive: true });
  }

  // Clone repo directly into workspace folder
  await execPromise(`git clone --branch ${branch} "${repoUrl}" .`, { cwd: wsDir });

  return {
    cloned: true,
    repoUrl,
    branch,
    workspaceId
  };
}

/**
 * Commit changes inside workspace
 */
async function commitWorkspaceChanges(studentId, workspaceId, message = 'Update assignment code') {
  const wsDir = path.join(WORKSPACES_DIR, String(studentId), String(workspaceId));
  if (!fs.existsSync(wsDir)) throw new Error('Workspace directory not found');

  await execPromise(`git add . && git commit -m "${message.replace(/"/g, '\\"')}" || true`, { cwd: wsDir });
  const { stdout: hash } = await execPromise(`git rev-parse HEAD || echo "none"`, { cwd: wsDir });

  return {
    committed: true,
    message,
    hash: hash.trim()
  };
}

/**
 * Get Git status for workspace
 */
async function getGitStatus(studentId, workspaceId) {
  const wsDir = path.join(WORKSPACES_DIR, String(studentId), String(workspaceId));
  if (!fs.existsSync(wsDir)) throw new Error('Workspace directory not found');

  try {
    const { stdout: status } = await execPromise(`git status -s`, { cwd: wsDir });
    const { stdout: branch } = await execPromise(`git branch --show-current`, { cwd: wsDir });

    return {
      isGitRepo: true,
      branch: branch.trim() || 'main',
      modifiedFiles: status.trim() ? status.trim().split('\n') : []
    };
  } catch (err) {
    return {
      isGitRepo: false,
      branch: null,
      modifiedFiles: []
    };
  }
}

module.exports = {
  cloneRepository,
  commitWorkspaceChanges,
  getGitStatus
};
