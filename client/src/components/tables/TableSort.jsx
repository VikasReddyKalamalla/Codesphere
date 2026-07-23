import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export const TableSort = ({ column, activeSortKey, activeSortOrder, onSort }) => {
  const isActive = activeSortKey === column;

  const handleSort = () => {
    const nextOrder = isActive && activeSortOrder === 'asc' ? 'desc' : 'asc';
    onSort && onSort(column, nextOrder);
  };

  return (
    <button
      type="button"
      onClick={handleSort}
      className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none"
    >
      {isActive ? (
        activeSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
      )}
    </button>
  );
};
