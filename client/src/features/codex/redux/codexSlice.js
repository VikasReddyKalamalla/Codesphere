import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  files: [],
  activeFile: null, // { _id, name, path, content }
  tasks: [],
  members: [],
  chats: [],
  activities: [],
  analytics: null,
  onlineUsers: [],
  cursors: {}, // userId -> { row, col, name, avatar }
  typingUsers: {}, // userId -> { name, isTyping }
  activeTab: 'code', // 'code', 'tasks', 'members', 'activity', 'analytics', 'settings'
  editorTheme: 'vs-dark',
  status: 'idle',
  error: null
};

const codexSlice = createSlice({
  name: 'codex',
  initialState,
  reducers: {
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
      state.status = 'succeeded';
    },
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    addFile: (state, action) => {
      state.files.push(action.payload);
    },
    updateFile: (state, action) => {
      const index = state.files.findIndex(f => f._id === action.payload._id);
      if (index !== -1) state.files[index] = action.payload;
      if (state.activeFile && state.activeFile._id === action.payload._id) {
        state.activeFile = action.payload;
      }
    },
    deleteFile: (state, action) => {
      state.files = state.files.filter(f => f._id !== action.payload);
      if (state.activeFile && state.activeFile._id === action.payload) {
        state.activeFile = null;
      }
    },
    setActiveFile: (state, action) => {
      state.activeFile = action.payload;
    },
    updateLocalCode: (state, action) => {
      if (state.activeFile && state.activeFile.path === action.payload.filePath) {
        state.activeFile.content = action.payload.content;
      }
      const index = state.files.findIndex(f => f.path === action.payload.filePath);
      if (index !== -1) {
        state.files[index].content = action.payload.content;
      }
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) state.tasks[index] = action.payload;
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t._id !== action.payload);
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    addChat: (state, action) => {
      state.chats.push(action.payload);
    },
    setActivities: (state, action) => {
      state.activities = action.payload;
    },
    addActivity: (state, action) => {
      state.activities.unshift(action.payload);
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.some(u => u._id === action.payload._id)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(u => u._id !== action.payload);
      delete state.cursors[action.payload];
      delete state.typingUsers[action.payload];
    },
    setCursor: (state, action) => {
      const { userId, cursor } = action.payload;
      state.cursors[userId] = cursor;
    },
    setTyping: (state, action) => {
      const { userId, typing } = action.payload;
      state.typingUsers[userId] = typing;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setEditorTheme: (state, action) => {
      state.editorTheme = action.payload;
    },
    fetchStart: (state) => {
      state.status = 'loading';
    },
    fetchSuccess: (state, action) => {
      state.status = 'succeeded';
      state.workspaces = action.payload;
    },
    fetchFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  }
});

export const {
  setWorkspaces,
  setCurrentWorkspace,
  setFiles,
  addFile,
  updateFile,
  deleteFile,
  setActiveFile,
  updateLocalCode,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setMembers,
  setChats,
  addChat,
  setActivities,
  addActivity,
  setAnalytics,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setCursor,
  setTyping,
  setActiveTab,
  setEditorTheme,
  fetchStart,
  fetchSuccess,
  fetchFailure
} = codexSlice.actions;

export default codexSlice.reducer;
