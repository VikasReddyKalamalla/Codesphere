import React, { useState } from 'react';
import { 
  Folder, FolderOpen, FileCode, Plus, Edit2, Trash2, 
  Copy, Download, Upload, ChevronRight, ChevronDown, Search 
} from 'lucide-react';
import toast from 'react-hot-toast';

export const WorkspaceFiles = ({ 
  files = [], 
  activeFile = null, 
  onSelectFile, 
  onCreateFile, 
  onCreateFolder, 
  onRename, 
  onDelete, 
  onDuplicate, 
  onUpload 
}) => {
  const [expandedFolders, setExpandedFolders] = useState({ '': true });
  const [searchQuery, setSearchQuery] = useState('');
  const [namingInput, setNamingInput] = useState(null); 
  const [renameInput, setRenameInput] = useState(null); 
  const [inputValue, setInputValue] = useState('');

  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const buildTree = () => {
    const root = { name: 'Root', type: 'folder', children: {}, path: '' };
    files.forEach(file => {
      const parts = file.path.split('/');
      let current = root;
      parts.forEach((part, idx) => {
        const isLast = idx === parts.length - 1;
        if (!current.children[part]) {
          current.children[part] = {
            _id: isLast ? file._id : null,
            name: part,
            type: isLast ? file.type : 'folder',
            path: parts.slice(0, idx + 1).join('/'),
            content: isLast ? file.content : '',
            children: {}
          };
        }
        current = current.children[part];
      });
    });
    return root;
  };

  const handleStartCreate = (type, parentPath) => {
    setNamingInput({ type, parentPath });
    setInputValue('');
  };

  const handleStartRename = (file) => {
    setRenameInput({ _id: file._id, oldPath: file.path, oldName: file.name });
    setInputValue(file.name);
  };

  const handleSaveCreate = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return setNamingInput(null);

    const fullPath = namingInput.parentPath
      ? `${namingInput.parentPath}/${inputValue.trim()}`
      : inputValue.trim();

    if (namingInput.type === 'file') {
      onCreateFile(inputValue.trim(), fullPath);
    } else {
      onCreateFolder(inputValue.trim(), fullPath);
    }
    setNamingInput(null);
  };

  const handleSaveRename = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || inputValue.trim() === renameInput.oldName) return setRenameInput(null);

    const dir = renameInput.oldPath.includes('/') 
      ? renameInput.oldPath.substring(0, renameInput.oldPath.lastIndexOf('/'))
      : '';
    const newPath = dir ? `${dir}/${inputValue.trim()}` : inputValue.trim();

    onRename(renameInput._id, inputValue.trim(), newPath);
    setRenameInput(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', ''); 
    onUpload(formData);
  };

  const renderNode = (node) => {
    const hasChildren = Object.keys(node.children).length > 0;
    const isExpanded = expandedFolders[node.path];
    const isActive = activeFile && activeFile.path === node.path;

    if (node.path === '') {
      return (
        <div className="space-y-1">
          {Object.values(node.children).map(child => renderNode(child))}
        </div>
      );
    }

    const isFolder = node.type === 'folder';

    if (searchQuery && !node.path.toLowerCase().includes(searchQuery.toLowerCase())) {
      const anyChildMatch = Object.values(node.children).some(child => 
        child.path.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (!anyChildMatch) return null;
    }

    return (
      <div key={node.path} className="pl-3.5 select-none">
        <div 
          className={`group flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-all hover:bg-slate-100/70 dark:hover:bg-slate-800/40 ${
            isActive ? 'bg-[#6366f1]/10 dark:bg-[#6366f1]/15 text-[#6366f1] border-l-2 border-[#6366f1]' : 'text-slate-600 dark:text-slate-355 hover:text-slate-900 dark:hover:text-white'
          }`}
          onClick={() => {
            if (isFolder) {
              toggleFolder(node.path);
            } else {
              onSelectFile(node);
            }
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {isFolder ? (
              <>
                {isExpanded ? <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" /> : <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />}
                {isExpanded ? <FolderOpen size={15} className="text-[#6366f1]" /> : <Folder size={15} className="text-[#6366f1]" />}
              </>
            ) : (
              <FileCode size={15} className={isActive ? 'text-[#6366f1]' : 'text-slate-455 dark:text-slate-550'} />
            )}
            <span className="text-xs truncate font-mono">{node.name}</span>
          </div>

          <div className="hidden group-hover:flex items-center gap-1.5 text-slate-400 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-300">
            {isFolder && (
              <>
                <button title="New File" onClick={(e) => { e.stopPropagation(); handleStartCreate('file', node.path); }} className="hover:text-[#6366f1]">
                  <Plus size={13} />
                </button>
              </>
            )}
            <button title="Rename" onClick={(e) => { e.stopPropagation(); handleStartRename(node); }} className="hover:text-amber-500">
              <Edit2 size={12} />
            </button>
            {!isFolder && (
              <>
                <button title="Duplicate" onClick={(e) => { e.stopPropagation(); onDuplicate(node._id); }} className="hover:text-[#6366f1]">
                  <Copy size={12} />
                </button>
                <a 
                  title="Download" 
                  href={`http://localhost:5000/api/workspaces/${node.path}/files/${node._id}/download`}
                  onClick={(e) => e.stopPropagation()} 
                  download 
                  className="hover:text-green-500"
                >
                  <Download size={12} />
                </a>
              </>
            )}
            <button title="Delete" onClick={(e) => { e.stopPropagation(); if (confirm(`Are you sure you want to delete ${node.name}?`)) onDelete(node._id); }} className="hover:text-rose-500">
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {namingInput && namingInput.parentPath === node.path && (
          <form onSubmit={handleSaveCreate} className="pl-6 py-1 flex items-center gap-1.5">
            {namingInput.type === 'folder' ? <Folder size={14} className="text-[#6366f1]" /> : <FileCode size={14} className="text-slate-450 dark:text-slate-500" />}
            <input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`New ${namingInput.type}...`}
              onBlur={() => setNamingInput(null)}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs px-2 py-0.5 rounded outline-none font-mono text-slate-800 dark:text-white max-w-[120px]"
            />
          </form>
        )}

        {renameInput && renameInput._id === node._id && (
          <form onSubmit={handleSaveRename} className="pl-6 py-1 flex items-center gap-1.5">
            <input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => setRenameInput(null)}
              className="bg-white dark:bg-slate-950 border border-[#6366f1] text-xs px-2 py-0.5 rounded outline-none font-mono text-slate-800 dark:text-white max-w-[120px]"
            />
          </form>
        )}

        {isFolder && isExpanded && (
          <div className="mt-0.5">
            {Object.values(node.children).map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/85 rounded-2xl overflow-hidden text-left">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 dark:text-white tracking-wide uppercase font-mono">Workspace Files</span>
        <div className="flex items-center gap-1.5">
          <button 
            title="Create File at Root"
            onClick={() => handleStartCreate('file', '')} 
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
          >
            <Plus size={15} />
          </button>
          <label 
            title="Upload File"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-805 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
          >
            <Upload size={14} />
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="p-3 border-b border-slate-150 dark:border-slate-800/50">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2.5 text-slate-450 dark:text-slate-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search path..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none text-slate-700 dark:text-slate-355 focus:border-[#6366f1] font-mono"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 no-scrollbar space-y-1">
        {namingInput && namingInput.parentPath === '' && (
          <form onSubmit={handleSaveCreate} className="pl-4 py-1 flex items-center gap-1.5">
            {namingInput.type === 'folder' ? <Folder size={14} className="text-[#6366f1]" /> : <FileCode size={14} className="text-slate-450 dark:text-slate-500" />}
            <input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`New ${namingInput.type}...`}
              onBlur={() => setNamingInput(null)}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs px-2 py-0.5 rounded outline-none font-mono text-slate-800 dark:text-white max-w-[150px]"
            />
          </form>
        )}
        
        {files.length === 0 ? (
          <div className="text-[11px] text-slate-500 font-mono py-10 text-center">
            Explorer is empty
          </div>
        ) : (
          renderNode(tree)
        )}
      </div>
    </div>
  );
};
