import React from 'react';
import { BarChart3, Globe, TrendingUp, Users, Award, Sparkles, Building2, Flame } from 'lucide-react';

export const EventAnalyticsDashboard = ({ analyticsSummary }) => {
  const summary = analyticsSummary || {
    totalEvents: 42,
    totalRegistrations: 28450,
    topCountries: [
      { country: 'United States', eventCount: 14, participants: 12400 },
      { country: 'India', eventCount: 10, participants: 8100 },
      { country: 'United Kingdom', eventCount: 6, participants: 3200 },
      { country: 'Germany', eventCount: 4, participants: 2100 },
      { country: 'Japan', eventCount: 3, participants: 1550 },
      { country: 'Singapore', eventCount: 3, participants: 1100 }
    ],
    techTrends: [
      { name: 'Generative AI & LLMs', percentage: 42, color: 'from-purple-500 to-indigo-500' },
      { name: 'Full-Stack & React 19', percentage: 26, color: 'from-blue-500 to-cyan-500' },
      { name: 'Cloud Native & Kubernetes', percentage: 16, color: 'from-amber-500 to-orange-500' },
      { name: 'Cybersecurity & Zero Trust', percentage: 10, color: 'from-rose-500 to-red-500' },
      { name: 'Web3 & Decentralized Tech', percentage: 6, color: 'from-emerald-500 to-teal-500' }
    ]
  };

  return (
    <div className="w-full bg-slate-50/90 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col gap-1 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#04AA6D]" />
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Global Event Discovery Analytics</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Real-time statistics on developer events, active regions, and global tech trends</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-1">
          <div className="flex justify-between items-center text-[#04AA6D] dark:text-emerald-400">
            <span className="text-[10px] font-black uppercase font-mono">TOTAL EVENTS MAPPED</span>
            <Globe className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{summary.totalEvents} Global Events</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Aggregated from 12 trusted tech sources</span>
        </div>

        <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex flex-col gap-1">
          <div className="flex justify-between items-center text-blue-500 dark:text-blue-400">
            <span className="text-[10px] font-black uppercase font-mono">GLOBAL REGISTRATIONS</span>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{summary.totalRegistrations.toLocaleString()} Developers</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">+34% growth this month</span>
        </div>

        <div className="p-5 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex flex-col gap-1">
          <div className="flex justify-between items-center text-teal-600 dark:text-teal-400">
            <span className="text-[10px] font-black uppercase font-mono">MOST ACTIVE TECH REGION</span>
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">North America & APAC</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Leading hackathon prize pools</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Top Active Countries */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">Top Active Developer Countries</h3>
          <div className="flex flex-col gap-3">
            {summary.topCountries.map((c, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-right font-mono font-bold text-slate-400 dark:text-slate-500">#{idx + 1}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-200">{c.country}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  <span>{c.eventCount} Events</span>
                  <span className="text-[#04AA6D] dark:text-emerald-400 font-bold">{c.participants.toLocaleString()} Devs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Technology Trends */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">Technology Trend Distribution</h3>
          <div className="flex flex-col gap-4">
            {summary.techTrends.map((t, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-slate-200">
                  <span>{t.name}</span>
                  <span className="font-mono text-[#04AA6D] dark:text-emerald-400">{t.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${t.color}`}
                    style={{ width: `${t.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventAnalyticsDashboard;
