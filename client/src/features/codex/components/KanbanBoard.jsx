import React from 'react';
import { 
  ArrowLeft, ArrowRight, Check, AlertCircle, Clock, 
  MessageSquare, Paperclip, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Avatar } from '@components/common/Avatar.jsx';

export const KanbanBoard = ({ 
  tasks = [], 
  onTaskStatusChange, 
  onTaskClick, 
  members = [] 
}) => {
  const columns = ['todo', 'in_progress', 'completed', 'blocked'];

  const getColumnLabel = (col) => {
    switch (col) {
      case 'todo': return 'To Do';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'blocked': return 'Blocked';
      default: return col;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-650 dark:text-orange-400 border border-orange-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'low': 
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
    }
  };

  const shiftStatus = (task, direction) => {
    const currentIndex = columns.indexOf(task.status);
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = columns.length - 1;
    if (nextIndex >= columns.length) nextIndex = 0;
    
    onTaskStatusChange(task, columns[nextIndex]);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none text-left h-full min-h-[400px]">
      {columns.map((col) => {
        const list = tasks.filter(t => t.status === col);
        
        return (
          <div key={col} className="flex flex-col gap-3 bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl h-full min-h-[350px]">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-850">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                {getColumnLabel(col)}
              </span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-850 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold font-mono">
                {list.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 no-scrollbar pr-0.5">
              {list.length === 0 ? (
                <div className="text-[10px] text-slate-400 dark:text-slate-650 font-mono py-12 text-center border border-dashed border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-slate-950/10">
                  No tasks here
                </div>
              ) : (
                list.map((task) => {
                  const assignee = task.assignedTo || null;
                  const labelList = task.labels || [];
                  const formattedDue = formatDate(task.dueDate);

                  return (
                    <div 
                      key={task._id} 
                      onClick={() => onTaskClick && onTaskClick(task)}
                      className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4.5 hover:border-[#6366f1]/30 dark:hover:border-[#6366f1]/30 transition-all shadow-sm hover:shadow-indigo-500/5 cursor-pointer relative group flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full font-mono ${getPriorityColor(task.priority)}`}>
                          {task.priority || 'medium'}
                        </span>
                        
                        <div className="hidden group-hover:flex items-center gap-1">
                          <button 
                            title="Move status left"
                            onClick={(e) => { e.stopPropagation(); shiftStatus(task, -1); }} 
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                          >
                            <ChevronLeft size={12} />
                          </button>
                          <button 
                            title="Move status right"
                            onClick={(e) => { e.stopPropagation(); shiftStatus(task, 1); }} 
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                          >
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">{task.title}</span>
                        {task.description && (
                          <span className="text-[10px] text-slate-450 dark:text-slate-500 line-clamp-2">{task.description}</span>
                        )}
                      </div>

                      {labelList.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {labelList.map((lbl, idx) => (
                            <span key={idx} className="text-[7.5px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/30 text-[#6366f1] px-1.5 py-0.2 rounded border border-[#6366f1]/10 dark:border-[#6366f1]/20 uppercase">
                              {lbl}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-2.5 mt-1 select-none">
                        <div className="flex items-center gap-2.5 text-slate-400 dark:text-slate-550">
                          {formattedDue && (
                            <div className="flex items-center gap-1 text-[9px] font-mono text-[#6366f1]">
                              <Clock size={10} />
                              <span>{formattedDue}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-[9px] font-mono">
                            <MessageSquare size={10} />
                            <span>{task.commentCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] font-mono">
                            <Paperclip size={10} />
                            <span>{task.attachmentCount || 0}</span>
                          </div>
                        </div>

                        {assignee ? (
                          <Avatar 
                            src={assignee.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${assignee.fullName || 'User'}`} 
                            alt={assignee.fullName} 
                            size="xs" 
                            title={`Assigned to ${assignee.fullName}`}
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-[8px] text-slate-450 dark:text-slate-650 font-mono font-bold" title="Unassigned">
                            U
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
