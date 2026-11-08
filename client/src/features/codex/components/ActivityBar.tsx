import React from 'react';
import {
  Files,
  Search,
  GitBranch,
  PlayCircle,
  Blocks,
  Settings,
  Video,
  Globe,
  Kanban,
  Sparkles,
  User
} from 'lucide-react';

export type ActivityTab =
  | 'explorer'
  | 'search'
  | 'git'
  | 'debug'
  | 'extensions'
  | 'voice'
  | 'api'
  | 'kanban'
  | 'copilot'
  | null;

interface ActivityBarProps {
  activeTab: ActivityTab;
  onSelectTab: (tab: ActivityTab) => void;
  isDark: boolean;
  onOpenSettings: () => void;
  isVoiceConnected?: boolean;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  activeTab,
  onSelectTab,
  isDark,
  onOpenSettings,
  isVoiceConnected,
}) => {
  const topItems: { id: ActivityTab; icon: any; label: string; badge?: boolean; highlight?: boolean }[] = [
    { id: 'explorer', icon: Files, label: 'Explorer (Ctrl+Shift+E)' },
    { id: 'search', icon: Search, label: 'Search (Ctrl+Shift+F)' },
    { id: 'git', icon: GitBranch, label: 'Source Control (Ctrl+Shift+G)' },
    { id: 'debug', icon: PlayCircle, label: 'Run and Debug (Ctrl+Shift+D)' },
    { id: 'copilot', icon: Sparkles, label: 'Codex AI Copilot (Ctrl+Shift+I)', highlight: true },
    { id: 'api', icon: Globe, label: 'API Tester & REST Client (Ctrl+Shift+A)' },
    { id: 'kanban', icon: Kanban, label: 'Sprint Kanban Board (Ctrl+Shift+K)' },
    { id: 'voice', icon: Video, label: 'Google Meet & Live Call (Ctrl+Shift+V)', badge: isVoiceConnected },
    { id: 'extensions', icon: Blocks, label: 'Extensions (Ctrl+Shift+X)' },
  ];

  return (
    <div
      className={`w-12 h-full flex flex-col justify-between items-center py-2 border-r select-none shrink-0 z-30 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}
    >
      {/* Top Icons */}
      <div className="flex flex-col items-center gap-1 w-full">
        {topItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(isActive ? null : item.id)}
              className={`relative p-2.5 rounded-lg transition-all cursor-pointer group flex items-center justify-center w-10 h-10 ${
                isActive
                  ? isDark
                    ? 'text-[#04AA6D] bg-slate-800/90 shadow-xs'
                    : 'text-[#04AA6D] font-bold bg-white shadow-xs'
                  : isDark
                  ? 'hover:text-slate-200 hover:bg-slate-800/50 text-slate-400'
                  : 'hover:text-slate-900 hover:bg-slate-200/60 text-slate-600'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 stroke-[1.6]" />

              {/* Connected voice indicator */}
              {item.badge && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#04AA6D] animate-ping" />
              )}
              {item.badge && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#04AA6D]" />
              )}

              {/* Active left edge bar matching CodeSphere emerald */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-[#04AA6D] rounded-r" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Icons: Account & Settings */}
      <div className="flex flex-col items-center gap-1 w-full">
        <button
          onClick={onOpenSettings}
          className={`p-2.5 rounded-lg transition cursor-pointer text-inherit ${
            isDark
              ? 'hover:text-slate-200 hover:bg-slate-800/50 text-slate-400'
              : 'hover:text-slate-900 hover:bg-slate-200/60 text-slate-600'
          }`}
          title="Manage & Settings"
        >
          <Settings className="w-5 h-5 stroke-[1.6]" />
        </button>
      </div>
    </div>
  );
};
