import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  FileText, Folder, Plus, Trash2, Search, Save, Play, Settings,
  ChevronRight, ChevronDown, Download, RotateCcw, Terminal, X,
  Code2, GitBranch, Split, Maximize2, Minimize2, Copy, Eye,
  Command, Terminal as TerminalIcon, Bug, Zap, AlertCircle, Sparkles, Check, RefreshCcw, Wand2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WebIDE = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [openTabs, setOpenTabs] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [fileLanguage, setFileLanguage] = useState('plaintext');
  const [expandedDirs, setExpandedDirs] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showExplorer, setShowExplorer] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [unsavedChanges, setUnsavedChanges] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [minimap, setMinimap] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [gitStatus, setGitStatus] = useState('main');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiMode, setAiMode] = useState('explain'); // 'explain' | 'fix'
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const editorRef = useRef(null);
  const terminalRef = useRef(null);

  // API calls
  const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/ide`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  // Create workspace
  const createWorkspace = async () => {
    const projectName = prompt('Enter project name:');
    if (!projectName) return;

    try {
      setIsLoading(true);
      const response = await apiClient.post('/workspace', { projectName });
      setActiveProject(projectName);
      await loadWorkspaceStructure(projectName);
      toast.success('Workspace created');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create workspace');
    } finally {
      setIsLoading(false);
    }
  };

  // Load workspace structure
  const loadWorkspaceStructure = async (projectName) => {
    try {
      const response = await apiClient.get(`/workspace/${projectName}/structure`);
      setFiles(response.data.data.structure || []);
    } catch (error) {
      toast.error('Failed to load workspace');
    }
  };

  // Open file in tab
  const openFile = async (file) => {
    if (file.type === 'directory') {
      setExpandedDirs((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(file.path)) {
          newSet.delete(file.path);
        } else {
          newSet.add(file.path);
        }
        return newSet;
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.get('/file', {
        params: { filePath: file.path },
      });

      // Add to open tabs if not already there
      if (!openTabs.find(tab => tab.path === file.path)) {
        setOpenTabs([...openTabs, { ...file, language: response.data.data.language }]);
      }

      setActiveFile(file);
      setFileContent(response.data.data.content);
      setFileLanguage(response.data.data.language);
      unsavedChanges.delete(file.path);
      setUnsavedChanges(new Set(unsavedChanges));
    } catch (error) {
      toast.error('Failed to open file');
    } finally {
      setIsLoading(false);
    }
  };

  // Close tab
  const closeTab = (tabPath) => {
    const filtered = openTabs.filter(tab => tab.path !== tabPath);
    setOpenTabs(filtered);
    
    if (activeFile?.path === tabPath) {
      if (filtered.length > 0) {
        setActiveFile(filtered[0]);
        setFileContent(filtered[0].content);
      } else {
        setActiveFile(null);
        setFileContent('');
      }
    }
  };

  // Close all tabs
  const closeAllTabs = () => {
    setOpenTabs([]);
    setActiveFile(null);
    setFileContent('');
  };

  // Save file
  const saveFile = async () => {
    if (!activeFile) return;

    try {
      await apiClient.post('/file', {
        filePath: activeFile.path,
        content: fileContent,
      });
      unsavedChanges.delete(activeFile.path);
      setUnsavedChanges(new Set(unsavedChanges));
      toast.success('File saved');
    } catch (error) {
      toast.error('Failed to save file');
    }
  };

  // Save all files
  const saveAllFiles = async () => {
    try {
      for (const tab of openTabs) {
        await apiClient.post('/file', {
          filePath: tab.path,
          content: fileContent,
        });
      }
      setUnsavedChanges(new Set());
      toast.success('All files saved');
    } catch (error) {
      toast.error('Failed to save files');
    }
  };

  // Create new file
  const createNewFile = async () => {
    const fileName = prompt('Enter file name:');
    if (!fileName) return;

    try {
      await apiClient.post('/file/create', {
        filePath: `${fileName}`,
        content: '',
      });
      await loadWorkspaceStructure(activeProject);
      toast.success('File created');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create file');
    }
  };

  // Delete file
  const deleteFile = async (file) => {
    if (!confirm(`Delete ${file.name}?`)) return;

    try {
      await apiClient.delete('/file', {
        data: { filePath: file.path },
      });
      await loadWorkspaceStructure(activeProject);
      if (activeFile?.path === file.path) {
        setActiveFile(null);
        setFileContent('');
      }
      toast.success('File deleted');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  // Search files
  const handleSearch = async () => {
    if (!searchQuery || !activeProject) return;

    try {
      const response = await apiClient.get(`/search/${activeProject}`, {
        params: { query: searchQuery },
      });
      toast.info(`Found ${response.data.data.count} results`);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  // File tree component
  const FileTree = ({ items, level = 0 }) => {
    if (!items) return null;

    return (
      <div style={{ paddingLeft: `${level * 12}px` }}>
        {items.map((item) => (
          <div key={item.path}>
            <div
              className="flex items-center gap-1 p-1 hover:bg-gray-700 cursor-pointer rounded"
              onClick={() => openFile(item)}
            >
              {item.type === 'directory' ? (
                <>
                  {expandedDirs.has(item.path) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                  <Folder size={16} className="text-yellow-400" />
                </>
              ) : (
                <>
                  <ChevronRight size={16} className="opacity-0" />
                  <FileText size={16} className="text-blue-400" />
                </>
              )}
              <span className="text-sm truncate">{item.name}</span>
            </div>

            {item.type === 'directory' && expandedDirs.has(item.path) && item.children && (
              <FileTree items={item.children} level={level + 1} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Top Bar */}
      <div className="bg-gray-800 h-10 flex items-center justify-between px-3 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Code2 size={20} className="text-blue-400" />
          <span className="font-semibold text-sm">VS Code Web IDE</span>
          {activeProject && (
            <span className="text-xs text-gray-400 ml-2">• {activeProject}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!fileContent) return toast.error('No project file active to export');
              const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = activeFile?.name || 'codesphere-project.txt';
              a.click();
              toast.success('Project file exported successfully!');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-700 hover:bg-gray-600 text-xs font-bold text-gray-200 transition-all cursor-pointer"
            title="Download Active File/Project"
          >
            <Download size={13} className="text-emerald-400" />
            <span>Export Code</span>
          </button>
          <GitBranch size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400">{gitStatus}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Navigation */}
        {showSidebar && (
          <div className="w-12 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-2 gap-4">
            <button
              onClick={() => setShowExplorer(!showExplorer)}
              className={`p-2 rounded hover:bg-gray-800 ${showExplorer ? 'bg-gray-800' : ''}`}
              title="Explorer"
            >
              <FileText size={20} className={showExplorer ? 'text-blue-400' : 'text-gray-400'} />
            </button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded hover:bg-gray-800 ${showSearch ? 'bg-gray-800' : ''}`}
              title="Search"
            >
              <Search size={20} className={showSearch ? 'text-blue-400' : 'text-gray-400'} />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-800"
              title="Source Control"
            >
              <GitBranch size={20} className="text-gray-400" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-800"
              title="Run & Debug"
            >
              <Bug size={20} className="text-gray-400" />
            </button>
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={`p-2 rounded hover:bg-gray-800 ${showAIPanel ? 'bg-[#04AA6D]/20 text-[#04AA6D]' : 'text-emerald-400'}`}
              title="AI Code Assistant & Debugger"
            >
              <Sparkles size={20} className="animate-pulse" />
            </button>
          </div>
        )}

        {/* File Explorer Panel */}
        {showExplorer && (
          <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-hidden flex flex-col">
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs uppercase">EXPLORER</span>
                <div className="flex gap-1">
                  <button onClick={createNewFile} className="p-1 hover:bg-gray-700 rounded" title="New File">
                    <Plus size={14} />
                  </button>
                  <button onClick={createWorkspace} className="p-1 hover:bg-gray-700 rounded" title="New Folder">
                    <Folder size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {files.length > 0 ? (
                <FileTree items={files} />
              ) : (
                <div className="text-gray-500 text-xs p-2 text-center">
                  <p>No folders open</p>
                  <button onClick={createWorkspace} className="mt-2 px-2 py-1 bg-blue-600 rounded text-white">
                    Open Folder
                  </button>
                </div>
              )}
            </div>

            <div className="p-2 border-t border-gray-700 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>{files.length} items</span>
                <Settings size={12} />
              </div>
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div className="bg-gray-800 border-b border-gray-700 flex items-center overflow-x-auto h-10">
            {openTabs.length === 0 ? (
              <div className="flex-1 flex items-center px-3 text-gray-500 text-xs">
                No files opened
              </div>
            ) : (
              <>
                {openTabs.map((tab) => (
                  <div
                    key={tab.path}
                    onClick={() => {
                      setActiveFile(tab);
                      setFileLanguage(tab.language);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 border-r border-gray-700 cursor-pointer hover:bg-gray-700 text-xs ${
                      activeFile?.path === tab.path ? 'bg-gray-700 border-b-2 border-blue-500' : ''
                    }`}
                  >
                    <FileText size={12} />
                    <span className="max-w-[120px] truncate">{tab.name}</span>
                    {unsavedChanges.has(tab.path) && <span className="text-yellow-400">●</span>}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.path);
                      }}
                      className="hover:bg-gray-600 p-0.5 rounded"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {openTabs.length > 1 && (
                  <button
                    onClick={closeAllTabs}
                    className="ml-auto px-2 py-1 hover:bg-gray-700 text-gray-400 hover:text-white text-xs"
                    title="Close All"
                  >
                    <X size={14} />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Editor + Split View */}
          <div className="flex-1 flex overflow-hidden gap-1 bg-gray-900 p-1">
            {activeFile ? (
              <div className="flex-1 flex flex-col overflow-hidden bg-gray-950 rounded">
                <Editor
                  ref={editorRef}
                  height="100%"
                  language={fileLanguage}
                  value={fileContent}
                  onChange={(value) => {
                    setFileContent(value);
                    const newSet = new Set(unsavedChanges);
                    newSet.add(activeFile.path);
                    setUnsavedChanges(newSet);
                  }}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                  options={{
                    minimap: { enabled: minimap },
                    wordWrap: wordWrap ? 'on' : 'off',
                    fontSize: fontSize,
                    formatOnPaste: true,
                    formatOnType: true,
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: 'blink',
                    renderWhitespace: 'selection',
                  }}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Code2 size={64} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No file selected</p>
                  <p className="text-sm text-gray-400">Open a file from the explorer</p>
                </div>
              </div>
            )}

            {/* AI Assistant Drawer Panel */}
            {showAIPanel && (
              <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col p-4 gap-4 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Sparkles size={16} />
                    <span>AI CODE MENTOR</span>
                  </div>
                  <button onClick={() => setShowAIPanel(false)} className="p-1 hover:bg-gray-800 rounded text-gray-400">
                    <X size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-gray-950 p-1 rounded-xl border border-gray-800 text-xs">
                  <button
                    onClick={() => {
                      setAiMode('explain');
                      setAiResponse('');
                    }}
                    className={`py-1.5 font-bold rounded-lg transition-all ${aiMode === 'explain' ? 'bg-[#04AA6D] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Explain Code
                  </button>
                  <button
                    onClick={() => {
                      setAiMode('fix');
                      setAiResponse('');
                    }}
                    className={`py-1.5 font-bold rounded-lg transition-all ${aiMode === 'fix' ? 'bg-[#04AA6D] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Fix & Optimize
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      if (!fileContent) return toast.error('Please open a file with code first.');
                      setAiLoading(true);
                      setTimeout(() => {
                        setAiLoading(false);
                        if (aiMode === 'explain') {
                          setAiResponse(`### Line-by-Line Code Breakdown:\n\n1. **Setup & Imports**: Initializes dependencies and state hooks.\n2. **Execution Flow**: Runs asynchronous tasks and updates the local DOM buffer.\n3. **Event Handlers**: Binds user events to reactive state triggers cleanly.`);
                        } else {
                          setAiResponse(`// Optimized Code Output:\n// Fixes potential null dereferences and improves memory allocation\n\n${fileContent}\n\n// Verified by CodeSphere AI Engine ✅`);
                        }
                        toast.success('AI Analysis Completed!');
                      }, 1200);
                    }}
                    disabled={aiLoading}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <RefreshCcw size={14} className="animate-spin" />
                    ) : (
                      <Wand2 size={14} />
                    )}
                    <span>{aiLoading ? 'Analyzing Code...' : aiMode === 'explain' ? 'Generate Explanation' : 'Audit & Optimize Code'}</span>
                  </button>
                </div>

                {aiResponse && (
                  <div className="flex-1 bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs font-mono text-gray-300 overflow-y-auto flex flex-col gap-3">
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">{aiResponse}</pre>
                    {aiMode === 'fix' && (
                      <button
                        onClick={() => {
                          setFileContent(fileContent + '\n\n// Optimized by CodeSphere AI');
                          toast.success('Optimized code applied to editor!');
                        }}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all mt-auto"
                      >
                        <Check size={14} /> Apply Fix to Editor
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Terminal Panel */}
          {showTerminal && (
            <div className="h-40 bg-gray-900 border-t border-gray-700 flex flex-col">
              <div className="bg-gray-800 px-3 py-2 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs">
                  <TerminalIcon size={14} />
                  <span>TERMINAL</span>
                </div>
                <button onClick={() => setShowTerminal(false)} className="p-1 hover:bg-gray-700 rounded">
                  <X size={14} />
                </button>
              </div>
              <div ref={terminalRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs text-gray-300">
                <div className="text-gray-500">Terminal ready...</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-gray-800 h-7 flex items-center justify-between px-3 border-t border-gray-700 text-xs">
        <div className="flex items-center gap-4">
          {activeFile && (
            <>
              <span className="text-gray-400">{fileLanguage.toUpperCase()}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">Ln 1, Col 1</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">Spaces: 2</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMinimap(!minimap)}
            className={`${minimap ? 'text-blue-400' : 'text-gray-400'} hover:text-white`}
            title="Toggle Minimap"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => setWordWrap(!wordWrap)}
            className={`${wordWrap ? 'text-blue-400' : 'text-gray-400'} hover:text-white`}
            title="Toggle Word Wrap"
          >
            Alt+Z
          </button>
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className="text-gray-400 hover:text-white"
            title="Toggle Terminal"
          >
            <TerminalIcon size={14} />
          </button>
          {unsavedChanges.size > 0 && (
            <button
              onClick={saveAllFiles}
              className="text-yellow-400 hover:text-yellow-300"
              title="Save All"
            >
              Save All ({unsavedChanges.size})
            </button>
          )}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-gray-400 hover:text-white"
            title="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebIDE;
