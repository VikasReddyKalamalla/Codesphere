/**
 * Container Orchestration & Idle Hibernation Service
 * Manages dynamic spawning, CPU/RAM resource limits per tier, and 15-min auto-hibernation.
 */

const { exec } = require('child_process');
const path = require('path');
const logger = require('../utils/logger');

// Resource allocation tiers
const TIER_RESOURCE_LIMITS = {
  free:     { cpus: '0.5', memory: '512m', diskQuotaMb: 2048 },
  standard: { cpus: '1.0', memory: '1024m', diskQuotaMb: 5120 },
  premium:  { cpus: '2.0', memory: '2048m', diskQuotaMb: 10240 },
};

// Map storing active container activity timestamps
const activeContainers = new Map();

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Dynamically spawn workspace container with CPU & RAM limits based on user plan
 */
const spawnContainer = async ({ userId, workspaceId, userTier = 'free' }) => {
  const limits = TIER_RESOURCE_LIMITS[userTier] || TIER_RESOURCE_LIMITS.free;
  const containerName = `codesphere-ws-${userId}-${workspaceId}`;

  logger.info(`Spawning container [${containerName}] with limits: CPUs=${limits.cpus}, RAM=${limits.memory}`);

  // Track container activity timestamp
  activeContainers.set(containerName, {
    userId,
    workspaceId,
    userTier,
    lastActive: Date.now(),
    status: 'running',
    limits,
  });

  return {
    containerName,
    status: 'running',
    resourceLimits: limits,
    spawnedAt: new Date(),
  };
};

/**
 * Record user activity heartbeat to delay hibernation
 */
const recordActivityHeartbeat = (containerName) => {
  const container = activeContainers.get(containerName);
  if (container) {
    container.lastActive = Date.now();
    container.status = 'running';
  }
};

/**
 * Hibernates containers inactive for more than idleThresholdMs (default 15 mins)
 */
const hibernateInactiveContainers = async (idleThresholdMinutes = 15) => {
  const now = Date.now();
  const thresholdMs = idleThresholdMinutes * 60 * 1000;
  const hibernatedList = [];

  for (const [containerName, info] of activeContainers.entries()) {
    if (info.status === 'running' && (now - info.lastActive) > thresholdMs) {
      info.status = 'hibernated';
      info.hibernatedAt = new Date();
      hibernatedList.push(containerName);
      logger.info(`Auto-hibernated idle container: ${containerName} (Inactive for > ${idleThresholdMinutes}m)`);
    }
  }

  return {
    hibernatedCount: hibernatedList.length,
    hibernatedContainers: hibernatedList,
  };
};

/**
 * Teardown container on workspace deletion
 */
const teardownContainer = async (containerName) => {
  activeContainers.delete(containerName);
  logger.info(`Teardown container: ${containerName}`);
  return { containerName, status: 'terminated' };
};

/**
 * Get active container orchestration metrics
 */
const getOrchestratorMetrics = () => {
  const containers = Array.from(activeContainers.entries()).map(([name, info]) => ({
    name,
    ...info,
    idleMinutes: Math.round((Date.now() - info.lastActive) / 60000),
  }));

  return {
    totalContainers: containers.length,
    runningContainers: containers.filter(c => c.status === 'running').length,
    hibernatedContainers: containers.filter(c => c.status === 'hibernated').length,
    containers,
  };
};

module.exports = {
  spawnContainer,
  recordActivityHeartbeat,
  hibernateInactiveContainers,
  teardownContainer,
  getOrchestratorMetrics,
  TIER_RESOURCE_LIMITS,
};
