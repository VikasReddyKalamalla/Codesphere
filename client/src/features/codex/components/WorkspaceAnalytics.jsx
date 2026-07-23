import React from 'react';
import { BarChart3, LineChart, Code, Award, Clock } from 'lucide-react';

export const WorkspaceAnalytics = ({ analytics = null }) => {
  if (!analytics) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center justify-center items-center select-none">
        <BarChart3 className="w-10 h-10 text-[#6366f1] animate-pulse mb-3" />
        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">Loading Analytics Metrics...</span>
      </div>
    );
  }

  const {
    memberCount = 1,
    totalTasks = 0,
    completedTasks = 0,
    pendingTasks = 0,
    linesOfCode = 0,
    totalCommits = 0,
    codingHours = 0,
    mostActiveMember = {},
    dailyActivity = []
  } = analytics;

  const taskCompletionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  const maxCommits = dailyActivity.length > 0
    ? Math.max(...dailyActivity.map(d => d.commits || 0), 1)
    : 1;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl select-none text-left">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-[#6366f1]" />
        <span className="text-xs font-bold text-slate-850 dark:text-white tracking-wide uppercase font-mono">Workspace Analytics</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 flex flex-col gap-1 hover:border-indigo-500/20 transition-all">
            <span className="text-[9px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Code size={11} className="text-[#6366f1]" /> Lines of Code
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-white font-mono mt-1">{linesOfCode}</span>
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 flex flex-col gap-1 hover:border-indigo-500/20 transition-all">
            <span className="text-[9px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <LineChart size={11} className="text-cyan-500" /> Total Commits
            </span>
            <span className="text-lg font-bold text-slate-855 dark:text-white font-mono mt-1">{totalCommits}</span>
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 flex flex-col gap-1 hover:border-indigo-500/20 transition-all">
            <span className="text-[9px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Clock size={11} className="text-emerald-550" /> Coding Hours
            </span>
            <span className="text-lg font-bold text-slate-855 dark:text-white font-mono mt-1">{codingHours}h</span>
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 flex flex-col gap-1 hover:border-indigo-500/20 transition-all">
            <span className="text-[9px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Award size={11} className="text-amber-500" /> Active Member
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate mt-1.5" title={mostActiveMember.fullName}>
              {mostActiveMember.fullName || 'No active logs'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="bg-slate-50/30 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-850 rounded-2xl p-4.5 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-widest font-mono">Tasks metrics</span>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-355">Completion Rate</span>
              <span className="text-xs font-bold text-[#6366f1] font-mono">{taskCompletionRate}%</span>
            </div>
            
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-955 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-[#6366f1] rounded-full transition-all duration-500" 
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-850">
              <div className="flex flex-col text-center">
                <span className="text-[9px] text-slate-450 dark:text-slate-500 font-mono">Total</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">{totalTasks}</span>
              </div>
              <div className="flex flex-col text-center">
                <span className="text-[9px] text-slate-450 dark:text-slate-500 font-mono">Completed</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-emerald-400 font-mono">{completedTasks}</span>
              </div>
              <div className="flex flex-col text-center">
                <span className="text-[9px] text-slate-455 dark:text-slate-550 font-mono">Pending</span>
                <span className="text-sm font-bold text-amber-500 dark:text-amber-400 font-mono">{pendingTasks}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/30 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-850 rounded-2xl p-4.5 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest font-mono">Daily activity (Commits)</span>
            
            <div className="flex-1 flex items-end justify-between gap-4 h-[100px] pt-4">
              {dailyActivity.map((day, idx) => {
                const heightPercentage = Math.round(((day.commits || 0) / maxCommits) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full bg-slate-100 dark:bg-slate-955 rounded-t-lg relative h-full flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-[#6366f1] to-emerald-500 rounded-t-lg transition-all duration-300 group-hover:from-[#6366f1] group-hover:to-emerald-400 cursor-pointer"
                        style={{ height: `${heightPercentage}%` }}
                        title={`${day.commits || 0} commits`}
                      />
                    </div>
                    <span className="text-[9px] font-bold font-mono text-slate-455 dark:text-slate-550 group-hover:text-[#6366f1] transition-colors uppercase">
                      {day.date || day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
