const handleEventSocket = (socket, io) => {
  // Join specific event room for real-time live updates
  socket.on('event:join', (eventId) => {
    socket.join(`event:${eventId}`);
  });

  socket.on('event:leave', (eventId) => {
    socket.leave(`event:${eventId}`);
  });

  // Real-time broadcast for event live tracking
  socket.on('event:ping', (data) => {
    if (data?.eventId) {
      io.to(`event:${data.eventId}`).emit('event:ping_update', {
        userId: socket.user?._id,
        userName: socket.user?.fullName,
        timestamp: Date.now()
      });
    }
  });
};

module.exports = { handleEventSocket };
