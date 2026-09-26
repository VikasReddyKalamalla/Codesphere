const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const WORKSPACES_DIR = path.resolve(__dirname, '../../../../workspaces');
const SNAPSHOTS_DIR = path.resolve(__dirname, '../../../../snapshots');

/**
 * Save snapshot checkpoint of workspace folder
 */
async function saveSnapshot(studentId, workspaceId, title = 'Checkpoint') {
  const wsDir = path.join(WORKSPACES_DIR, String(studentId), String(workspaceId));
  if (!fs.existsSync(wsDir)) {
    throw new Error('Workspace directory not found');
  }

  const wsSnapshotsDir = path.join(SNAPSHOTS_DIR, String(workspaceId));
  if (!fs.existsSync(wsSnapshotsDir)) {
    fs.mkdirSync(wsSnapshotsDir, { recursive: true });
  }

  const snapshotId = `snap_${Date.now()}`;
  const archivePath = path.join(wsSnapshotsDir, `${snapshotId}.tar.gz`);

  // Compress workspace files
  await execPromise(`tar -czf "${archivePath}" -C "${wsDir}" .`);

  return {
    snapshotId,
    title,
    diskPath: archivePath,
    createdAt: new Date()
  };
}

/**
 * Restore snapshot checkpoint into workspace folder
 */
async function restoreSnapshot(studentId, workspaceId, snapshotId) {
  const wsDir = path.join(WORKSPACES_DIR, String(studentId), String(workspaceId));
  const archivePath = path.join(SNAPSHOTS_DIR, String(workspaceId), `${snapshotId}.tar.gz`);

  if (!fs.existsSync(archivePath)) {
    throw new Error('Snapshot archive file not found');
  }

  // Clear existing workspace dir content
  if (fs.existsSync(wsDir)) {
    fs.rmSync(wsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(wsDir, { recursive: true });

  // Extract snapshot archive
  await execPromise(`tar -xzf "${archivePath}" -C "${wsDir}"`);

  return {
    restored: true,
    snapshotId,
    workspaceId
  };
}

module.exports = {
  saveSnapshot,
  restoreSnapshot
};
