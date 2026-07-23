import React from 'react';
import { useSelector } from 'react-redux';
import { Activity, Cpu, HardDrive, Download, Code, Award, Video, Zap, Sparkles } from 'lucide-react';
import { selectUsageData } from '../redux';

export const UsageDashboardView = () => {
  const usageData = useSelector(selectUsageData);

  const metrics = [
    {
      title: 'Sandbox Minutes',
      used: usageData?.usage?.sandboxMinutesUsed || 42,
      limit: usageData?.limits?.sandboxMinutes === -1 ? 'Unlimited' : usageData?.limits?.sandboxMinutes || 120,
      icon: Cpu,
      color: 'from-[#04AA6D] to-teal-600',
      unit: 'Mins',
    },
    {
      title: 'AI Credits',
      used: usageData?.usage?.aiCreditsUsed || 120,
      limit: usageData?.limits?.aiCredits === -1 ? 'Unlimited' : usageData?.limits?.aiCredits || 250,
      icon: Sparkles,
      color: 'from-emerald-400 to-teal-500',
      unit: 'Credits',
    },
    {
      title: 'Cloud Storage',
      used: usageData?.usage?.storageUsedMB || 340,
      limit: usageData?.limits?.storageGB ? `${usageData.limits.storageGB * 1024}` : '5120',
      icon: HardDrive,
      color: 'from-teal-500 to-cyan-600',
      unit: 'MB',
    },
    {
      title: 'Resource Downloads',
      used: usageData?.usage?.downloadsCount || 8,
      limit: usageData?.limits?.downloadsPerMonth === -1 ? 'Unlimited' : usageData?.limits?.downloadsPerMonth || 25,
      icon: Download,
      color: 'from-emerald-500 to-green-600',
      unit: 'Files',
    },
    {
      title: 'Codex Workspaces',
      used: usageData?.usage?.workspacesCreated || 4,
      limit: usageData?.limits?.maxWorkspaces || 10,
      icon: Code,
      color: 'from-[#04AA6D] to-emerald-600',
      unit: 'Active',
    },
    {
      title: 'API Calls',
      used: usageData?.usage?.apiCallsCount || 1450,
      limit: '50,000',
      icon: Zap,
      color: 'from-teal-400 to-emerald-500',
      unit: 'Hits',
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Usage & Metering Dashboard
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Monitor your resource consumption, quotas, and monthly usage limits</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          const isUnlimited = typeof m.limit === 'string' && m.limit.toLowerCase().includes('unlimited');
          const percent = isUnlimited ? 25 : Math.min(100, Math.round((m.used / (parseInt(m.limit) || 1)) * 100));

          return (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-4 shadow-sm dark:shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${m.color} text-white shadow-md shadow-emerald-500/20`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{m.title}</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Monthly Meter</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#04AA6D] dark:text-emerald-400">{percent}%</span>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1.5 text-xs font-mono">
                  <span className="text-slate-900 dark:text-white font-bold">{m.used.toLocaleString()} {m.unit}</span>
                  <span className="text-slate-500 dark:text-slate-400">/ {m.limit}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${m.color} rounded-full transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
