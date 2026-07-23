import React from 'react';
import { Plus, Minus } from 'lucide-react';
import clsx from 'clsx';

export const NumberInput = React.forwardRef(({
  label,
  error,
  helperText,
  min,
  max,
  step = 1,
  value,
  onChange,
  className = '',
  id,
  ...props
}, ref) => {
  const handleDecrement = () => {
    const val = Number(value) || 0;
    if (min !== undefined && val <= min) return;
    onChange && onChange(val - step);
  };

  const handleIncrement = () => {
    const val = Number(value) || 0;
    if (max !== undefined && val >= max) return;
    onChange && onChange(val + step);
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex rounded-lg shadow-sm">
        <button
          type="button"
          onClick={handleDecrement}
          className="px-3 border border-r-0 border-slate-300 bg-slate-50 text-slate-600 rounded-l-lg hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-750 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          ref={ref}
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange && onChange(Number(e.target.value))}
          className={clsx(
            'block w-full border-y border-slate-300 text-center text-sm py-2.5 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            error ? 'border-rose-300 dark:border-rose-800' : '',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={handleIncrement}
          className="px-3 border border-l-0 border-slate-300 bg-slate-50 text-slate-600 rounded-r-lg hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-750 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});

NumberInput.displayName = 'NumberInput';
