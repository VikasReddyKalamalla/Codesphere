import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Users, UserPlus, Mail } from 'lucide-react';
import { selectOrganizationData } from '../redux';
import { inviteTeamMemberAPI } from '../services/subscriptionAPI';

export const TeamManagementView = () => {
  const orgData = useSelector(selectOrganizationData);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const members = orgData?.members || [
    { email: 'alex.smith@codesphere.dev', role: 'admin', joinedAt: new Date().toISOString() },
    { email: 'dev.lead@codesphere.dev', role: 'member', joinedAt: new Date().toISOString() },
    { email: 'sarah.c@codesphere.dev', role: 'member', joinedAt: new Date().toISOString() },
  ];

  const totalSeats = orgData?.totalSeats || 5;
  const usedSeats = members.length;

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setLoading(true);
    try {
      await inviteTeamMemberAPI({ email: inviteEmail, role: inviteRole });
      setStatusMsg(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
    } catch (err) {
      setStatusMsg('Failed to invite member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Team & Seat Billing Console
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">Manage team seats, central organization billing, and developer access</p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-[#04AA6D] dark:text-emerald-300">
          Seats Used: {usedSeats} / {totalSeats}
        </div>
      </div>

      {/* Invite Box */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Invite New Team Member</h3>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              placeholder="developer@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
            />
          </div>
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
          >
            <option value="member">Developer Member</option>
            <option value="admin">Team Admin</option>
            <option value="billing_admin">Billing Admin</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Send Invite
          </button>
        </form>
        {statusMsg && <p className="text-xs text-[#04AA6D] dark:text-emerald-300 mt-2">{statusMsg}</p>}
      </div>

      {/* Members List */}
      <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300">
          Assigned Seats ({members.length})
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
          {members.map((m, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 font-bold flex items-center justify-center border border-emerald-500/30">
                  {m.email[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-slate-900 dark:text-white font-semibold">{m.email}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Added on {new Date(m.joinedAt).toLocaleDateString()}</div>
                </div>
              </div>
              <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-slate-200 dark:bg-slate-800 text-[#04AA6D] dark:text-emerald-300 border border-slate-300 dark:border-slate-700 capitalize">
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
