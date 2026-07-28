import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';

const COLORS = ['#94a3b8', '#06b6d4', '#6366f1', '#10b981'];

export const RevenueAnalyticsCard = ({ planDistribution = {}, metrics = {} }) => {
  const pieData = [
    { name: 'Free Tier', value: planDistribution.free ?? 0 },
    { name: 'Standard Plan', value: planDistribution.standard ?? 0 },
    { name: 'Premium Pro', value: planDistribution.premium ?? 0 },
    { name: 'Enterprise Seats', value: planDistribution.enterprise ?? 0 },
  ];

  const totalMembers = pieData.reduce((acc, curr) => acc + curr.value, 0);

  const monthlyRevenueData = [
    { month: 'Today', revenue: metrics.revenueToday ?? 0 },
    { month: 'Total Gross', revenue: metrics.totalRevenue ?? 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Plan Tier Distribution Pie Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Subscription Tier Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Active user breakdown by membership tier
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30 px-2.5 py-0.5 rounded-full">
            Total: {totalMembers} Users
          </span>
        </div>

        <div className="w-full h-64 flex items-center justify-center">
          {totalMembers > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-10">
              <p className="text-xs text-slate-400 font-mono">No subscription tier records found in database.</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Revenue Bar Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Platform Revenue Summary ($)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Live gross revenue from completed payments
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            MongoDB Synced
          </div>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#0f172a',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" name="Revenue ($)" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
