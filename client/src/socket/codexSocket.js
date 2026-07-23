import { socket } from './socket.js';
export const syncWorkspaceCode = (workspaceId, code) => {
  socket.emit('workspace_code_sync', { workspaceId, code });
};
