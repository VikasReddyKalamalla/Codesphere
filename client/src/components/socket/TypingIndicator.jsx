import React from 'react';

export const TypingIndicator = ({ label = 'Someone is writing' }) => {
  return (
    <div className="flex items-center gap-2 select-none text-xs text-slate-400 py-1 font-medium">
      <span>{label}</span>
      <div className="flex items-center gap-1 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-350 animate-[bounce_1.4s_infinite]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-350 animate-[bounce_1.4s_0.2s_infinite]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-350 animate-[bounce_1.4s_0.4s_infinite]" />
      </div>
    </div>
  );
};
