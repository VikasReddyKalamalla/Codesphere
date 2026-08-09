import React, { Suspense } from 'react';

import { Sparkles } from 'lucide-react';

export const RouteLoader = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4 text-slate-500 font-mono text-xs select-none">
          <Sparkles className="w-8 h-8 text-[#04AA6D] animate-spin" />
          <span>Loading CodeSphere Environment...</span>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default RouteLoader;
