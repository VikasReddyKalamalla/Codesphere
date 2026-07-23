import React from 'react';
import { Tag } from 'lucide-react';

export const TrendingTags = ({ tags = ['react', 'python', 'webrtc', 'ml', 'devops'], activeTag, onTagClick }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-xl text-left select-none flex flex-col gap-3">
      <div className="flex items-center gap-1.5 border-b border-slate-150 dark:border-slate-850 pb-2.5">
        <Tag size={12} className="text-[#04AA6D] dark:text-emerald-400" />
        <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">Trending Topics</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {tags.map((tag, idx) => {
          const isActive = activeTag === tag;
          return (
            <button 
              key={idx} 
              onClick={() => onTagClick && onTagClick(isActive ? null : tag)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold font-mono tracking-wide uppercase transition-all flex justify-between items-center border ${
                isActive 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-[#04AA6D] dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 border-transparent'
              }`}
            >
              <span>#{tag}</span>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono">{Math.floor(Math.random() * 50) + 10} posts</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default TrendingTags;
