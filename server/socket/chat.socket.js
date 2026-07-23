const handleChat = (socket, io) => {
  // Join a community room
  socket.on('chat:join', (communityId) => {
    socket.join(`community:${communityId}`);
    console.log(`${socket.id} joined community room: ${communityId}`);
  });

  // Leave a community room
  socket.on('chat:leave', (communityId) => {
    socket.leave(`community:${communityId}`);
  });

  // Send a message to a community room
  socket.on('chat:message', ({ communityId, message }) => {
    io.to(`community:${communityId}`).emit('chat:message', message);
  });
};

module.exports = { handleChat };
