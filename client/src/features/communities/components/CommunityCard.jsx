import React from 'react';
import { Users, Shield } from 'lucide-react';

export const CommunityCard = ({ community = {}, onJoinToggle, isJoined }) => {
  return (
    <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 hover:border-[#04AA6D]/50 transition-all shadow-sm dark:shadow-xl text-left select-none flex flex-col justify-between h-full group">
      <div>
        {/* Banner placeholder */}
        <div className="h-16 w-full rounded-2xl bg-gradient-to-r from-emerald-900/10 to-emerald-900/20 dark:from-emerald-900/30 dark:to-emerald-900/30 border border-slate-200/80 dark:border-slate-800 flex items-center justify-end p-2 relative overflow-hidden mb-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
          {community.visibility === 'private' && (
            <span className="text-[7px] font-bold font-mono bg-red-100 dark:bg-red-955/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 px-1.5 py-0.5 rounded uppercase z-10">Private</span>
          )}
        </div>

        {/* Logo and Meta */}
        <div className="flex gap-3 items-start relative mt-[-32px] px-2 mb-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center shrink-0 shadow-sm">
            {community.logo ? (
              <img src={community.logo} alt={community.name} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" />
            )}
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#04AA6D] dark:group-hover:text-emerald-400 transition-colors">{community.name}</h4>
          {community.memberCount > 50 && (
            <Shield size={11} className="text-[#04AA6D] dark:text-emerald-400 fill-emerald-500/10" title="Verified Community" />
          )}
        </div>

        {/* Description */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{community.description || 'Discuss developer topics, share code, and collaborate.'}</p>
        
        {/* Tags */}
        {community.tags && community.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {community.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[8px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/20 text-[#04AA6D] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 px-1.5 py-0.5 rounded uppercase">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer details */}
      <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-150 dark:border-slate-850">
        <span className="text-[9px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">{community.memberCount || 0} Members</span>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onJoinToggle && onJoinToggle(community._id || community.id);
          }}
          style={{
            backgroundColor: isJoined ? 'transparent' : '#04AA6D',
            borderColor: isJoined ? undefined : '#04AA6D',
            color: isJoined ? undefined : '#ffffff',
          }}
          className={`text-[10px] font-bold px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
            isJoined 
              ? 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/20' 
              : 'hover:opacity-90 shadow-sm'
          }`}
        >
          {isJoined ? 'Joined' : 'Join'}
        </button>
      </div>
    </div>
  );
};
export default CommunityCard;
