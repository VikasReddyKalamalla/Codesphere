const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);

const WORKSPACES_DIR = path.resolve(__dirname, '../../../../workspaces');

// In-memory registry of active workspace runtimes
const workspaceRegistry = new Map();

let nextPort = 8100;
function allocatePort() {
  const port = nextPort++;
  if (nextPort > 8999) nextPort = 8100;
  return port;
}

function getPlanQuotas(plan = 'free') {
  switch (plan.toLowerCase()) {
    case 'enterprise':
      return { cpus: '8.0', memory: '16g', cpusNum: 8, memoryMb: 16384 };
    case 'premium':
      return { cpus: '2.0', memory: '4g', cpusNum: 2, memoryMb: 4096 };
    case 'free':
    default:
      return { cpus: '1.0', memory: '1g', cpusNum: 1, memoryMb: 1024 };
  }
}

async function isDockerAvailable() {
  try {
    await execPromise('docker info');
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Scan exposed preview ports and assign friendly human-readable app labels
 */
async function scanExposedPreviewPortsWithLabels(workspaceId) {
  const wsInfo = workspaceRegistry.get(workspaceId);
  const rawPorts = new Set([3000, 5000, 5173, 8080, 8081, 4173, 9000, 4200]);

  if (wsInfo && wsInfo.type === 'docker') {
    try {
      const { stdout } = await execPromise(`docker exec ${wsInfo.containerName} netstat -tuln || docker exec ${wsInfo.containerName} ss -tuln`);
      const lines = stdout.split('\n');
      for (const line of lines) {
        const match = line.match(/:(\d+)\b/);
        if (match) {
          const p = parseInt(match[1], 10);
          if (p >= 1000 && p <= 9999 && p !== 8080) {
            rawPorts.add(p);
          }
        }
      }
    } catch (e) {}
  }

  const portMap = {
    3000: 'React / Web App',
    5000: 'Python FastAPI / Flask',
    5173: 'Vite Frontend',
    8080: 'Spring Boot / Java App',
    8081: 'Node.js API Server',
    4173: 'Vite Preview',
    9000: 'PHP / Go Web Server',
    4200: 'Angular Frontend',
    5001: 'Microservice API'
  };

  return Array.from(rawPorts).map(p => ({
    port: p,
    label: portMap[p] || `Custom Server (Port ${p})`,
    url: `http://localhost:${p}`
  }));
}

/**
 * Auto-heal & crash recovery
 */
async function autoHealWorkspaceContainer(studentId, workspaceId, language = 'javascript', plan = 'free') {
  console.log(`[AutoHeal] Triggering crash recovery for workspace ${workspaceId}...`);
  await stopWorkspaceContainer(workspaceId);
  return await createOrStartWorkspaceContainer(studentId, workspaceId, language, plan);
}

/**
 * Create and start workspace environment
 */
async function createOrStartWorkspaceContainer(studentId, workspaceId, language = 'javascript', plan = 'free') {
  const existing = workspaceRegistry.get(workspaceId);
  if (existing && existing.status === 'running') {
    existing.lastActivity = Date.now();
    return existing;
  }

  const workspaceHostDir = path.join(WORKSPACES_DIR, String(studentId), String(workspaceId));
  if (!fs.existsSync(workspaceHostDir)) {
    fs.mkdirSync(workspaceHostDir, { recursive: true });
  }

  const containerName = `codesphere-ws-${workspaceId}`.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const allocatedPort = existing?.port || allocatePort();
  const quotas = getPlanQuotas(plan);
  const hasDocker = await isDockerAvailable();

  if (hasDocker) {
    try {
      const { stdout: checkOut } = await execPromise(`docker ps -a --filter "name=${containerName}" --format "{{.ID}} {{.State}}"`);
      
      if (checkOut.trim()) {
        const [existingId, state] = checkOut.trim().split(' ');
        if (state === 'running') {
          console.log(`[WorkspaceManager] Container ${containerName} is running.`);
        } else {
          console.log(`[WorkspaceManager] Starting stopped container ${containerName}...`);
          await execPromise(`docker start ${containerName}`);
        }
      } else {
        console.log(`[WorkspaceManager] Launching Docker container ${containerName} (Plan: ${plan})...`);
        
        const runCmd = `docker run -d \
          --name ${containerName} \
          -p ${allocatedPort}:8080 \
          -v "${workspaceHostDir}:/home/coder/workspace" \
          --memory=${quotas.memory} \
          --cpus=${quotas.cpus} \
          --security-opt=no-new-privileges:true \
          --user coder \
          codesphere/workspace-runner:latest || docker run -d \
          --name ${containerName} \
          -p ${allocatedPort}:8080 \
          -v "${workspaceHostDir}:/home/coder/workspace" \
          --memory=${quotas.memory} \
          --cpus=${quotas.cpus} \
          --security-opt=no-new-privileges:true \
          codercom/code-server:latest --auth none`;

        await execPromise(runCmd);

        // Multiple persistent terminal sessions with tmux
        try {
          await execPromise(`docker exec ${containerName} tmux new-session -d -s term_1 || true`);
          await execPromise(`docker exec ${containerName} tmux new-session -d -s term_2 || true`);
        } catch (e) {}
      }

      const wsInfo = {
        workspaceId,
        studentId,
        containerName,
        port: allocatedPort,
        status: 'running',
        type: 'docker',
        plan,
        quotas,
        lastActivity: Date.now(),
        url: `http://localhost:${allocatedPort}`
      };

      workspaceRegistry.set(workspaceId, wsInfo);
      return wsInfo;
    } catch (dockerErr) {
      console.warn(`[WorkspaceManager] Docker launch warning (${dockerErr.message}). Falling back to local process runner...`);
    }
  }

  // Process Fallback
  console.log(`[WorkspaceManager] Starting local process fallback for workspace ${workspaceId} on port ${allocatedPort}`);
  
  let proc;
  try {
    proc = exec(`code-server --bind-addr 127.0.0.1:${allocatedPort} --auth none "${workspaceHostDir}"`);
  } catch (procErr) {}

  const wsInfo = {
    workspaceId,
    studentId,
    containerName,
    port: allocatedPort,
    status: 'running',
    type: 'local_process',
    process: proc,
    plan,
    quotas,
    lastActivity: Date.now(),
    url: `http://localhost:${allocatedPort}`
  };

  workspaceRegistry.set(workspaceId, wsInfo);
  return wsInfo;
}

async function stopWorkspaceContainer(workspaceId) {
  const wsInfo = workspaceRegistry.get(workspaceId);
  if (!wsInfo) return { status: 'stopped', message: 'Workspace container not found' };

  if (wsInfo.type === 'docker') {
    try {
      await execPromise(`docker stop ${wsInfo.containerName}`);
    } catch (err) {}
  } else if (wsInfo.process) {
    try { wsInfo.process.kill('SIGTERM'); } catch (e) {}
  }

  wsInfo.status = 'stopped';
  return { status: 'stopped', workspaceId };
}

async function deleteWorkspaceContainer(workspaceId, removeFiles = false) {
  const wsInfo = workspaceRegistry.get(workspaceId);
  if (wsInfo && wsInfo.type === 'docker') {
    try {
      await execPromise(`docker rm -f ${wsInfo.containerName}`);
    } catch (err) {}
  }

  if (wsInfo && wsInfo.process) {
    try { wsInfo.process.kill('SIGKILL'); } catch (e) {}
  }

  workspaceRegistry.delete(workspaceId);

  if (removeFiles && wsInfo?.studentId) {
    const dir = path.join(WORKSPACES_DIR, String(wsInfo.studentId), String(workspaceId));
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  return { status: 'deleted', workspaceId };
}

function getWorkspaceStatus(workspaceId) {
  const existing = workspaceRegistry.get(workspaceId);
  if (!existing) return { status: 'stopped', workspaceId };
  return existing;
}

function getAllTrackedWorkspaces() {
  return Array.from(workspaceRegistry.values());
}

function updateWorkspaceActivity(workspaceId) {
  const existing = workspaceRegistry.get(workspaceId);
  if (existing) existing.lastActivity = Date.now();
}

module.exports = {
  createOrStartWorkspaceContainer,
  stopWorkspaceContainer,
  deleteWorkspaceContainer,
  getWorkspaceStatus,
  getAllTrackedWorkspaces,
  updateWorkspaceActivity,
  scanExposedPreviewPortsWithLabels,
  autoHealWorkspaceContainer,
  workspaceRegistry
};
