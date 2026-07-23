import React from 'react';

export const Terminal = ({ output = [] }) => {
  return (
    <div className="bg-slate-950 text-emerald-450 border border-slate-900 rounded-lg p-4 font-mono text-[10px] w-full min-h-[140px] shadow-inner select-text">
      <span className="text-slate-500 select-none block mb-1">Terminal Shell Log console:</span>
      {output.length === 0 ? (
        <span className="text-slate-600 select-none">&gt; ready for compiler output...</span>
      ) : (
        output.map((line, idx) => <p key={idx} className="leading-relaxed">&gt; {line}</p>)
      )}
    </div>
  );
};
