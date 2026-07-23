import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { IconButton } from './IconButton.jsx';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <IconButton
      icon={theme === 'dark' ? Sun : Moon}
      variant="secondary"
      size="md"
      onClick={toggleTheme}
      className="rounded-full shadow-sm"
      aria-label="Toggle dark mode"
    />
  );
};
