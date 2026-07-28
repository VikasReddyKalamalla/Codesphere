import React from 'react';
import { 
  Activity, 
  RefreshCw, 
  Zap, 
  Database, 
  LayoutDashboard, 
  Radio, 
  Server, 
  DollarSign, 
  Layers,
  Sparkles
} from 'lucide-react';

export const AnalyticsHeader = ({
  isConnected,
  timeRange,
  setTimeRange,
  activeTab,
  setActiveTab,
  onRefresh,
  onSimulate,
  onSeed,
  isRefreshing,
  autoRefresh,
  setAutoRefresh,
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live-stream', label: 'Live Audit Feed', icon: Radio },
    { id: 'system-health', label: 'System Health', icon: Server },
    { id: 'revenue', label: 'Revenue & Plans', icon: DollarSign },
    { id: 'engagement', label: 'Module Engagement', icon: Layers },
  ];

  const timeRanges = [
    { id: 'LIVE', label: 'LIVE Stream' },
    { id: '1H', label: 'Last 1h' },
    { id: '24H', label: 'Last 24h' },
    { id: '7D', label: 'Last 7d' },
    { id: '30D', label: 'Last 30d' },
  ];

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-slate-900 dark:text-white transition-all">
      {/* Row 1: Brand Title, Subtitle, Socket Status Pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 shrink-0">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Real-Time Analytics Dashboard
              </h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-mono font-bold border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Live Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Live platform telemetry, Socket.IO concurrency streams, system health, and event auditing
            </p>
          </div>
        </div>

        {/* Socket Connection Status Pill */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all shrink-0 ${
          isConnected
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400'
            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400'
        }`}>
          <span className="relative flex h-2 w-2">
            {isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-600' : 'bg-amber-500'}`} />
          </span>
          {isConnected ? 'SOCKET.IO LIVE' : 'RECONNECTING...'}
        </div>
      </div>

      {/* Row 2: Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Time Range Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium overflow-x-auto">
          {timeRanges.map((tr) => (
            <button
              key={tr.id}
              onClick={() => setTimeRange(tr.id)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                timeRange === tr.id
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tr.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              autoRefresh
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle 3s Auto Telemetry Refresh"
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
            Auto-Sync {autoRefresh ? 'ON' : 'OFF'}
          </button>

          {/* Sync Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all active:scale-95 disabled:opacity-50"
            title="Refresh Snapshot"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync
          </button>

          {/* Seed Data Button */}
          <button
            onClick={onSeed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
            title="Seed Initial Analytics Events"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            Seed
          </button>

          {/* Simulate Event Button */}
          <button
            onClick={onSimulate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Simulate Traffic Event
          </button>
        </div>
      </div>

      {/* Row 3: Navigation Tabs */}
      <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
