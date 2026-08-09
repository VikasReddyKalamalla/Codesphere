import React from 'react';
import { Users, Shield, ShieldCheck, ShieldAlert, UserPlus } from 'lucide-react';
import { sendFriendRequestAPI } from '../../network/services/networkAPI';
import toast from 'react-hot-toast';

export const CommunityMembers = ({ members = [], moderators = [], owner = {}, onPromote, onRemove, currentUserId }) => {
  const isOwner = currentUserId === owner?._id || currentUserId === owner;
  
  const getRole = (memberId) => {
    if (memberId === owner?._id || memberId === owner) return 'Owner';
    if (moderators.some(m => m === memberId || m._id === memberId)) return 'Moderator';
    return 'Member';
  };

  const handleAddFriend = async (userId) => {
    try {
      await sendFriendRequestAPI(userId);
      toast.success('Friend request sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending request');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl text-left select-none flex flex-col gap-4">
      <div className="flex items-center gap-1.5 border-b border-slate-150 dark:border-slate-850 pb-2.5">
        <Users size={12} className="text-indigo-650 dark:text-indigo-400" />
        <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">Teammates & Collaborators</span>
      </div>
      
      <div className="flex flex-col gap-3.5">
        {members.length === 0 ? (
          <div className="text-center py-6 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
            No collaborators found
          </div>
        ) : (
          members.map((item) => {
            const role = getRole(item._id);
            const isSelf = item._id === currentUserId;
            
            return (
              <div key={item._id} className="flex justify-between items-center gap-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-900/60 p-3 rounded-xl hover:border-slate-205 dark:hover:border-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center shrink-0">
                    {item.avatar ? (
                      <img 
                        src={item.avatar} 
                        alt={item.fullName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        {(item.fullName || 'U').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-205">{item.fullName}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {role === 'Owner' && (
                        <>
                          <ShieldAlert size={10} className="text-indigo-600 dark:text-indigo-400" />
                          <span className="text-[8px] font-bold font-mono text-indigo-605 dark:text-indigo-400 uppercase tracking-wide">Owner</span>
                        </>
                      )}
                      {role === 'Moderator' && (
                        <>
                          <ShieldCheck size={10} className="text-emerald-600 dark:text-emerald-400" />
                          <span className="text-[8px] font-bold font-mono text-emerald-650 dark:text-emerald-455 uppercase tracking-wide">Mod</span>
                        </>
                      )}
                      {role === 'Member' && (
                        <>
                          <Users size={10} className="text-slate-400 dark:text-slate-550" />
                          <span className="text-[8px] font-bold font-mono text-slate-500 uppercase tracking-wide">Collaborator</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Moderate buttons & Friend Actions */}
                <div className="flex items-center gap-2">
                  {!isSelf && (
                    <button 
                      onClick={() => handleAddFriend(item._id)}
                      className="p-1.5 text-slate-400 hover:text-[#04AA6D] hover:bg-[#04AA6D]/10 rounded-lg transition-colors"
                      title="Add Friend"
                    >
                      <UserPlus size={14} />
                    </button>
                  )}
                  {isOwner && !isSelf && (
                    <>
                      {role === 'Member' && (
                      <button 
                        onClick={() => onPromote && onPromote(item._id)}
                        className="text-[9px] font-bold font-mono text-indigo-650 dark:text-indigo-400 hover:text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20 px-2 py-1 rounded"
                      >
                        Promote
                      </button>
                    )}
                    {role === 'Moderator' && (
                      <button 
                        onClick={() => onRemove && onRemove(item._id)}
                        className="text-[9px] font-bold font-mono text-red-500 hover:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 px-2 py-1 rounded"
                      >
                        Demote
                      </button>
                    )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default CommunityMembers;
