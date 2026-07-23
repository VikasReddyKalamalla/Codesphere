import React from 'react';

export const DashboardWrapper = ({ sidebar, navbar, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {navbar}
      <div className="flex flex-1">
        {sidebar}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
