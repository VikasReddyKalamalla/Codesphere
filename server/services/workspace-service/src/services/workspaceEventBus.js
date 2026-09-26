const EventEmitter = require('events');

class WorkspaceEventBus extends EventEmitter {}

const eventBus = new WorkspaceEventBus();

// Log events for audit and microservice routing
eventBus.on('workspace.created', (data) => {
  console.log(`[EventBus] EVENT: workspace.created -> ID: ${data.workspaceId}`);
});

eventBus.on('workspace.started', (data) => {
  console.log(`[EventBus] EVENT: workspace.started -> ID: ${data.workspaceId}, Port: ${data.port}`);
});

eventBus.on('telemetry.updated', (data) => {
  // Broadcasted to active WebSocket listeners
});

eventBus.on('ports.discovered', (data) => {
  console.log(`[EventBus] EVENT: ports.discovered -> Workspace: ${data.workspaceId}, Count: ${data.ports.length}`);
});

module.exports = eventBus;
