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
        'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 select-none relative',
        isActive
          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
          : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
      )}
    >
      {Icon && (
        <Icon className={clsx(
          'w-5 h-5 shrink-0 transition-colors',
          isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
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
