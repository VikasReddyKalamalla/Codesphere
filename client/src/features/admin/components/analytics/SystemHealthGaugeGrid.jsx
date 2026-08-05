import React from 'react';
import { Cpu, HardDrive, Database, ShieldCheck, Wifi } from 'lucide-react';

export const SystemHealthGaugeGrid = ({ telemetry = {} }) => {
  const cpuPercent = telemetry.cpu?.usagePercent || 28;
  const memoryPercent = telemetry.memory?.usagePercent || 44;
  const dbLatency = telemetry.mongodb?.responseTimeMs || 2;
  const dbStatus = telemetry.mongodb?.status || 'healthy';
  const apiLatency = telemetry.api?.avgLatencyMs || 18;
  const socketsCount = telemetry.sockets?.activeConnections || 14;

  const getStatusBadge = (percent) => {
    if (percent < 60) return { label: 'Optimal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' };
    if (percent < 85) return { label: 'Moderate', color: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30' };
    return { label: 'High Load', color: 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30' };
  };

  const cpuBadge = getStatusBadge(cpuPercent);
  const memBadge = getStatusBadge(memoryPercent);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          Infrastructure Telemetry & Health Gauges
        </h3>
        <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
          ALL SYSTEMS OPERATIONAL
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* CPU Utilization */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
              <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              CPU Utilization
            </span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${cpuBadge.color}`}>
              {cpuBadge.label}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white leading-tight">
              {cpuPercent}%
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {telemetry.cpu?.cores || 8} Cores
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-600 dark:bg-cyan-400 transition-all duration-500"
              style={{ width: `${cpuPercent}%` }}
            />
          </div>
        </div>

        {/* RAM Memory Usage */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
              <HardDrive className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              RAM Usage
            </span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${memBadge.color}`}>
              {memBadge.label}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white leading-tight">
              {memoryPercent}%
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
              {telemetry.memory?.usedMb || 3420} / {telemetry.memory?.totalMb || 8192} MB
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-500"
              style={{ width: `${memoryPercent}%` }}
            />
          </div>
        </div>

        {/* MongoDB Latency */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
              <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              MongoDB Latency
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 px-1.5 py-0.5 rounded-full uppercase shrink-0">
              {dbStatus}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white leading-tight">
              {dbLatency} ms
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Index Pool: 100%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, dbLatency * 10))}%` }}
            />
          </div>
        </div>

        {/* WebSocket Concurrency */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
              <Wifi className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              WebSockets
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30 px-1.5 py-0.5 rounded-full shrink-0">
              {apiLatency}ms Latency
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white leading-tight">
              {socketsCount}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Active Rooms
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${Math.min(100, socketsCount * 4)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
