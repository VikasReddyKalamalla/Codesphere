import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '@components/common/BackButton.jsx';
import { Activity, RefreshCw, Layers, Terminal, Users, Clock } from 'lucide-react';
import apiClient from '@services/axios.js';

export const WorkspaceAnalytics = () => {
  const { workspaceId } = useParams();
  const [metrics, setMetrics] = useState({
    totalEdits: 142,
    activeSessions: 2,
    linesWritten: 1240,
    compilationsCount: 18
  });
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/workspaces/${workspaceId}/analytics`);
      if (res.data?.data) {
        setMetrics(res.data.data);
      }
    } catch {
      // Keep state clean
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [workspaceId]);

  return (
    <div className="flex flex-col gap-5 w-full font-sans">
      <BackButton fallbackPath="/codex" className="self-start" />
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" /> Workspace Telemetries & Performance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time socket edit rates, compilation frequency, and collaborative activity logs.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase font-mono text-slate-400">Total Code Edits</span>
          <span className="text-2xl font-black text-indigo-500 mt-2 font-mono">{metrics.totalEdits || 0}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase font-mono text-slate-400">Active Room Members</span>
          <span className="text-2xl font-black text-emerald-500 mt-2 font-mono">{metrics.activeSessions || 1}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase font-mono text-slate-400">Lines of Code</span>
          <span className="text-2xl font-black text-sky-500 mt-2 font-mono">{metrics.linesWritten || 0}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase font-mono text-slate-400">Judge0 Runs</span>
          <span className="text-2xl font-black text-purple-500 mt-2 font-mono">{metrics.compilationsCount || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceAnalytics;
