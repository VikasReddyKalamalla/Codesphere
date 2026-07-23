import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const Logo = ({ size = 'w-8 h-8', showText = true, textColor = 'text-slate-800', isLight = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div 
          onClick={handleLogoClick}
          className="cursor-pointer hover:scale-105 transition-transform"
          title="Click to view full illustration"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={`${size} shrink-0`}>
            <defs>
              <linearGradient id="logoGlobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="logoOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            {/* Orbit Ring */}
            <ellipse cx="24" cy="24" rx="21" ry="6" transform="rotate(-30 24 24)" stroke="url(#logoOrbitGrad)" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
            {/* Satellites */}
            <circle cx="8" cy="32" r="1.5" fill="#3b82f6" />
            <circle cx="40" cy="16" r="1.5" fill="#ec4899" />
            {/* Globe Outer Circle */}
            <circle cx="24" cy="24" r="14" stroke="url(#logoGlobeGrad)" strokeWidth="2" fill="none" />
            {/* Grid Lines */}
            <path d="M24 10c-3 4-5 9-5 14s2 10 5 14" stroke="url(#logoGlobeGrad)" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
            <path d="M24 10c3 4 5 9 5 14s-2 10-5 14" stroke="url(#logoGlobeGrad)" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
            <path d="M10 24c4-2 9-3 14-3s10 1 14 3" stroke="url(#logoGlobeGrad)" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
            {/* Code Tags Inside Globe */}
            <path d="M15 15c-1 0-1.8.8-1.8 1.8v1.5c0 .8-.8.8-.8.8s.8 0 .8.8v1.5c0 1 .8 1.8 1.8 1.8" stroke="url(#logoGlobeGrad)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M21 21l-2 3 2 3" stroke="url(#logoGlobeGrad)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M27 21l2 3-2 3" stroke="url(#logoGlobeGrad)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M33 22c1 0 1.8-.8 1.8-1.8v-1.5c0-.8.8-.8.8-.8s-.8 0-.8-.8v-1.5c0-1-.8-1.8-1.8-1.8" stroke="url(#logoGlobeGrad)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        {showText && (
          <span className={`text-[11px] font-semibold tracking-[0.22em] uppercase font-sans-origin ${textColor}`}>
            Code<span className="text-[#04AA6D]">Sphere</span>
          </span>
        )}
      </Link>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out select-none"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Image Wrapper */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()} // don't close when clicking image
              className="relative max-w-4xl w-full flex flex-col items-center gap-4 bg-slate-900/50 p-3 rounded-2xl border border-white/10 shadow-2xl cursor-default animate-fade-in"
            >
              <img
                src="/images/codesphere-full-logo.jpg"
                alt="CodeSphere Ecosystem Illustration"
                className="max-h-[75vh] object-contain rounded-lg"
              />
              <div className="text-center font-mono-origin text-xs text-white/80 select-text uppercase tracking-widest px-4 py-1">
                CodeSphere — The Coding Ecosystem That Changes Lives
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Logo;
