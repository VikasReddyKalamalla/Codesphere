import { AUTH_KEYS } from '../constants/authConstants.js';

export const saveToken = (token) => {
  try {
    if (token) localStorage.setItem(AUTH_KEYS.TOKEN, token);
    else localStorage.removeItem(AUTH_KEYS.TOKEN);
  } catch (_) {}
};

export const getToken = () => {
  try {
    const token = localStorage.getItem(AUTH_KEYS.TOKEN) || localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') return null;
    return token;
  } catch (_) {
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem('token');
  } catch (_) {}
};

export const saveUser = (user) => {
  try {
    if (user) {
      const val = typeof user === 'string' ? user : JSON.stringify(user);
      localStorage.setItem(AUTH_KEYS.USER, val);
    } else {
      localStorage.removeItem(AUTH_KEYS.USER);
    }
  } catch (_) {}
};

export const getUser = () => {
  try {
    const u = localStorage.getItem(AUTH_KEYS.USER) || localStorage.getItem('user');
    if (!u || u === 'undefined' || u === 'null') return null;
    return typeof u === 'string' ? JSON.parse(u) : u;
  } catch (err) {
    try {
      localStorage.removeItem(AUTH_KEYS.USER);
      localStorage.removeItem('user');
    } catch (_) {}
    return null;
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem(AUTH_KEYS.USER);
    localStorage.removeItem('user');
  } catch (_) {}
};

