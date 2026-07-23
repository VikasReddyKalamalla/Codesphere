import { useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (val) => {
    setStoredValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [storedValue, setValue];
};
