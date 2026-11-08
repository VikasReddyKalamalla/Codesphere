import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  FilePlus,
  FolderPlus,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  FolderGit2
} from 'lucide-react';
import { WorkspaceFile } from '../types/codex';

interface FileExplorerProps {
  files: WorkspaceFile[];
  activeFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onCreateFile: (name: string, isFolder: boolean, parentFolder?: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
  folderName: string;
  workspacePath?: string;
  onOpenFolderModal: () => void;
  onRequestNewItem?: (isFolder: boolean, parentFolder?: string) => void;
  isDark: boolean;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  folderName,
  workspacePath,
  onOpenFolderModal,
  onRequestNewItem,
  isDark,
}) => {
  const [isCreating, setIsCreating] = useState<{ isFolder: boolean; parentFolder?: string } | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [isRootExpanded, setIsRootExpanded] = useState<boolean>(true);

  const getFileIcon = (fileName: string, isFolder: boolean, isExpanded: boolean) => {
    if (isFolder) {
      return isExpanded ? (
        <FolderOpen className="w-4 h-4 text-[#04AA6D]" />
      ) : (
        <Folder className="w-4 h-4 text-[#04AA6D]/80" />
      );
    }
    if (fileName.endsWith('.jsx') || fileName.endsWith('.tsx') || fileName.endsWith('.js') || fileName.endsWith('.ts')) {
      return <FileCode className="w-4 h-4 text-[#0d9488]" />;
    }
    if (fileName.endsWith('.py')) {
      return <FileCode className="w-4 h-4 text-[#f59e0b]" />;
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-4 h-4 text-[#f97316]" />;
    }
    if (fileName.endsWith('.html')) {
      return <FileCode className="w-4 h-4 text-[#ef4444]" />;
    }
    if (fileName.endsWith('.css')) {
      return <FileCode className="w-4 h-4 text-[#38bdf8]" />;
    }
    return <FileText className="w-4 h-4 text-[#94a3b8]" />;
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !isCreating) return;

    let targetPath = newItemName.trim();
    if (isCreating.parentFolder) {
      targetPath = `${isCreating.parentFolder}/${targetPath}`;
    }

    onCreateFile(targetPath, isCreating.isFolder, isCreating.parentFolder);
    setNewItemName('');
    setIsCreating(null);
  };

  const handleRenameSubmit = (fileId: string) => {
    if (editName.trim()) {
      onRenameFile(fileId, editName.trim());
    }
    setEditingFileId(null);
  };

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const handleTriggerNewItem = (isFolder: boolean, parent?: string) => {
    if (onRequestNewItem) {
      onRequestNewItem(isFolder, parent);
    } else {
      setIsCreating({ isFolder, parentFolder: parent });
      setNewItemName('');
    }
  };

  return (
    <div
      className={`h-full flex flex-col border-r select-none transition-colors ${
        isDark
          ? 'bg-slate-950 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Top Header - Displays Explorer & Active Opened Folder Name */}
      <div
        className={`flex items-center justify-between px-3 py-2 border-b shrink-0 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <span
          className={`text-[11px] font-bold uppercase tracking-wider truncate max-w-[130px] ${
            isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'
          }`}
          title={`EXPLORER: ${folderName}`}
        >
          EXPLORER: {folderName}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => handleTriggerNewItem(false)}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-[#04AA6D]' : 'hover:bg-slate-100 text-slate-600 hover:text-[#04AA6D]'
            }`}
            title="New File"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleTriggerNewItem(true)}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-[#04AA6D]' : 'hover:bg-slate-100 text-slate-600 hover:text-[#04AA6D]'
            }`}
            title="New Folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenFolderModal}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-[#04AA6D]' : 'hover:bg-slate-100 text-slate-600 hover:text-[#04AA6D]'
            }`}
            title="Open Folder..."
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Root Opened Folder Banner */}
      <div
        onClick={() => setIsRootExpanded(!isRootExpanded)}
        className={`flex items-center justify-between px-2.5 py-1.5 border-b text-xs font-semibold cursor-pointer transition group shrink-0 ${
          isDark
            ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-white'
            : 'bg-slate-100/90 border-slate-200 hover:bg-slate-200/80 text-slate-900'
        }`}
        title={`Opened Folder: ${folderName} (${workspacePath || ''})`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {isRootExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-[#04AA6D] shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-[#04AA6D] shrink-0" />
          )}
          <FolderOpen className="w-4 h-4 text-[#04AA6D] shrink-0" />
          <span
            className={`truncate uppercase font-bold tracking-wider text-[11px] ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            {folderName}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTriggerNewItem(false);
            }}
            className="p-0.5 rounded hover:bg-white/20 text-[#94a3b8] hover:text-[#04AA6D] cursor-pointer"
            title="Create File in this folder"
          >
            <FilePlus className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTriggerNewItem(true);
            }}
            className="p-0.5 rounded hover:bg-white/20 text-[#94a3b8] hover:text-[#04AA6D] cursor-pointer"
            title="Create Subfolder"
          >
            <FolderPlus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Creation Inline Form if active */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="p-2 border-b border-[#334155]/40 shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            {isCreating.isFolder ? (
              <Folder className="w-3.5 h-3.5 text-[#04AA6D]" />
            ) : (
              <FileCode className="w-3.5 h-3.5 text-[#0d9488]" />
            )}
            <input
              autoFocus
              type="text"
              placeholder={isCreating.isFolder ? 'folder_name' : 'filename.ext'}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsCreating(null);
              }}
              className="w-full px-1.5 py-0.5 rounded bg-[#020617] border border-[#04AA6D] text-xs text-white outline-none"
            />
          </div>
        </form>
      )}

      {/* File List Content */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 text-xs">
        {isRootExpanded && (
          <>
            {files.length > 0 ? (
              files.map((file) => {
                const isActive = file.id === activeFileId;
                const isFolder = file.type === 'folder';
                const isExpanded = expandedFolders[file.name] ?? true;

                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      if (isFolder) {
                        toggleFolder(file.name);
                      } else {
                        onSelectFile(file.id);
                      }
                    }}
                    className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition ${
                      isActive
                        ? 'bg-[#04AA6D]/15 text-[#04AA6D] font-medium border-l-2 border-[#04AA6D]'
                        : isDark
                        ? 'hover:bg-slate-800/60 text-slate-300'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {isFolder && (
                        <span className="text-[#94a3b8]">
                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </span>
                      )}
                      {getFileIcon(file.name, isFolder, isExpanded)}

                      {editingFileId === file.id ? (
                        <input
                          autoFocus
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => handleRenameSubmit(file.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameSubmit(file.id);
                            if (e.key === 'Escape') setEditingFileId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="px-1 py-0.5 rounded bg-[#020617] border border-[#04AA6D] text-white text-xs outline-none"
                        />
                      ) : (
                        <span className="truncate">{file.name}</span>
                      )}
                    </div>

                    <div className="hidden group-hover:flex items-center gap-1 opacity-80">
                      {isFolder && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTriggerNewItem(false, file.name);
                          }}
                          className="p-0.5 hover:text-[#04AA6D] transition"
                          title="New file in this folder"
                        >
                          <FilePlus className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFileId(file.id);
                          setEditName(file.name);
                        }}
                        className="p-0.5 hover:text-[#04AA6D] transition"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFile(file.id);
                        }}
                        className="p-0.5 hover:text-[#ef4444] transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-10 px-3 text-center space-y-3">
                <FolderOpen className="w-8 h-8 text-[#04AA6D]/50 mx-auto" />
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Folder <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>'{folderName}'</span> is empty.
                </p>
                <div className="flex flex-col gap-2 max-w-[190px] mx-auto pt-1">
                  <button
                    onClick={() => handleTriggerNewItem(false)}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#04AA6D] hover:bg-[#03985e] text-white text-xs font-semibold transition cursor-pointer shadow-xs active:scale-98 flex items-center justify-center gap-1.5"
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>+ Create File</span>
                  </button>
                  <button
                    onClick={() => handleTriggerNewItem(true)}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium border transition cursor-pointer active:scale-98 flex items-center justify-center gap-1.5 ${
                      isDark
                        ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                        : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
                    }`}
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>+ Create Folder</span>
                  </button>
                  <button
                    onClick={onOpenFolderModal}
                    className="w-full py-1 text-[11px] text-slate-400 hover:text-[#04AA6D] transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <FolderOpen className="w-3 h-3" />
                    <span>Open another folder...</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
