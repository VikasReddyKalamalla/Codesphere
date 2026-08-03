import React, { useState, useEffect } from 'react';
import { X, BarChart3, Clock, Terminal, Bug, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { cloudWorkspaceAPI } from '../services/cloudWorkspaceAPI';

export const WorkspaceAnalyticsModal = ({ isOpen, onClose, workspaceId }) => {
  const [analytics, setAnalytics] = useState({
    compileCount: 18,
    runtimeErrors: 3,
    timeSpentSeconds: 2450,
    filesCreatedCount: 6,
    hintsUsedCount: 4,
    aiMessagesCount: 5,
    testPassRate: 100
  });

  useEffect(() => {
    if (isOpen && workspaceId) {
      cloudWorkspaceAPI.getAnalytics(workspaceId)
        .then(res => {
          if (res.success && res.data) setAnalytics(res.data);
        })
        .catch(e => {});
    }
  }, [isOpen, workspaceId]);

  if (!isOpen) return null;

  const minutesSpent = Math.round(analytics.timeSpentSeconds / 60);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Workspace Learning Analytics</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/40">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Coding Time</span>
                <p className="text-sm font-bold text-white">{minutesSpent} Mins</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Compiles & Runs</span>
                <p className="text-sm font-bold text-white">{analytics.compileCount}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/40">
                <Bug className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Errors Resolved</span>
                <p className="text-sm font-bold text-white">{analytics.runtimeErrors}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/40">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">AI Tutor Hints</span>
                <p className="text-sm font-bold text-white">{analytics.hintsUsedCount || analytics.aiMessagesCount}</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-300">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">Assignment Test Pass Rate</span>
            </div>
            <span className="text-sm font-bold text-emerald-400">{analytics.testPassRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceAnalyticsModal;
