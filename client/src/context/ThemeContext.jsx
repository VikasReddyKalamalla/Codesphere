import React, { createContext } from 'react';
import { useTheme } from '../hooks/useTheme.js';

export const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const value = useTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
