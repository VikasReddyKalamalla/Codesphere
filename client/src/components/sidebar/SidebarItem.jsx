import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export const SidebarItem = ({
  icon: Icon,
  label,
  path,
  badge,
  onClick,
  collapsed = false
}) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      onClick={onClick}
      className={clsx(
        'group flex items-center rounded-xl px-3 py-2 text-xs font-bold font-mono transition-all duration-200 select-none relative',
        isActive
          ? 'bg-[#04AA6D]/10 text-[#04AA6D] dark:text-[#04AA6D] border border-[#04AA6D]/20 shadow-xs'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white border border-transparent'
      )}
    >
      {Icon && (
        <Icon className={clsx(
          'w-4 h-4 shrink-0 transition-colors',
          isActive ? 'text-[#04AA6D]' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
        )} />
      )}
      {!collapsed && <span className="ml-3 truncate">{label}</span>}
      {!collapsed && badge !== undefined && (
        <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-150 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
          {badge}
        </span>
      )}
    </Link>
  );
};
