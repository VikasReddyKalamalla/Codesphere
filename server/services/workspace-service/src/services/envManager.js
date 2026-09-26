const fs = require('fs');
const path = require('path');

const WORKSPACES_DIR = path.resolve(__dirname, '../../../../workspaces');

/**
 * Write environment variables to workspace .env file
 */
function syncEnvFile(studentId, workspaceId, envVars = []) {
  const wsDir = path.join(WORKSPACES_DIR, String(studentId), String(workspaceId));
  if (!fs.existsSync(wsDir)) {
    fs.mkdirSync(wsDir, { recursive: true });
  }

  const envFilePath = path.join(wsDir, '.env');
  const lines = envVars.map(item => `${item.key}=${item.value}`);
  fs.writeFileSync(envFilePath, lines.join('\n'), 'utf-8');

  return {
    synced: true,
    count: envVars.length,
    path: envFilePath
  };
}

/**
 * Read environment variables from workspace .env file
 */
function readEnvFile(studentId, workspaceId) {
  const envFilePath = path.join(WORKSPACES_DIR, String(studentId), String(workspaceId), '.env');
  if (!fs.existsSync(envFilePath)) return [];

  const content = fs.readFileSync(envFilePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));

  return lines.map(line => {
    const idx = line.indexOf('=');
    if (idx === -1) return { key: line.trim(), value: '' };
    return {
      key: line.substring(0, idx).trim(),
      value: line.substring(idx + 1).trim()
    };
  });
}

module.exports = {
  syncEnvFile,
  readEnvFile
};
