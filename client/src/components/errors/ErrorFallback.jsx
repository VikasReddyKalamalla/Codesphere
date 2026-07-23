import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../common/Button.jsx';

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-6 border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-950/10 rounded-xl flex flex-col items-center text-center gap-3">
      <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-455" />
      <div>
        <h4 className="text-sm font-semibold text-rose-800 dark:text-rose-300">Widget Failed Loading</h4>
        <p className="text-xs text-rose-605/70 dark:text-rose-400/60 mt-1 max-w-xs">{error?.message || 'Context render error'}</p>
      </div>
      {resetErrorBoundary && (
        <Button variant="danger" size="sm" onClick={resetErrorBoundary} className="mt-1">
          Reset Boundary
        </Button>
      )}
    </div>
  );
};
