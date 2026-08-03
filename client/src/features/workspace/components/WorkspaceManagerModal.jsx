import React, { useState, useEffect } from 'react';
import { X, Plus, HardDrive, Cpu, FolderGit2, Trash2, ExternalLink, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import { cloudWorkspaceAPI } from '../services/cloudWorkspaceAPI';
import toast from 'react-hot-toast';

export const WorkspaceManagerModal = ({ isOpen, onClose, currentWorkspaceId, onSelectWorkspace }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLang, setNewLang] = useState('javascript');
  const [newPlan, setNewPlan] = useState('free');

  useEffect(() => {
    if (isOpen) {
      fetchWorkspaces();
    }
  }, [isOpen]);

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const res = await cloudWorkspaceAPI.getStudentWorkspaces();
      if (res.success && res.data) {
        setWorkspaces(res.data);
      }
    } catch (err) {
      console.error('Failed to load workspaces:', err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const res = await cloudWorkspaceAPI.createWorkspace({
        title: newTitle.trim(),
        language: newLang,
        plan: newPlan
      });

      if (res.success && res.data) {
        toast.success('Workspace created successfully!');
        setNewTitle('');
        fetchWorkspaces();
        if (res.data.workspace?._id) {
          onSelectWorkspace(res.data.workspace._id);
          onClose();
        }
      }
    } catch (err) {
      toast.error('Failed to create workspace');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await cloudWorkspaceAPI.deleteWorkspace(id, true);
      toast.success('Workspace deleted');
      fetchWorkspaces();
    } catch (err) {
      toast.error('Failed to delete workspace');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">My Cloud Workspaces</h3>
              <p className="text-xs text-slate-400">Manage, switch, or launch isolated student projects</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          {/* Create New Workspace Form */}
          <form onSubmit={handleCreate} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs uppercase font-semibold text-indigo-400 tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Create New Workspace
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Workspace Title (e.g. Java Arrays Lab)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 col-span-1 md:col-span-1"
                required
              />
              <select
                value={newLang}
                onChange={(e) => setNewLang(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="javascript">JavaScript / Node.js</option>
                <option value="python">Python 3</option>
                <option value="java">Java (OpenJDK 17)</option>
                <option value="cpp">C++ (GCC/clangd)</option>
                <option value="go">Go (gopls)</option>
                <option value="rust">Rust</option>
              </select>
              <select
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="free">Free Tier (1 CPU / 1GB RAM)</option>
                <option value="premium">Premium Tier (2 CPU / 4GB RAM)</option>
                <option value="enterprise">Enterprise Tier (8 CPU / 16GB RAM)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs rounded-lg transition-all shadow-md shadow-indigo-600/20"
            >
              {creating ? 'Spinning Up Environment...' : '+ Launch Workspace'}
            </button>
          </form>

          {/* Existing Workspaces List */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-3">Your Saved Workspaces</h4>
            {loading ? (
              <div className="text-center py-6 text-xs text-slate-500">Loading workspaces...</div>
            ) : workspaces.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No active workspaces found. Create one above to get started!
              </div>
            ) : (
              <div className="space-y-2.5">
                {workspaces.map((ws) => {
                  const isActive = ws._id === currentWorkspaceId;
                  return (
                    <div
                      key={ws._id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase">
                          {ws.language?.substring(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{ws.title}</span>
                            {isActive && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1 font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                            <span>Language: {ws.language}</span>
                            <span>•</span>
                            <span className="uppercase text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                              {ws.plan} Tier
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onSelectWorkspace(ws._id);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                        >
                          Open IDE
                        </button>
                        <button
                          onClick={() => handleDelete(ws._id, ws.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Delete Workspace"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
