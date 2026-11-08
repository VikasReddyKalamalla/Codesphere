import React, { useState, useEffect, useRef } from 'react';
import { Search, FileCode, FileText, FileJson, X } from 'lucide-react';
import { WorkspaceFile } from '../types/codex';

interface QuickOpenModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: WorkspaceFile[];
  onSelectFile: (fileId: string) => void;
  isDark: boolean;
}

export const QuickOpenModal: React.FC<QuickOpenModalProps> = ({
  isOpen,
  onClose,
  files,
  onSelectFile,
  isDark,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const onlyFiles = files.filter((f) => f.type === 'file');
  const filtered = onlyFiles.filter(
    (f) =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.path.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      onSelectFile(filtered[selectedIndex].id);
      onClose();
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-[#f97316]" />;
    if (name.endsWith('.py')) return <FileCode className="w-3.5 h-3.5 text-[#f59e0b]" />;
    if (name.endsWith('.jsx') || name.endsWith('.tsx') || name.endsWith('.js') || name.endsWith('.ts')) {
      return <FileCode className="w-3.5 h-3.5 text-[#0d9488]" />;
    }
    return <FileText className="w-3.5 h-3.5 text-[#94a3b8]" />;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xl rounded-xl border shadow-2xl overflow-hidden transition-all ${
          isDark ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-[#e2e8f0] text-black'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className={`flex items-center gap-2.5 px-3.5 py-3 border-b ${isDark ? 'border-[#334155]/60' : 'border-[#e2e8f0]'}`}>
          <Search className="w-4 h-4 text-[#04AA6D]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search files by name (Ctrl+P)..."
            className="w-full bg-transparent border-none outline-none text-xs text-inherit placeholder-[#94a3b8]"
          />
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 dark:bg-white/10 text-[#94a3b8]">
            ESC
          </span>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 text-xs">
          {filtered.length > 0 ? (
            filtered.map((file, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={file.id}
                  onClick={() => {
                    onSelectFile(file.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#04AA6D] text-white font-medium'
                      : isDark
                      ? 'hover:bg-[#1e293b] text-[#cbd5e1]'
                      : 'hover:bg-[#f1f5f9] text-[#334155]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getFileIcon(file.name)}
                    <span className="truncate font-medium">{file.name}</span>
                    <span className={`text-[10px] font-mono truncate ${isSelected ? 'text-white/70' : 'text-[#94a3b8]'}`}>
                      {file.path}
                    </span>
                  </div>

                  <span className={`text-[10px] uppercase font-mono ${isSelected ? 'text-white' : 'text-[#94a3b8]'}`}>
                    {file.language}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-[#94a3b8]">
              No files found matching "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
