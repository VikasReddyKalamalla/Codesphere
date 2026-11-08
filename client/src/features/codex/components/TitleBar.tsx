import React, { useState, useRef, useEffect } from 'react';
import {
  Columns2,
  PanelLeft,
  PanelBottom,
  Search,
  Settings,
  Maximize2,
  Minimize2,
  Globe,
  Sun,
  Moon,
  Sparkles,
  Kanban,
  Radio,
  User,
  Shield,
  LogOut,
  FolderOpen,
  Keyboard,
  Info,
  ExternalLink,
  Users
} from 'lucide-react';
import { MenuBar } from './MenuBar';
import { CodexLogo } from './CodexLogo';
import { ActivityTab } from './ActivityBar';

interface TitleBarProps {
  onNewFile: () => void;
  onNewFolder: () => void;
  onOpenFolder?: () => void;
  onCloneRepo?: () => void;
  onSaveFile: () => void;
  onCloseActiveFile: () => void;
  onClearWorkspace: () => void;
  onRunCode: () => void;
  onToggleTerminal: () => void;
  onToggleSideBar: () => void;
  onOpenQuickOpen: () => void;
  onToggleWordWrap: () => void;
  onFormatDocument: () => void;
  onTriggerMonacoAction: (actionId: string) => void;
  onOpenWelcome: () => void;
  onOpenFavorites: () => void;
  onToggleVoice: () => void;
  onSelectActivityTab?: (tab: ActivityTab) => void;
  onOpenSettings?: () => void;
  onOpenAccount?: () => void;
  onOpenWorkspaceDashboard?: () => void;
  onOpenShareCollab?: () => void;
  isVoiceConnected: boolean;
  isSideBarOpen: boolean;
  isTerminalOpen: boolean;
  folderName: string;
  activeFileName?: string;
  username?: string;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  onNewFile,
  onNewFolder,
  onOpenFolder,
  onCloneRepo,
  onSaveFile,
  onCloseActiveFile,
  onClearWorkspace,
  onRunCode,
  onToggleTerminal,
  onToggleSideBar,
  onOpenQuickOpen,
  onToggleWordWrap,
  onFormatDocument,
  onTriggerMonacoAction,
  onOpenWelcome,
  onOpenFavorites,
  onToggleVoice,
  onSelectActivityTab,
  onOpenSettings,
  onOpenAccount,
  onOpenWorkspaceDashboard,
  onOpenShareCollab,
  isVoiceConnected,
  isSideBarOpen,
  isTerminalOpen,
  folderName,
  activeFileName,
  username = 'reddymanish315',
  isDark,
  onToggleTheme,
}) => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close account dropdown on click outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleMinimizeZen = () => {
    // Toggles all panels closed for clean writing
    if (isSideBarOpen) onToggleSideBar();
    if (isTerminalOpen) onToggleTerminal();
  };

  return (
    <header
      className={`h-9 border-b flex items-center justify-between px-2 select-none z-40 shrink-0 text-xs ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
      }`}
    >
      {/* Left: Codex Emblem + VS Code Menus */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenWelcome}
          className="p-1 hover:opacity-80 transition cursor-pointer"
          title="CodeSphere Codex Home / Welcome Hub"
        >
          <CodexLogo className="w-4 h-4 text-[#04AA6D]" />
        </button>

        {/* Working Dropdown Menu Bar */}
        <MenuBar
          onNewFile={onNewFile}
          onNewFolder={onNewFolder}
          onOpenFolder={onOpenFolder}
          onCloneRepo={onCloneRepo}
          onSaveFile={onSaveFile}
          onCloseActiveFile={onCloseActiveFile}
          onClearWorkspace={onClearWorkspace}
          onRunCode={onRunCode}
          onToggleTerminal={onToggleTerminal}
          onOpenQuickOpen={onOpenQuickOpen}
          onToggleWordWrap={onToggleWordWrap}
          onFormatDocument={onFormatDocument}
          onTriggerMonacoAction={onTriggerMonacoAction}
          onOpenWelcome={onOpenWelcome}
          onSelectActivityTab={onSelectActivityTab}
          onOpenShortcuts={() => setIsHelpModalOpen(true)}
          isDark={isDark}
        />
      </div>

      {/* Center: Command Palette / File Search Trigger */}
      <button
        onClick={onOpenQuickOpen}
        className={`group flex items-center gap-2 px-3 py-1 rounded-md border transition cursor-pointer max-w-md w-full justify-between mx-4 ${
          isDark
            ? 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-[#04AA6D]/50 text-slate-200'
            : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 hover:border-[#04AA6D]/50 text-slate-800'
        }`}
        title="Search files, symbols, commands (Ctrl+P)"
      >
        <div className="flex items-center gap-2 truncate">
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#04AA6D] transition" />
          <span className="font-mono text-[11px] truncate">
            {activeFileName ? `${activeFileName} — ` : ''}{folderName}
          </span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">— CodeSphere Codex</span>
        </div>

        <kbd
          className={`hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono border ${
            isDark
              ? 'bg-slate-800 text-slate-300 border-slate-700'
              : 'bg-white text-slate-700 border-slate-300 shadow-xs'
          }`}
        >
          Ctrl+P
        </kbd>
      </button>

      {/* Right: Layout Controls & Window Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Google Meet Quick Action Button */}
        <button
          onClick={onToggleVoice}
          className={`px-2.5 py-0.5 rounded border transition font-sans text-[11px] cursor-pointer flex items-center gap-1.5 ${
            isVoiceConnected
              ? 'bg-[#04AA6D] hover:bg-[#03985e] border-[#04AA6D] text-white shadow-xs'
              : isDark
              ? 'border-slate-800 hover:border-[#04AA6D] hover:bg-[#04AA6D]/15 text-slate-300 hover:text-white'
              : 'border-slate-200 hover:border-[#04AA6D] hover:bg-[#04AA6D]/10 text-slate-700 hover:text-slate-900 bg-slate-50'
          }`}
          title="Open Google Meet & Live Calls (Ctrl+Shift+V)"
        >
          <span className={`w-2 h-2 rounded-full ${isVoiceConnected ? 'bg-white animate-pulse' : 'bg-[#04AA6D]'}`} />
          <span>{isVoiceConnected ? 'In Meet Call' : 'Google Meet'}</span>
        </button>

        {/* Favorites Button */}
        <button
          onClick={onOpenFavorites}
          className={`px-2 py-0.5 rounded border transition font-sans text-[11px] cursor-pointer flex items-center gap-1 ${
            isDark
              ? 'border-slate-800 hover:border-[#04AA6D] hover:bg-[#04AA6D]/15 text-slate-300 hover:text-white'
              : 'border-slate-200 hover:border-[#04AA6D] hover:bg-[#04AA6D]/10 text-slate-700 hover:text-slate-900 bg-slate-50'
          }`}
          title="Open Favorites & Workspaces (Ctrl+Shift+O)"
        >
          <span>Favorites</span>
        </button>

        {/* Toggle primary sidebar */}
        <button
          onClick={onToggleSideBar}
          className={`p-1 rounded transition cursor-pointer ${
            isSideBarOpen
              ? 'text-[#04AA6D] bg-[#04AA6D]/10'
              : isDark
              ? 'hover:bg-slate-800 hover:text-white text-slate-400'
              : 'hover:bg-slate-100 hover:text-slate-900 text-slate-600'
          }`}
          title="Toggle Primary Side Bar (Ctrl+B)"
        >
          <PanelLeft className="w-3.5 h-3.5" />
        </button>

        {/* Toggle bottom panel */}
        <button
          onClick={onToggleTerminal}
          className={`p-1 rounded transition cursor-pointer ${
            isTerminalOpen
              ? 'text-[#04AA6D] bg-[#04AA6D]/10'
              : isDark
              ? 'hover:bg-slate-800 hover:text-white text-slate-400'
              : 'hover:bg-slate-100 hover:text-slate-900 text-slate-600'
          }`}
          title="Toggle Terminal & Panel (Ctrl+`)"
        >
          <PanelBottom className="w-3.5 h-3.5" />
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={onToggleTheme}
          className={`p-1 rounded transition cursor-pointer ${
            isDark
              ? 'hover:bg-slate-800 hover:text-white text-slate-400'
              : 'hover:bg-slate-100 hover:text-slate-900 text-slate-600'
          }`}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
        </button>

        {/* Live Multiplayer Share Collab Button */}
        {onOpenShareCollab && (
          <button
            onClick={onOpenShareCollab}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition cursor-pointer text-xs ${
              isDark
                ? 'bg-[#04AA6D]/15 text-[#04AA6D] hover:bg-[#04AA6D]/25 border border-[#04AA6D]/30'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
            title="Live Multiplayer Coding & Share Room"
          >
            <Users className="w-3 h-3" />
            <span className="text-[11px] font-semibold hidden sm:inline">Share</span>
          </button>
        )}

        {/* Settings button */}
        <button
          onClick={onOpenSettings || onOpenFavorites}
          className={`p-1 rounded transition cursor-pointer ${
            isDark
              ? 'hover:bg-slate-800 hover:text-white text-slate-400'
              : 'hover:bg-slate-100 hover:text-slate-900 text-slate-600'
          }`}
          title="Manage & Preferences"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        <div className={`h-3 w-px mx-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

        {/* User avatar badge with account dropdown */}
        <div ref={accountRef} className="relative">
          <button
            onClick={() => setIsAccountOpen(!isAccountOpen)}
            className="relative p-0.5 rounded-full hover:ring-2 hover:ring-[#04AA6D] transition cursor-pointer flex items-center justify-center"
            title={`${username} (Workspace Owner)`}
          >
            <div className="w-4 h-4 rounded-full bg-[#04AA6D] flex items-center justify-center font-bold text-[9px] text-white">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#10b981] ring-1 ring-white dark:ring-slate-900" />
          </button>

          {isAccountOpen && (
            <div
              className={`absolute right-0 top-full mt-1.5 w-60 rounded-xl border shadow-xl p-3 z-50 text-xs ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className={`flex items-center gap-2.5 pb-2.5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="w-8 h-8 rounded-full bg-[#04AA6D] flex items-center justify-center font-bold text-sm text-white">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-xs truncate">{username}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{username}@codesphere.dev</div>
                </div>
              </div>

              <div className="py-2 space-y-1 text-[11px] font-sans">
                <div className={`flex items-center justify-between py-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Current Workspace</span>
                  <span className="font-mono text-[#04AA6D] font-bold">{folderName}</span>
                </div>
                <div className={`flex items-center justify-between py-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Workspace Role</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#04AA6D]/20 text-[#04AA6D] text-[10px] font-mono">Owner</span>
                </div>
                <div className={`flex items-center justify-between py-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Google Meet</span>
                  <span className={`text-[10px] ${isVoiceConnected ? 'text-[#04AA6D] font-semibold' : 'text-slate-400'}`}>
                    {isVoiceConnected ? 'In Call' : 'Available'}
                  </span>
                </div>
              </div>

              <div className={`pt-2 border-t flex flex-col gap-1 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  onClick={() => {
                    setIsAccountOpen(false);
                    if (onOpenWorkspaceDashboard) onOpenWorkspaceDashboard();
                    else onOpenFavorites();
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-[11px] flex items-center gap-2 transition cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[#04AA6D]" />
                  <span>Manage Workspaces...</span>
                </button>
                <button
                  onClick={() => {
                    setIsAccountOpen(false);
                    if (onOpenAccount) onOpenAccount();
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-[11px] flex items-center gap-2 transition cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span>Account & Authentication</span>
                </button>
                {onOpenShareCollab && (
                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onOpenShareCollab();
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded text-[11px] flex items-center gap-2 transition cursor-pointer ${
                      isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-[#04AA6D]" />
                    <span>Live Multiplayer Room...</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsAccountOpen(false);
                    setIsHelpModalOpen(true);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-[11px] flex items-center gap-2 transition cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Shortcuts Cheat Sheet</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`h-3 w-px mx-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

        {/* Fullscreen IDE toggle */}
        <button
          onClick={handleToggleFullscreen}
          className={`p-1 rounded transition cursor-pointer ${
            isDark ? 'hover:bg-slate-800 hover:text-white text-slate-400' : 'hover:bg-slate-100 hover:text-slate-900 text-slate-600'
          }`}
          title="Toggle Fullscreen IDE (F11)"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Shortcuts & Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`max-w-md w-full p-5 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div className={`flex items-center gap-2 font-semibold text-sm ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Keyboard className="w-4 h-4 text-[#04AA6D]" />
                <span>CodeSphere Codex Shortcuts</span>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs max-h-72 overflow-y-auto pr-1">
              {[
                { key: 'Ctrl + P', desc: 'Quick Open File & Command Palette' },
                { key: 'Ctrl + Shift + I', desc: 'Toggle Codex AI Copilot (Gemini)' },
                { key: 'Ctrl + Shift + A', desc: 'Toggle REST API Tester Suite' },
                { key: 'Ctrl + Shift + K', desc: 'Toggle Agile Sprint Kanban Board' },
                { key: 'Ctrl + Shift + V', desc: 'Toggle Google Meet & Live Call' },
                { key: 'Ctrl + Shift + O', desc: 'Open Favorites & Workspaces Hub' },
                { key: 'Ctrl + B', desc: 'Toggle Primary Side Bar' },
                { key: 'Ctrl + `', desc: 'Toggle Terminal & Bottom Panel' },
                { key: 'Ctrl + S', desc: 'Save Active File' },
                { key: 'Ctrl + Enter', desc: 'Execute / Run Active Code' },
                { key: 'Shift + Alt + F', desc: 'Format Document' },
                { key: 'Alt + Z', desc: 'Toggle Editor Word Wrap' },
              ].map((item, idx) => (
                <div key={idx} className={`flex items-center justify-between py-1.5 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item.desc}</span>
                  <kbd className={`px-2 py-0.5 rounded font-mono text-[10px] text-[#04AA6D] font-bold border ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="px-4 py-1.5 rounded bg-[#04AA6D] hover:bg-[#059669] text-xs font-medium text-white transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
