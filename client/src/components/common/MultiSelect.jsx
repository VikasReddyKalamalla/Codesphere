import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { Chip } from './Chip.jsx';

export const MultiSelect = ({
  label,
  error,
  helperText,
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleSelect = (val) => {
    const newVal = value.includes(val)
      ? value.filter(v => v !== val)
      : [...value, val];
    onChange && onChange(newVal);
  };

  const removeValue = (val) => {
    onChange && onChange(value.filter(v => v !== val));
  };

  const selectedLabels = options.filter(opt => value.includes(opt.value));

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-1.5 relative">
      {label && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex flex-wrap items-center gap-1.5 min-h-[42px] w-full rounded-lg border px-3 py-1.5 text-sm cursor-pointer shadow-sm bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700',
          error ? 'border-rose-300 dark:border-rose-800' : '',
          className
        )}
      >
        {selectedLabels.length === 0 && (
          <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
        )}
        {selectedLabels.map(item => (
          <Chip
            key={item.value}
            label={item.label}
            onDelete={(e) => {
              e.stopPropagation();
              removeValue(item.value);
            }}
          />
        ))}
        <div className="ml-auto text-slate-400 dark:text-slate-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 py-1">
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleSelect(opt.value)}
                className={clsx(
                  'px-3.5 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between',
                  isSelected ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-700 dark:text-slate-300'
                )}
              >
                {opt.label}
                {isSelected && <span className="text-xs">✓</span>}
              </div>
            );
          })}
        </div>
      )}
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};
