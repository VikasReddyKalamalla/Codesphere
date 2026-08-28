import React, { useState, useEffect } from 'react';
import { 
  Layers, Plus, RefreshCw, Search, Users, Activity,
  Archive, ShieldCheck, Terminal, Server
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchContentWorkspacesAPI } from '../services/adminAPI.js';
import { BackButton } from '@components/common/BackButton.jsx';
import apiClient from '@services/axios.js';

export const AdminCodex = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchContentWorkspacesAPI();
      const list = Array.isArray(data) ? data : (data?.workspaces || data?.items || []);
      setWorkspaces(list);
    } catch (err) {
      toast.error('Failed to load multiplayer workspaces: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleArchiveRoom = async (id, name) => {
    if (!window.confirm(`Are you sure you want to archive room: ${name}?`)) return;
    const loader = toast.loading('Archiving collaborative workspace...');
    try {
      await apiClient.delete(`/workspaces/${id}`);
      toast.success('Workspace room archived successfully', { id: loader });
      loadData();
    } catch (err) {
      toast.error('Archival failed: ' + (err.message || 'Error'), { id: loader });
    }
  };

  const filteredWorkspaces = workspaces.filter(w => 
    (w.name || w.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (w.owner?.fullName || w.owner?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/admin" className="self-start" />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Multiplayer Codex Workspaces</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Monitor active collaborative rooms, WebSocket state relays, and repository bindings.
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
            Refresh Rooms
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search workspace room by name or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Active Rooms: <span className="font-extrabold text-slate-900 dark:text-white">{filteredWorkspaces.length}</span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
          <span className="text-xs text-slate-400 font-mono">Scanning live WebSocket rooms...</span>
        </div>
      ) : filteredWorkspaces.length === 0 ? (
        <div className="py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-6">
          <Layers className="w-10 h-10 text-slate-400 mb-2" />
          <p className="text-sm font-bold">No Active Rooms Found</p>
          <p className="text-xs text-slate-500 mt-1">Users will see collaborative rooms here when created.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredWorkspaces.map((item, idx) => (
            <div 
              key={item._id || idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors flex justify-between items-center shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{item.name || item.title || 'Collaborative Room'}</h4>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-500/30 flex items-center gap-1">
                    <Activity className="w-2.5 h-2.5 animate-pulse" />
                    WS Socket Active
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                  <span>Owner: {item.owner?.fullName || item.owner?.email || 'CodeSphere User'}</span>
                  <span>• Members: {item.members?.length || 1} active</span>
                  <span>• Created: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleArchiveRoom(item._id, item.name || 'Room')}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Archive
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCodex;
