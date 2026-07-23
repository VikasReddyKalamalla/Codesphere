const handleWorkspace = (socket, io) => {
  // Join a workspace room
  socket.on('workspace:join', (workspaceId) => {
    socket.join(`workspace:${workspaceId}`);
    console.log(`${socket.id} joined workspace: ${workspaceId}`);
  });

  // Leave a workspace room
  socket.on('workspace:leave', (workspaceId) => {
    socket.leave(`workspace:${workspaceId}`);
  });

  // Broadcast task updates to workspace members
  socket.on('workspace:taskUpdated', ({ workspaceId, task }) => {
    socket.to(`workspace:${workspaceId}`).emit('workspace:taskUpdated', task);
  });

  // Broadcast when a member joins/leaves workspace
  socket.on('workspace:memberJoined', ({ workspaceId, user }) => {
    socket.to(`workspace:${workspaceId}`).emit('workspace:memberJoined', user);
  });
};

module.exports = { handleWorkspace };
