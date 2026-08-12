import React, { useState } from 'react';
import { MessageSquare, RefreshCw, Sparkles, Shield, Wifi, Lock } from 'lucide-react';

export const CommunityChat = ({ communityId, communityName }) => {
  const [iframeKey, setIframeKey] = useState(0);
  
  // Use CodeSphere's zero-header backend proxy to embed Rocket.Chat in layout=embedded mode
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const rawProxyUrl = apiBaseUrl.replace(/\/api\/?$/, '') + '/api/rocketchat-proxy';
  const embeddedProxyUrl = `${rawProxyUrl}?layout=embedded`;

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col h-[650px] overflow-hidden shadow-xl text-left font-sans">
      
      {/* Header Bar with CodeSphere Branding & Rocket.Chat Engine Badge */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#04AA6D]/10 border border-[#04AA6D]/30 flex items-center justify-center text-[#04AA6D]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                {communityName || 'CodeSphere'} Inbuilt Live Chat
              </h3>
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#04AA6D]/15 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30 font-mono">
                <Sparkles className="w-2.5 h-2.5" />
                Inbuilt Engine
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Embedded channel messaging — contained directly inside CodeSphere
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
            <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>INBUILT EMBEDDED</span>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1 text-xs font-mono font-bold"
            title="Reload embedded chat frame"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* Main Rocket.Chat Embedded Engine View */}
      <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center">
        <iframe
          key={iframeKey}
          src={embeddedProxyUrl}
          title="CodeSphere Inbuilt Live Chat"
          className="w-full h-full border-none z-10"
          allow="camera; microphone; display-capture; autoplay; clipboard-write; fullscreen"
        />
      </div>

      {/* Footer Instructions Bar */}
      <div className="px-6 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#04AA6D]" />
          CodeSphere Reverse Proxy — Layout Embedded Mode Active
        </span>
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-emerald-500" />
          Single-Page Inbuilt Window
        </span>
      </div>
    </div>
  );
};

export default CommunityChat;

