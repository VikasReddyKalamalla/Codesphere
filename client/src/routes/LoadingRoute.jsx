import React, { Suspense } from 'react';

/**
 * LoadingRoute — Suspense wrapper for lazily loaded route components.
 * Wraps every lazy() import with a consistent full-page spinner.
 */
const PageSpinner = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-slate-500 text-sm">Loading...</span>
    </div>
  </div>
);

const LoadingRoute = ({ children }) => (
  <Suspense fallback={<PageSpinner />}>
    {children}
  </Suspense>
);

export default LoadingRoute;
