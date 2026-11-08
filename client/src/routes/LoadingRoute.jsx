import React, { Suspense } from 'react';

/**
 * LoadingRoute — High-performance Suspense wrapper for asynchronously loaded routes.
 * Uses a non-blocking top progress line instead of a full-screen blocking overlay,
 * ensuring zero screen flicker or layout shifts during navigation.
 */
const PageSpinner = () => (
  <div className="w-full flex flex-col items-center justify-center py-12 select-none">
    <div className="w-24 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 bg-[#04AA6D] rounded-full w-1/2 animate-pulse" />
    </div>
  </div>
);

const LoadingRoute = ({ children }) => (
  <Suspense fallback={<PageSpinner />}>
    {children}
  </Suspense>
);

export default LoadingRoute;
