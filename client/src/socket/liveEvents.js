import { socket } from './socket.js';
export const trackLiveWebcasts = (callback) => {
  socket.on('live_webcasts_updates', callback);
};
