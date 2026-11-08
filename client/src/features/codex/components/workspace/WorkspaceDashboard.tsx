import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  FolderKanban,
  Download,
  Upload,
  Copy,
  Trash2,
  ExternalLink,
  Edit2,
  Check,
  Folder,
} from 'lucide-react';
import { WorkspaceFile } from '../../types/codex';
import {
  getSavedWorkspaces,
  saveWorkspaceMetadata,
  deleteWorkspaceMetadata,
  exportWorkspaceZip,
  importWorkspaceZip,
  WorkspaceMetadata,
} from '../../services/workspacePersistence';

interface WorkspaceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentWorkspaceName: string;
  files: WorkspaceFile[];
  onSwitchWorkspace: (name: string, files?: WorkspaceFile[]) => void;
  onImportFiles: (files: WorkspaceFile[]) => void;
  isDark?: boolean;
}

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({
  isOpen,
  onClose,
  currentWorkspaceName,
  files,
  onSwitchWorkspace,
  onImportFiles,
  isDark = true,
}) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceMetadata[]>(() => getSavedWorkspaces());
  const [newWsName, setNewWsName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!newWsName.trim()) return;
    const newWs: WorkspaceMetadata = {
      id: `ws_${Date.now()}`,
      name: newWsName.trim(),
      updatedAt: new Date().toLocaleDateString(),
      fileCount: 0,
    };
    saveWorkspaceMetadata(newWs);
    setWorkspaces(getSavedWorkspaces());
    setNewWsName('');
    setIsCreating(false);
    onSwitchWorkspace(newWs.name, []);
    onClose();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete workspace "${name}"?`)) {
      deleteWorkspaceMetadata(id);
      setWorkspaces(getSavedWorkspaces());
    }
  };

  const handleDuplicate = (ws: WorkspaceMetadata) => {
    const dupName = `${ws.name} (Copy)`;
    const dupWs: WorkspaceMetadata = {
      id: `ws_${Date.now()}`,
      name: dupName,
      updatedAt: new Date().toLocaleDateString(),
      fileCount: files.length,
    };
    saveWorkspaceMetadata(dupWs);
    setWorkspaces(getSavedWorkspaces());
  };

  const handleStartRename = (ws: WorkspaceMetadata) => {
    setEditingId(ws.id);
    setEditName(ws.name);
  };

  const handleSaveRename = (ws: WorkspaceMetadata) => {
    if (!editName.trim()) return;
    const updated = { ...ws, name: editName.trim() };
    saveWorkspaceMetadata(updated);
    setWorkspaces(getSavedWorkspaces());
    setEditingId(null);
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importWorkspaceZip(file);
      if (imported.length > 0) {
        onImportFiles(imported);
        const wsName = file.name.replace(/\.zip$/i, '');
        const newWs: WorkspaceMetadata = {
          id: `ws_${Date.now()}`,
          name: wsName,
          updatedAt: new Date().toLocaleDateString(),
          fileCount: imported.length,
        };
        saveWorkspaceMetadata(newWs);
        setWorkspaces(getSavedWorkspaces());
        onSwitchWorkspace(wsName, imported);
        onClose();
      }
    } catch (err) {
      alert('Failed to import ZIP archive. Please ensure it is a valid zip file.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-2xl border rounded-xl shadow-2xl overflow-hidden font-sans flex flex-col max-h-[85vh] ${
        isDark ? 'bg-[#181824] border-[#2b2b3b] text-[#cccccc]' : 'bg-white border-[#e2e8f0] text-slate-800'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-[#2b2b3b] bg-[#12121a]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <FolderKanban className="w-5 h-5 text-[#04AA6D]" />
            <div>
              <h2 className={`text-sm font-semibold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>Workspace Dashboard</h2>
              <p className={`text-[11px] ${isDark ? 'text-[#858595]' : 'text-slate-500'}`}>Manage, switch, import, and export cloud workspaces</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors ${isDark ? 'text-[#858595] hover:text-white hover:bg-[#2b2b3b]' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-200'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className={`flex items-center justify-between px-6 py-3 border-b ${
          isDark ? 'bg-[#151520] border-[#2b2b3b]' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#04AA6D] hover:bg-[#03945e] text-white rounded text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Workspace
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportWorkspaceZip(currentWorkspaceName, files)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-medium transition-colors cursor-pointer ${
                isDark ? 'bg-[#20202e] hover:bg-[#2a2a3e] border-[#35354a] text-white' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-[#04AA6D]" />
              Export ZIP
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-medium transition-colors cursor-pointer ${
                isDark ? 'bg-[#20202e] hover:bg-[#2a2a3e] border-[#35354a] text-white' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-[#00f2fe]" />
              Import ZIP
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".zip"
              className="hidden"
            />
          </div>
        </div>

        {/* Create Input Box */}
        {isCreating && (
          <div className={`p-4 border-b flex items-center gap-2 ${
            isDark ? 'bg-[#1b1b28] border-[#2b2b3b]' : 'bg-slate-100 border-slate-200'
          }`}>
            <input
              type="text"
              autoFocus
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
              placeholder="e.g. NextJS Fullstack API"
              className={`flex-1 rounded px-3 py-1.5 text-xs outline-none border focus:border-[#04AA6D] ${
                isDark ? 'bg-[#12121a] border-[#2b2b3b] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
                if (e.key === 'Escape') setIsCreating(false);
              }}
            />
            <button
              onClick={handleCreate}
              className="px-3 py-1.5 bg-[#04AA6D] hover:bg-[#03945e] text-white text-xs font-medium rounded transition-colors cursor-pointer"
            >
              Create
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className={`px-3 py-1.5 rounded transition-colors text-xs cursor-pointer ${
                isDark ? 'bg-[#252535] hover:bg-[#303045] text-[#858595]' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Workspace List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
          {workspaces.map((ws) => {
            const isActive = ws.name.toLowerCase() === currentWorkspaceName.toLowerCase();
            const isEditing = editingId === ws.id;

            return (
              <div
                key={ws.id}
                className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-[#04AA6D]/10 border-[#04AA6D]/40 shadow-sm'
                    : isDark
                    ? 'bg-[#1a1a26] border-[#2b2b3b] hover:border-[#3d3d52]'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-[#04AA6D]/20 text-[#04AA6D]' : isDark ? 'bg-[#252535] text-[#858595]' : 'bg-slate-100 text-slate-600'}`}>
                    <Folder className="w-4 h-4" />
                  </div>
                  <div>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`rounded px-2 py-0.5 text-xs outline-none border border-[#04AA6D] ${
                            isDark ? 'bg-[#12121a] text-white' : 'bg-white text-slate-900'
                          }`}
                        />
                        <button
                          onClick={() => handleSaveRename(ws)}
                          className="p-1 text-[#04AA6D] hover:bg-[#04AA6D]/20 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{ws.name}</span>
                        {isActive && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#04AA6D]/20 text-[#04AA6D] rounded font-mono font-medium">
                            Active
                          </span>
                        )}
                      </div>
                    )}
                    <div className={`text-[11px] mt-0.5 ${isDark ? 'text-[#707085]' : 'text-slate-400'}`}>
                      Last modified: {ws.updatedAt}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  {!isActive && (
                    <button
                      onClick={() => {
                        onSwitchWorkspace(ws.name);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-[#2b2b3c] hover:bg-[#38384e] text-white text-[11px] font-medium rounded transition-colors"
                    >
                      Switch
                    </button>
                  )}

                  <button
                    onClick={() => handleDuplicate(ws)}
                    title="Duplicate workspace"
                    className="p-1.5 text-[#858595] hover:text-white hover:bg-[#252535] rounded transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleStartRename(ws)}
                    title="Rename workspace"
                    className="p-1.5 text-[#858595] hover:text-white hover:bg-[#252535] rounded transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {workspaces.length > 1 && (
                    <button
                      onClick={() => handleDelete(ws.id, ws.name)}
                      title="Delete workspace"
                      className="p-1.5 text-[#858595] hover:text-[#ff5555] hover:bg-[#ff5555]/10 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
