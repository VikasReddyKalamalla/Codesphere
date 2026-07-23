import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { IconButton } from '../common/IconButton.jsx';
import { NavbarLogo } from './NavbarLogo.jsx';
import { Link } from 'react-router-dom';

export const MobileNavbar = ({ menuItems = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
      <NavbarLogo />
      <IconButton
        icon={isOpen ? X : Menu}
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      />
      {isOpen && (
        <div className="absolute top-[57px] left-0 w-full bg-white dark:bg-slate-900 shadow-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 z-40 flex flex-col gap-4 animate-scale-in">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
