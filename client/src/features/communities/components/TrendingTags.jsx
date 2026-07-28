import React, { useMemo } from 'react';
import { Tag } from 'lucide-react';

export const TrendingTags = ({ communities = [], activeTag, onTagClick }) => {
  const dynamicTags = useMemo(() => {
    const counts = {};
    communities.forEach((comm) => {
      if (comm.tags && Array.isArray(comm.tags)) {
        comm.tags.forEach((t) => {
          const cleanTag = t.trim().toLowerCase();
          if (cleanTag) {
            counts[cleanTag] = (counts[cleanTag] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [communities]);

  if (dynamicTags.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-xl text-left select-none flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-850 pb-3">
        <Tag size={13} className="text-[#04AA6D] dark:text-emerald-400" />
        <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">Trending Topics</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {dynamicTags.map(({ name, count }) => {
          const isActive = activeTag === name;
          return (
            <button 
              key={name} 
              onClick={() => onTagClick && onTagClick(isActive ? null : name)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wide uppercase transition-all flex justify-between items-center border ${
                isActive 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-[#04AA6D] dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-950 border-transparent'
              }`}
            >
              <span>#{name}</span>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                {count} {count === 1 ? 'space' : 'spaces'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default TrendingTags;
