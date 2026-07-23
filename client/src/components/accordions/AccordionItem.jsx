import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 dark:border-slate-805 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 font-semibold text-left text-sm text-slate-850 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown className={clsx('w-4 h-4 text-slate-400 transition-transform duration-200', isOpen ? 'transform rotate-180' : '')} />
      </button>
      {isOpen && (
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-850 text-xs text-slate-600 dark:text-slate-350 leading-relaxed bg-slate-50/50 dark:bg-slate-900/30">
          {children}
        </div>
      )}
    </div>
  );
};
