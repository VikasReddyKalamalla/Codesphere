import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Activity, Radio } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xl text-xs font-mono text-slate-900 dark:text-white">
        <p className="text-slate-500 dark:text-slate-400 mb-2 font-bold flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          Time: {label}
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span style={{ color: entry.color }} className="font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const RealtimeTrafficChart = ({ data = [], isLive = true }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Real-Time Platform Concurrency & Throughput Stream
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Live telemetry received every 3 seconds via Socket.IO
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-500/30 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">STREAM ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="activeUsersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="codeRunsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
              iconType="circle"
            />

            <Area
              type="monotone"
              dataKey="activeUsers"
              name="Active Users"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#activeUsersGrad)"
              isAnimationActive={true}
            />
            <Area
              type="monotone"
              dataKey="apiThroughput"
              name="API Requests / sec"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#throughputGrad)"
              isAnimationActive={true}
            />
            <Area
              type="monotone"
              dataKey="codeRuns"
              name="Code Executions"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#codeRunsGrad)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
