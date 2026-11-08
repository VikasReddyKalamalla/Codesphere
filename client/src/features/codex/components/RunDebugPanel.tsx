import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  RotateCw,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Bug,
  CircleDot,
  Plus,
  Trash2,
  Eye,
  Check
} from 'lucide-react';
import { WorkspaceFile, ExecutionResult } from '../types/codex';
import { isExecutionActive, stopExecution, onRunningStateChange } from '../services/codeRunner';

interface Breakpoint {
  id: string;
  file: string;
  line: number;
  enabled: boolean;
}

interface WatchExpression {
  id: string;
  expression: string;
  value: string;
}

interface RunDebugPanelProps {
  activeFile: WorkspaceFile | undefined;
  onRunCode: () => void;
  outputResult: ExecutionResult | null;
  isDark: boolean;
}

export const RunDebugPanel: React.FC<RunDebugPanelProps> = ({
  activeFile,
  onRunCode,
  outputResult,
  isDark,
}) => {
  const [isRunning, setIsRunning] = useState(() => isExecutionActive());

  // Interactive Breakpoints state
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>(() => {
    try {
      const saved = localStorage.getItem('codesphere_debug_breakpoints');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'bp_1', file: 'main.py', line: 14, enabled: true },
      { id: 'bp_2', file: 'index.ts', line: 42, enabled: true },
    ];
  });
  const [newLineInput, setNewLineInput] = useState('');

  // Interactive Watch state
  const [watchList, setWatchList] = useState<WatchExpression[]>([
    { id: 'w_1', expression: 'window.location.origin', value: typeof window !== 'undefined' ? window.location.origin : 'N/A' },
  ]);
  const [newWatchInput, setNewWatchInput] = useState('');

  useEffect(() => {
    return onRunningStateChange(setIsRunning);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('codesphere_debug_breakpoints', JSON.stringify(breakpoints));
    } catch {}
  }, [breakpoints]);

  const handleAddBreakpoint = (e: React.FormEvent) => {
    e.preventDefault();
    const lineNum = parseInt(newLineInput.trim(), 10);
    if (!lineNum || isNaN(lineNum) || !activeFile) return;

    const bp: Breakpoint = {
      id: `bp_${Date.now()}`,
      file: activeFile.name,
      line: lineNum,
      enabled: true,
    };
    setBreakpoints((prev) => [...prev, bp]);
    setNewLineInput('');
  };

  const handleAddWatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatchInput.trim()) return;
    let evalVal = 'undefined';
    try {
      const fn = new Function(`return (${newWatchInput})`);
      evalVal = String(fn());
    } catch (err: any) {
      evalVal = `Error: ${err.message}`;
    }
    setWatchList((prev) => [
      ...prev,
      { id: `w_${Date.now()}`, expression: newWatchInput.trim(), value: evalVal },
    ]);
    setNewWatchInput('');
  };

  return (
    <div
      className={`h-full flex flex-col border-r select-none transition-colors ${
        isDark
          ? 'bg-slate-950 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-2 border-b shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Run and Debug
        </span>
        <Bug className="w-3.5 h-3.5 text-[#04AA6D]" />
      </div>

      <div className="p-3 space-y-3">
        {/* Active Target */}
        <div className={`p-2.5 rounded-xl border space-y-1 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-xs'}`}>
          <div className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Target File</div>
          <div className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {activeFile ? activeFile.name : 'No file selected'}
          </div>
          <div className="text-[10px] text-[#04AA6D] font-mono">
            Environment: {activeFile?.language || 'None'}
          </div>
        </div>

        {/* Action Button: Run vs Stop */}
        {isRunning ? (
          <button
            onClick={stopExecution}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-400 font-semibold text-xs transition cursor-pointer shadow-xs active:scale-98 animate-pulse"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop Execution</span>
          </button>
        ) : (
          <button
            onClick={onRunCode}
            disabled={!activeFile}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#04AA6D] hover:bg-[#03985e] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs transition cursor-pointer shadow-xs active:scale-98"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run and Debug (Ctrl+Enter)</span>
          </button>
        )}

        {/* Diagnostic Status */}
        {outputResult && (
          <div className={`p-2.5 rounded-xl border space-y-1 text-xs ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-xs'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Latest Run</span>
              <span
                className={`text-[10px] font-bold font-mono ${
                  outputResult.exitCode === 0 ? 'text-[#04AA6D]' : 'text-rose-500'
                }`}
              >
                Exit {outputResult.exitCode}
              </span>
            </div>
            <div className={`text-[11px] font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Time: {outputResult.executionTime}s | RAM: {outputResult.memoryUsed}
            </div>
          </div>
        )}
      </div>

      {/* Breakpoints section */}
      <div className={`p-3 space-y-2 border-t ${isDark ? 'border-[#334155]/40' : 'border-[#e2e8f0]'}`}>
        <div className="flex items-center justify-between">
          <div className={`text-[10px] uppercase font-bold ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
            Breakpoints ({breakpoints.filter((b) => b.enabled).length})
          </div>
        </div>

        {/* Quick add breakpoint form */}
        <form onSubmit={handleAddBreakpoint} className="flex items-center gap-1.5">
          <input
            type="number"
            value={newLineInput}
            onChange={(e) => setNewLineInput(e.target.value)}
            placeholder="Line (e.g. 24)"
            className={`flex-1 px-2 py-1 text-xs rounded border outline-none font-mono ${
              isDark ? 'bg-[#020617] border-[#334155] text-white' : 'bg-white border-slate-300 text-black'
            }`}
          />
          <button
            type="submit"
            disabled={!newLineInput || !activeFile}
            className="px-2 py-1 rounded bg-[#04AA6D] hover:bg-[#03945e] disabled:opacity-40 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </form>

        <div className="space-y-1 max-h-32 overflow-y-auto">
          {breakpoints.length === 0 ? (
            <div className="text-[10px] text-zinc-500 py-1">No breakpoints set</div>
          ) : (
            breakpoints.map((bp) => (
              <div
                key={bp.id}
                className={`p-1.5 rounded border text-xs flex items-center justify-between ${
                  isDark ? 'bg-[#020617]/70 border-[#334155]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setBreakpoints((prev) =>
                        prev.map((b) => (b.id === bp.id ? { ...b, enabled: !b.enabled } : b))
                      )
                    }
                    className="cursor-pointer"
                  >
                    <CircleDot
                      className={`w-3.5 h-3.5 ${
                        bp.enabled ? 'text-rose-500 fill-rose-500/20' : 'text-zinc-500'
                      }`}
                    />
                  </button>
                  <span className="font-mono text-[11px] text-zinc-300">
                    {bp.file}:{bp.line}
                  </span>
                </div>

                <button
                  onClick={() => setBreakpoints((prev) => prev.filter((b) => b.id !== bp.id))}
                  className="text-zinc-500 hover:text-rose-400 p-0.5 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Watch Expressions Section */}
      <div className={`flex-1 p-3 space-y-2 border-t overflow-y-auto ${isDark ? 'border-[#334155]/40' : 'border-[#e2e8f0]'}`}>
        <div className={`text-[10px] uppercase font-bold flex items-center justify-between ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-[#04AA6D]" />
            <span>Watch Expressions</span>
          </div>
        </div>

        <form onSubmit={handleAddWatch} className="flex items-center gap-1.5">
          <input
            type="text"
            value={newWatchInput}
            onChange={(e) => setNewWatchInput(e.target.value)}
            placeholder="Expression (e.g. date.now)"
            className={`flex-1 px-2 py-1 text-xs rounded border outline-none font-mono ${
              isDark ? 'bg-[#020617] border-[#334155] text-white' : 'bg-white border-slate-300 text-black'
            }`}
          />
          <button
            type="submit"
            disabled={!newWatchInput.trim()}
            className="px-2 py-1 rounded bg-[#04AA6D] hover:bg-[#03945e] disabled:opacity-40 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
          </button>
        </form>

        <div className="space-y-1">
          {watchList.map((w) => (
            <div
              key={w.id}
              className={`p-1.5 rounded border text-[11px] font-mono flex items-center justify-between ${
                isDark ? 'bg-[#020617]/70 border-[#334155]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="truncate">
                <span className="text-[#04AA6D]">{w.expression}: </span>
                <span className="text-zinc-300">{w.value}</span>
              </div>
              <button
                onClick={() => setWatchList((prev) => prev.filter((item) => item.id !== w.id))}
                className="text-zinc-500 hover:text-rose-400 p-0.5 cursor-pointer ml-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
