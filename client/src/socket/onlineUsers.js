import { socket } from './socket.js';
export const trackOnlineStatus = (callback) => {
  socket.on('online_users_list', callback);
};
