import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertCircle, Plus, Trash2, Calendar, 
  User, Tag, AlignLeft, Paperclip, MessageSquare, PlusSquare 
} from 'lucide-react';
import { Button } from '@components/common/Button.jsx';
import { Input } from '@components/common/Input.jsx';
import { Select } from '@components/common/Select.jsx';
import { 
  fetchTaskCommentsAPI, addTaskCommentAPI, 
  fetchTaskAttachmentsAPI, uploadTaskAttachmentAPI 
} from '../services/codexAPI.js';
import toast from 'react-hot-toast';

export const TaskModal = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  onUpdate, 
  onDelete, 
  task = null, 
  members = [] 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [labels, setLabels] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingAttachments, setLoadingAttachments] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setAssignedTo(task.assignedTo?._id || task.assignedTo || '');
      setPriority(task.priority || 'medium');
      setStatus(task.status || 'todo');
      setLabels(task.labels ? task.labels.join(', ') : '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : '');
      
      loadTaskDetails(task._id);
    } else {
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setPriority('medium');
      setStatus('todo');
      setLabels('');
      setDueDate('');
      setComments([]);
      setAttachments([]);
    }
  }, [task, isOpen]);

  const loadTaskDetails = async (taskId) => {
    setLoadingComments(true);
    setLoadingAttachments(true);
    try {
      const [commRes, attRes] = await Promise.all([
        fetchTaskCommentsAPI(taskId),
        fetchTaskAttachmentsAPI(taskId)
      ]);
      if (commRes.success) setComments(commRes.data.comments || commRes.data || []);
      if (attRes.success) setAttachments(attRes.data.attachments || attRes.data || []);
    } catch (err) {
      console.error('Failed to load task details:', err);
    } finally {
      setLoadingComments(false);
      setLoadingAttachments(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Task title is required');

    const payload = {
      title: title.trim(),
      description: description.trim(),
      assignedTo: assignedTo || null,
      priority,
      status,
      labels: labels ? labels.split(',').map(s => s.trim()).filter(Boolean) : [],
      dueDate: dueDate ? new Date(dueDate) : null
    };

    if (task) {
      onUpdate(task._id, payload);
    } else {
      onAdd(payload);
    }
    onClose();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await addTaskCommentAPI(task._id, { content: commentText.trim() });
      if (res.success) {
        setComments(prev => [...prev, res.data]);
        setCommentText('');
        toast.success('Comment added');
      }
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoadingAttachments(true);
    try {
      const res = await uploadTaskAttachmentAPI(task._id, formData);
      if (res.success) {
        setAttachments(prev => [...prev, res.data]);
        toast.success('Attachment uploaded successfully');
      }
    } catch (err) {
      toast.error('Failed to upload attachment');
    } finally {
      setLoadingAttachments(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl animate-scale-in text-left">
        
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between shrink-0">
          <h4 className="text-sm font-bold text-slate-850 dark:text-white font-mono uppercase tracking-wider">
            {task ? 'Edit Task Cards' : 'Create New Task Card'}
          </h4>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-6 p-6 overflow-y-auto no-scrollbar min-h-0">
          <form onSubmit={handleSubmit} className="md:col-span-3 flex flex-col gap-4">
            <Input 
              label="Task Title" 
              placeholder="e.g. Implement Socket connection indicator" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="text-xs border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans focus:border-[#6366f1]"
            />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail objectives..."
                rows={4}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs outline-none text-slate-900 dark:text-slate-200 focus:border-[#6366f1] font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Assignee"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                options={[
                  { label: 'Unassigned', value: '' },
                  ...members.map(m => ({
                    label: m.userId?.fullName || 'Collaborator',
                    value: m.userId?._id || m.userId
                  }))
                ]}
                className="text-xs border-slate-200 dark:border-slate-800 focus:border-[#6366f1]"
              />
              <Input 
                label="Due Date" 
                type="date"
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                className="text-xs border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:border-[#6366f1]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                  { label: 'Critical', value: 'critical' }
                ]}
                className="text-xs border-slate-200 dark:border-slate-800 focus:border-[#6366f1]"
              />
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { label: 'To Do', value: 'todo' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Blocked', value: 'blocked' }
                ]}
                className="text-xs border-slate-200 dark:border-slate-800 focus:border-[#6366f1]"
              />
            </div>

            <Input 
              label="Labels (comma-separated)" 
              placeholder="e.g. bug, frontend" 
              value={labels} 
              onChange={(e) => setLabels(e.target.value)} 
              className="text-xs border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:border-[#6366f1]"
            />

            <div className="flex justify-between items-center mt-4">
              {task && (
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  icon={Trash2}
                  onClick={() => { if (confirm('Delete this task?')) { onDelete(task._id); onClose(); } }}
                  className="text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  Delete Task
                </Button>
              )}
              <div className="flex gap-2.5 ml-auto">
                <Button type="button" variant="secondary" size="sm" onClick={onClose} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Cancel</Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#6366f1] hover:bg-[#4f46e5]">
                  {task ? 'Save Changes' : 'Create Task'}
                </Button>
              </div>
            </div>
          </form>

          <div className="md:col-span-2 border-l border-slate-200 dark:border-slate-800/60 pl-6 flex flex-col gap-5 overflow-y-auto no-scrollbar">
            {task ? (
              <>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Paperclip size={11} /> File Attachments
                  </span>
                  
                  <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto pr-1 no-scrollbar">
                    {loadingAttachments ? (
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono animate-pulse">Loading attachments...</span>
                    ) : attachments.length === 0 ? (
                      <span className="text-[9px] text-slate-455 dark:text-slate-550 font-mono italic">No files attached yet.</span>
                    ) : (
                      attachments.map((att, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-955/40 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850">
                          <span className="text-[10px] text-slate-600 dark:text-slate-355 truncate max-w-[155px] font-mono">{att.fileName}</span>
                          <a 
                            href={`http://localhost:5000/api/attachments/${att._id}/download`} 
                            download 
                            className="text-[9px] text-[#6366f1] hover:underline font-bold font-mono"
                          >
                            Get
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <label className="flex items-center justify-center gap-1 border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500/20 p-2.5 rounded-xl cursor-pointer text-slate-500 dark:text-slate-455 hover:text-slate-850 dark:hover:text-white transition-all text-xs">
                    <PlusSquare size={13} />
                    <span>Upload Attachment</span>
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex-1 flex flex-col gap-2 min-h-[200px]">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <MessageSquare size={11} /> Comments & Feed
                  </span>

                  <div className="flex-1 overflow-y-auto max-h-[220px] border border-slate-200 dark:border-slate-850 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/20 space-y-3 no-scrollbar select-text">
                    {loadingComments ? (
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono animate-pulse">Loading discussion...</span>
                    ) : comments.length === 0 ? (
                      <span className="text-[9px] text-slate-455 dark:text-slate-555 font-mono italic block py-4 text-center">No discussion yet.</span>
                    ) : (
                      comments.map((c, idx) => (
                        <div key={idx} className="flex flex-col gap-0.5">
                          <div className="flex justify-between items-center select-none">
                            <span className="text-[9px] font-bold text-[#6366f1] font-mono">
                              {c.user?.fullName || c.userId?.fullName || 'Collaborator'}
                            </span>
                            <span className="text-[8px] text-slate-400 dark:text-slate-650 font-mono">
                              {c.createdAt ? new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Now'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-600 dark:text-slate-355 leading-relaxed font-sans">{c.content}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleAddComment} className="flex items-center gap-2">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write comment..."
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs outline-none text-slate-800 dark:text-slate-200 focus:border-[#6366f1]"
                    />
                    <Button type="submit" variant="secondary" size="xs" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      Send
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col justify-center items-center gap-2 text-center p-6 bg-slate-55 dark:bg-slate-950/20 rounded-2xl border border-slate-200 dark:border-slate-850">
                <AlertCircle size={20} className="text-[#6366f1] animate-pulse" />
                <span className="text-[10px] font-mono text-slate-450 dark:text-slate-500 uppercase tracking-wide">
                  Submit basic information to build a new task card on the Kanban list.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
