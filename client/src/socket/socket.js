import { io } from 'socket.io-client';
import API_CONFIG from '@config/api.config.js';
import { STORAGE_KEYS } from '@config/constants.js';

export const socket = io(API_CONFIG.SOCKET_URL, {
  autoConnect: false,
  auth: (cb) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    cb({ token: token ? `Bearer ${token}` : '' });
  },
});
