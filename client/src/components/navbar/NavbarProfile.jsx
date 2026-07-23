import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '../common/Avatar.jsx';

export const NavbarProfile = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative select-none">
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none flex items-center">
        <Avatar src={user.avatar} alt={user.name || 'User'} size="sm" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 py-1.5 animate-scale-in">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>My Profile</span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </Link>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout && onLogout();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
