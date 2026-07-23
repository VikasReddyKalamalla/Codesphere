import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button.jsx';

export const EmptyState = ({
  title = 'No records found',
  description = 'There are no active items in this category yet.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  ...props
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-350 dark:border-slate-700 rounded-xl py-12" {...props}>
      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-full mb-4 border border-slate-100 dark:border-slate-800 text-slate-400">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-250 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
