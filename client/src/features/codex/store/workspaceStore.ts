import { create } from 'zustand';
import { WorkspaceFile, ExecutionResult } from '../types/codex';
import { ActivityTab } from '../components/ActivityBar';
import { realtimeSync } from '../services/realtimeSync';
import { workspaceCollab } from '../services/yjsCollab';

interface WorkspaceStore {
  // Files State
  files: WorkspaceFile[];
  activeFileId: string | null;
  setFiles: (files: WorkspaceFile[]) => void;
  setActiveFileId: (id: string | null) => void;
  createFile: (name: string, isFolder: boolean, parentFolder?: string) => void;
  deleteFile: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  closeFile: (fileId: string) => void;
  clearWorkspace: () => void;

  // Workspace Path & User
  username: string;
  folderName: string;
  workspacePath: string;
  setUsername: (username: string) => void;
  setWorkspace: (name: string, path: string, initialFiles?: WorkspaceFile[]) => void;

  // Layout & UI
  isDark: boolean;
  toggleTheme: () => void;
  wordWrap: boolean;
  toggleWordWrap: () => void;
  fontSize: number;
  activeActivityTab: ActivityTab;
  setActiveActivityTab: (tab: ActivityTab) => void;
  isSideBarOpen: boolean;
  toggleSideBar: () => void;
  setSideBarOpen: (open: boolean) => void;
  isBottomOpen: boolean;
  toggleBottom: () => void;
  setBottomOpen: (open: boolean) => void;

  // Execution State
  isExecuting: boolean;
  setIsExecuting: (executing: boolean) => void;
  outputResult: ExecutionResult | null;
  setOutputResult: (res: ExecutionResult | null) => void;

