import React from 'react';
import { Spinner } from './Spinner.jsx';

export const Loading = ({
  message = 'Loading details...',
  fullScreen = false
}) => {
  const containerStyle = fullScreen
    ? 'fixed inset-0 bg-white/80 dark:bg-slate-950/80 z-50 flex items-center justify-center'
    : 'w-full py-16 flex items-center justify-center';

  return (
    <div className={containerStyle}>
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        {message && <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{message}</p>}
      </div>
    </div>
  );
};
