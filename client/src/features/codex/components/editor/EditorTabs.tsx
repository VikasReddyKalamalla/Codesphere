import React from 'react';
import { X, FileCode, FileText, FileJson } from 'lucide-react';
import { WorkspaceFile } from '../../types/codex';
import { RemoteCursor } from '../../services/realtimeSync';

interface EditorTabsProps {
  openFiles: WorkspaceFile[];
  activeFileId: string | null;
  remoteCursors: RemoteCursor[];
  onSelectFile: (fileId: string) => void;
  onCloseFile: (fileId: string) => void;
  isDark: boolean;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({
  openFiles,
  activeFileId,
  remoteCursors,
  onSelectFile,
  onCloseFile,
  isDark,
}) => {
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
      return <FileCode className="w-3.5 h-3.5 text-[#facc15]" />;
    }
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      return <FileCode className="w-3.5 h-3.5 text-[#3b82f6]" />;
    }
    if (fileName.endsWith('.py')) {
      return <FileCode className="w-3.5 h-3.5 text-[#04AA6D]" />;
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-3.5 h-3.5 text-[#eab308]" />;
    }
    return <FileText className="w-3.5 h-3.5 text-[#a1a1aa]" />;
  };

  return (
    <div className="flex-1 flex overflow-x-auto scrollbar-none items-center">
      {openFiles.map((file) => {
        const isActive = file.id === activeFileId;
        const fileCollaborators = remoteCursors.filter(
          (c) =>
            c.filePath === file.name ||
            c.filePath === file.path ||
            c.filePath?.endsWith(file.name)
        );

        return (
          <div
            key={file.id}
            onClick={() => onSelectFile(file.id)}
            className={`group flex items-center gap-2 px-3 py-2 border-r text-xs font-mono cursor-pointer transition select-none shrink-0 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            } ${
              isActive
                ? isDark
                  ? 'bg-slate-950 text-white font-medium border-t-2 border-t-[#04AA6D]'
                  : 'bg-white text-slate-900 font-medium border-t-2 border-t-[#04AA6D]'
                : isDark
                ? 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                : 'bg-slate-100 text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            {getFileIcon(file.name)}
            <span>{file.name}</span>

            {fileCollaborators.length > 0 && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: fileCollaborators[0].userColor }}
                title={`${fileCollaborators.map((c) => c.userName).join(', ')} active`}
              />
            )}

            {file.isModified ? (
              <span className="w-1.5 h-1.5 rounded-full bg-[#04AA6D]" />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseFile(file.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/20 dark:hover:bg-white/20 transition cursor-pointer"
                title="Close tab"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
