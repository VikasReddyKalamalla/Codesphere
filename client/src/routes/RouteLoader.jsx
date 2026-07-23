import React, { Suspense } from 'react';

export const RouteLoader = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-3 select-none">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loading...</span>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default RouteLoader;
