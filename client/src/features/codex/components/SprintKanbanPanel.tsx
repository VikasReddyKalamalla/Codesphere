import React, { useState, useEffect } from 'react';
import {
  Kanban,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  FileCode,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Filter,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { WorkspaceFile } from '../types/codex';
import { realtimeSync } from '../services/realtimeSync';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ColumnId = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  priority: Priority;
  assignee: {
    name: string;
    avatar: string;
    color: string;
  };
  points: number;
  linkedFile?: string;
}

interface SprintKanbanPanelProps {
  isDark: boolean;
  files: WorkspaceFile[];
  onOpenFile: (fileId: string) => void;
}

export const SprintKanbanPanel: React.FC<SprintKanbanPanelProps> = ({
  isDark,
  files,
  onOpenFile,
}) => {
  const [tasks, setTasks] = useState<KanbanTask[]>(() => {
    try {
      const saved = localStorage.getItem('codesphere_kanban_tasks');
      if (saved) {
        const parsed: KanbanTask[] = JSON.parse(saved);
        // Sanitize any legacy mock personas
        return parsed.map((t) => {
          if (t.assignee?.name === 'Sarah Chen' || t.assignee?.name === 'Elena Rostova') {
            return {
              ...t,
              assignee: { name: 'Core Team', avatar: 'CT', color: '#3b82f6' },
            };
          }
          return t;
        });
      }
    } catch {}

    return [
      {
        id: 'task-1',
        title: 'Optimize Monaco Editor Multi-Cursor Sync',
        description: 'Reduce WebRTC broadcast latency for simultaneous typing under 50ms.',
        columnId: 'in_progress',
        priority: 'high',
        assignee: { name: 'Vikas Reddy', avatar: 'VR', color: '#04AA6D' },
        points: 5,
        linkedFile: 'src/components/EditorArea.tsx',
      },
      {
        id: 'task-2',
        title: 'Google Meet Integration & Live Speaker Detection',
        description: 'Verify Web Audio API mic energy analysis and live speaking status pulses.',
        columnId: 'done',
        priority: 'urgent',
        assignee: { name: 'Core Team', avatar: 'CT', color: '#3b82f6' },
        points: 8,
        linkedFile: 'src/components/VoiceChannelPanel.tsx',
      },
      {
        id: 'task-3',
        title: 'Integrated Shell & Code Execution Workers',
        description: 'Support Node.js REPL mode and Pyodide Web Worker execution.',
        columnId: 'done',
        priority: 'medium',
        assignee: { name: 'Core Team', avatar: 'CT', color: '#8b5cf6' },
        points: 3,
        linkedFile: 'src/services/codeRunner.ts',
      },
      {
        id: 'task-4',
        title: 'Integrated REST API Tester Suite',
        description: 'Provide header builder, query params, JSON body formatting, and cURL export.',
        columnId: 'done',
        priority: 'high',
        assignee: { name: 'Vikas Reddy', avatar: 'VR', color: '#04AA6D' },
        points: 5,
        linkedFile: 'src/components/ApiTesterPanel.tsx',
      },
      {
        id: 'task-5',
        title: 'Gemini 2.5 Flash Neural Assistant',
        description: 'Integrate multi-turn code reasoning, test generation, and algorithmic review.',
        columnId: 'in_progress',
        priority: 'urgent',
        assignee: { name: 'Core Team', avatar: 'CT', color: '#00f2fe' },
        points: 8,
        linkedFile: 'src/services/geminiService.ts',
      },
    ];
  });

  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCol, setNewCol] = useState<ColumnId>('todo');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newPoints, setNewPoints] = useState(3);
  const [newLinkedFile, setNewLinkedFile] = useState('');

  // Real-time synchronization of Kanban tasks across team mesh
  useEffect(() => {
    const unsub = realtimeSync.subscribe((payload) => {
      if (payload.type === 'KANBAN_UPDATE' && (payload.data as any)?.tasks) {
        setTasks((payload.data as any).tasks);
      }
    });
    return () => unsub();
  }, []);

  // Persist tasks and broadcast changes to teammates
  const updateTasksAndBroadcast = (updater: (prev: KanbanTask[]) => KanbanTask[]) => {
    setTasks((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('codesphere_kanban_tasks', JSON.stringify(next));
      } catch {}
      realtimeSync.broadcast('KANBAN_UPDATE', { tasks: next });
      return next;
    });
  };

  const columns: { id: ColumnId; title: string; color: string }[] = [
    { id: 'backlog', title: 'Backlog', color: '#71717a' },
    { id: 'todo', title: 'To Do', color: '#3b82f6' },
    { id: 'in_progress', title: 'In Progress', color: '#f59e0b' },
    { id: 'review', title: 'In Review', color: '#8b5cf6' },
    { id: 'done', title: 'Done', color: '#04AA6D' },
  ];

  const moveTask = (taskId: string, direction: 'prev' | 'next') => {
    const colOrder: ColumnId[] = ['backlog', 'todo', 'in_progress', 'review', 'done'];
    updateTasksAndBroadcast((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentIdx = colOrder.indexOf(t.columnId);
        const nextIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
        if (nextIdx < 0 || nextIdx >= colOrder.length) return t;
        return { ...t, columnId: colOrder[nextIdx] };
      })
    );
  };

  const deleteTask = (taskId: string) => {
    updateTasksAndBroadcast((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const task: KanbanTask = {
      id: `task_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      columnId: newCol,
      priority: newPriority,
      assignee: { name: 'Vikas Reddy', avatar: 'VR', color: '#04AA6D' },
      points: Number(newPoints) || 1,
      linkedFile: newLinkedFile.trim() || undefined,
    };

    updateTasksAndBroadcast((prev) => [task, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setNewLinkedFile('');
    setIsNewTaskOpen(false);
  };

  const handleLinkClick = (filePath: string) => {
    const target = files.find(
      (f) => f.path.toLowerCase() === filePath.toLowerCase() || f.name.toLowerCase() === filePath.toLowerCase()
    );
    if (target) {
      onOpenFile(target.id);
    }
  };

  const priorityStyles: Record<Priority, { label: string; badge: string }> = {
    low: { label: 'Low', badge: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
    medium: { label: 'Medium', badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    high: { label: 'High', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    urgent: { label: 'Urgent', badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignee.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);
  const donePoints = tasks
    .filter((t) => t.columnId === 'done')
    .reduce((sum, t) => sum + t.points, 0);
  const progressPercent = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

  return (
    <div
      className={`h-full flex flex-col text-xs select-none overflow-hidden ${
        isDark ? 'bg-slate-950 text-slate-200' : 'bg-white text-slate-800'
      }`}
    >
      {/* Top Sprint Bar */}
      <div className={`p-3 border-b flex flex-col gap-2 shrink-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Kanban className="w-4 h-4 text-[#04AA6D]" />
            <span className={`font-semibold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Sprint 14: Cloud Workspace Suite</span>
          </div>

          <button
            onClick={() => setIsNewTaskOpen(true)}
            className="px-2.5 py-1 rounded bg-[#04AA6D] hover:bg-[#059669] text-white font-medium flex items-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>

        {/* Progress Bar & Story Points */}
        <div className="space-y-1">
          <div className={`flex items-center justify-between text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span>Sprint Burndown Progress</span>
            <span className="text-[#04AA6D] font-bold">
              {donePoints} / {totalPoints} Points ({progressPercent}%)
            </span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-[#04AA6D] to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Filter tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 px-2.5 py-1 rounded border text-xs outline-none focus:border-[#04AA6D] ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-[#04AA6D]'
            }`}
          />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className={`px-2 py-1 rounded border text-[11px] outline-none focus:border-[#04AA6D] cursor-pointer ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-300'
                : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* New Task Modal Form */}
      {isNewTaskOpen && (
        <div className={`p-3 border-b space-y-2 shrink-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className={`flex items-center justify-between font-semibold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span>Create Sprint Task</span>
            <button
              onClick={() => setIsNewTaskOpen(false)}
              className={`${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleCreateTask} className="space-y-2">
            <input
              type="text"
              placeholder="Task summary / title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded border text-xs outline-none focus:border-[#04AA6D] ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
              autoFocus
            />
            <textarea
              placeholder="Details / acceptance criteria"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded border text-xs outline-none focus:border-[#04AA6D] resize-none h-14 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
            <div className="grid grid-cols-3 gap-2">
              <select
                value={newCol}
                onChange={(e) => setNewCol(e.target.value as ColumnId)}
                className={`px-2 py-1 rounded border text-xs cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>

              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Priority)}
                className={`px-2 py-1 rounded border text-xs cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              <input
                type="number"
                min="1"
                max="21"
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                placeholder="Story pts"
                className={`px-2 py-1 rounded border text-xs font-mono ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsNewTaskOpen(false)}
                className={`px-3 py-1 rounded text-xs ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-[#04AA6D] hover:bg-[#059669] text-xs text-white font-medium"
              >
                Add Card
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Columns (Horizontal Scrollable) */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 flex gap-3">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.columnId === col.id);
          const colPoints = colTasks.reduce((acc, cur) => acc + cur.points, 0);

          return (
            <div
              key={col.id}
              className={`w-64 shrink-0 flex flex-col rounded-lg border overflow-hidden ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              {/* Column Header */}
              <div className={`p-2.5 border-b flex items-center justify-between ${
                isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <span className={`font-semibold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{col.title}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {colTasks.length}
                  </span>
                </div>
                <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{colPoints} pts</span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-md transition flex flex-col gap-2 group shadow-xs border ${
                      isDark
                        ? 'bg-slate-950/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Header: Priority & Story Points */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                          priorityStyles[task.priority].badge
                        }`}
                      >
                        {priorityStyles[task.priority].label}
                      </span>
                      <span className={`text-[10px] font-mono ${isDark ? 'text-[#a1a1aa]' : 'text-slate-500'}`}>
                        {task.points} SP
                      </span>
                    </div>

                    {/* Task Title & Description */}
                    <div>
                      <h4 className={`text-xs font-medium leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isDark ? 'text-[#a1a1aa]' : 'text-slate-600'}`}>
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Linked File Jump */}
                    {task.linkedFile && (
                      <button
                        onClick={() => handleLinkClick(task.linkedFile!)}
                        className="self-start flex items-center gap-1 text-[10px] font-mono text-[#04AA6D] hover:underline"
                        title="Open file in editor"
                      >
                        <FileCode className="w-3 h-3" />
                        <span className="truncate max-w-[170px]">{task.linkedFile}</span>
                      </button>
                    )}

                    {/* Card Footer: Assignee & Column Mover */}
                    <div className={`flex items-center justify-between pt-1 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] text-white"
                          style={{ backgroundColor: task.assignee.color }}
                        >
                          {task.assignee.avatar}
                        </div>
                        <span className={`text-[10px] truncate max-w-[80px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {task.assignee.name.split(' ')[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {col.id !== 'backlog' && (
                          <button
                            onClick={() => moveTask(task.id, 'prev')}
                            className={`p-1 rounded transition cursor-pointer ${
                              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                            }`}
                            title="Move left"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {col.id !== 'done' && (
                          <button
                            onClick={() => moveTask(task.id, 'next')}
                            className={`p-1 rounded transition cursor-pointer ${
                              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                            }`}
                            title="Move right"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                          title="Delete card"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className={`h-28 flex flex-col items-center justify-center text-[11px] border border-dashed rounded ${
                    isDark ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-400'
                  }`}>
                    <span>No tasks</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
