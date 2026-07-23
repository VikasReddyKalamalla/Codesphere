import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../common/Button.jsx';

export const SuccessModal = ({ isOpen = false, onClose, title = 'Success!', description = 'The action finished successfully.' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center gap-4 animate-scale-in">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full shrink-0">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </div>
        <Button variant="primary" size="sm" onClick={onClose} className="w-full mt-2">
          Awesome
        </Button>
      </div>
    </div>
  );
};
