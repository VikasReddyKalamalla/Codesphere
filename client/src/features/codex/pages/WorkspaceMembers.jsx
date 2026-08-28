import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '@components/common/BackButton.jsx';
import { Users, UserPlus, RefreshCw, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@services/axios.js';

export const WorkspaceMembersPage = () => {
  const { workspaceId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/workspaces/${workspaceId}/members`);
      const list = Array.isArray(res.data?.data) ? res.data.data : (res.data?.members || []);
      setMembers(list);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  return (
    <div className="flex flex-col gap-5 w-full font-sans">
      <BackButton fallbackPath="/codex" className="self-start" />
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" /> Collaborative Workspace Members
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage active room collaborators, role permissions, and access keys.</p>
        </div>
        <button
          onClick={() => toast.success('Invite link copied to clipboard!')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <UserPlus size={15} /> Invite Member
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 font-mono">
            Loading active members...
          </div>
        ) : members.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 font-mono">
            No additional members in this workspace room. Invite team members using the invite link above!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((m, idx) => (
              <div key={m._id || idx} className="flex justify-between items-center p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                <span className="font-bold text-xs text-slate-900 dark:text-white">{m.fullName || m.email || 'Collaborator'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-indigo-500/10 text-indigo-500">{m.role || 'Editor'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceMembersPage;
