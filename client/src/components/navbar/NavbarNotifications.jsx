import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { IconButton } from '../common/IconButton.jsx';

export const NavbarNotifications = ({ count = 0, items = [], onMarkRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative select-none">
      <div className="relative">
        <IconButton
          icon={Bell}
          variant="ghost"
          size="md"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="View notifications"
        />
        {count > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {count}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 py-2 animate-scale-in">
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Notifications</h4>
            {count > 0 && onMarkRead && (
              <button onClick={onMarkRead} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-850">
            {items.length === 0 ? (
              <p className="text-xs text-center py-6 text-slate-400 dark:text-slate-550">No notifications yet</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex gap-2">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-slate-700 dark:text-slate-350">{item.message}</p>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
