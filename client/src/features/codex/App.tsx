import React, { useState, useEffect, useRef, useCallback, Suspense, lazy, useContext } from 'react';
import { WorkspaceFile } from './types/codex';
import { executeCode } from './services/codeRunner';
import { realtimeSync, SyncPayload } from './services/realtimeSync';
import { TitleBar } from './components/TitleBar';
import { ActivityBar, ActivityTab } from './components/ActivityBar';
import { FileExplorer } from './components/FileExplorer';
import { EditorArea } from './components/EditorArea';
import { BottomPanel } from './components/BottomPanel';
import { StatusBar } from './components/StatusBar';
import { QuickOpenModal } from './components/QuickOpenModal';
import { LanguagePickerModal } from './components/LanguagePickerModal';
import { FavoritesModal } from './components/FavoritesModal';
import { CreateItemModal } from './components/CreateItemModal';
import { OpenFolderModal } from './components/OpenFolderModal';
import { CloneRepoModal } from './components/CloneRepoModal';
import { AuthModal } from './components/auth/AuthModal';
import { WorkspaceDashboard } from './components/workspace/WorkspaceDashboard';
import { ShareCollabModal } from './components/workspace/ShareCollabModal';
import { saveWorkspaceFilesDebounced } from './services/workspacePersistence';
import { PanelErrorBoundary } from './components/common/PanelErrorBoundary';
import { voiceMeshService } from './services/voiceMesh';
import { useWorkspaceStore } from './store/workspaceStore';
import { workspaceCollab } from './services/yjsCollab';
import { ThemeContext } from '@providers/ThemeProvider.jsx';
import { useSelector } from 'react-redux';

// Lazy-loaded secondary sidebar panels for optimal bundle splitting
const SearchPanel = lazy(() =>
  import('./components/SearchPanel').then((m) => ({ default: m.SearchPanel }))
);
const GitPanel = lazy(() =>
  import('./components/GitPanel').then((m) => ({ default: m.GitPanel }))
);
const RunDebugPanel = lazy(() =>
  import('./components/RunDebugPanel').then((m) => ({ default: m.RunDebugPanel }))
);
const ExtensionsPanel = lazy(() =>
  import('./components/ExtensionsPanel').then((m) => ({ default: m.ExtensionsPanel }))
);
const VoiceChannelPanel = lazy(() =>
  import('./components/VoiceChannelPanel').then((m) => ({ default: m.VoiceChannelPanel }))
);
const ApiTesterPanel = lazy(() =>
  import('./components/ApiTesterPanel').then((m) => ({ default: m.ApiTesterPanel }))
);
const SprintKanbanPanel = lazy(() =>
  import('./components/SprintKanbanPanel').then((m) => ({ default: m.SprintKanbanPanel }))
);
const AICopilotPanel = lazy(() =>
  import('./components/AICopilotPanel').then((m) => ({ default: m.AICopilotPanel }))
);

function PanelLoadingFallback() {
  return (
    <div className="h-full w-full flex items-center justify-center p-4 text-xs text-[#71717a] font-mono">
      <span>Loading module...</span>
    </div>
  );
}

