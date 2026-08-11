import React, { useState } from 'react';
import { MessageSquare, ExternalLink, RefreshCw, Sparkles, Shield, Wifi, Globe } from 'lucide-react';

export const CommunityChat = ({ communityId, communityName }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [urlHost, setUrlHost] = useState('127.0.0.1'); // '127.0.0.1' or 'localhost'

  const envUrl = import.meta.env.VITE_ROCKETCHAT_URL;
  const rocketChatUrl = envUrl || `http://${urlHost}:3000`;

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const toggleHost = () => {
    setUrlHost((prev) => (prev === '127.0.0.1' ? 'localhost' : '127.0.0.1'));
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
                {communityName || 'CodeSphere'} Live Workspace Chat
              </h3>
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#04AA6D]/15 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30 font-mono">
                <Sparkles className="w-2.5 h-2.5" />
                Rocket.Chat Engine
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Real-time enterprise channel messaging powered by Rocket.Chat & Docker
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleHost}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            title="Toggle between 127.0.0.1 and localhost"
          >
            <Globe className="w-3 h-3 text-[#04AA6D]" />
            <span>{urlHost}:3000</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
            <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>LIVE CHAT ONLINE</span>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            title="Reload Rocket.Chat iframe"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href={rocketChatUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#04AA6D] hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-all font-mono"
          >
            <span>Open Rocket.Chat</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Rocket.Chat Embedded Engine View */}
      <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center">
        <iframe
          key={iframeKey}
          src={rocketChatUrl}
          title="Rocket.Chat Live Engine"
          className="w-full h-full border-none z-10"
          allow="camera; microphone; display-capture; autoplay; clipboard-write; fullscreen"
        />

        {/* Fallback launcher card if local browser blocks iframe */}
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 text-slate-300">
          <div className="w-12 h-12 rounded-2xl bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/30 flex items-center justify-center mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Rocket.Chat Server is Running</h4>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
            If your browser blocks local iframe embeds, click below to open Rocket.Chat in a dedicated tab or toggle endpoint.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleHost}
              className="px-4 py-2 rounded-xl text-xs font-bold font-mono bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer"
            >
              Try {urlHost === '127.0.0.1' ? 'http://localhost:3000' : 'http://127.0.0.1:3000'}
            </button>
            <a
              href={rocketChatUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold font-mono bg-[#04AA6D] hover:bg-emerald-600 text-white transition-all shadow-lg"
            >
              Open Direct Window ↗
            </a>
          </div>
        </div>
      </div>

      {/* Footer Instructions Bar */}
      <div className="px-6 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#04AA6D]" />
          CodeSphere Single Sign-On (SSO) & REST API integrated
        </span>
        <span>
          Server URL: <code className="text-[#04AA6D] font-bold">{rocketChatUrl}</code>
        </span>
      </div>
    </div>
  );
};

export default CommunityChat;
