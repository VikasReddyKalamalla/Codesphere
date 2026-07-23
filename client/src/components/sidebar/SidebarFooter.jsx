import React from 'react';
import { LogOut } from 'lucide-react';
import { Avatar } from '../common/Avatar.jsx';

export const SidebarFooter = ({ user, onLogout, collapsed = false }) => {
  if (!user) return null;

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar src={user.avatar} alt={user.name} size="sm" />
        {!collapsed && (
          <div className="min-w-0 flex flex-col">
            <span className="text-xs font-semibold text-slate-800 dark:text-white truncate">{user.name}</span>
            <span className="text-[10px] text-slate-400 truncate">{user.role}</span>
          </div>
        )}
      </div>
      {!collapsed && onLogout && (
        <button
          onClick={onLogout}
          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      )}
    </div>
  );
};
