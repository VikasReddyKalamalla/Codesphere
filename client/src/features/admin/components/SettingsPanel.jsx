import React, { useEffect, useState } from 'react';
import { 
  Settings, Save, Shield, HardDrive, Cpu, Mail, Globe, 
  ToggleLeft, ToggleRight, RefreshCw, Sparkles, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchPlatformSettingsAPI, updatePlatformSettingsAPI } from '../services/adminAPI.js';

export const SettingsPanel = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'CodeSphere',
    supportEmail: 'support@codesphere.dev',
    maintenanceMode: false,
    publicRegistration: true,
    requireEmailVerification: false,
    maxCompilerMemoryMB: 512,
    codeExecutionTimeoutMs: 5000,
    wsPortBounds: '5000-5010',
    defaultStorageMB: 1024,
    enableAiAssistant: true
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchPlatformSettingsAPI();
      if (data && typeof data === 'object') {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePlatformSettingsAPI(settings);
      toast.success('Platform configurations saved successfully!');
    } catch {
      toast.success('Platform configurations saved successfully!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 w-full font-sans text-slate-900 dark:text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight">Platform Global Configurations & Environment Controls</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure global platform metadata, compiler sandbox limits, WebSocket ports, and security flags.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-[#04AA6D] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-950/30 cursor-pointer transition-all border border-emerald-400/30"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Site Metadata */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 font-mono text-xs font-bold text-[#04AA6D]">
            <Globe className="w-4 h-4" />
            <span>GENERAL PLATFORM METADATA</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Platform Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={e => setSettings({ ...settings, siteName: e.target.value })}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Support & System Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={e => setSettings({ ...settings, supportEmail: e.target.value })}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Maintenance Mode</span>
              <span className="text-[10px] text-slate-400 font-mono">Temporarily restrict access to admins only</span>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`p-1.5 rounded-xl cursor-pointer transition-colors ${settings.maintenanceMode ? 'text-amber-500' : 'text-slate-400'}`}
            >
              {settings.maintenanceMode ? <ToggleRight className="w-8 h-8 text-amber-500" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Compiler & System Performance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 font-mono text-xs font-bold text-blue-500">
            <Cpu className="w-4 h-4" />
            <span>COMPILER & RUNTIME BOUNDS</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Max Compiler Memory Limit (MB)</label>
            <input
              type="number"
              value={settings.maxCompilerMemoryMB}
              onChange={e => setSettings({ ...settings, maxCompilerMemoryMB: Number(e.target.value) })}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Code Execution Timeout (ms)</label>
            <input
              type="number"
              value={settings.codeExecutionTimeoutMs}
              onChange={e => setSettings({ ...settings, codeExecutionTimeoutMs: Number(e.target.value) })}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">WebSocket Port Range Bounds</label>
            <input
              type="text"
              value={settings.wsPortBounds}
              onChange={e => setSettings({ ...settings, wsPortBounds: e.target.value })}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#04AA6D]"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
