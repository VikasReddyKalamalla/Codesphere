import axios from 'axios';
import API_CONFIG from '@config/api.config.js';

/**
 * apiClient — pre-configured Axios instance used by every service module.
 *
 * Features:
 *  - Automatically attaches the JWT Bearer token from localStorage
 *  - Intercepts 401 responses and clears the session
 *  - Normalises error messages into a single `error.message` string
 */
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor — attach token ───────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — normalise errors ──────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    if (status === 401) {
      console.warn('[ApiClient 401 Unauthorized]:', error.config?.url, message);
      if (
        message.includes('no longer exists') || 
        message.includes('Session expired') || 
        message.includes('Access denied') ||
        message.includes('Invalid token')
      ) {
        localStorage.removeItem(API_CONFIG.TOKEN_KEY);
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject({ message, status, data: error.response?.data });
  }
);

export default apiClient;
