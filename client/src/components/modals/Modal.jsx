import React from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../common/IconButton.jsx';

export const Modal = ({ isOpen = false, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-xl overflow-hidden border border-slate-205 dark:border-slate-800 p-5 flex flex-col gap-4 animate-scale-in">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-855">
          <span className="font-semibold text-sm text-slate-800 dark:text-white">{title}</span>
          <IconButton icon={X} variant="ghost" size="sm" onClick={onClose} aria-label="Close dialog" />
        </div>
        <div className="flex-1 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
};
