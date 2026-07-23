import React from 'react';
import clsx from 'clsx';

export const DifficultyFilter = ({ value = '', onChange }) => {
  const options = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => onChange && onChange('')}
        className={clsx('px-3.5 py-2 text-xs font-semibold select-none transition-colors border-r border-slate-200 dark:border-slate-800', !value ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800')}
      >
        All
      </button>
      {options.map((opt, idx) => {
        const isActive = value === opt;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onChange && onChange(opt)}
            className={clsx(
              'px-3.5 py-2 text-xs font-semibold select-none transition-colors',
              idx < options.length - 1 ? 'border-r border-slate-200 dark:border-slate-800' : '',
              isActive
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};
