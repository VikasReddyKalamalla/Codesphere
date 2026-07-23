import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setThemeState] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  return { theme, toggleTheme };
};
