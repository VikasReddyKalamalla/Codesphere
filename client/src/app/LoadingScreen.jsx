import React from 'react';
import Logo from '../components/Logo.jsx';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center select-none animate-fade-in">
      <div className="flex flex-col items-center gap-6">
        {/* Unified brand Logo with pulse effect */}
        <div className="animate-pulse flex flex-col items-center gap-3">
          <Logo size="w-12 h-12" showText={true} textColor="text-slate-800" />
        </div>

        {/* Looping loader bar */}
        <div className="w-36 bg-slate-100 rounded-full h-1 mt-2 overflow-hidden relative border border-slate-200/40">
          <div className="absolute inset-y-0 left-0 bg-[#04AA6D] rounded-full w-1/3 animate-loading-progress" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
