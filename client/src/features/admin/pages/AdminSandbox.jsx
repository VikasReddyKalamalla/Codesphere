import React, { useState, useEffect } from 'react';
import { 
  Code2, Plus, RefreshCw, Search, CheckCircle2, ShieldAlert,
  Play, Cpu, Layers, Trash2, Edit3, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchContentSandboxAPI } from '../services/adminAPI.js';
import { BackButton } from '@components/common/BackButton.jsx';
import apiClient from '@services/axios.js';

export const AdminSandbox = () => {
  const [sandboxes, setSandboxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newLanguage, setNewLanguage] = useState('javascript');
  const [newDifficulty, setNewDifficulty] = useState('Intermediate');
  const [newTemplate, setNewTemplate] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchContentSandboxAPI();
      const list = Array.isArray(data) ? data : (data?.sandboxProjects || data?.items || []);
      setSandboxes(list);
    } catch (err) {
      toast.error('Failed to load sandbox projects: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSandbox = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Title is required');
      return;
    }

    const loader = toast.loading('Creating sandbox project template...');
    try {
      await apiClient.post('/sandbox/projects', {
        title: newTitle,
        language: newLanguage,
        difficulty: newDifficulty,
        templateCode: newTemplate || '// Write initial starter code here\n',
        isTemplate: true
      });
      toast.success('Sandbox project template created!', { id: loader });
      setShowCreateModal(false);
      setNewTitle('');
      setNewTemplate('');
      loadData();
    } catch (err) {
      toast.error('Failed to create template: ' + (err.message || 'Error'), { id: loader });
    }
  };

  const filteredSandboxes = sandboxes.filter(s => 
    (s.title || s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.language || s.template || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/admin" className="self-start" />

      {/* Top Banner Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Compiler Sandbox Templates</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage dockerized sandbox runtime configurations, language starter templates, and test boundaries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            New Template
          </button>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search sandbox templates by title or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Total Templates: <span className="font-extrabold text-slate-900 dark:text-white">{filteredSandboxes.length}</span>
        </div>
      </div>

      {/* Templates Grid / Table */}
      {loading ? (
        <div className="py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
          <span className="text-xs text-slate-400 font-mono">Loading compiler sandboxes...</span>
        </div>
      ) : filteredSandboxes.length === 0 ? (
        <div className="py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-6">
          <ShieldAlert className="w-10 h-10 text-slate-400 mb-2" />
          <p className="text-sm font-bold">No Sandbox Templates Found</p>
          <p className="text-xs text-slate-500 mt-1">Create a new sandbox template to provide starter code for students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSandboxes.map((item, idx) => (
            <div 
              key={item._id || idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                    {item.language || item.difficulty || 'JavaScript'}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-400 font-mono">
                    {item.enrolled ? `${item.enrolled}` : item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                  {item.title || item.name || 'Sandbox Project'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {item.description || item.template || 'Multi-language execution sandbox template with automated hidden test runner.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Play className="w-3 h-3 text-emerald-500" /> Max 5s execution
                </span>

                <button 
                  onClick={() => toast.success(`Inspecting template: ${item.title || item.name}`)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold font-mono transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating New Template */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Create Sandbox Template</h3>
            <form onSubmit={handleCreateSandbox} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Project Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Build a REST API with Express"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500">Language</label>
                  <select 
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1"
                  >
                    <option value="javascript">JavaScript (Node.js)</option>
                    <option value="python">Python 3</option>
                    <option value="java">Java 17</option>
                    <option value="cpp">C++ 20</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Difficulty</label>
                  <select 
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">Starter Code Template</label>
                <textarea 
                  rows={4}
                  placeholder="// Starter code..."
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSandbox;