  // Cursor & Editor State
  cursorPos: { line: number; col: number };
  setCursorPos: (pos: { line: number; col: number }) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => {
  // Initialize from localStorage safely
  const initialUsername = (() => {
    try {
      const stored = localStorage.getItem('codesphere_username');
      if (stored) return stored;
      const csUserStr = localStorage.getItem('codesphere_user') || localStorage.getItem('user');
      if (csUserStr) {
        const u = JSON.parse(csUserStr);
        if (u.username || u.name) return u.username || u.name;
      }
      return 'Her0';
    } catch {
      return 'Her0';
    }
  })();

  const initialFolderName = (() => {
    try {
      return localStorage.getItem('codesphere_folder_name') || 'workspace';
    } catch {
      return 'workspace';
    }
  })();

  const initialWorkspacePath = (() => {
    try {
      return (
        localStorage.getItem('codesphere_workspace_path') ||
        `C:\\Users\\${initialUsername}\\workspace`
      );
    } catch {
      return `C:\\Users\\${initialUsername}\\workspace`;
    }
  })();

  const initialFiles: WorkspaceFile[] = (() => {
    try {
      const saved = localStorage.getItem('codesphere_codex_user_files');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  })();

  return {
    files: initialFiles,
    activeFileId: initialFiles.length > 0 ? initialFiles[0].id : null,
    setFiles: (files) => set({ files }),
    setActiveFileId: (id) => set({ activeFileId: id }),

    createFile: (name, isFolder, parentFolder) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const cleanPath = parentFolder ? `${parentFolder}/${trimmed}` : trimmed;
      const parts = cleanPath.split(/[/\\]/).filter(Boolean);
      const fileName = parts[parts.length - 1] || cleanPath;

      let lang = 'plaintext';
      if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) lang = 'javascript';
      else if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) lang = 'typescript';
      else if (fileName.endsWith('.py')) lang = 'python';
      else if (fileName.endsWith('.html')) lang = 'html';
      else if (fileName.endsWith('.css')) lang = 'css';
      else if (fileName.endsWith('.json')) lang = 'json';
      else if (fileName.endsWith('.md')) lang = 'markdown';
      else if (fileName.endsWith('.cpp') || fileName.endsWith('.c')) lang = 'cpp';
      else if (fileName.endsWith('.java')) lang = 'java';
      else if (fileName.endsWith('.sql')) lang = 'sql';

      const newFile: WorkspaceFile = {
        id: `f_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: fileName,
        path: cleanPath,
        language: lang,
        type: isFolder ? 'folder' : 'file',
        isFolder: Boolean(isFolder),
        content: '',
        isOpen: !isFolder,
        isModified: false,
      };

      set((state) => {
        const exists = state.files.find((f) => f.path.toLowerCase() === cleanPath.toLowerCase());
        if (exists) {
          return { activeFileId: !isFolder ? exists.id : state.activeFileId };
        }
        const updated = [...state.files, newFile];
        try {
          localStorage.setItem('codesphere_codex_user_files', JSON.stringify(updated));
        } catch {}
        return {
          files: updated,
          activeFileId: !isFolder ? newFile.id : state.activeFileId,
        };
      });

      realtimeSync.broadcastFileCreated(newFile);
    },

    deleteFile: (fileId) => {
      set((state) => {
        const updated = state.files.filter((f) => f.id !== fileId);
        let nextActive = state.activeFileId;
        if (state.activeFileId === fileId) {
          const remaining = updated.filter((f) => f.type === 'file');
          nextActive = remaining.length > 0 ? remaining[0].id : null;
        }
        try {
          localStorage.setItem('codesphere_codex_user_files', JSON.stringify(updated));
        } catch {}
        return { files: updated, activeFileId: nextActive };
      });
      realtimeSync.broadcastFileDeleted(fileId);
    },

    renameFile: (fileId, newName) => {
      set((state) => {
        const updated = state.files.map((f) =>
          f.id === fileId ? { ...f, name: newName, path: newName } : f
        );
        try {
          localStorage.setItem('codesphere_codex_user_files', JSON.stringify(updated));
        } catch {}
        return { files: updated };
      });
      realtimeSync.broadcastFileRenamed(fileId, newName);
    },

    updateFileContent: (fileId, content) => {
      set((state) => {
        const updated = state.files.map((f) =>
          f.id === fileId ? { ...f, content, isModified: true } : f
        );
        try {
          localStorage.setItem('codesphere_codex_user_files', JSON.stringify(updated));
        } catch {}
        return { files: updated };
      });
    },

    closeFile: (fileId) => {
      set((state) => {
        const updated = state.files.map((f) =>
          f.id === fileId ? { ...f, isOpen: false } : f
        );
        let nextActive = state.activeFileId;
        if (state.activeFileId === fileId) {
          const remainingOpen = updated.filter((f) => f.id !== fileId && f.isOpen !== false && f.type === 'file');
          nextActive = remainingOpen.length > 0 ? remainingOpen[0].id : null;
        }
        return { files: updated, activeFileId: nextActive };
      });
    },

    clearWorkspace: () => {
      set({ files: [], activeFileId: null, outputResult: null });
      try {
        localStorage.removeItem('codesphere_codex_user_files');
      } catch {}
    },

    username: initialUsername,
    folderName: initialFolderName,
    workspacePath: initialWorkspacePath,

    setUsername: (username) => {
      set({ username });
      try {
        localStorage.setItem('codesphere_username', username);
      } catch {}
      realtimeSync.setUsername(username);
      workspaceCollab.setUserProfile(username);
    },

    setWorkspace: (name, path, initialFiles) => {
      const fullPath = path.endsWith(name) ? path : `${path.replace(/\\$/, '')}\\${name}`;
      set({ folderName: name, workspacePath: fullPath });
      try {
        localStorage.setItem('codesphere_folder_name', name);
        localStorage.setItem('codesphere_workspace_path', fullPath);
      } catch {}

      if (initialFiles && initialFiles.length > 0) {
        set({ files: initialFiles, activeFileId: initialFiles.find((f) => f.isOpen)?.id || initialFiles[0].id });
        return;
      }

      try {
        const saved = localStorage.getItem(`codesphere_ws_files_${name}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            set({ files: parsed, activeFileId: parsed.find((f: WorkspaceFile) => f.isOpen)?.id || parsed[0].id });
            return;
          }
        }
      } catch {}

      set({ files: [], activeFileId: null });
    },

    isDark: (() => {
      try {
        if (typeof document !== 'undefined') {
          return document.documentElement.classList.contains('dark');
        }
        const saved = localStorage.getItem('codesphere_theme') || localStorage.getItem('theme');
        return saved === 'dark';
      } catch {
        return false;
      }
    })(),
    toggleTheme: () => set((state) => ({ isDark: !state.isDark })),

    wordWrap: true,
    toggleWordWrap: () => set((state) => ({ wordWrap: !state.wordWrap })),

    fontSize: 13,

    activeActivityTab: 'explorer',
    setActiveActivityTab: (tab) => set({ activeActivityTab: tab, isSideBarOpen: tab !== null }),

    isSideBarOpen: true,
    toggleSideBar: () => set((state) => ({ isSideBarOpen: !state.isSideBarOpen })),
    setSideBarOpen: (open) => set({ isSideBarOpen: open }),

    isBottomOpen: true,
    toggleBottom: () => set((state) => ({ isBottomOpen: !state.isBottomOpen })),
    setBottomOpen: (open) => set({ isBottomOpen: open }),

    isExecuting: false,
    setIsExecuting: (executing) => set({ isExecuting: executing }),

    outputResult: null,
    setOutputResult: (res) => set({ outputResult: res }),

    cursorPos: { line: 1, col: 1 },
    setCursorPos: (pos) => set({ cursorPos: pos }),
  };
});
