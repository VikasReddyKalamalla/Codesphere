const memStore = new Map();

export const getLocal = (key) => {
  try {
    return localStorage.getItem(key) ?? memStore.get(key) ?? null;
  } catch (_) {
    return memStore.get(key) ?? null;
  }
};

export const setLocal = (key, val) => {
  try {
    localStorage.setItem(key, val);
  } catch (_) {
    memStore.set(key, String(val));
  }
};

export const removeLocal = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (_) {}
  memStore.delete(key);
};
