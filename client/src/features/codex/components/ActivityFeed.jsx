import React from 'react';
import { 
  FileCode, UserPlus, UserMinus, Plus, Trash2, CheckCircle, 
  Eye, Terminal, GitBranch, Calendar, ListTodo, Activity 
} from 'lucide-react';
import { Avatar } from '@components/common/Avatar.jsx';

export const ActivityFeed = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const cls = "w-4 h-4";
    switch (type) {
      case 'workspace_created':
        return <CheckCircle className={`${cls} text-[#6366f1]`} />;
      case 'member_joined':
        return <UserPlus className={`${cls} text-green-500`} />;
      case 'member_left':
      case 'member_removed':
        return <UserMinus className={`${cls} text-slate-400`} />;
      case 'task_created':
      case 'task_updated':
        return <ListTodo className={`${cls} text-[#6366f1]`} />;
      case 'task_assigned':
        return <Activity className={`${cls} text-[#6366f1]`} />;
      case 'task_completed':
      case 'milestone_completed':
        return <CheckCircle className={`${cls} text-indigo-500`} />;
      case 'code_edited':
        return <FileCode className={`${cls} text-[#6366f1]`} />;
      case 'file_created':
        return <Plus className={`${cls} text-green-500`} />;
      case 'file_deleted':
        return <Trash2 className={`${cls} text-rose-500`} />;
      case 'terminal_used':
        return <Terminal className={`${cls} text-cyan-500`} />;
      case 'preview_opened':
        return <Eye className={`${cls} text-sky-500`} />;
      case 'github_linked':
        return <GitBranch className={`${cls} text-blue-500`} />;
      default:
        return <Activity className={`${cls} text-slate-400`} />;
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl text-left select-none">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <Activity className="w-4 h-4 text-[#6366f1]" />
        <span className="text-xs font-bold text-slate-855 dark:text-white tracking-wide uppercase font-mono">Workspace Activity Timeline</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {activities.length === 0 ? (
          <div className="text-[10px] text-slate-450 dark:text-slate-500 font-mono text-center py-10">
            No activities recorded yet
          </div>
        ) : (
          activities.map((act, idx) => {
            const user = act.userId || {};
            const userName = user.fullName || 'Collaborator';
            const description = act.description || '';

            return (
              <div key={idx} className="flex items-start gap-3 p-2.5 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-855 rounded-xl hover:border-[#6366f1]/10 transition-all">
                <div className="mt-0.5">
                  <Avatar 
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} 
                    alt={userName} 
                    size="xs" 
                  />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-355 font-mono truncate">{userName}</span>
                    <span className="text-[8px] text-slate-400 dark:text-slate-655 font-mono whitespace-nowrap">{formatTime(act.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {getActivityIcon(act.activityType)}
                    <span className="text-xs text-slate-600 dark:text-slate-355 font-sans truncate">{description}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
