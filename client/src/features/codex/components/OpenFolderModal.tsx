import React, { useState, useRef } from 'react';
import {
  FolderOpen,
  Folder,
  X,
  Upload,
  HardDrive,
  Check,
  ChevronRight,
  FolderPlus
} from 'lucide-react';
import { WorkspaceFile } from '../types/codex';

interface OpenFolderModalProps {
  isOpen: boolean;
  currentFolderName: string;
  currentWorkspacePath: string;
  username: string;
  onClose: () => void;
  onSelectFolder: (
    folderName: string,
    workspacePath: string,
    loadedFiles?: WorkspaceFile[]
  ) => void;
  isDark: boolean;
}

export const OpenFolderModal: React.FC<OpenFolderModalProps> = ({
  isOpen,
  currentFolderName,
  currentWorkspacePath,
  username,
  onClose,
  onSelectFolder,
  isDark,
}) => {
  const [customPath, setCustomPath] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const quickFolders = [
    { name: 'dsa-roadmap', path: `D:\\dsa-roadmap`, desc: 'Data structures and algorithms problems' },
    { name: 'Codesphere', path: `D:\\PROJECTS\\Codesphere`, desc: 'Fullstack collaborative workspace' },
    { name: 'Fast-API', path: `D:\\Fast-API`, desc: 'Python async API backend' },
    { name: 'codex-cloud-core', path: `C:\\Users\\${username}\\codex-cloud-core`, desc: 'Cloud runtime modules' },
    { name: 'react-fullstack-suite', path: `D:\\WORKSPACE\\web\\react-fullstack-suite`, desc: 'React components and UI library' },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = customPath.trim();
    if (!raw) return;

    // Extract leaf folder name
    const normalized = raw.replace(/\//g, '\\');
    const parts = normalized.split('\\').filter(Boolean);
    const leaf = parts.length > 0 ? parts[parts.length - 1] : raw;
    const fullPath = raw.includes('\\') || raw.includes('/')
      ? raw
      : `C:\\Users\\${username}\\${leaf}`;

    onSelectFolder(leaf, fullPath);
    onClose();
  };

  // Handle native folder browse via input[webkitdirectory]
  const handleNativeFolderSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setLoading(true);
    try {
      const firstFile = fileList[0];
      const relativePath = firstFile.webkitRelativePath || firstFile.name;
      const rootFolderName = relativePath.split('/')[0] || 'opened-folder';

      const parsedFiles: WorkspaceFile[] = [];

      // Read files (up to 40 files for performance)
      const maxFiles = Math.min(fileList.length, 40);
      for (let i = 0; i < maxFiles; i++) {
        const f = fileList[i];
        const rel = f.webkitRelativePath;
        const parts = rel.split('/');
        // Drop the root folder name from relative path to show within workspace
        const subPath = parts.slice(1).join('/');
        if (!subPath) continue;

        let content = '';
        // Only read text files under 2MB
        if (f.size < 2 * 1024 * 1024) {
          try {
            content = await f.text();
          } catch {
            content = '';
          }
        }

        const ext = f.name.split('.').pop()?.toLowerCase() || '';
        let lang = 'plaintext';
        if (ext === 'js' || ext === 'jsx') lang = 'javascript';
        else if (ext === 'ts' || ext === 'tsx') lang = 'typescript';
        else if (ext === 'py') lang = 'python';
        else if (ext === 'html') lang = 'html';
        else if (ext === 'css') lang = 'css';
        else if (ext === 'json') lang = 'json';
        else if (ext === 'md') lang = 'markdown';
        else if (ext === 'cpp' || ext === 'c') lang = 'cpp';

        parsedFiles.push({
          id: `f_${Date.now()}_${i}`,
          name: f.name,
          path: subPath,
          language: lang,
          type: 'file',
          content,
          isOpen: i === 0,
          isModified: false,
        });
      }

      const fullPath = `C:\\Users\\${username}\\${rootFolderName}`;
      onSelectFolder(rootFolderName, fullPath, parsedFiles);
      onClose();
    } catch (err) {
      console.error('Failed to open local folder:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-xl shadow-2xl border overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden directory picker input */}
        <input
          ref={fileInputRef}
          type="file"
          // @ts-expect-error webkitdirectory is standard in Chromium/Firefox/Safari
          webkitdirectory=""
          directory=""
          multiple
          className="hidden"
          onChange={handleNativeFolderSelected}
        />

        {/* Modal Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#04AA6D]" />
            <div>
              <h3 className="text-sm font-semibold">Open Folder</h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Current: <span className="text-[#04AA6D] font-mono font-medium">{currentFolderName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Action 1: Browse Folder from PC */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`p-3.5 rounded-xl border-2 border-dashed flex items-center gap-3 cursor-pointer transition ${
              isDark
                ? 'border-slate-700 hover:border-[#04AA6D] bg-slate-800/40 hover:bg-slate-800/70'
                : 'border-slate-300 hover:border-[#04AA6D] bg-slate-50 hover:bg-slate-100/80'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#04AA6D]/15 text-[#04AA6D] flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span>Browse Folder from Computer</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#04AA6D]/20 text-[#04AA6D] font-mono">Native</span>
              </div>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Select any folder from your machine to load its files and folder name directly.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Action 2: Enter Custom Folder Name or Path */}
          <form onSubmit={handleCustomSubmit} className="space-y-2">
            <label className={`text-[11px] font-medium block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Or Enter Folder Name / Path:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Folder className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  placeholder={`e.g. my-awesome-app or C:\\Users\\${username}\\projects\\web`}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs outline-none transition font-mono ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 focus:border-[#04AA6D] text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 focus:border-[#04AA6D] text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={!customPath.trim()}
                className="px-4 py-2 rounded-lg bg-[#04AA6D] hover:bg-[#03985e] disabled:opacity-40 text-white font-medium text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Open</span>
              </button>
            </div>
          </form>

          {/* Action 3: Quick Preset Workspaces */}
          <div className="space-y-2 pt-1">
            <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Quick Workspaces
            </div>
            <div className="space-y-1.5">
              {quickFolders.map((ws) => (
                <div
                  key={ws.name}
                  onClick={() => {
                    onSelectFolder(ws.name, ws.path);
                    onClose();
                  }}
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                    currentFolderName === ws.name
                      ? 'border-[#04AA6D] bg-[#04AA6D]/10'
                      : isDark
                      ? 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Folder className={`w-4 h-4 ${currentFolderName === ws.name ? 'text-[#04AA6D]' : 'text-slate-400'}`} />
                    <div>
                      <div className={`font-medium flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <span>{ws.name}</span>
                        {currentFolderName === ws.name && (
                          <span className="text-[10px] text-[#04AA6D] font-mono">(Active)</span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{ws.path}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
