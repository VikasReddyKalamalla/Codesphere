import { STORAGE_KEYS } from '../config/constants.js';

export const setupRequestInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export const setupResponseInterceptor = (instance, errorHandler) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;
      if (config && (!config._retryCount || config._retryCount < 2)) {
        const status = error.response?.status;
        if (!status || status === 502 || status === 503 || status === 504) {
          config._retryCount = (config._retryCount || 0) + 1;
          const delay = Math.pow(2, config._retryCount) * 500; // Exponential backoff: 1s, 2s
          await new Promise((res) => setTimeout(res, delay));
          return instance(config);
        }
      }
      return errorHandler(error);
    }
  );
};
