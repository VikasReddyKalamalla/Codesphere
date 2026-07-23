export const CONSTANTS = {
  DEFAULT_AVATAR: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><circle cx='12' cy='8' r='4'/><path d='M12 14c-6.1 0-10 4-10 10h20c0-6-3.9-10-10-10z'/></svg>",
  DEFAULT_BANNER: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024,
  DEFAULT_LANGUAGE: 'javascript',
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 30
};

export const STORAGE_KEYS = {
  TOKEN: import.meta.env.VITE_JWT_STORAGE_KEY || 'codesphere_token',
  USER: import.meta.env.VITE_USER_STORAGE_KEY || 'codesphere_user',
  THEME: 'codesphere_theme'
};

export default CONSTANTS;
