import ENV_CONFIG from './envConfig.js';
export const SOCKET_CONFIG = {
  URL: ENV_CONFIG.SOCKET_URL,
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 2000,
  TIMEOUT: 20000,
  TRANSPORTS: ['websocket']
};
export default SOCKET_CONFIG;
