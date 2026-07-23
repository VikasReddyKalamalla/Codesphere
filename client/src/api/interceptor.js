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
    (error) => errorHandler(error)
  );
};
