import React, { useState } from 'react';
import { Search as SearchIcon, CaseSensitive, WholeWord, Regex, ArrowRight, FileCode } from 'lucide-react';
import { WorkspaceFile } from '../types/codex';

interface SearchPanelProps {
  files: WorkspaceFile[];
  onSelectFile: (fileId: string) => void;
  isDark: boolean;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  files,
  onSelectFile,
  isDark,
}) => {
  const [query, setQuery] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  // Search through all workspace files
  const searchResults = React.useMemo(() => {
    if (!query.trim()) return [];

    const results: { file: WorkspaceFile; matches: { line: number; text: string }[] }[] = [];

    files.forEach((file) => {
      if (file.type === 'folder') return;
      const lines = file.content.split('\n');
      const matches: { line: number; text: string }[] = [];

      lines.forEach((lineText, idx) => {
        let isMatch = false;
        if (useRegex) {
          try {
            const re = new RegExp(query, matchCase ? 'g' : 'gi');
            isMatch = re.test(lineText);
          } catch {
            isMatch = false;
          }
        } else {
          const hay = matchCase ? lineText : lineText.toLowerCase();
          const needle = matchCase ? query : query.toLowerCase();
          isMatch = hay.includes(needle);
        }

        if (isMatch) {
          matches.push({
            line: idx + 1,
            text: lineText.trim(),
          });
        }
      });

      if (matches.length > 0) {
        results.push({ file, matches });
      }
    });

    return results;
  }, [files, query, matchCase, useRegex]);

  const totalMatches = searchResults.reduce((acc, curr) => acc + curr.matches.length, 0);

  return (
    <div
      className={`h-full flex flex-col border-r select-none transition-colors ${
        isDark
          ? 'bg-slate-950 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-2 border-b shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Search
        </span>
        {query && (
          <span className="text-[10px] text-[#04AA6D] font-mono font-semibold">
            {totalMatches} result{totalMatches === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {/* Search Input Bar */}
      <div className={`p-2 space-y-2 border-b shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in files (e.g. function, import)..."
            className={`w-full pl-7 pr-16 py-1 rounded-lg border focus:border-[#04AA6D] text-xs outline-none transition ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
            autoFocus
          />
          <SearchIcon className={`w-3.5 h-3.5 absolute left-2 pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />

          {/* Query Modifiers */}
          <div className="absolute right-1.5 flex items-center gap-0.5">
            <button
              onClick={() => setMatchCase(!matchCase)}
              className={`p-1 rounded text-[10px] transition cursor-pointer ${
                matchCase
                  ? 'bg-[#04AA6D] text-white'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Match Case"
            >
              <CaseSensitive className="w-3 h-3" />
            </button>
            <button
              onClick={() => setUseRegex(!useRegex)}
              className={`p-1 rounded text-[10px] transition cursor-pointer ${
                useRegex
                  ? 'bg-[#04AA6D] text-white'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Use Regular Expression"
            >
              <Regex className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-2 text-xs">
        {query.trim() === '' ? (
          <div className={`p-4 text-center text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Type a query above to search across all workspace files.
          </div>
        ) : searchResults.length === 0 ? (
          <div className={`p-4 text-center text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            No results found for "{query}".
          </div>
        ) : (
          searchResults.map(({ file, matches }) => (
            <div key={file.id} className="space-y-1">
              <div
                onClick={() => onSelectFile(file.id)}
                className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer font-medium transition ${
                  isDark
                    ? 'hover:bg-slate-800/60 text-white'
                    : 'hover:bg-slate-100 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <FileCode className="w-3.5 h-3.5 text-[#04AA6D]" />
                  <span className="truncate">{file.name}</span>
                </div>
                <span className="text-[10px] text-[#04AA6D] bg-[#04AA6D]/15 px-1.5 py-0.2 rounded-full font-mono">
                  {matches.length}
                </span>
              </div>

              <div className="pl-4 space-y-0.5">
                {matches.map((m, i) => (
                  <div
                    key={i}
                    onClick={() => onSelectFile(file.id)}
                    className={`flex items-baseline gap-2 px-2 py-0.5 rounded cursor-pointer text-[11px] font-mono truncate transition ${
                      isDark
                        ? 'hover:bg-[#04AA6D]/15 text-slate-300'
                        : 'hover:bg-[#04AA6D]/10 text-slate-700'
                    }`}
                  >
                    <span className={`text-[10px] w-5 text-right shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {m.line}
                    </span>
                    <span className="truncate">{m.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
