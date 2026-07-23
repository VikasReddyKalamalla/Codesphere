import ENV_CONFIG from './envConfig.js';
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  TIMEOUT: 15000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  CREDENTIALS: true
};
export default API_CONFIG;
