import React, { useState } from 'react';
import { Star, X, Folder, FileCode, Check } from 'lucide-react';
import { WorkspaceFile } from '../types/codex';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: WorkspaceFile[];
  onSelectFile: (id: string) => void;
  onSelectWorkspace: (name: string, path: string) => void;
  isDark: boolean;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  files,
  onSelectFile,
  onSelectWorkspace,
  isDark,
}) => {
  if (!isOpen) return null;

  const favoriteWorkspaces = [
    { name: 'dsa-roadmap', path: 'D:\\dsa-roadmap', desc: 'Data structures & algorithms roadmap' },
    { name: 'Codesphere', path: 'D:\\PROJECTS\\Codesphere', desc: 'Main fullstack repository' },
    { name: 'Fast-API', path: 'D:\\Fast-API', desc: 'High performance Python microservices' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-24 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-xl shadow-2xl border overflow-hidden ${
          isDark ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-[#e2e8f0] text-black'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-[#334155]/60' : 'border-[#e2e8f0]'}`}>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#f59e0b] fill-current" />
            <h3 className="text-sm font-bold">Favorites & Workspaces</h3>
            <span className="text-[10px] text-[#94a3b8] font-mono">(Ctrl+Shift+O)</span>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded transition cursor-pointer ${isDark ? 'hover:bg-white/10 text-[#94a3b8]' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
          <div>
            <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 px-1 ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
              Pinned Workspaces
            </div>
            <div className="space-y-1">
              {favoriteWorkspaces.map((ws) => (
                <div
                  key={ws.name}
                  onClick={() => {
                    onSelectWorkspace(ws.name, ws.path);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg border hover:border-[#04AA6D] hover:bg-[#04AA6D]/10 transition cursor-pointer ${
                    isDark ? 'border-[#334155]/40' : 'border-[#e2e8f0]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-[#04AA6D]" />
                    <div>
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{ws.name}</div>
                      <div className={`text-[10px] font-mono ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>{ws.path}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#04AA6D] font-medium">Open &rarr;</span>
                </div>
              ))}
            </div>
          </div>

          {files.length > 0 && (
            <div>
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 px-1 ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                Workspace Files
              </div>
              <div className="space-y-1">
                {files.filter(f => f.type === 'file').map((file) => (
                  <div
                    key={file.id}
                    onClick={() => {
                      onSelectFile(file.id);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg transition cursor-pointer ${
                      isDark ? 'hover:bg-[#1e293b]' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-[#0d9488]" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <span className="text-[10px] text-[#94a3b8] font-mono">{file.language}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
