import React from 'react';
import { Trophy, Sparkles, Award, CheckCircle2, TrendingUp, Cpu, Flame, Star } from 'lucide-react';

export const TestRightSidebar = ({ leaderboard = [], onSelectUser }) => {
  return (
    <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 font-sans">
      {/* AI Readiness Score Banner */}
      <div className="bg-slate-50/90 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#04AA6D] dark:text-emerald-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#04AA6D]" />
          AI Interview Readiness
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#04AA6D] dark:text-emerald-400 font-mono">92.4%</span>
          <span className="text-xs text-slate-700 dark:text-slate-200 font-bold">Top 5% Candidate</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
          Strong accuracy in Data Structures, Dynamic Programming & SQL Query optimization.
        </p>
      </div>

      {/* Global Leaderboard */}
      <div className="bg-slate-50/90 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col gap-4 shadow-sm">
        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">Top Performers</span>
          </div>
          <span className="text-[10px] text-[#04AA6D] font-mono font-bold">Global Rank</span>
        </div>

        <div className="flex flex-col gap-3">
          {leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((u, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black font-mono ${
                    (u.rank || idx + 1) === 1 ? 'bg-amber-500 text-slate-950' : (u.rank || idx + 1) === 2 ? 'bg-slate-300 text-slate-950' : (u.rank || idx + 1) === 3 ? 'bg-amber-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {u.rank || idx + 1}
                  </span>
                  <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-[#04AA6D]/40" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-slate-100 leading-tight">{u.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{u.xp || `${u.score}% pts`}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#04AA6D] dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {u.score}% Avg
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 font-mono py-2 text-center">No rankings recorded yet.</p>
          )}
        </div>
      </div>

      {/* Skill Strength Breakdown */}
      <div className="bg-slate-50/90 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <TrendingUp className="w-4 h-4 text-[#04AA6D]" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">Skill Radar</span>
        </div>

        <div className="flex flex-col gap-2 pt-1 font-mono text-[11px]">
          {[
            { skill: 'DSA & Algorithms', score: 94, color: 'bg-emerald-500' },
            { skill: 'System Design', score: 88, color: 'bg-blue-500' },
            { skill: 'SQL & Databases', score: 90, color: 'bg-purple-500' },
            { skill: 'Aptitude & Logic', score: 85, color: 'bg-amber-500' },
          ].map(s => (
            <div key={s.skill} className="flex flex-col gap-1">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>{s.skill}</span>
                <span className="font-bold">{s.score}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default TestRightSidebar;
