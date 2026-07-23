import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button.jsx';

export const ErrorState = ({
  title = 'An error occurred',
  description = 'We encountered an error loading this content. Please try again.',
  onRetry,
  ...props
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/40 rounded-xl py-10" {...props}>
      <AlertCircle className="w-10 h-10 text-rose-600 dark:text-rose-400 mb-3" />
      <h3 className="text-base font-semibold text-rose-800 dark:text-rose-300 mb-1">{title}</h3>
      <p className="text-sm text-rose-600/80 dark:text-rose-400/70 max-w-sm mb-5">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
};
