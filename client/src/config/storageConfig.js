export const STORAGE_CONFIG = {
  TOKEN: import.meta.env.VITE_JWT_STORAGE_KEY || 'codesphere_token',
  USER: import.meta.env.VITE_USER_STORAGE_KEY || 'codesphere_user',
  THEME: 'codesphere_theme',
  LANGUAGE: 'codesphere_lang',
  SETTINGS: 'codesphere_settings'
};
export default STORAGE_CONFIG;
