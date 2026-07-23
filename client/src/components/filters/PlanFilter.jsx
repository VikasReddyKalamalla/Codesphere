import React from 'react';

export const PlanFilter = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="rounded-lg border border-slate-200 dark:border-slate-800 text-xs px-3.5 py-2 bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
    >
      <option value="">All Tiers</option>
      <option value="free">Free Tiers</option>
      <option value="premium">Premium Tiers</option>
    </select>
  );
};
