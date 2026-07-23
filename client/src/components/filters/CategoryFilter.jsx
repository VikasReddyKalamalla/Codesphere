import React from 'react';

export const CategoryFilter = ({ value, onChange, options = [] }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="rounded-lg border border-slate-200 dark:border-slate-800 text-xs px-3.5 py-2 bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
    >
      <option value="">All Categories</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};
