import axios from 'axios';
import API_CONFIG from './apiConfig.js';
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptor.js';
import { handleApiError } from './apiErrorHandler.js';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true,
});

setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient, handleApiError);

export default apiClient;
