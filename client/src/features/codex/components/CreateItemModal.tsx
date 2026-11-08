import React, { useState, useEffect, useRef } from 'react';
import { FilePlus, FolderPlus, X, Check, FileCode, Folder } from 'lucide-react';

interface CreateItemModalProps {
  isOpen: boolean;
  isFolder: boolean;
  folderName: string;
  parentFolder?: string;
  onClose: () => void;
  onCreate: (name: string, isFolder: boolean, parentFolder?: string) => void;
  isDark: boolean;
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({
  isOpen,
  isFolder,
  folderName,
  parentFolder,
  onClose,
  onCreate,
  isDark,
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, isFolder]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(`Please enter a valid ${isFolder ? 'folder' : 'file'} name.`);
      return;
    }
    if (trimmed.includes('\\') || trimmed.includes(':') || trimmed.includes('*') || trimmed.includes('?') || trimmed.includes('"') || trimmed.includes('<') || trimmed.includes('>') || trimmed.includes('|')) {
      setError('Name contains invalid characters.');
      return;
    }

    onCreate(trimmed, isFolder, parentFolder);
    onClose();
  };

  const quickExtensions = ['.java', '.py', '.js', '.ts', '.html', '.css', '.json', '.jsx', '.tsx', '.md'];

  const handleAppendExtension = (ext: string) => {
    if (name.includes('.')) {
      const base = name.split('.')[0];
      setName(base + ext);
    } else {
      setName((prev) => (prev ? prev + ext : 'index' + ext));
    }
    inputRef.current?.focus();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-xl shadow-2xl border overflow-hidden transition-all transform scale-100 ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            {isFolder ? (
              <FolderPlus className="w-5 h-5 text-[#04AA6D]" />
            ) : (
              <FilePlus className="w-5 h-5 text-[#04AA6D]" />
            )}
            <h3 className="text-sm font-semibold">
              {isFolder ? 'Create New Folder' : 'Create New File'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          <div>
            <div className={`flex items-center justify-between text-[11px] mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span>Target Location:</span>
              <span className="font-mono text-[#04AA6D] truncate max-w-[220px]">
                {parentFolder ? `${folderName}/${parentFolder}` : folderName}
              </span>
            </div>

            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') onClose();
                }}
                placeholder={
                  isFolder
                    ? 'Folder name (e.g., components, utils, styles)'
                    : 'File name (e.g., index.js, script.py, styles.css)'
                }
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 focus:border-[#04AA6D] text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 focus:border-[#04AA6D] text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
            {error && <p className="text-[11px] text-rose-500 mt-1.5">{error}</p>}
          </div>

          {!isFolder && (
            <div>
              <div className={`text-[10px] font-medium uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Quick Extension
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickExtensions.map((ext) => (
                  <button
                    key={ext}
                    type="button"
                    onClick={() => handleAppendExtension(ext)}
                    className={`px-2 py-1 rounded text-[11px] font-mono transition cursor-pointer ${
                      name.endsWith(ext)
                        ? 'bg-[#04AA6D] text-white font-semibold'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {ext}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className={`flex items-center justify-end gap-2 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                isDark
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#04AA6D] hover:bg-[#03985e] text-white font-medium text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isFolder ? 'Create Folder' : 'Create File'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
