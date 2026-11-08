import React, { Suspense } from 'react';

/**
 * LoadingRoute — Lightweight Suspense wrapper for lazy route components.
 * Uses a sleek, non-intrusive top progress bar with zero full-page blocking or text.
 */
const TopLoadingBar = () => (
  <div className="w-full fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent overflow-hidden pointer-events-none">
    <div className="h-full bg-[#04AA6D] animate-pulse w-full" />
  </div>
);

const LoadingRoute = ({ children }) => (
  <Suspense fallback={<TopLoadingBar />}>
    {children}
  </Suspense>
);

export default LoadingRoute;
