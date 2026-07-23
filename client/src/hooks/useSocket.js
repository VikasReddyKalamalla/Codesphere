import { useEffect } from 'react';
import { socket } from '../socket/socket.js';

export const useSocket = (event, callback) => {
  useEffect(() => {
    socket.connect();
    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
  return socket;
};
