import { AUTH_KEYS } from '../constants/authConstants.js';

export const saveToken = (token) => localStorage.setItem(AUTH_KEYS.TOKEN, token);
export const getToken = () => localStorage.getItem(AUTH_KEYS.TOKEN);
export const removeToken = () => localStorage.removeItem(AUTH_KEYS.TOKEN);

export const saveUser = (user) => localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
export const getUser = () => {
  const u = localStorage.getItem(AUTH_KEYS.USER);
  return u ? JSON.parse(u) : null;
};
export const removeUser = () => localStorage.removeItem(AUTH_KEYS.USER);
