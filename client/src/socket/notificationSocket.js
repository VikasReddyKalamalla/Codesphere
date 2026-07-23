import { socket } from './socket.js';
export const subscribeToNotifications = (callback) => {
  socket.on('notification_received', callback);
};
