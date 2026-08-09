import React, { useState } from 'react';
import { 
  X, Copy, Check, UserPlus, Mail, Shield, 
  Sparkles, Link2, Lock, Globe, CheckCircle2, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { inviteWorkspaceMemberAPI } from '../services/codexAPI.js';

export const InviteModal = ({ isOpen, onClose, workspace, workspaceId }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);

  if (!isOpen) return null;

  const directLink = `${window.location.origin}/codex/${workspaceId || workspace?._id || ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directLink);
    setCopied(true);
    toast.success('Workspace invite link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await inviteWorkspaceMemberAPI(workspaceId, { email: email.trim(), role });
      if (res.success) {
        toast.success(`Invitation sent to ${email.trim()}!`);
        setPendingInvites(prev => [...prev, { email: email.trim(), role, invitedAt: new Date().toLocaleTimeString() }]);
        setEmail('');
      } else {
        toast.error(res.message || 'Failed to send invite');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error sending invite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-left flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#04AA6D]/10 text-[#04AA6D] rounded-xl border border-emerald-500/20">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                Invite Collaborators
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                {workspace?.name || 'Workspace'} • Shared Coding Space
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh] font-sans">
          
          {/* Section 1: Direct Link Sharing */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Link2 size={13} className="text-[#04AA6D]" />
                Direct Invite Link
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                <Globe size={9} /> {workspace?.visibility === 'public' ? 'Public Access' : 'Invite Only'}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded-xl">
              <input
                type="text"
                readOnly
                value={directLink}
                className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-slate-600 dark:text-slate-300 px-2 select-all truncate"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#04AA6D] hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10 active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={13} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed font-sans">
              Anyone with this link can join this active workspace session instantly.
            </p>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800/80" />

          {/* Section 2: Invite by Email */}
          <form onSubmit={handleSendInvite} className="space-y-3">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Mail size={13} className="text-[#04AA6D]" />
              Invite via Email
            </span>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collaborator@codesphere.com"
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-200 focus:border-[#04AA6D] font-sans"
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl outline-none cursor-pointer"
              >
                <option value="editor">Editor (Can edit code)</option>
                <option value="viewer">Viewer (Read-only)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#04AA6D] hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-mono font-bold rounded-xl shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <span>Sending Invitation...</span>
              ) : (
                <>
                  <UserPlus size={14} />
                  <span>Send Workspace Invite</span>
                </>
              )}
            </button>
          </form>

          {/* Section 3: Pending Invitations List */}
          {pendingInvites.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                <Clock size={11} /> Sent Invitations
              </span>

              <div className="space-y-1.5">
                {pendingInvites.map((inv, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-slate-400" />
                      <span className="font-bold text-slate-700 dark:text-slate-200">{inv.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                        {inv.role}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">{inv.invitedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold rounded-lg cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default InviteModal;
