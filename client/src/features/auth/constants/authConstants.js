// Match exactly the keys used by apiClient (from api.config.js / .env)
export const AUTH_KEYS = {
  TOKEN: import.meta.env.VITE_JWT_STORAGE_KEY  || 'codesphere_token',
  USER:  import.meta.env.VITE_USER_STORAGE_KEY || 'codesphere_user',
};

export const AUTH_STATUS = {
  IDLE:      'idle',
  LOADING:   'loading',
  SUCCEEDED: 'succeeded',
  FAILED:    'failed',
};
