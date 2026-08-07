import React from 'react';
import { Users, Code, Award, Eye, ShieldAlert, Activity, Play, Sparkles, Copy, FolderCode } from 'lucide-react';

export const WorkspaceCard = ({ workspace, onDuplicate }) => {
  const {
    id,
    name = 'Unnamed Sandbox',
    description = 'Collaborative pair programming sandbox module.',
    language = 'JavaScript',
    framework = 'React',
    owner = 'Collaborator',
    memberCount = 1,
    status = 'active',
    visibility = 'private'
  } = workspace;

  const getStatusColor = (st) => {
    switch (st) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'on_hold': return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'archived': return 'bg-slate-800 text-slate-400 border border-slate-700';
      case 'planning': return 'bg-sky-500/10 text-sky-400 border border-sky-500/30';
      case 'active':
      default:
        return 'bg-[#04AA6D]/10 text-emerald-400 border border-[#04AA6D]/30';
    }
  };

  const getVisibilityIcon = (vis) => {
    switch (vis) {
      case 'public':
        return <Eye size={11} className="text-cyan-400" title="Public" />;
      case 'invite_only':
        return <ShieldAlert size={11} className="text-rose-400" title="Invite Only" />;
      case 'private':
      default:
        return <ShieldAlert size={11} className="text-slate-500" title="Private" />;
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 hover:border-[#04AA6D]/50 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-emerald-500/10 select-none flex flex-col justify-between text-left group relative overflow-hidden">
      
      {/* Top Ambient Glow Accent */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#04AA6D]/10 rounded-full blur-2xl group-hover:bg-[#04AA6D]/25 transition-all" />

      {/* Main Content */}
      <div className="flex flex-col gap-3 z-10">
        {/* Title block */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#04AA6D]/10 text-[#04AA6D] rounded-lg group-hover:scale-110 transition-transform">
                <FolderCode className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white truncate font-mono tracking-wide group-hover:text-[#04AA6D] transition-colors">
                {name}
              </h3>
              {onDuplicate && (
                <button
                  title="Duplicate Workspace"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Duplicate workspace "${name}"?`)) {
                      onDuplicate(e, id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-[#04AA6D] transition-all cursor-pointer"
                >
                  <Copy size={11} />
                </button>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-sans pl-6">
              Created by <span className="text-slate-700 dark:text-slate-300 font-bold">{owner}</span>
            </span>
          </div>
          
          {/* Status indicator */}
          <span className={`text-[8px] font-extrabold font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
          {description}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[9px] font-bold font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 uppercase">
            <Code size={10} /> {language}
          </span>
          {framework && (
            <span className="text-[9px] font-bold font-mono bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-500/20 flex items-center gap-1 uppercase">
              <Sparkles size={10} /> {framework}
            </span>
          )}
        </div>
      </div>

      {/* Footer stats: Members, Visibility, Launch button */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 pt-3.5 mt-4 z-10">
        <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 font-mono text-[10px]">
          <div className="flex items-center gap-1.5" title={`${memberCount} active members`}>
            <Users size={12} className="text-emerald-400" />
            <span className="font-bold text-slate-700 dark:text-slate-300">{memberCount}</span>
          </div>

          <div className="flex items-center gap-1.5 capitalize" title={`Visibility: ${visibility}`}>
            {getVisibilityIcon(visibility)}
            <span>{visibility.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Launch Workspace Button */}
        <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 group-hover:bg-[#04AA6D] group-hover:text-white rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all shadow-sm group-hover:shadow-emerald-500/30">
          <Play size={11} className="ml-0.5 fill-current" />
        </div>
      </div>
    </div>
  );
};
