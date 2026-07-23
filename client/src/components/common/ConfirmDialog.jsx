import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button.jsx';

export const ConfirmDialog = ({
  isOpen = false,
  title = 'Are you sure?',
  description = 'This action cannot be undone. Please confirm.',
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-4 animate-scale-in">
        <div className="flex gap-3">
          <div className="p-2.5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 shrink-0 self-start">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={isDanger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