export default function App() {
  const { theme, toggleTheme: toggleCsTheme } = useContext(ThemeContext) || {};
  const {
    files,
    activeFileId,
    setFiles,
    setActiveFileId,
    createFile,
    deleteFile,
    renameFile,
    updateFileContent,
    closeFile,
    clearWorkspace,
    username,
    folderName,
    workspacePath,
    setUsername,
    setWorkspace,
    isDark: storeIsDark,
    toggleTheme: storeToggleTheme,
    wordWrap,
    toggleWordWrap,
    fontSize,
    activeActivityTab,
    setActiveActivityTab,
    isSideBarOpen,
    toggleSideBar,
    setSideBarOpen,
    isBottomOpen,
    toggleBottom,
    setBottomOpen,
    outputResult,
    setOutputResult,
    cursorPos,
    setCursorPos,
  } = useWorkspaceStore();

  const isDark = theme
    ? theme === 'dark'
    : typeof document !== 'undefined'
    ? document.documentElement.classList.contains('dark')
    : storeIsDark;

  const toggleTheme = toggleCsTheme || storeToggleTheme;

  useEffect(() => {
    if (useWorkspaceStore.getState().isDark !== isDark) {
      useWorkspaceStore.setState({ isDark });
    }
  }, [isDark]);

  const authUser = useSelector((state: any) => state?.auth?.user);
  useEffect(() => {
    const activeName = authUser?.username || authUser?.name;
    if (activeName) {
      if (username !== activeName) {
        setUsername(activeName);
      }
      realtimeSync.setUsername(activeName);
      workspaceCollab.setUserProfile(activeName);
    }
  }, [authUser, username, setUsername]);

  // Dialog states
  const [isQuickOpenOpen, setIsQuickOpenOpen] = useState(false);
  const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [newItemModal, setNewItemModal] = useState<{
    isOpen: boolean;
    isFolder: boolean;
    parentFolder?: string;
  }>({
    isOpen: false,
    isFolder: false,
  });
  const [isOpenFolderModalOpen, setIsOpenFolderModalOpen] = useState(false);
  const [isCloneRepoModalOpen, setIsCloneRepoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWorkspaceDashboardOpen, setIsWorkspaceDashboardOpen] = useState(false);
  const [isShareCollabOpen, setIsShareCollabOpen] = useState(false);

  // Debounced auto-save of files to persistent storage
  useEffect(() => {
    if (files.length > 0) {
      saveWorkspaceFilesDebounced(folderName || 'default-workspace', files);
    }
  }, [files, folderName]);

  // WebRTC Voice mesh state
  const [isVoiceConnected, setIsVoiceConnected] = useState<boolean>(
    voiceMeshService.getState() === 'connected'
  );

  useEffect(() => {
    const unsub = voiceMeshService.onStateChange((state) => {
      setIsVoiceConnected(state === 'connected');
    });
    return () => unsub();
  }, []);

  const handleToggleVoice = useCallback(() => {
    if (activeActivityTab === 'voice' && isSideBarOpen) {
      setSideBarOpen(false);
    } else {
      setActiveActivityTab('voice');
      setSideBarOpen(true);
    }
  }, [activeActivityTab, isSideBarOpen, setActiveActivityTab, setSideBarOpen]);

  const monacoEditorRef = useRef<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Yjs CRDT session synchronization

  // Synchronize workspace files and active folder with shared Yjs session
  const lastSyncedJsonRef = useRef<string>('');
  useEffect(() => {
    if (files.length > 0) {
      const currentJson = JSON.stringify({ folderName, workspacePath, files, activeFileId });
      if (currentJson === lastSyncedJsonRef.current) return;
      lastSyncedJsonRef.current = currentJson;
      workspaceCollab.syncWorkspaceState({
        folderName,
        workspacePath,
        files,
        activeFileId,
      });
    }
  }, [files, folderName, workspacePath, activeFileId]);

  // Listen to shared workspace changes from Yjs CRDT room document
  useEffect(() => {
    const unsubYjs = workspaceCollab.onWorkspaceStateChange((syncedState) => {
      const state = useWorkspaceStore.getState();
      if (syncedState.files.length > 0) {
        if (state.files.length === 0 || state.folderName !== syncedState.folderName) {
          state.setWorkspace(syncedState.folderName, syncedState.workspacePath, syncedState.files);
          if (syncedState.activeFileId) {
            state.setActiveFileId(syncedState.activeFileId);
          }
        } else {
          let hasDiff = false;
          const merged = state.files.map((lf) => {
            const rf = syncedState.files.find((f) => f.id === lf.id || f.name === lf.name);
            if (rf && rf.content && rf.content !== lf.content && (!lf.content || lf.content.trim().length === 0)) {
              hasDiff = true;
              return { ...lf, content: rf.content };
            }
            return lf;
          });
          syncedState.files.forEach((rf) => {
            if (!merged.some((lf) => lf.id === rf.id || lf.name === rf.name)) {
              merged.push(rf);
              hasDiff = true;
            }
          });
          if (hasDiff) {
            state.setFiles(merged);
          }
        }
      }
    });
    return () => unsubYjs();
  }, []);

  // Request workspace snapshot on mount if empty
  useEffect(() => {
    if (useWorkspaceStore.getState().files.length === 0) {
      const timer = setTimeout(() => {
        realtimeSync.requestWorkspaceSync();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  // Real-time synchronization subscription (Cross-tab broadcast and peer sync)
  useEffect(() => {
    const unsubscribe = realtimeSync.subscribe((payload: SyncPayload) => {
      const state = useWorkspaceStore.getState();
      if (payload.type === 'FILE_CONTENT_CHANGE') {
        const data = payload.data as { fileId: string; content: string };
        state.updateFileContent(data.fileId, data.content);
      } else if (payload.type === 'FILE_CREATED') {
        const data = payload.data as { file: WorkspaceFile };
        if (!state.files.some((f) => f.id === data.file.id)) {
          state.setFiles([...state.files, data.file]);
        }
      } else if (payload.type === 'FILE_DELETED') {
        const data = payload.data as { fileId: string };
        state.deleteFile(data.fileId);
      } else if (payload.type === 'FILE_RENAMED') {
        const data = payload.data as { fileId: string; newName: string };
        state.renameFile(data.fileId, data.newName);
      } else if (payload.type === 'REQUEST_WORKSPACE_SYNC' || payload.type === 'PEER_JOIN') {
        // If a new peer joined and we have files, automatically push our active workspace
        if (state.files.length > 0) {
          realtimeSync.broadcastWorkspaceSync({
            folderName: state.folderName,
            workspacePath: state.workspacePath,
            files: state.files,
            activeFileId: state.activeFileId,
          });
        }
      } else if (payload.type === 'WORKSPACE_SYNC_RESPONSE' || payload.type === 'WORKSPACE_UPDATE') {
        const data = payload.data as {
          folderName: string;
          workspacePath: string;
          files: WorkspaceFile[];
          activeFileId: string | null;
        };
        if (data && Array.isArray(data.files) && data.files.length > 0) {
          if (state.files.length === 0 || state.folderName !== data.folderName) {
            state.setWorkspace(data.folderName, data.workspacePath, data.files);
            if (data.activeFileId) {
              state.setActiveFileId(data.activeFileId);
            }
          } else {
            let hasDiff = false;
            const merged = state.files.map((lf) => {
              const rf = data.files.find((f) => f.id === lf.id || f.name === lf.name);
              if (rf && rf.content && rf.content !== lf.content && (!lf.content || lf.content.trim().length === 0)) {
                hasDiff = true;
                return { ...lf, content: rf.content };
              }
              return lf;
            });
            data.files.forEach((rf) => {
              if (!merged.some((lf) => lf.id === rf.id || lf.name === rf.name)) {
                merged.push(rf);
                hasDiff = true;
              }
            });
            if (hasDiff) {
              state.setFiles(merged);
            }
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Universal Code Run handler
  const handleRunCode = useCallback(async () => {
    const current = files.find((f) => f.id === activeFileId);
    if (!current) return;

    const latestContent = monacoEditorRef.current?.getValue() ?? current.content;
    if (latestContent !== current.content) {
      updateFileContent(current.id, latestContent);
    }

    const lowerName = current.name.toLowerCase();
    const effectiveLang = lowerName.endsWith('.java')
      ? 'java'
      : lowerName.endsWith('.py')
      ? 'python'
      : lowerName.endsWith('.js') || lowerName.endsWith('.jsx')
      ? 'javascript'
      : lowerName.endsWith('.ts') || lowerName.endsWith('.tsx')
      ? 'typescript'
      : lowerName.endsWith('.cpp') || lowerName.endsWith('.cc')
      ? 'cpp'
      : lowerName.endsWith('.c')
      ? 'c'
      : lowerName.endsWith('.rb')
      ? 'ruby'
      : lowerName.endsWith('.sh') || lowerName.endsWith('.bash')
      ? 'bash'
      : current.language;

    setBottomOpen(true);
    const result = await executeCode(effectiveLang, latestContent, '', current.name);
    setOutputResult(result);
  }, [files, activeFileId, setBottomOpen, setOutputResult, updateFileContent]);

  // Manual save handler
  const handleSaveManual = useCallback(() => {
    setIsSaving(true);
    if (activeFileId) {
      const editorVal = monacoEditorRef.current?.getValue();
      const current = files.find((f) => f.id === activeFileId);
      const latestContent = editorVal !== undefined ? editorVal : (current?.content || '');
      setFiles(
        files.map((f) =>
          f.id === activeFileId ? { ...f, content: latestContent, isModified: false } : f
        )
      );
      updateFileContent(activeFileId, latestContent);
    }
    setTimeout(() => setIsSaving(false), 300);
  }, [files, activeFileId, setFiles, updateFileContent]);

  // Language change for active file
  const handleSelectLanguage = useCallback(
    (langId: string) => {
      if (!activeFileId) return;
      setFiles(files.map((f) => (f.id === activeFileId ? { ...f, language: langId } : f)));
    },
    [activeFileId, files, setFiles]
  );

  // Monaco Editor Actions Trigger
  const handleTriggerMonacoAction = useCallback((actionId: string) => {
    if (monacoEditorRef.current) {
      if (actionId === 'undo') {
        monacoEditorRef.current.trigger('menu', 'undo', null);
      } else if (actionId === 'redo') {
        monacoEditorRef.current.trigger('menu', 'redo', null);
      } else {
        monacoEditorRef.current.getAction(actionId)?.run();
      }
    }
  }, []);

  const handleFormatDocument = useCallback(() => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  }, []);

  // Insert AI generated code into Monaco Editor
  const handleInsertAICode = useCallback(
    (code: string) => {
      if (monacoEditorRef.current) {
        const editor = monacoEditorRef.current;
        const selection = editor.getSelection();
        if (selection) {
          editor.executeEdits('ai-copilot', [
            {
              range: selection,
              text: code,
              forceMoveMarkers: true,
            },
          ]);
          editor.focus();
          return;
        }
      }
      if (activeFileId) {
        const cur = files.find((f) => f.id === activeFileId);
        if (cur) {
          updateFileContent(activeFileId, cur.content ? `${cur.content}\n\n${code}` : code);
        }
      }
    },
    [activeFileId, files, updateFileContent]
  );

  // Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+O: Favorites
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'O' || e.key === 'o')) {
        e.preventDefault();
        setIsFavoritesOpen(true);
      }
      // Ctrl+O: Open Folder
      else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'O' || e.key === 'o')) {
        e.preventDefault();
        setIsOpenFolderModalOpen(true);
      }
      // Ctrl+Shift+V: Toggle Voice Mesh
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'V' || e.key === 'v')) {
        e.preventDefault();
        handleToggleVoice();
      }
      // Ctrl+Shift+A: Toggle API Tester
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActiveActivityTab(activeActivityTab === 'api' ? null : 'api');
      }
      // Ctrl+Shift+K: Toggle Sprint Kanban
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'K' || e.key === 'k')) {
        e.preventDefault();
        setActiveActivityTab(activeActivityTab === 'kanban' ? null : 'kanban');
      }
      // Ctrl+Shift+I: Toggle AI Copilot
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        setActiveActivityTab(activeActivityTab === 'copilot' ? null : 'copilot');
      }
      // Ctrl+P: Quick Open
      else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        setIsQuickOpenOpen(true);
      }
      // Ctrl+Alt+N: New File
      else if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'N' || e.key === 'n')) {
        e.preventDefault();
        setNewItemModal({ isOpen: true, isFolder: false });
      }
      // Ctrl+`: Toggle Terminal
      else if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.key === '~')) {
        e.preventDefault();
        toggleBottom();
      }
      // Ctrl+B: Toggle Sidebar
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'B' || e.key === 'b')) {
        e.preventDefault();
        toggleSideBar();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleToggleVoice, activeActivityTab, setActiveActivityTab, toggleBottom, toggleSideBar]);

  const currentActiveFile = files.find((f) => f.id === activeFileId);

  return (
    <div
      className={`w-full h-full min-h-0 flex-1 flex flex-col overflow-hidden font-sans select-none transition-colors duration-150 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* 1. TitleBar with Menus, Quick Open Trigger, Window Controls */}
      <PanelErrorBoundary panelName="Title Bar">
        <TitleBar
          onNewFile={() => setNewItemModal({ isOpen: true, isFolder: false })}
          onNewFolder={() => setNewItemModal({ isOpen: true, isFolder: true })}
          onOpenFolder={() => setIsOpenFolderModalOpen(true)}
          onCloneRepo={() => setIsCloneRepoModalOpen(true)}
          onSaveFile={handleSaveManual}
          onCloseActiveFile={() => activeFileId && closeFile(activeFileId)}
          onClearWorkspace={clearWorkspace}
          onRunCode={handleRunCode}
          onToggleTerminal={toggleBottom}
          onToggleSideBar={toggleSideBar}
          onOpenQuickOpen={() => setIsQuickOpenOpen(true)}
          onToggleWordWrap={toggleWordWrap}
          onFormatDocument={handleFormatDocument}
          onTriggerMonacoAction={handleTriggerMonacoAction}
          onOpenWelcome={() => setActiveFileId(null)}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          onToggleVoice={handleToggleVoice}
          onSelectActivityTab={(tab) => {
            setActiveActivityTab(tab);
            setSideBarOpen(true);
          }}
          onOpenSettings={() => setIsLanguagePickerOpen(true)}
          isVoiceConnected={isVoiceConnected}
          isSideBarOpen={isSideBarOpen}
          isTerminalOpen={isBottomOpen}
          folderName={folderName}
          activeFileName={currentActiveFile?.name}
          username={username}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onOpenAccount={() => setIsAuthModalOpen(true)}
          onOpenWorkspaceDashboard={() => setIsWorkspaceDashboardOpen(true)}
          onOpenShareCollab={() => setIsShareCollabOpen(true)}
        />
      </PanelErrorBoundary>

      {/* 2. Main Center Body: ActivityBar + SideBar + Editor Area + Terminal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Leftmost Activity Bar */}
        <ActivityBar
          activeTab={activeActivityTab}
          onSelectTab={(tab) => setActiveActivityTab(tab)}
          isDark={isDark}
          onOpenSettings={() => setIsLanguagePickerOpen(true)}
          isVoiceConnected={isVoiceConnected}
        />

        {/* Dynamic Primary Side Bar with Error Boundary */}
        {isSideBarOpen && (
          <PanelErrorBoundary panelName="Sidebar Panel">
            <div
              className={`h-full shrink-0 border-r ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              } transition-all duration-200 overflow-hidden ${
                activeActivityTab === 'kanban'
                  ? 'w-[780px] max-w-[85vw]'
                  : activeActivityTab === 'api'
                  ? 'w-[520px] max-w-[70vw]'
                  : activeActivityTab === 'copilot'
                  ? 'w-80 max-w-[50vw]'
                  : activeActivityTab === 'voice'
                  ? 'w-72 max-w-[50vw]'
                  : 'w-64'
              }`}
            >
              {activeActivityTab === 'explorer' && (
                <FileExplorer
                  files={files}
                  activeFileId={activeFileId}
                  onSelectFile={(id) => {
                    setFiles(files.map((f) => (f.id === id ? { ...f, isOpen: true } : f)));
                    setActiveFileId(id);
                  }}
                  onCreateFile={createFile}
                  onDeleteFile={deleteFile}
                  onRenameFile={renameFile}
                  folderName={folderName}
                  workspacePath={workspacePath}
                  onOpenFolderModal={() => setIsOpenFolderModalOpen(true)}
                  onRequestNewItem={(isFolder, parent) =>
                    setNewItemModal({ isOpen: true, isFolder, parentFolder: parent })
                  }
                  isDark={isDark}
                />
              )}

              <Suspense fallback={<PanelLoadingFallback />}>
                {activeActivityTab === 'search' && (
                  <SearchPanel
                    files={files}
                    onSelectFile={(id) => {
                      setFiles(files.map((f) => (f.id === id ? { ...f, isOpen: true } : f)));
                      setActiveFileId(id);
                    }}
                    isDark={isDark}
                  />
                )}

                {activeActivityTab === 'git' && (
                  <GitPanel
                    files={files}
                    onCommitSuccess={() => {
                      setFiles(files.map((f) => ({ ...f, isModified: false })));
                    }}
                    isDark={isDark}
                  />
                )}

                {activeActivityTab === 'debug' && (
                  <RunDebugPanel
                    activeFile={currentActiveFile}
                    onRunCode={handleRunCode}
                    outputResult={outputResult}
                    isDark={isDark}
                  />
                )}

                {activeActivityTab === 'copilot' && (
                  <AICopilotPanel
                    isDark={isDark}
                    activeFile={currentActiveFile}
                    onInsertCode={handleInsertAICode}
                  />
                )}

                {activeActivityTab === 'api' && <ApiTesterPanel isDark={isDark} />}

                {activeActivityTab === 'kanban' && (
                  <SprintKanbanPanel
                    isDark={isDark}
                    files={files}
                    onOpenFile={(id) => {
                      setFiles(files.map((f) => (f.id === id ? { ...f, isOpen: true } : f)));
                      setActiveFileId(id);
                    }}
                  />
                )}

                {activeActivityTab === 'extensions' && <ExtensionsPanel isDark={isDark} />}

                {activeActivityTab === 'voice' && (
                  <VoiceChannelPanel
                    isDark={isDark}
                    onCallStateChange={(isInCall) => setIsVoiceConnected(isInCall)}
                    onFollowParticipant={(name: string) => {
                      const cursors = realtimeSync.getRemoteCursors();
                      const target = cursors.find((c) =>
                        c.userName.toLowerCase().includes(name.toLowerCase())
                      );
                      if (target && monacoEditorRef.current) {
                        monacoEditorRef.current.revealPositionInCenter({
                          lineNumber: target.lineNumber,
                          column: target.column,
                        });
                        monacoEditorRef.current.setPosition({
                          lineNumber: target.lineNumber,
                          column: target.column,
                        });
                        monacoEditorRef.current.focus();
                      }
                    }}
                  />
                )}
              </Suspense>
            </div>
          </PanelErrorBoundary>
        )}

        {/* Central Area: Editor Area & Bottom Terminal Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <PanelErrorBoundary panelName="Monaco Editor">
              <EditorArea
                files={files}
                activeFileId={activeFileId}
                onSelectFile={(id) => {
                  setFiles(files.map((f) => (f.id === id ? { ...f, isOpen: true } : f)));
                  setActiveFileId(id);
                }}
                onCloseFile={closeFile}
                onUpdateContent={updateFileContent}
                onRunCode={handleRunCode}
                isDark={isDark}
                isSaving={isSaving}
                onSaveManual={handleSaveManual}
                onOpenQuickOpen={() => setIsQuickOpenOpen(true)}
                onOpenLanguagePicker={() => setIsLanguagePickerOpen(true)}
                onOpenFolder={() => setIsOpenFolderModalOpen(true)}
                onCloneRepo={() => setIsCloneRepoModalOpen(true)}
                onSelectWorkspace={(name: string, path: string) => setWorkspace(name, path)}
                onNewFile={() => setNewItemModal({ isOpen: true, isFolder: false })}
                onNewFolder={() => setNewItemModal({ isOpen: true, isFolder: true })}
                folderName={folderName}
                wordWrap={wordWrap}
                onToggleWordWrap={toggleWordWrap}
                fontSize={fontSize}
                onMountEditor={(editor) => {
                  monacoEditorRef.current = editor;
                }}
                onCursorChange={setCursorPos}
                onOpenShareCollab={() => setIsShareCollabOpen(true)}
              />
            </PanelErrorBoundary>
          </div>

          <PanelErrorBoundary panelName="Terminal Bottom Dock">
            <BottomPanel
              isDark={isDark}
              isOpen={isBottomOpen}
              onToggleOpen={toggleBottom}
              outputResult={outputResult}
              files={files}
              onFileCreate={createFile}
              onFileDelete={deleteFile}
              onFileUpdate={updateFileContent}
              username={username}
              workspacePath={workspacePath}
              onWorkspacePathChange={(newPath) => {
                useWorkspaceStore.setState({ workspacePath: newPath });
              }}
              onUsernameChange={(newUser) => {
                setUsername(newUser);
                useWorkspaceStore.setState({ workspacePath: `C:\\Users\\${newUser}\\workspace` });
              }}
              onJumpToLine={(filePath, line, col) => {
                const target = files.find(
                  (f) => f.path === filePath || f.name === filePath || f.id === filePath
                );
                if (target) {
                  setFiles(
                    files.map((f) => (f.id === target.id ? { ...f, isOpen: true } : f))
                  );
                  setActiveFileId(target.id);
                }
                if (monacoEditorRef.current) {
                  monacoEditorRef.current.revealPositionInCenter({
                    lineNumber: line,
                    column: col || 1,
                  });
                  monacoEditorRef.current.setPosition({
                    lineNumber: line,
                    column: col || 1,
                  });
                  monacoEditorRef.current.focus();
                }
              }}
            />
          </PanelErrorBoundary>
        </div>
      </div>

      {/* 3. Bottom Status Bar */}
      <StatusBar
        language={currentActiveFile?.language || 'Plain Text'}
        line={cursorPos.line}
        col={cursorPos.col}
        onOpenLanguagePicker={() => setIsLanguagePickerOpen(true)}
        onToggleTerminal={toggleBottom}
        isDark={isDark}
      />

      {/* 4. Modals */}
      <QuickOpenModal
        isOpen={isQuickOpenOpen}
        onClose={() => setIsQuickOpenOpen(false)}
        files={files}
        onSelectFile={(id) => {
          setFiles(files.map((f) => (f.id === id ? { ...f, isOpen: true } : f)));
          setActiveFileId(id);
        }}
        isDark={isDark}
      />

      <LanguagePickerModal
        isOpen={isLanguagePickerOpen}
        onClose={() => setIsLanguagePickerOpen(false)}
        currentLanguage={currentActiveFile?.language || 'javascript'}
        onSelectLanguage={handleSelectLanguage}
        isDark={isDark}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        files={files}
        onSelectFile={(id) => {
          setFiles(files.map((f) => (f.id === id ? { ...f, isOpen: true } : f)));
          setActiveFileId(id);
        }}
        onSelectWorkspace={(name: string, path: string) => setWorkspace(name, path)}
        isDark={isDark}
      />

      <CreateItemModal
        isOpen={newItemModal.isOpen}
        isFolder={newItemModal.isFolder}
        folderName={folderName}
        parentFolder={newItemModal.parentFolder}
        onClose={() => setNewItemModal((prev) => ({ ...prev, isOpen: false }))}
        onCreate={(name, isFolder, parent) => createFile(name, isFolder, parent)}
        isDark={isDark}
      />

      <OpenFolderModal
        isOpen={isOpenFolderModalOpen}
        currentFolderName={folderName}
        currentWorkspacePath={workspacePath}
        username={username}
        onClose={() => setIsOpenFolderModalOpen(false)}
        onSelectFolder={(name, path, loadedFiles) => setWorkspace(name, path, loadedFiles)}
        isDark={isDark}
      />

      <CloneRepoModal
        isOpen={isCloneRepoModalOpen}
        username={username}
        onClose={() => setIsCloneRepoModalOpen(false)}
        onCloneSuccess={(name, path, clonedFiles) => setWorkspace(name, path, clonedFiles)}
        isDark={isDark}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <WorkspaceDashboard
        isOpen={isWorkspaceDashboardOpen}
        onClose={() => setIsWorkspaceDashboardOpen(false)}
        currentWorkspaceName={folderName}
        files={files}
        onSwitchWorkspace={(name, loadedFiles) => setWorkspace(name, workspacePath, loadedFiles)}
        onImportFiles={(newFiles) => setFiles(newFiles)}
        isDark={isDark}
      />

      <ShareCollabModal
        isOpen={isShareCollabOpen}
        onClose={() => setIsShareCollabOpen(false)}
        isDark={isDark}
        currentFileName={files.find((f) => f.id === activeFileId)?.name}
      />
    </div>
  );
}
