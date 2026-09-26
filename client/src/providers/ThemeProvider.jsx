import React, { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../config/constants.js';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || localStorage.getItem('theme') || 'light';
    } catch (_) {
      return 'light';
    }
  });

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, next);
      localStorage.setItem('theme', next);
    } catch (_) {}
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;
