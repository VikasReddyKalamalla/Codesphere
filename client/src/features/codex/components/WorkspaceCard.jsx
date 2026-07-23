import React from 'react';
import { Users, Code, Award, Eye, ShieldAlert, CheckCircle, Activity, Play, Star, Copy } from 'lucide-react';

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
      case 'completed': return 'bg-indigo-500/10 text-indigo-600 dark:text-emerald-400 border border-indigo-500/20';
      case 'on_hold': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'archived': return 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700';
      case 'planning': return 'bg-indigo-500/10 text-[#6366f1] border border-indigo-500/20';
      case 'active':
      default:
        return 'bg-indigo-500/10 text-[#6366f1] border border-indigo-500/20';
    }
  };

  const getVisibilityIcon = (vis) => {
    switch (vis) {
      case 'public':
        return <Eye size={10} className="text-cyan-500" title="Public" />;
      case 'invite_only':
        return <ShieldAlert size={10} className="text-rose-500" title="Invite Only" />;
      case 'private':
      default:
        return <ShieldAlert size={10} className="text-slate-450 dark:text-slate-500" title="Private" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 hover:border-[#6366f1]/30 hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-indigo-500/5 select-none flex flex-col gap-4 text-left group">
      {/* Title block */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate font-mono uppercase tracking-wider group-hover:text-[#6366f1] transition-colors">
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
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-850 rounded text-slate-400 dark:text-slate-550 hover:text-[#6366f1] transition-all cursor-pointer"
              >
                <Copy size={11} />
              </button>
            )}
          </div>
          <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
            By <span className="text-slate-600 dark:text-slate-400 font-bold">{owner}</span>
          </span>
        </div>
        
        {/* Status indicator */}
        <span className={`text-[8px] font-bold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-550 dark:text-slate-450 line-clamp-2 h-8 leading-relaxed">
        {description}
      </p>

      {/* Language, Framework, details */}
      <div className="flex flex-wrap gap-1.5 pt-1 select-none">
        <span className="text-[8px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/30 text-[#6366f1] px-2 py-0.5 rounded-xl border border-indigo-500/10 dark:border-indigo-500/20 flex items-center gap-1 uppercase">
          <Code size={9} /> {language}
        </span>
        {framework && (
          <span className="text-[8px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/30 text-[#6366f1] px-2 py-0.5 rounded-xl border border-indigo-500/10 dark:border-indigo-500/20 flex items-center gap-1 uppercase">
            {framework}
          </span>
        )}
      </div>

      {/* Footer stats: Members, Visibility, Launch button */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-850 pt-3.5 mt-1">
        <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1 text-[10px] font-mono" title={`${memberCount} members`}>
            <Users size={11} className="text-slate-400 dark:text-slate-500" />
            <span>{memberCount}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-mono capitalize" title={`Visibility: ${visibility}`}>
            {getVisibilityIcon(visibility)}
            <span>{visibility.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Action pointer */}
        <div className="w-6 h-6 bg-slate-100 dark:bg-slate-950 group-hover:bg-[#6366f1] group-hover:text-white rounded-full flex items-center justify-center text-slate-500 dark:text-slate-555 transition-all text-xs">
          <Play size={10} className="ml-0.5" />
        </div>
      </div>
    </div>
  );
};
