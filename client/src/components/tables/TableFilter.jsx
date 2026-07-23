import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { IconButton } from '../common/IconButton.jsx';
import { Button } from '../common/Button.jsx';

export const TableFilter = ({ filters = [], activeFilters = {}, onApply, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(activeFilters);

  const handleSelect = (key, val) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleApply = () => {
    onApply && onApply(tempFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempFilters({});
    onClear && onClear();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <IconButton
        icon={Filter}
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Filter columns"
      />

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 p-4 flex flex-col gap-4 animate-scale-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850">
            <span className="text-sm font-semibold text-slate-800 dark:text-white">Filters</span>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {filters.map((filter) => (
              <div key={filter.key} className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-500">{filter.label}</span>
                <select
                  value={tempFilters[filter.key] || ''}
                  onChange={(e) => handleSelect(filter.key, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="">All</option>
                  {filter.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
            <Button variant="ghost" size="sm" onClick={handleClear}>Clear</Button>
            <Button variant="primary" size="sm" onClick={handleApply}>Apply</Button>
          </div>
        </div>
      )}
    </div>
  );
};
