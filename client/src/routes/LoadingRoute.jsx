import React, { Suspense } from 'react';

import { Sparkles } from 'lucide-react';

/**
 * LoadingRoute — Suspense wrapper for lazily loaded route components.
 * Wraps every lazy() import with a consistent full-page spinner.
 */
const PageSpinner = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 text-slate-500 font-mono text-xs">
      <Sparkles className="w-8 h-8 text-[#04AA6D] animate-spin" />
      <span>Loading CodeSphere Environment...</span>
    </div>
  </div>
);

const LoadingRoute = ({ children }) => (
  <Suspense fallback={<PageSpinner />}>
    {children}
  </Suspense>
);

export default LoadingRoute;
