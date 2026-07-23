import React from 'react';
import { useSelector } from 'react-redux';
import { ShieldCheck, DollarSign, TrendingUp, Users, RefreshCw } from 'lucide-react';
import { selectPlans } from '../redux';

export const AdminBillingDashboardView = () => {
  const plans = useSelector(selectPlans);

  const stats = [
    { label: 'Monthly Recurring Revenue (MRR)', value: '₹4,85,000', icon: DollarSign, color: 'text-[#04AA6D] dark:text-emerald-400' },
    { label: 'Active Subscribers', value: '1,420 Users', icon: Users, color: 'text-teal-600 dark:text-teal-400' },
    { label: 'Renewal Rate', value: '94.2%', icon: RefreshCw, color: 'text-[#04AA6D] dark:text-emerald-400' },
    { label: 'Churn Rate', value: '1.8%', icon: TrendingUp, color: 'text-amber-500 dark:text-amber-400' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Admin Revenue & License Console
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">High-level platform revenue statistics, active subscribers, and plan overrides</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 shadow-sm dark:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">{s.label}</span>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Plan Catalog Table */}
      <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-sm dark:shadow-xl">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Active Plan Catalog ({plans.length})</h3>
        <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
          {plans.map((p, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{p.displayName}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{p.name} • Order: {p.sortOrder}</div>
              </div>
              <div className="font-mono text-[#04AA6D] dark:text-emerald-400 font-bold">₹{p.monthlyPrice}/mo</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
