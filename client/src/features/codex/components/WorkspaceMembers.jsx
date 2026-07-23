import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, UserMinus, ArrowUp, ArrowDown, Award, Users } from 'lucide-react';
import { Avatar } from '@components/common/Avatar.jsx';

export const WorkspaceMembers = ({ 
  members = [], 
  onlineUsers = [], 
  currentUser = null, 
  onPromote, 
  onDemote, 
  onRemove, 
  onTransferOwnership 
}) => {
  const isOnline = (memberUserId) => {
    return onlineUsers.some(u => u._id === memberUserId || u.id === memberUserId);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <Award size={13} className="text-amber-500" title="Workspace Owner" />;
      case 'admin':
        return <ShieldAlert size={13} className="text-rose-500" title="Admin" />;
      case 'editor':
        return <ShieldCheck size={13} className="text-[#6366f1]" title="Editor" />;
      case 'viewer':
      default:
        return <Shield size={13} className="text-slate-400" title="Viewer" />;
    }
  };

  const myMembership = members.find(m => m.userId?._id === currentUser?._id || m.userId === currentUser?._id);
  const myRole = myMembership?.role || 'viewer';

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl text-left select-none">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <Users className="w-4 h-4 text-[#6366f1]" />
        <span className="text-xs font-bold text-slate-855 dark:text-white tracking-wide uppercase font-mono">Workspace Team ({members.length})</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
        {members.length === 0 ? (
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono text-center py-10">
            No collaborators found
          </div>
        ) : (
          members.map((member) => {
            const memberUser = member.userId || {};
            const isMe = memberUser._id === currentUser?._id;
            const online = isOnline(memberUser._id);
            const userRole = member.role;

            return (
              <div key={member._id} className="flex items-center justify-between gap-3 p-2.5 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-855 rounded-xl hover:border-[#6366f1]/20 transition-all group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <Avatar 
                      src={memberUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${memberUser.fullName || 'User'}`} 
                      alt={memberUser.fullName} 
                      size="sm" 
                    />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                      online ? 'bg-indigo-500 shadow-md shadow-indigo-500/50' : 'bg-slate-350 dark:bg-slate-650'
                    }`} />
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{memberUser.fullName}</span>
                      {getRoleIcon(userRole)}
                      {isMe && <span className="text-[8px] bg-indigo-50 dark:bg-indigo-950/30 text-[#6366f1] font-bold px-1 py-0.2 rounded font-mono select-none">You</span>}
                    </div>
                    <span className="text-[9px] text-slate-450 dark:text-slate-500 font-mono capitalize">
                      {userRole} &bull; {online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>

                {!isMe && (myRole === 'owner' || myRole === 'admin') && (
                  <div className="hidden group-hover:flex items-center gap-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 select-none">
                    {userRole !== 'owner' && (
                      <>
                        {userRole === 'viewer' && onPromote && (
                          <button 
                            title="Promote to Editor"
                            onClick={() => onPromote(memberUser._id, 'editor')} 
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#6366f1] rounded-lg transition-all"
                          >
                            <ArrowUp size={11} />
                          </button>
                        )}
                        {userRole === 'editor' && myRole === 'owner' && onPromote && (
                          <button 
                            title="Promote to Admin"
                            onClick={() => onPromote(memberUser._id, 'admin')} 
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-500 rounded-lg transition-all"
                          >
                            <ArrowUp size={11} />
                          </button>
                        )}
                        {userRole === 'admin' && myRole === 'owner' && onDemote && (
                          <button 
                            title="Demote to Editor"
                            onClick={() => onDemote(memberUser._id, 'editor')} 
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-550 rounded-lg transition-all"
                          >
                            <ArrowDown size={11} />
                          </button>
                        )}
                        {userRole === 'editor' && onDemote && (
                          <button 
                            title="Demote to Viewer"
                            onClick={() => onDemote(memberUser._id, 'viewer')} 
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-555 rounded-lg transition-all"
                          >
                            <ArrowDown size={11} />
                          </button>
                        )}
                        {onRemove && (userRole !== 'admin' || myRole === 'owner') && (
                          <button 
                            title="Remove Member"
                            onClick={() => { if (confirm(`Remove ${memberUser.fullName} from workspace?`)) onRemove(memberUser._id); }} 
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-600 rounded-lg transition-all"
                          >
                            <UserMinus size={11} />
                          </button>
                        )}
                        {myRole === 'owner' && onTransferOwnership && (
                          <button 
                            title="Transfer Ownership"
                            onClick={() => { if (confirm(`Transfer ownership to ${memberUser.fullName}? This will demote you to Admin.`)) onTransferOwnership(memberUser._id); }} 
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 rounded-lg transition-all"
                          >
                            <Award size={11} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
