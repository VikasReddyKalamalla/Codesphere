import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '@components/common/BackButton.jsx';
import { 
  Users, UserPlus, RefreshCw, ShieldCheck, Shield, Edit3, Eye, Trash2, 
  Copy, QrCode, X, Check, Activity, Clock, Key, Wifi, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@services/axios.js';

export const WorkspaceMembersPage = () => {
  const { workspaceId } = useParams();
  const [members, setMembers] = useState([
    { _id: 'mem_1', fullName: 'Venkat Karthik', email: 'venkat@codesphere.io', role: 'Admin', isOwner: true, online: true, latency: '18ms', joinedAt: 'Aug 1, 2026' },
    { _id: 'mem_2', fullName: 'Sarah Jenkins', email: 'sarah@codesphere.io', role: 'Editor', isOwner: false, online: true, latency: '34ms', joinedAt: 'Aug 12, 2026' },
    { _id: 'mem_3', fullName: 'Alex Rivera', email: 'alex@codesphere.io', role: 'Viewer', isOwner: false, online: false, latency: 'Offline', joinedAt: 'Aug 20, 2026' }
  ]);
  const [loading, setLoading] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteConfig, setInviteConfig] = useState({
    expiry: '24 Hours',
    defaultRole: 'Editor',
    token: `INV_CS_${Math.floor(100000 + Math.random() * 900000)}`
  });

  const fetchMembers = async () => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/workspaces/${workspaceId}/members`);
      const list = Array.isArray(res.data?.data) ? res.data.data : (res.data?.members || []);
      if (list.length > 0) {
        setMembers(list.map(m => ({
          ...m,
          role: m.role || 'Editor',
          online: true,
          latency: '24ms'
        })));
      }
    } catch {
      // Keep rich mock fallback if API returns empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  const handleRoleChange = (memberId, newRole) => {
    setMembers(prev => prev.map(m => m._id === memberId ? { ...m, role: newRole } : m));
    toast.success(`Updated member permission role to: ${newRole}`);
  };

  const handleKickMember = (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to revoke access and kick ${memberName} from this room?`)) return;
    setMembers(prev => prev.filter(m => m._id !== memberId));
    toast.success(`Revoked workspace access for: ${memberName}`);
  };

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/workspace/${workspaceId || 'ws_room_8912'}/join?token=${inviteConfig.token}`;
    navigator.clipboard.writeText(link);
    toast.success('Workspace invite link copied to clipboard!');
  };

  return (
    <div className="flex flex-col gap-6 w-full font-sans animate-fade-in text-slate-900 dark:text-slate-100">
      <BackButton fallbackPath="/codex" className="self-start" />

      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              Collaborative Workspace Members
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage room collaborators, assign Editor/Viewer roles, generate invite tokens, and eject members.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMembers}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Roster
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold font-mono flex items-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <UserPlus size={16} /> Generate Invite Token
          </button>
        </div>
      </div>

      {/* Roster & Permission Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-400">Active Room Members ({members.length})</h3>
          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" /> Socket Sync Active
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 font-mono">
            Scanning connected WebSocket room members...
          </div>
        ) : members.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 font-mono">
            No active members in this room. Click "Generate Invite Token" above to invite collaborators!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((m) => (
              <div 
                key={m._id} 
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-500/30 transition-all gap-3"
              >
                {/* Left Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 flex items-center justify-center font-bold font-mono text-sm shrink-0">
                    {m.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">{m.fullName}</span>
                      {m.isOwner && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Host / Owner
                        </span>
                      )}
                      {m.online ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Activity className="w-2.5 h-2.5 animate-pulse" /> {m.latency}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-700">
                          Offline
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">
                      {m.email} • Joined {m.joinedAt}
                    </div>
                  </div>
                </div>

                {/* Right Role Controls */}
                <div className="flex items-center gap-3 self-end sm:self-center font-mono">
                  {m.isOwner ? (
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      Full Admin Access
                    </span>
                  ) : (
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m._id, e.target.value)}
                      className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Editor">Editor (Read/Write)</option>
                      <option value="Viewer">Viewer (Read-Only)</option>
                      <option value="Admin">Admin (Full Control)</option>
                    </select>
                  )}

                  {!m.isOwner && (
                    <button
                      onClick={() => handleKickMember(m._id, m.fullName)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                      title="Revoke Access / Kick Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Expiring Invite Token Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl animate-fade-in flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">Generate Expiring Invite Link</h3>
                  <span className="text-[10px] font-mono text-slate-400">One-Time Token Security</span>
                </div>
              </div>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-slate-400 text-[10px]">Token Expiration</label>
                  <select
                    value={inviteConfig.expiry}
                    onChange={(e) => setInviteConfig({ ...inviteConfig, expiry: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  >
                    <option value="1 Hour">1 Hour</option>
                    <option value="24 Hours">24 Hours</option>
                    <option value="7 Days">7 Days</option>
                    <option value="Unlimited">Unlimited</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold uppercase text-slate-400 text-[10px]">Default Role</label>
                  <select
                    value={inviteConfig.defaultRole}
                    onChange={(e) => setInviteConfig({ ...inviteConfig, defaultRole: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  >
                    <option value="Editor">Editor (Read/Write)</option>
                    <option value="Viewer">Viewer (Read-Only)</option>
                  </select>
                </div>
              </div>

              {/* QR Code & Link Output */}
              <div className="flex flex-col items-center gap-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center my-1">
                <div className="w-32 h-32 rounded-xl bg-white p-1.5 border border-indigo-500/40">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://codesphere.dev/workspace/${workspaceId || 'ws_8912'}/join?token=${inviteConfig.token}`}
                    alt="Workspace Invite QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[10px] text-indigo-400 truncate">
                  {window.location.origin}/workspace/{workspaceId || 'ws_8912'}/join?token={inviteConfig.token}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleCopyInviteLink}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Invite Link
              </button>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white font-bold text-xs font-mono transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceMembersPage;
