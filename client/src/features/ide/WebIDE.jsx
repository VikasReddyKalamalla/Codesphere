import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  FileText, Folder, Plus, Trash2, Search, Save, Play, Settings,
  ChevronRight, ChevronDown, Download, RotateCcw, Terminal
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WebIDE = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [fileLanguage, setFileLanguage] = useState('plaintext');
  const [expandedDirs, setExpandedDirs] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef(null);

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

  // Open file
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

      setActiveFile(file);
      setFileContent(response.data.data.content);
      setFileLanguage(response.data.data.language);
      setUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to open file');
    } finally {
      setIsLoading(false);
    }
  };

  // Save file
  const saveFile = async () => {
    if (!activeFile) return;

    try {
      await apiClient.post('/file', {
        filePath: activeFile.path,
        content: fileContent,
      });
      setUnsavedChanges(false);
      toast.success('File saved');
    } catch (error) {
      toast.error('Failed to save file');
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
      {/* Header */}
      <div className="bg-gray-800 p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">Web IDE</h1>
          {activeProject && <span className="text-sm text-gray-400">{activeProject}</span>}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={createWorkspace}
            className="p-2 hover:bg-gray-700 rounded"
            title="New Project"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-gray-700 rounded"
            title="Search"
          >
            <Search size={18} />
          </button>
          {unsavedChanges && (
            <button onClick={saveFile} className="p-2 bg-blue-600 hover:bg-blue-700 rounded" title="Save">
              <Save size={18} />
            </button>
          )}
          <button className="p-2 hover:bg-gray-700 rounded" title="Settings">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-gray-800 p-2 flex gap-2 border-b">
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-2 py-1 bg-gray-700 rounded text-sm"
          />
          <button onClick={handleSearch} className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700">
            Search
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - File Explorer */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto flex flex-col">
          <div className="p-3 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">EXPLORER</span>
              <button onClick={createNewFile} className="p-1 hover:bg-gray-700 rounded" title="New File">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {files.length > 0 ? <FileTree items={files} /> : <p className="text-gray-500 text-sm p-2">No files</p>}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Tabs */}
          {activeFile && (
            <div className="bg-gray-800 border-b border-gray-700 flex items-center overflow-x-auto">
              <div className="flex items-center gap-1 p-2 bg-gray-700 rounded-t">
                <FileText size={14} />
                <span className="text-sm">{activeFile.name}</span>
                {unsavedChanges && <span className="text-yellow-400">●</span>}
              </div>
            </div>
          )}

          {/* Editor */}
          {activeFile ? (
            <div className="flex-1 overflow-hidden">
              <Editor
                ref={editorRef}
                height="100%"
                language={fileLanguage}
                value={fileContent}
                onChange={(value) => {
                  setFileContent(value);
                  setUnsavedChanges(true);
                }}
                theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                options={{
                  minimap: { enabled: true },
                  wordWrap: 'on',
                  formatOnPaste: true,
                  formatOnType: true,
                  autoClosingBrackets: 'always',
                  autoClosingQuotes: 'always',
                }}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>Open a file to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between text-xs border-t border-gray-700">
        <div className="flex items-center gap-4">
          {activeFile && (
            <>
              <span>{fileLanguage}</span>
              <span>Ln 1, Col 1</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="hover:bg-gray-700 px-2 py-1 rounded">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebIDE;
