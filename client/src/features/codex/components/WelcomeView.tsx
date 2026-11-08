import React, { useState } from 'react';
import {
  FolderOpen,
  GitFork,
  Cloud,
  Check,
  Download,
  ChevronDown,
  Sparkles,
  ArrowRight,
  FilePlus,
  FolderPlus
} from 'lucide-react';
import { CodexLogo } from './CodexLogo';

interface WelcomeViewProps {
  onOpenFolder: () => void;
  onCloneRepo: () => void;
  onSelectWorkspace: (name: string, path: string) => void;
  onNewFile?: () => void;
  onNewFolder?: () => void;
  folderName?: string;
  isDark: boolean;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onOpenFolder,
  onCloneRepo,
  onSelectWorkspace,
  onNewFile,
  onNewFolder,
  folderName,
  isDark,
}) => {
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(() => {
    return localStorage.getItem('codesphere_ext_google_cloud') === 'true';
  });
  const [showAllWorkspaces, setShowAllWorkspaces] = useState(false);

  // Dynamically load user's real saved workspaces from storage
  const [userWorkspaces, setUserWorkspaces] = useState<{ name: string; path: string }[]>(() => {
    try {
      const saved = localStorage.getItem('codesphere_workspaces_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((w: any) => ({
            name: w.name || 'Workspace',
            path: w.path || `~/workspace/${w.name || 'project'}`,
          }));
        }
      }
    } catch {}

    return [
      { name: 'Codesphere-Codex', path: '~/workspace/Codesphere-Codex' },
      { name: 'Python-Algorithms', path: '~/workspace/python-dsa' },
      { name: 'React-Fullstack', path: '~/workspace/react-app' },
    ];
  });

  const visibleWorkspaces = showAllWorkspaces
    ? userWorkspaces
    : userWorkspaces.slice(0, 3);

  return (
    <div
      className={`h-full w-full overflow-y-auto flex flex-col items-center justify-start p-6 md:p-12 select-none transition-colors ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/60 text-slate-800'
      }`}
    >
      <div className="max-w-md w-full space-y-6 my-auto pt-4 pb-12">
        {/* Center Codex Logo & Title */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <CodexLogo className="w-16 h-16 text-[#04AA6D]" />

          <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            CodeSphere Codex
          </h1>

          {folderName && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#04AA6D]/15 border border-[#04AA6D]/40 text-[#04AA6D] text-[11px] font-mono">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Workspace: <strong>{folderName}</strong></span>
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2.5">
          {/* Quick Create row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onNewFile}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#04AA6D] hover:bg-[#03985e] text-white font-medium text-xs transition shadow-sm cursor-pointer active:scale-98"
            >
              <FilePlus className="w-4 h-4" />
              <span>New File</span>
            </button>
            <button
              onClick={onNewFolder}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-medium transition cursor-pointer active:scale-98 ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200 hover:text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
          </div>

          <button
            onClick={onOpenFolder}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-medium transition cursor-pointer active:scale-98 ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200 hover:text-white'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Open Folder</span>
          </button>

          <button
            onClick={onCloneRepo}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-medium transition cursor-pointer active:scale-98 ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200 hover:text-white'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>Clone Repository</span>
          </button>
        </div>

        {/* Workspaces Section */}
        <div className="space-y-2 pt-2">
          <h2 className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Workspaces
          </h2>

          <div className="space-y-1.5">
            {visibleWorkspaces.map((ws) => (
              <div
                key={ws.name}
                onClick={() => onSelectWorkspace(ws.name, ws.path)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  isDark
                    ? 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-[#04AA6D]'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-[#04AA6D] shadow-xs'
                }`}
              >
                <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{ws.name}</div>
                <div className={`text-[10px] font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ws.path}</div>
              </div>
            ))}
          </div>

          <div className="text-center pt-1">
            <button
              onClick={() => setShowAllWorkspaces(!showAllWorkspaces)}
              className="text-[11px] text-slate-400 hover:text-[#04AA6D] transition cursor-pointer"
            >
              {showAllWorkspaces ? 'Show Less' : 'Show More...'}
            </button>
          </div>
        </div>

        {/* Google Extensions Section */}
        <div className="space-y-2 pt-2">
          <h2 className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Google Extensions
          </h2>

          <div
            className={`p-3 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#04AA6D]/15 text-[#04AA6D]">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Google Data Cloud</div>
                <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Google Data Cloud for your intelligent IDE.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const nextState = !isExtensionInstalled;
                setIsExtensionInstalled(nextState);
                try {
                  localStorage.setItem('codesphere_ext_google_cloud', String(nextState));
                } catch {}
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                isExtensionInstalled
                  ? 'bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/40 font-semibold'
                  : isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              }`}
            >
              {isExtensionInstalled ? 'Installed' : 'Install Extension'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
