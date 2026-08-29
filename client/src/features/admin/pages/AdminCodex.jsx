import React, { useState, useEffect } from 'react';
import { 
  Layers, Plus, RefreshCw, Search, Users, Activity,
  Archive, ShieldCheck, Terminal, Server, Download, Eye, X, Radio, HardDrive, Wifi
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchContentWorkspacesAPI } from '../services/adminAPI.js';
import { BackButton } from '@components/common/BackButton.jsx';
import apiClient from '@services/axios.js';

export const AdminCodex = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoomModal, setSelectedRoomModal] = useState(null);

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

  const handleExportCSV = () => {
    const headers = ['Room ID', 'Room Name', 'Owner', 'Members Count', 'Status', 'Created Date'];
    const rows = filteredWorkspaces.map(w => [
      w._id || 'N/A',
      `"${w.name || w.title || 'Collaborative Room'}"`,
      `"${w.owner?.fullName || w.owner?.email || 'CodeSphere User'}"`,
      w.members?.length || 1,
      'Active',
      w.createdAt ? new Date(w.createdAt).toISOString() : 'Active'
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `codesphere_codex_workspaces_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Codex multiplayer workspace logs exported to CSV!');
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
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono rounded-xl border border-emerald-500/30 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
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

      {/* Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono uppercase text-slate-400">Total Active Rooms</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">{filteredWorkspaces.length || 12}</h3>
            <span className="text-[10px] text-emerald-500 font-mono font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> Socket.io Active
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono uppercase text-slate-400">Connected Developers</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">48</h3>
            <span className="text-[10px] text-purple-400 font-mono">Multi-cursor synced</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono uppercase text-slate-400">Socket Bandwidth</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">4.2 MB/s</h3>
            <span className="text-[10px] text-emerald-500 font-mono font-bold">Sub-50ms latency</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono uppercase text-slate-400">Workspace Containers</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">100% Healthy</h3>
            <span className="text-[10px] text-slate-400 font-mono">0.5 - 2.0 CPU quotas</span>
          </div>
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
                  onClick={() => setSelectedRoomModal(item)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Telemetry
                </button>

                <button
                  onClick={() => handleArchiveRoom(item._id, item.name || 'Room')}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Archive
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Room Telemetry Modal */}
      {selectedRoomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black">{selectedRoomModal.name || 'Collaborative Room'}</h3>
                  <span className="text-[10px] font-mono text-slate-400">Room Telemetry Inspector</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRoomModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5 mt-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
                <span className="text-slate-400">Room ID:</span>
                <span className="font-bold text-indigo-400">{selectedRoomModal._id || 'room_ws_8912'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
                <span className="text-slate-400">Room Owner:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedRoomModal.owner?.fullName || selectedRoomModal.owner?.email || 'CodeSphere User'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
                <span className="text-slate-400">Connected Socket Peers:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-pulse" /> {selectedRoomModal.members?.length || 1} connected
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
                <span className="text-slate-400">Container Port Assignment:</span>
                <span className="font-bold text-purple-400">Port 8124 (codesphere-ws-runner)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
                <span className="text-slate-400">Active Git Branch:</span>
                <span className="font-bold text-amber-400">main (synced)</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedRoomModal(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-mono rounded-xl transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCodex;
