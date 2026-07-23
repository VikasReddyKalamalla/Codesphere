import { io } from 'socket.io-client';
import API_CONFIG from '@config/api.config.js';

export const socket = io(API_CONFIG.SOCKET_URL, {
  autoConnect: false,
});
