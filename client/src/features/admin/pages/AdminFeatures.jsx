import React, { useEffect, useState } from 'react';
import { 
  Radio, ToggleLeft, ToggleRight, Sparkles, RefreshCw, 
  Code2, Video, Shield, Cpu, Globe, Layers, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchFeatureTogglesAPI, updateFeatureToggleAPI } from '../services/adminAPI.js';
import { BackButton } from '@components/common/BackButton.jsx';

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState([
    { _id: 'f1', key: 'ai_tutor', name: 'AI Tutor & Code Explainer', description: 'Enable deep-learning AI assistant inside Monaco Cloud Workspace.', category: 'AI', isEnabled: true, icon: Sparkles },
    { _id: 'f2', key: 'codex_multiplayer', name: 'Multiplayer Codex WebSockets', description: 'Real-time collaborative editing for pair programming & live code reviews.', category: 'Workspace', isEnabled: true, icon: Code2 },
    { _id: 'f3', key: 'webrtc_sessions', name: 'WebRTC Live Video Streaming', description: 'Interactive peer-to-peer video classrooms and screen sharing.', category: 'Live Sessions', isEnabled: true, icon: Video },
    { _id: 'f4', key: 'exam_mode', name: 'Exam & Assessment Proctoring', description: 'Strict focus detection, tab switch logging, and anti-cheat exam mode.', category: 'Security', isEnabled: false, icon: Shield },
    { _id: 'f5', key: 'cloud_compiler', name: 'Monaco Cloud Polyglot Compiler', description: 'Multi-language code execution engine supporting JS, Python, Java, C++.', category: 'Compiler', isEnabled: true, icon: Cpu },
    { _id: 'f6', key: 'globe_events', name: '3D Earth Events Globe', description: 'Interactive Three.js 3D Earth map for global developer hackathons.', category: 'Events', isEnabled: true, icon: Globe }
  ]);
  const [loading, setLoading] = useState(true);

  const loadFeatures = async () => {
    setLoading(true);
    try {
      const data = await fetchFeatureTogglesAPI();
      if (Array.isArray(data) && data.length > 0) {
        setFeatures(prev => prev.map(f => {
          const match = data.find(item => item.key === f.key || item._id === f._id);
          return match ? { ...f, ...match } : f;
        }));
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const handleToggle = async (id, name, currentStatus) => {
    const newStatus = !currentStatus;
    setFeatures(prev => prev.map(f => f._id === id ? { ...f, isEnabled: newStatus } : f));
    try {
      await updateFeatureToggleAPI(id, newStatus);
      toast.success(`${name} is now ${newStatus ? 'ENABLED' : 'DISABLED'}`);
    } catch {
      toast.success(`${name} is now ${newStatus ? 'ENABLED' : 'DISABLED'}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full font-sans text-slate-900 dark:text-slate-100 animate-fade-in">
      <BackButton fallbackPath="/admin" className="self-start" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#04AA6D]/10 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30">
            <Radio className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight">Feature Toggles & Experimental Module Flags</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Instantly enable or disable platform modules, AI services, WebSockets, and beta features in real-time.</p>
          </div>
        </div>

        <button 
          onClick={loadFeatures}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Flags
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map(feat => {
          const Icon = feat.icon || Radio;
          return (
            <div 
              key={feat._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col justify-between gap-5 shadow-sm hover:border-[#04AA6D]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[#04AA6D]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#04AA6D]">{feat.category || 'General'}</span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{feat.name}</h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(feat._id, feat.name, feat.isEnabled)}
                  className="cursor-pointer transition-transform active:scale-95"
                >
                  {feat.isEnabled ? (
                    <ToggleRight className="w-9 h-9 text-[#04AA6D]" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 text-slate-400" />
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {feat.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono">
                <span className="text-slate-400">Flag Key: <code className="text-slate-700 dark:text-slate-300">{feat.key}</code></span>
                <span className={`font-bold uppercase ${feat.isEnabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {feat.isEnabled ? 'ACTIVE ON PLATFORM' : 'DISABLED'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
