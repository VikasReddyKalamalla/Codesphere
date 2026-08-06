import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import { 
  FolderCode, Plus, Play, Save, Settings, Users, Activity, 
  BarChart3, MessageSquare, Terminal, Eye, Link2, GitBranch, 
  GitCommit, Phone, PhoneOff, Mic, MicOff, Video, Monitor, 
  Search, Bell, LogOut, CheckSquare, PlusCircle, Maximize2, Minimize2, 
  RefreshCw, Lock, Sparkles, HelpCircle, ArrowRight, Share2, Award, ShieldAlert,
  Code2, Check, Copy, Trash2, Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';

import { socket } from '../../../socket/socket.js';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';
import { ThemeContext } from '../../../providers/ThemeProvider.jsx';

// Subcomponents
import { WorkspaceFiles } from '../components/WorkspaceFiles.jsx';
import { WorkspaceChat } from '../components/WorkspaceChat.jsx';
import { WorkspaceMembers } from '../components/WorkspaceMembers.jsx';
import { WorkspaceSettings } from '../components/WorkspaceSettings.jsx';
import { ActivityFeed } from '../components/ActivityFeed.jsx';
import { WorkspaceAnalytics } from '../components/WorkspaceAnalytics.jsx';
import { KanbanBoard } from '../components/KanbanBoard.jsx';
import { TaskModal } from '../components/TaskModal.jsx';
import { APITester } from '../components/APITester.jsx';
import { SessionManagerModal } from '../../../components/SessionManagerModal.jsx';
import { BackButton } from '@components/common/BackButton.jsx';
import { Button } from '@components/common/Button.jsx';

// Actions
import {
  setCurrentWorkspace, setFiles, addFile, updateFile, deleteFile,
  setActiveFile, updateLocalCode, setTasks, addTask, updateTask,
  deleteTask, setMembers, setChats, addChat, setActivities, addActivity,
  setAnalytics, setOnlineUsers, addOnlineUser, removeOnlineUser,
  setCursor, setTyping, setActiveTab, setEditorTheme
} from '../redux/codexSlice.js';

// API services
import {
  fetchWorkspaceDetailsAPI,
  fetchWorkspaceMembersAPI,
  fetchWorkspaceTasksAPI,
  fetchWorkspaceFilesAPI,
  createWorkspaceFileAPI,
  updateWorkspaceFileAPI,
  deleteWorkspaceFileAPI,
  duplicateWorkspaceFileAPI,
  uploadWorkspaceFileAPI,
  fetchWorkspaceChatsAPI,
  searchWorkspaceChatsAPI,
  fetchWorkspaceAnalyticsAPI,
  updateWorkspaceSettingsAPI,
  deleteWorkspaceAPI,
  archiveWorkspaceAPI,
  restoreWorkspaceAPI,
  inviteWorkspaceMemberAPI,
  createWorkspaceTaskAPI,
  updateWorkspaceTaskAPI,
  deleteWorkspaceTaskAPI
} from '../services/codexAPI.js';

export const Workspace = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  // Redux collaborative states
  const {
    currentWorkspace,
    files,
    activeFile,
    tasks,
    members,
    chats,
    activities,
    analytics,
    onlineUsers,
    cursors,
    typingUsers,
    activeTab,
    editorTheme
  } = useSelector(state => state.codex);

  // Local component states
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  // Terminal states
  const [terminalTabs, setTerminalTabs] = useState([
    { id: 'term-1', name: 'Terminal', logs: ['Compiled successfully!', 'You can now view frontend in the browser.', '  Local:            http://localhost:3000', '  On Your Network:  http://192.168.1.12:3000', '', 'Note that the development build is not optimized.', 'To create a production build, use npm run build.'] },
    { id: 'term-2', name: 'Problems (2)', logs: ['No critical errors found.', 'Warning: Line 12 in Home.jsx has unused import.'] },
    { id: 'term-3', name: 'Output', logs: ['Build finished in 819ms.'] },
    { id: 'term-4', name: 'Git', logs: ['On branch main', 'Your branch is up to date with \'origin/main\'.'] }
  ]);
  const [activeTermId, setActiveTermId] = useState('term-1');
  const [termInputText, setTermInputText] = useState('');
  const [terminalFullscreen, setTerminalFullscreen] = useState(false);

  // Preview states
  const [previewDevice, setPreviewDevice] = useState('desktop'); 
  const [previewCacheBuster, setPreviewCacheBuster] = useState(Date.now());
  const [previewTab, setPreviewTab] = useState('preview'); 

  // Voice states
  const [inVoiceCall, setInVoiceCall] = useState(false);
  const [micMuted, setMicMuted] = useState(false);

  // GitHub states
  const [gitBranch, setGitBranch] = useState('main');
  const [gitHistory, setGitHistory] = useState([
    { commit: 'a1b2c3d', author: 'Rohan Mehta', message: 'feat: add product filtering' },
    { commit: 'b2c3d4e', author: 'Priya Sharma', message: 'fix: cart total calculation' },
    { commit: 'c3d4e5f', author: 'Neha Gupta', message: 'style: improve product card UI' }
  ]);

  // Search/Filters states
  const [globalSearch, setGlobalSearch] = useState('');

  // Session Manager Modal states
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionModalMode, setSessionModalMode]     = useState('start'); // 'start' | 'end'
  const [isGitHubImported, setIsGitHubImported]     = useState(false);
  const [activeRepoUrl, setActiveRepoUrl]           = useState('');

  const handleStartSessionFlow = ({ isGitHub, repoUrl }) => {
    setIsGitHubImported(isGitHub);
    setActiveRepoUrl(repoUrl);
    setIsSessionModalOpen(false);
    if (isGitHub && repoUrl) {
      toast.success(`GitHub Repository "${repoUrl}" connected to session!`);
    }
  };

  const handleEndSessionFlow = ({ pushToGit, repoUrl, terminateStorage }) => {
    setIsSessionModalOpen(false);
    if (pushToGit && repoUrl) {
      toast.success(`Session edits pushed to GitHub "${repoUrl}"!`);
    }
    if (terminateStorage) {
      toast.success('Workspace session terminated. Cloud storage cleared.');
      navigate('/dashboard');
    }
  };

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorRef = useRef([]);



  // Warn user before closing tab or navigating away to push code to GitHub
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const msg = 'You have active workspace edits! Make sure to push your code to your GitHub repository before closing this tab.';
      e.preventDefault();
      e.returnValue = msg;
      return msg;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Load Initial API Data
  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetchWorkspaceDetailsAPI(workspaceId),
      fetchWorkspaceMembersAPI(workspaceId),
      fetchWorkspaceTasksAPI(workspaceId),
      fetchWorkspaceFilesAPI(workspaceId),
      fetchWorkspaceAnalyticsAPI(workspaceId)
    ])
      .then(([wsRes, memRes, taskRes, fileRes, analyticsRes]) => {
        if (wsRes.status === 'fulfilled' && wsRes.value?.success) {
          dispatch(setCurrentWorkspace(wsRes.value.data));
        } else if (wsRes.status === 'rejected') {
          console.error('Failed to load workspace details:', wsRes.reason);
          toast.error(wsRes.reason?.response?.data?.message || 'Failed to retrieve workspace data');
        }

        if (memRes.status === 'fulfilled' && memRes.value?.success) {
          dispatch(setMembers(memRes.value.data?.members || memRes.value.data || []));
        }
        if (taskRes.status === 'fulfilled' && taskRes.value?.success) {
          dispatch(setTasks(taskRes.value.data?.tasks || taskRes.value.data || []));
        }
        if (fileRes.status === 'fulfilled' && fileRes.value?.success) {
          const list = fileRes.value.data?.files || fileRes.value.data || [];
          dispatch(setFiles(list));
          if (list.length > 0) {
            const defaultFile = list.find(f => f.name === 'index.html') || list[0];
            dispatch(setActiveFile(defaultFile));
          }
        }
        if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.success) {
          dispatch(setAnalytics(analyticsRes.value.data?.stats || analyticsRes.value.data));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [workspaceId, dispatch]);

  // Socket setup
  useEffect(() => {
    const token = localStorage.getItem('codesphere_token');
    socket.auth = { token };
    socket.connect();

    socket.emit('join_workspace', { workspaceId });

    socket.on('workspace_joined', ({ roomKey, activeUsers, chatHistory }) => {
      dispatch(setOnlineUsers(activeUsers));
      dispatch(setChats(chatHistory.map(c => ({
        _id: c._id,
        text: c.content,
        user: c.sender?.fullName || 'Collaborator',
        sender: c.sender,
        createdAt: c.createdAt
      }))));
    });

    socket.on('member_joined', ({ user }) => {
      toast.success(`${user.fullName} joined workspace!`);
      dispatch(addOnlineUser(user));
    });

    socket.on('member_left', ({ userId, fullName }) => {
      toast.error(`${fullName || 'Collaborator'} left workspace`);
      dispatch(removeOnlineUser(userId));
    });

    socket.on('code_change', ({ filePath, content, senderId }) => {
      if (senderId !== currentUser?._id) {
        dispatch(updateLocalCode({ filePath, content }));
      }
    });

    socket.on('cursor_move', ({ filePath, cursor, userId, fullName, avatar }) => {
      if (userId !== currentUser?._id) {
        dispatch(setCursor({ userId, cursor: { row: cursor.row, col: cursor.col, name: fullName, avatar, filePath } }));
      }
    });

    socket.on('file_save', ({ filePath, content, senderId }) => {
      if (senderId !== currentUser?._id) {
        dispatch(updateLocalCode({ filePath, content }));
        toast.success(`File "${filePath}" synchronized!`);
      }
    });

    socket.on('preview_update', () => {
      setPreviewCacheBuster(Date.now());
    });

    socket.on('terminal_output', ({ tabId, text }) => {
      setTerminalTabs(prev => prev.map(t => {
        if (t.id === tabId) {
          const nextLogs = [...t.logs, text];
          if (nextLogs.length > 500) nextLogs.shift();
          return { ...t, logs: nextLogs };
        }
        return t;
      }));
    });

    socket.on('chat_message', ({ message }) => {
      dispatch(addChat({
        _id: message._id,
        text: message.content,
        user: message.sender?.fullName || 'Collaborator',
        sender: message.sender,
        createdAt: message.createdAt
      }));
    });

    socket.on('typing', ({ userId, fullName, isTyping }) => {
      dispatch(setTyping({ userId, typing: { name: fullName, isTyping } }));
    });

    socket.on('task_created', ({ task }) => {
      dispatch(addTask(task));
    });

    socket.on('task_updated', ({ task }) => {
      dispatch(updateTask(task));
    });

    socket.on('task_completed', ({ task }) => {
      dispatch(updateTask(task));
      toast.success(`Task "${task.title}" completed!`);
    });

    socket.on('activity_added', ({ activity }) => {
      dispatch(addActivity(activity));
    });

    return () => {
      socket.emit('leave_workspace', { workspaceId });
      socket.off('workspace_joined');
      socket.off('member_joined');
      socket.off('member_left');
      socket.off('code_change');
      socket.off('cursor_move');
      socket.off('file_save');
      socket.off('preview_update');
      socket.off('terminal_output');
      socket.off('chat_message');
      socket.off('typing');
      socket.off('task_created');
      socket.off('task_updated');
      socket.off('task_completed');
      socket.off('activity_added');
      socket.disconnect();
    };
  }, [workspaceId, currentUser, dispatch]);

  // Cursors decorations updates in Monaco Editor
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    const nextDecorations = [];
    Object.entries(cursors).forEach(([userId, cursor]) => {
      if (cursor && cursor.row && activeFile && cursor.filePath === activeFile.path) {
        nextDecorations.push({
          range: new monaco.Range(cursor.row, cursor.col, cursor.row, cursor.col + 1),
          options: {
            className: 'remote-cursor-line',
            hoverMessage: { value: `**${cursor.name}** is here` },
            inlineClassName: 'remote-cursor-inline'
          }
        });
      }
    });

    decorRef.current = editor.deltaDecorations(decorRef.current, nextDecorations);
  }, [cursors, activeFile]);

  // Injects styling rules for cursors (Green-themed matching CodeSphere)
  useEffect(() => {
    const styleId = 'monaco-cursors-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        .remote-cursor-line {
          border-left: 2px solid #04AA6D !important;
          margin-left: -1px;
        }
        .remote-cursor-inline {
          background-color: rgba(99, 102, 241, 0.15) !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  // Workspace Settings / CRUD Actions
  const handleUpdateWorkspaceSettings = async (payload) => {
    try {
      const res = await updateWorkspaceSettingsAPI(workspaceId, payload);
      if (res.success) {
        dispatch(setCurrentWorkspace(res.data));
        toast.success('Workspace updated successfully');
        socket.emit('activity_added', {
          workspaceId,
          activityType: 'workspace_updated',
          description: `Settings updated: ${payload.name}`
        });
      }
    } catch (err) {
      toast.error('Failed to update workspace');
    }
  };

  const handleArchiveWorkspace = async () => {
    try {
      const res = await archiveWorkspaceAPI(workspaceId);
      if (res.success) {
        toast.success('Workspace archived');
        navigate('/codex');
      }
    } catch (err) {
      toast.error('Failed to archive workspace');
    }
  };

  const handleRestoreWorkspace = async () => {
    try {
      const res = await restoreWorkspaceAPI(workspaceId);
      if (res.success) {
        dispatch(setCurrentWorkspace(res.data));
        toast.success('Workspace restored successfully');
        socket.emit('activity_added', {
          workspaceId,
          activityType: 'workspace_updated',
          description: `Restored workspace from archives`
        });
      }
    } catch (err) {
      toast.error('Failed to restore workspace');
    }
  };

  const handleDeleteWorkspace = async () => {
    try {
      const res = await deleteWorkspaceAPI(workspaceId);
      if (res.success) {
        toast.success('Workspace deleted');
        navigate('/codex');
      }
    } catch (err) {
      toast.error('Failed to delete workspace');
    }
  };

  const handleLeaveWorkspace = () => {
    toast.success('Left workspace');
    navigate('/codex');
  };

  // Files CRUD wrappers
  const handleSelectFile = (file) => {
    dispatch(setActiveFile(file));
    socket.emit('file_open', { workspaceId, filePath: file.path });
  };

  const handleCreateFile = async (name, path) => {
    try {
      const res = await createWorkspaceFileAPI(workspaceId, { name, path, type: 'file' });
      if (res.success) {
        dispatch(addFile(res.data.file));
        dispatch(setActiveFile(res.data.file));
        socket.emit('activity_added', { workspaceId, activityType: 'file_created', description: `Created file "${name}"` });
      }
    } catch (err) {
      toast.error('Error creating file');
    }
  };

  const handleCreateFolder = async (name, path) => {
    try {
      const res = await createWorkspaceFileAPI(workspaceId, { name, path, type: 'folder' });
      if (res.success) {
        dispatch(addFile(res.data.file));
        socket.emit('activity_added', { workspaceId, activityType: 'file_created', description: `Created folder "${name}"` });
      }
    } catch (err) {
      toast.error('Error creating folder');
    }
  };

  const handleRenameFile = async (fileId, name, path) => {
    try {
      const res = await updateWorkspaceFileAPI(workspaceId, fileId, { name, path });
      if (res.success) {
        dispatch(updateFile(res.data.file));
        const listRes = await fetchWorkspaceFilesAPI(workspaceId);
        if (listRes.success) dispatch(setFiles(listRes.data.files));
      }
    } catch (err) {
      toast.error('Error renaming file');
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const res = await deleteWorkspaceFileAPI(workspaceId, fileId);
      if (res.success) {
        dispatch(deleteFile(fileId));
        socket.emit('activity_added', { workspaceId, activityType: 'file_deleted', description: `Deleted file/folder` });
      }
    } catch (err) {
      toast.error('Error deleting file');
    }
  };

  const handleDuplicateFile = async (fileId) => {
    try {
      const res = await duplicateWorkspaceFileAPI(workspaceId, fileId);
      if (res.success) {
        dispatch(addFile(res.data.file));
      }
    } catch (err) {
      toast.error('Error duplicating file');
    }
  };

  const handleFileUpload = async (formData) => {
    try {
      const res = await uploadWorkspaceFileAPI(workspaceId, formData);
      if (res.success) {
        dispatch(addFile(res.data.file));
        toast.success('File uploaded');
      }
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  // Editor typing change sync
  const handleEditorChange = (value) => {
    if (!activeFile) return;
    dispatch(updateLocalCode({ filePath: activeFile.path, content: value }));
    socket.emit('code_change', { workspaceId, filePath: activeFile.path, content: value });
  };

  // Editor cursor movement sync
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.onDidChangeCursorPosition(e => {
      if (activeFile) {
        socket.emit('cursor_move', {
          workspaceId,
          filePath: activeFile.path,
          cursor: { row: e.position.lineNumber, col: e.position.column }
        });
      }
    });
  };

  const handleSaveFile = () => {
    if (!activeFile) return;
    socket.emit('file_save', {
      workspaceId,
      filePath: activeFile.path,
      content: activeFile.content
    });
    toast.success('Saved to server sandbox!');
  };

  // Chat wrappers
  const handleSendMessage = (text) => {
    socket.emit('chat_message', { workspaceId, content: text });
  };

  const handlePinMessage = async (msgId) => {
    toast.success('Toggled pin message');
  };

  const handleSearchChat = async (query) => {
    try {
      const res = await searchWorkspaceChatsAPI(workspaceId, query);
      if (res.success) {
        return res.data.chats.map(c => ({
          text: c.content,
          user: c.sender?.fullName || 'Collaborator',
          sender: c.sender,
          createdAt: c.createdAt
        }));
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  };

  const handleTypingStart = () => {
    socket.emit('typing', { workspaceId, isTyping: true });
  };

  const handleTypingStop = () => {
    socket.emit('typing', { workspaceId, isTyping: false });
  };

  // Tasks Kanban board wrappers
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = async (taskPayload) => {
    try {
      const payload = {
        ...taskPayload,
        workspaceId,
        reporter: currentUser?._id
      };
      const res = await createWorkspaceTaskAPI(payload);
      if (res.success) {
        dispatch(addTask(res.data));
        socket.emit('task_created', { workspaceId, task: res.data });
        socket.emit('activity_added', { workspaceId, activityType: 'task_created', description: `Created task "${taskPayload.title}"` });
      }
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, taskPayload) => {
    try {
      const res = await updateWorkspaceTaskAPI(taskId, taskPayload);
      if (res.success) {
        dispatch(updateTask(res.data));
        socket.emit('task_updated', { workspaceId, task: res.data });
        
        if (taskPayload.status === 'completed') {
          socket.emit('task_completed', { workspaceId, task: res.data });
        }
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskStatusChange = async (task, nextStatus) => {
    await handleUpdateTask(task._id, { status: nextStatus });
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await deleteWorkspaceTaskAPI(taskId);
      if (res.success) {
        dispatch(deleteTask(taskId));
        toast.success('Task card deleted');
      }
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  // Terminal commands running
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!termInputText.trim()) return;

    setTerminalTabs(prev => prev.map(t => {
      if (t.id === activeTermId) {
        return { ...t, logs: [...t.logs, `\r\n$ ${termInputText}\r\n`] };
      }
      return t;
    }));

    socket.emit('terminal_input', {
      workspaceId,
      tabId: activeTermId,
      input: termInputText.trim() + '\n'
    });

    setTermInputText('');

    socket.emit('activity_added', {
      workspaceId,
      activityType: 'terminal_used',
      description: `Executed command in terminal`
    });
  };

  // Invite member email trigger
  const handleInviteUser = async () => {
    const email = prompt("Enter team collaborator's email:");
    if (!email) return;
    try {
      const res = await inviteWorkspaceMemberAPI(workspaceId, { email, role: 'editor' });
      if (res.success) {
        toast.success('Invitation sent successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Error sending invite');
    }
  };

  // Editor language detection
  const getEditorLanguage = (fileName) => {
    if (!fileName) return 'javascript';
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'html') return 'html';
    if (ext === 'css') return 'css';
    if (ext === 'js') return 'javascript';
    if (ext === 'py') return 'python';
    if (ext === 'cpp') return 'cpp';
    if (ext === 'json') return 'json';
    return 'javascript';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-[#04AA6D] animate-spin" />
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Loading Collaborative Codex...</span>
      </div>
    );
  }

  const previewUrl = `http://localhost:5000/preview/${workspaceId}/index.html?cb=${previewCacheBuster}`;

  return (
    <div className="flex flex-col h-[calc(100vh-90px)] w-full text-slate-800 dark:text-slate-200 select-none overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* ─── Top Navbar ────────────────────────────────────────────────────────── */}
      <div className="h-14 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-4 text-left">
          <div className="p-2 bg-[#04AA6D]/10 text-[#04AA6D] rounded-lg">
            <FolderCode className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                {currentWorkspace?.name || 'Collaborative Platform'}
              </h1>
              <Lock size={12} className="text-slate-400 dark:text-slate-500" />
              <span className="text-[9px] bg-slate-200 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 capitalize">
                {currentWorkspace?.visibility || 'private'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-sans mt-0.5">
              {currentWorkspace?.description || 'Full-stack collaborative project'}
            </span>
          </div>
        </div>

        {/* Global Workspace Search */}
        <div className="relative w-full max-w-md hidden md:block">
          <input
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search in workspace..."
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-8 py-1.5 text-xs outline-none text-slate-800 dark:text-slate-200 focus:border-[#04AA6D] font-sans"
          />
          <Search size={13} className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
          <span className="absolute right-3 top-2 text-[9px] font-mono text-slate-400 dark:text-slate-550 border border-slate-200 dark:border-slate-800 px-1 rounded bg-white dark:bg-slate-900">
            K
          </span>
        </div>

        {/* Indicators Navbar Right */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Online</span>
            <div className="flex -space-x-1.5 ml-1">
              {onlineUsers.slice(0, 4).map((user) => (
                <img 
                  key={user._id} 
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} 
                  alt={user.fullName} 
                  title={user.fullName}
                  className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-950" 
                />
              ))}
              {onlineUsers.length > 4 && (
                <div className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[7px] font-bold text-slate-700 dark:text-white font-mono">
                  +{onlineUsers.length - 4}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all relative">
              <Bell size={14} />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose-500 rounded-full flex items-center justify-center text-[7px] font-bold text-white">
                12
              </span>
            </button>
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-all">
              <MessageSquare size={14} />
            </button>
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-all">
              <HelpCircle size={14} />
            </button>
          </div>

          <button
            onClick={() => {
              setSessionModalMode('end');
              setIsSessionModalOpen(true);
            }}
            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-all border border-slate-300 dark:border-slate-700"
          >
            <GitBranch size={13} className="text-purple-500" />
            <span>End Session / GitHub Sync</span>
          </button>

          <button 
            onClick={handleInviteUser}
            className="px-3.5 py-1.5 bg-[#04AA6D] hover:bg-[#4f46e5] active:scale-95 text-white text-xs font-mono font-bold rounded-lg shadow-lg shadow-indigo-500/10 cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Plus size={13} />
            <span>Invite</span>
          </button>
        </div>
      </div>

      {/* ─── Secondary Tab Navigation Bar ──────────────────────────────────────── */}
      <div className="h-11 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900 flex items-center justify-between px-6 select-none shrink-0">
        <div className="flex gap-1.5">
          {[
            { id: 'overview', label: 'Overview', icon: FolderCode },
            { id: 'tasks', label: 'Tasks', icon: CheckSquare },
            { id: 'code', label: 'Code', icon: Code2 },
            { id: 'milestones', label: 'Milestones', icon: Award },
            { id: 'members', label: 'Members', icon: Users },
            { id: 'discussions', label: 'Discussions', icon: MessageSquare },
            { id: 'files', label: 'Files', icon: FolderCode },
            { id: 'commits', label: 'Commits', icon: GitCommit },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveTab(tab.id))}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/50 text-[#04AA6D] shadow-sm shadow-slate-100 dark:shadow-none' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
              }`}
            >
              <tab.icon size={13} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <select
          value="default"
          onChange={() => dispatch(setActiveTab('settings'))}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold text-slate-550 dark:text-slate-400 py-1 px-2.5 rounded-lg outline-none cursor-pointer"
        >
          <option value="default">Workspace Settings</option>
          <option value="settings">Settings Manager</option>
        </select>
      </div>

      {/* ─── Main Content Splitter ────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* If Active Tab is Code (mockup layout: 3-column layout) */}
        {activeTab === 'code' ? (
          <div className="flex-1 flex overflow-hidden min-h-0">
            
            {/* COLUMN 1: LEFT SIDEBAR PANEL */}
            <div className="w-[280px] border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex flex-col gap-4 p-4 overflow-y-auto no-scrollbar shrink-0">
              
              {/* Workspace Info */}
              <div className="bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-4 flex flex-col gap-3.5 text-left">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Workspace Info</span>
                
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Tech Stack</span>
                    <div className="flex gap-1">
                      <span className="px-1 text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono rounded">React</span>
                      <span className="px-1 text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono rounded">Node</span>
                      <span className="px-1 text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono rounded">+2</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-[11px]">
                    <span className="text-slate-500">Repository</span>
                    <a 
                      href={`https://${currentWorkspace?.githubRepo || 'github.com/codesphere'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#04AA6D] hover:underline font-mono truncate"
                    >
                      {currentWorkspace?.githubRepo || 'github.com/codesphere/sandbox'}
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Created On</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">12 Apr 2025</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Owner</span>
                    <span className="font-mono text-[#04AA6D] font-bold">Arjun Verma</span>
                  </div>
                </div>
              </div>

              {/* Code Explorer Files tree */}
              <div className="flex-1 flex flex-col min-h-[300px]">
                <WorkspaceFiles
                  files={files}
                  activeFile={activeFile}
                  onSelectFile={handleSelectFile}
                  onCreateFile={handleCreateFile}
                  onCreateFolder={handleCreateFolder}
                  onRename={handleRenameFile}
                  onDelete={handleDeleteFile}
                  onDuplicate={handleDuplicateFile}
                  onUpload={handleFileUpload}
                />
              </div>

              {/* Live Cursor Positions */}
              <div className="bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-4 flex flex-col gap-3 text-left">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Live Cursor</span>
                <div className="flex flex-col gap-2.5">
                  {[
                    { name: 'Priya Sharma', path: 'src/pages/Home.jsx', line: 45, color: '#9c27b0' },
                    { name: 'Rohan Mehta', path: 'src/components/Navbar.jsx', line: 22, color: '#3f51b5' },
                    { name: 'Neha Gupta', path: 'src/context/CartContext.jsx', line: 10, color: '#04AA6D' }
                  ].map((cur, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-[11px] font-sans">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: cur.color }} />
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{cur.name}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-550 font-mono truncate">{cur.path} (Line {cur.line})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 2: MIDDLE EDITOR CORE */}
            <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800/80 overflow-hidden min-w-0">
              
              {/* File tabs bar */}
              <div className="h-11 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900 flex items-center justify-between px-4 select-none shrink-0">
                <div className="flex gap-1.5">
                  {files.filter(f => f.type === 'file').slice(0, 5).map((file) => (
                    <button
                      key={file._id}
                      onClick={() => handleSelectFile(file)}
                      className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        activeFile && activeFile._id === file._id
                          ? 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700/60 text-[#04AA6D] shadow-xs'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-355'
                      }`}
                    >
                      {file.name}
                    </button>
                  ))}
                  <button className="text-slate-450 hover:text-slate-800 dark:hover:text-white px-2 py-1 text-xs">+</button>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleSaveFile}
                    className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-indigo-500/20 text-[#04AA6D] text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Share2 size={13} />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Path Breadcrumbs */}
              <div className="h-8 bg-slate-50/50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800/50 px-4 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                <div className="flex items-center gap-1">
                  <span>frontend</span>
                  <span>&gt;</span>
                  <span>src</span>
                  <span>&gt;</span>
                  <span>pages</span>
                  <span>&gt;</span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold">{activeFile?.name || 'Home.jsx'}</span>
                </div>
                <div>
                  <span>You, 2 minutes ago | 3 authors (You and others)</span>
                </div>
              </div>

              {/* Editor Workspace */}
              <div className="flex-1 min-h-[250px] bg-white dark:bg-slate-900/20">
                {activeFile ? (
                  <Editor
                    height="100%"
                    language={getEditorLanguage(activeFile.name)}
                    theme={isDarkMode ? 'vs-dark' : 'light'}
                    value={activeFile.content || ''}
                    onChange={handleEditorChange}
                    onMount={handleEditorMount}
                    options={{
                      minimap: { enabled: true },
                      fontSize: 12,
                      lineNumbers: 'on',
                      wordWrap: 'on',
                      automaticLayout: true,
                      scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                      padding: { top: 10 }
                    }}
                  />
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center gap-2">
                    <FolderCode size={30} className="text-slate-300 dark:text-slate-700 animate-bounce" />
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-550 uppercase tracking-widest">Select a file from the explorer to begin.</span>
                  </div>
                )}
              </div>

              {/* Editor Status Bar */}
              <div className="h-8 bg-slate-100/50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/60 px-4 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 select-none shrink-0">
                <div className="flex items-center gap-3">
                  <span>Ln 45, Col 12</span>
                  <span>Spaces: 2</span>
                  <span>UTF-8</span>
                  <span>LF</span>
                  <span>JavaScript JSX</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#6366f1] font-bold hover:underline cursor-pointer">
                  <Play size={10} />
                  <span>Go Live</span>
                </div>
              </div>

              {/* Split bottom pane: Terminal + Commits */}
              <div className="h-[220px] border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex overflow-hidden select-text shrink-0">
                {/* Bottom Left: Terminal */}
                <div className="flex-1 border-r border-slate-200 dark:border-slate-800/60 flex flex-col overflow-hidden">
                  <div className="h-9 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between px-4 bg-slate-50 dark:bg-slate-950/20 select-none">
                    <div className="flex gap-2">
                      {terminalTabs.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTermId(tab.id)}
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                            activeTermId === tab.id
                              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-[#6366f1] shadow-xs'
                              : 'border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                          }`}
                        >
                          {tab.name}
                        </button>
                      ))}
                    </div>
                    <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-[9px] font-mono text-slate-500 dark:text-slate-400 px-1 py-0.5 rounded outline-none">
                      <option>Local</option>
                    </select>
                  </div>
                  
                  <div className="flex-1 bg-slate-900 dark:bg-slate-950/85 p-3.5 font-mono text-[10px] leading-relaxed text-slate-300 overflow-y-auto no-scrollbar flex flex-col gap-0.5">
                    {terminalTabs.find(t => t.id === activeTermId)?.logs.map((logLine, idx) => (
                      <div key={idx} className="whitespace-pre-wrap">{logLine}</div>
                    ))}
                  </div>
                  
                  <form onSubmit={handleTerminalSubmit} className="p-2 bg-slate-955 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-850 flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#6366f1] select-none">$</span>
                    <input
                      value={termInputText}
                      onChange={(e) => setTermInputText(e.target.value)}
                      placeholder="Type command..."
                      className="flex-1 bg-transparent border-none outline-none font-mono text-[10px] text-slate-900 dark:text-white"
                    />
                  </form>
                </div>

                {/* Bottom Right: Commits Timeline */}
                <div className="w-[300px] flex flex-col overflow-hidden shrink-0">
                  <div className="h-9 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between px-4 bg-slate-50 dark:bg-slate-950/20 select-none">
                    <span className="text-[9px] font-bold text-slate-700 dark:text-white tracking-widest uppercase font-mono">Commits</span>
                    <button className="text-[8px] text-[#6366f1] hover:underline font-mono uppercase font-bold">View All</button>
                  </div>
                  <div className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-2.5 select-none text-left">
                    {gitHistory.map((git, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-slate-150 dark:hover:border-slate-850">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${git.author}`} className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800" alt="" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate">{git.message}</span>
                            <span className="text-[8px] text-slate-400 dark:text-slate-500 font-mono truncate">{git.author}</span>
                          </div>
                        </div>
                        <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono px-1 rounded">{git.commit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: RIGHT PANEL SIDEBAR */}
            <div className="w-[380px] lg:w-[420px] flex flex-col overflow-hidden shrink-0">
              
              {/* Live Preview Panel (Top half) */}
              <div className="flex-1 flex flex-col border-b border-slate-200 dark:border-slate-800/80 overflow-hidden">
                <div className="h-11 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-4 bg-slate-100/50 dark:bg-slate-900 select-none shrink-0">
                  <div className="flex gap-2">
                    {['Live Preview', 'API', 'Terminal'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setPreviewTab(tab.toLowerCase())}
                        className={`text-[9px] font-mono font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                          previewTab === tab.toLowerCase()
                            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 text-[#6366f1] shadow-xs'
                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-355'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setPreviewCacheBuster(Date.now())}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-850 rounded text-slate-450 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      <RefreshCw size={11} />
                    </button>
                    <a 
                      href={previewUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-850 rounded text-slate-455 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      <Link2 size={11} />
                    </a>
                  </div>
                </div>

                {/* Preview view */}
                <div className="flex-1 bg-slate-50 dark:bg-slate-950/20 p-3 flex flex-col overflow-hidden">
                  {previewTab === 'api' ? (
                    <APITester />
                  ) : (
                    <div className="flex-1 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-2xl flex flex-col overflow-hidden">
                      <div className="h-7 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 flex items-center px-3 gap-2 shrink-0">
                        <div className="flex gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        </div>
                        <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded text-[8.5px] font-mono text-slate-400 dark:text-slate-500 px-3 py-0.5 select-text truncate text-left">
                          https://codesphere.live/e-commerce-platform
                        </div>
                      </div>
                      <iframe
                        src={previewUrl}
                        title="Live sandbox compiler frame"
                        className="flex-1 border-none bg-slate-950"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom split: Tasks + Activity Log */}
              <div className="h-[220px] bg-white dark:bg-slate-900 flex overflow-hidden select-none shrink-0">
                
                {/* Tasks checklist */}
                <div className="flex-1 border-r border-slate-200 dark:border-slate-800/60 flex flex-col overflow-hidden">
                  <div className="h-9 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between px-4 bg-slate-50 dark:bg-slate-950/20">
                    <span className="text-[9px] font-bold text-slate-700 dark:text-white tracking-widest uppercase font-mono">Tasks</span>
                    <button onClick={() => dispatch(setActiveTab('tasks'))} className="text-[8px] text-[#6366f1] hover:underline font-mono uppercase font-bold">View All</button>
                  </div>
                  
                  <div className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-2 text-left">
                    {tasks.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-xl hover:border-slate-350 dark:hover:border-slate-800 transition-all animate-fade-in">
                        <input 
                          type="checkbox" 
                          checked={item.status === 'completed'}
                          onChange={() => handleTaskStatusChange(item, item.status === 'completed' ? 'todo' : 'completed')}
                          className="mt-0.5 rounded accent-[#6366f1] border-slate-300 dark:border-slate-850 cursor-pointer"
                        />
                        <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                          <span className={`text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate ${item.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-550' : ''}`}>
                            {item.title}
                          </span>
                          <span className="text-[8.5px] text-slate-500 font-mono truncate">{item.assignedTo?.fullName || 'Unassigned'}</span>
                        </div>
                        <span className={`text-[7.5px] font-bold font-mono px-1 rounded uppercase shrink-0 ${
                          item.status === 'completed' 
                            ? 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-emerald-400' 
                            : item.status === 'in_progress'
                            ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }}
                      className="w-full py-1.5 border border-dashed border-slate-250 dark:border-slate-850 hover:border-indigo-500/20 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl text-[9px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus size={11} />
                      <span>New Task</span>
                    </button>
                  </div>
                </div>

                {/* Activity timeline logs */}
                <div className="w-[180px] flex flex-col overflow-hidden shrink-0">
                  <div className="h-9 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between px-4 bg-slate-50 dark:bg-slate-950/20">
                    <span className="text-[9px] font-bold text-slate-700 dark:text-white tracking-widest uppercase font-mono">Activity Log</span>
                    <button onClick={() => dispatch(setActiveTab('activity'))} className="text-[8px] text-[#6366f1] hover:underline font-mono uppercase font-bold">View All</button>
                  </div>
                  
                  <div className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-2.5 text-left">
                    {activities.slice(0, 4).map((act, idx) => {
                      const user = act.userId || {};
                      const userName = user.fullName || 'Collaborator';
                      
                      return (
                        <div key={idx} className="flex items-start gap-2 text-[10px]">
                          <img src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800" alt="" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-700 dark:text-slate-355 truncate">{userName}</span>
                            <span className="text-[8.5px] text-slate-450 dark:text-slate-500 line-clamp-2 leading-tight">{act.description}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : activeTab === 'overview' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 text-left">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white font-mono uppercase tracking-wider mb-4">Workspace Overview</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              Welcome to the collaborative playground dashboard. Start by navigating to the **Code** tab to open Monaco and term shells, or assign cards inside the **Tasks** checklist.
            </p>
          </div>
        ) : activeTab === 'tasks' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center mb-6 text-left">
              <div className="flex items-center gap-2">
                <CheckSquare size={18} className="text-[#6366f1]" />
                <span className="text-xs font-bold text-slate-850 dark:text-white tracking-widest uppercase font-mono">Tasks Kanban List</span>
              </div>
              <Button size="xs" icon={Plus} onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }} className="bg-[#6366f1] hover:bg-[#4f46e5]">Add Task</Button>
            </div>
            <KanbanBoard 
              tasks={tasks} 
              onTaskStatusChange={handleTaskStatusChange} 
              onTaskClick={handleTaskClick}
            />
          </div>
        ) : activeTab === 'members' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 max-w-2xl mx-auto w-full">
            <WorkspaceMembers 
              members={members} 
              onlineUsers={onlineUsers} 
              currentUser={currentUser}
              onRemove={(id) => handleUpdateWorkspaceSettings({ removeMemberId: id })}
              onPromote={(id, r) => handleUpdateWorkspaceSettings({ promoteMemberId: id, promoteRole: r })}
              onTransferOwnership={(id) => handleUpdateWorkspaceSettings({ transferOwnershipId: id })}
            />
          </div>
        ) : activeTab === 'discussions' ? (
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            <WorkspaceChat
              messages={chats}
              onSendMessage={handleSendMessage}
              onPinMessage={handlePinMessage}
              onSearchChat={handleSearchChat}
              typingUsers={typingUsers}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
            />
          </div>
        ) : activeTab === 'activity' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 max-w-2xl mx-auto w-full">
            <ActivityFeed activities={activities} />
          </div>
        ) : activeTab === 'files' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 max-w-2xl mx-auto w-full">
            <WorkspaceFiles
              files={files}
              activeFile={activeFile}
              onSelectFile={handleSelectFile}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
              onRename={handleRenameFile}
              onDelete={handleDeleteFile}
              onDuplicate={handleDuplicateFile}
              onUpload={handleFileUpload}
            />
          </div>
        ) : activeTab === 'commits' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 max-w-2xl mx-auto w-full">
            <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl text-left select-none p-6">
              <h2 className="text-sm font-bold text-slate-850 dark:text-white font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-[#6366f1]" />
                Repository Commit History
              </h2>
              <div className="space-y-4">
                {gitHistory.map((git, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-xl hover:border-[#6366f1]/20 transition-all">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${git.author}`} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 mt-0.5" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{git.author}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-[#6366f1] font-mono px-2 py-0.5 rounded">{git.commit}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 font-sans">{git.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
            <WorkspaceAnalytics analytics={analytics} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 max-w-2xl mx-auto w-full">
            <WorkspaceSettings 
              workspace={currentWorkspace} 
              currentUser={currentUser}
              onUpdateSettings={handleUpdateWorkspaceSettings}
              onArchive={handleArchiveWorkspace}
              onRestore={handleRestoreWorkspace}
              onDelete={handleDeleteWorkspace}
              onLeave={handleLeaveWorkspace}
            />
          </div>
        )}

      </div>

      {/* Floating Voice Room call presence indicator bar */}
      {inVoiceCall && (
        <div className="absolute right-6 bottom-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-4 shadow-2xl z-30 select-none animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
            <span className="text-[10px] font-bold font-mono text-slate-700 dark:text-slate-350 uppercase tracking-widest">Call Room Connected</span>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-850 pl-4">
            <button 
              onClick={() => { setMicMuted(!micMuted); toast.success(micMuted ? "Mic Unmuted" : "Mic Muted"); }} 
              className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer ${
                micMuted ? 'text-rose-600 bg-rose-500/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <MicOff size={14} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer">
              <Video size={14} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer">
              <Monitor size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Kanban Task Creation/Editing Modal Dialog */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
        onAdd={handleAddTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        members={members}
      />

      {/* Session Manager Modal (Start & End of Session GitHub/Storage Workflow) */}
      <SessionManagerModal
        isOpen={isSessionModalOpen}
        mode={sessionModalMode}
        isGitHubImported={isGitHubImported}
        githubRepoUrl={activeRepoUrl}
        onStartSession={handleStartSessionFlow}
        onEndSession={handleEndSessionFlow}
        onClose={() => setIsSessionModalOpen(false)}
      />
    </div>
  );
};
