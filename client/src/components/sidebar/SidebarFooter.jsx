import React, { useContext } from 'react';
import { LogOut, Sun, Moon } from 'lucide-react';
import { Avatar } from '../common/Avatar.jsx';
import { ThemeContext } from '../../providers/ThemeProvider.jsx';

export const SidebarFooter = ({ user, onLogout, collapsed = false }) => {
  const { theme, toggleTheme } = useContext(ThemeContext) || {};
  const isDark = theme === 'dark';

  if (!user) return null;

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar src={user.avatar} alt={user.fullName || user.name} size="sm" />
        {!collapsed && (
          <div className="min-w-0 flex flex-col">
            <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{user.fullName || user.name}</span>
            <span className="text-[10px] text-slate-400 capitalize font-mono">{user.role || 'Student'}</span>
          </div>
        )}
      </div>
      
      {!collapsed && (
        <div className="flex items-center gap-1">
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

