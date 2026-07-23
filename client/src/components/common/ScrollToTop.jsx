import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { IconButton } from './IconButton.jsx';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <IconButton
      icon={ArrowUp}
      variant="primary"
      size="lg"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 shadow-xl rounded-full z-55 hover:scale-105 border border-indigo-400"
      aria-label="Scroll to top"
    />
  );
};
