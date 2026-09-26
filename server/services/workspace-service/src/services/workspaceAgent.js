const telemetryService = require('./telemetryService');
const eventBus = require('./workspaceEventBus');

/**
 * Unified Container Workspace Agent helper running telemetry and monitoring cycles
 */
class WorkspaceAgent {
  constructor(workspaceId, containerName) {
    this.workspaceId = workspaceId;
    this.containerName = containerName;
    this.active = true;
  }

  async runCycle() {
    if (!this.active) return;
    try {
      const stats = await telemetryService.getContainerTelemetry(this.containerName);
      eventBus.emit('telemetry.updated', {
        workspaceId: this.workspaceId,
        telemetry: stats
      });
    } catch (e) {}
  }
}

const activeAgents = new Map();

function startAgentForWorkspace(workspaceId, containerName) {
  if (activeAgents.has(workspaceId)) return activeAgents.get(workspaceId);

  const agent = new WorkspaceAgent(workspaceId, containerName);
  activeAgents.set(workspaceId, agent);

  const timer = setInterval(() => {
    agent.runCycle();
  }, 4000);

  agent.timer = timer;
  return agent;
}

function stopAgentForWorkspace(workspaceId) {
  const agent = activeAgents.get(workspaceId);
  if (agent) {
    agent.active = false;
    if (agent.timer) clearInterval(agent.timer);
    activeAgents.delete(workspaceId);
  }
}

module.exports = {
  startAgentForWorkspace,
  stopAgentForWorkspace
};
