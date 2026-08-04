const API_CONFIG = {
  BASE_URL:   import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL   || 'http://127.0.0.1:5000',
  TIMEOUT:    30000, // 30s — generous for dev

  // Must match VITE_JWT_STORAGE_KEY and VITE_USER_STORAGE_KEY in .env
  TOKEN_KEY: import.meta.env.VITE_JWT_STORAGE_KEY  || 'codesphere_token',
  USER_KEY:  import.meta.env.VITE_USER_STORAGE_KEY || 'codesphere_user',
};

export default API_CONFIG;
