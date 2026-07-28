import React from 'react';
import { Layers, Code, Terminal, BookOpen, CheckCircle2, Video, Users } from 'lucide-react';

const iconMap = {
  code: Code,
  terminal: Terminal,
  book: BookOpen,
  'check-circle': CheckCircle2,
  video: Video,
  users: Users,
};

export const ModuleEngagementChart = ({ modules = [] }) => {
  const totalActions = modules.reduce((sum, m) => sum + (m.completions || 0), 0);
  const maxCompletions = Math.max(...modules.map((m) => m.completions || 0), 1);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Platform Module Engagement & Activity Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Active learners and completion volume per module
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30 px-2.5 py-0.5 rounded-full">
          Total Activity: {totalActions.toLocaleString()} Actions
        </span>
      </div>

      {modules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod, idx) => {
            const Icon = (typeof mod.icon === 'string' ? iconMap[mod.icon] : mod.icon) || Code;
            const pct = maxCompletions > 0 ? Math.min(100, Math.round(((mod.completions || 0) / maxCompletions) * 100)) : 0;

            return (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col gap-2.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-cyan-600 text-white shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{mod.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {(mod.completions || 0).toLocaleString()} Actions
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Active Today: {mod.active || 0}</span>
                  <span>Relative Usage: {pct}%</span>
                </div>

                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${mod.barColor || 'bg-cyan-600'} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-slate-400 font-mono">
          No module engagement activity logged yet.
        </div>
      )}
    </div>
  );
};
