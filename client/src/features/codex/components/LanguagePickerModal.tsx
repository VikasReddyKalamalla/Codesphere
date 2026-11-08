import React, { useState, useEffect, useRef } from 'react';
import { Search, Code2, Check, X } from 'lucide-react';

export const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', ext: '.js' },
  { id: 'typescript', name: 'TypeScript', ext: '.ts' },
  { id: 'python', name: 'Python', ext: '.py' },
  { id: 'html', name: 'HTML', ext: '.html' },
  { id: 'css', name: 'CSS', ext: '.css' },
  { id: 'json', name: 'JSON', ext: '.json' },
  { id: 'markdown', name: 'Markdown', ext: '.md' },
  { id: 'cpp', name: 'C++', ext: '.cpp' },
  { id: 'java', name: 'Java', ext: '.java' },
  { id: 'rust', name: 'Rust', ext: '.rs' },
  { id: 'go', name: 'Go', ext: '.go' },
  { id: 'sql', name: 'SQL', ext: '.sql' },
  { id: 'shell', name: 'Shell Script', ext: '.sh' },
  { id: 'yaml', name: 'YAML', ext: '.yaml' },
  { id: 'xml', name: 'XML', ext: '.xml' },
];

interface LanguagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (langId: string) => void;
  isDark: boolean;
}

export const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  isDark,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.id.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

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
      onSelectLanguage(filtered[selectedIndex].id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-xl border shadow-2xl overflow-hidden transition-all ${
          isDark ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-[#e2e8f0] text-black'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center gap-2.5 px-3.5 py-3 border-b ${isDark ? 'border-[#334155]/60' : 'border-[#e2e8f0]'}`}>
          <Code2 className="w-4 h-4 text-[#04AA6D]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Select Language Mode..."
            className="w-full bg-transparent border-none outline-none text-xs text-inherit placeholder-[#94a3b8]"
          />
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 dark:bg-white/10 text-[#94a3b8]">
            ESC
          </span>
        </div>

        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 text-xs">
          {filtered.map((lang, idx) => {
            const isSelected = idx === selectedIndex;
            const isCurrent = lang.id === currentLanguage;
            return (
              <div
                key={lang.id}
                onClick={() => {
                  onSelectLanguage(lang.id);
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
                <div className="flex items-center gap-2">
                  <span>{lang.name}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-white/70' : 'text-[#94a3b8]'}`}>
                    ({lang.ext})
                  </span>
                </div>

                {isCurrent && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
