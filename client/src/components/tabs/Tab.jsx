import React from 'react';
import clsx from 'clsx';

export const Tab = ({ label, isActive = false, onClick, icon: Icon }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg focus:outline-none transition-all duration-150',
        isActive
          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold'
          : 'text-slate-655 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </button>
  );
};
