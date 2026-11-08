import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Terminal as TerminalIcon,
  Plus,
  ChevronDown,
  Trash2,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  X,
  Columns2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Radio,
  Layers,
  FolderOpen,
  Edit3,
  User,
  Check,
  ExternalLink,
  Copy,
  Globe,
  Wifi,
  Search,
  Filter
} from 'lucide-react';
import {
  TerminalTabType,
  ShellType,
  TerminalInstance,
  WorkspaceFile,
  ExecutionResult,
  TerminalEntry
} from '../types/codex';
import { processTerminalCommand } from '../services/terminalEngine';

export interface ProblemItem {
  id: string;
  filePath: string;
  fileName: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  line: number;
  column: number;
  source?: string;
}

export interface ForwardedPort {
  id: string;
  port: number;
  protocol: string;
  label: string;
  address: string;
  status: 'listening' | 'stopped';
}

interface BottomPanelProps {
  isDark: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
  outputResult: ExecutionResult | null;
  files: WorkspaceFile[];
  onFileCreate: (name: string, isFolder: boolean) => void;
  onFileDelete: (fileId: string) => void;
  onFileUpdate: (fileId: string, content: string) => void;
  username?: string;
  workspacePath?: string;
  onWorkspacePathChange?: (newPath: string) => void;
  onUsernameChange?: (newUsername: string) => void;
  onJumpToLine?: (filePath: string, line: number, col?: number) => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = React.memo(({
  isDark,
  isOpen,
  onToggleOpen,
  outputResult,
  files,
  onFileCreate,
  onFileDelete,
  onFileUpdate,
  username = 'reddymanish315',
  workspacePath,
  onWorkspacePathChange,
  onUsernameChange,
  onJumpToLine,
}) => {
  const currentDefaultPath = workspacePath || `C:\\Users\\${username}\\workspace`;
  const [activeTab, setActiveTab] = useState<TerminalTabType>('terminal');
  const [isMaximized, setIsMaximized] = useState(false);

  // Terminals instances
  const [terminals, setTerminals] = useState<TerminalInstance[]>([
    {
      id: 'term_1',
      name: 'powershell',
      shell: 'powershell',
      cwd: currentDefaultPath,
      history: [],
      commandHistory: [],
    },
  ]);
  const [activeTerminalId, setActiveTerminalId] = useState<string>('term_1');

  // Input state
  const [currentInput, setCurrentInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [inNodeRepl, setInNodeRepl] = useState(false);
  const [showShellDropdown, setShowShellDropdown] = useState(false);
  const [showSplitTerminal, setShowSplitTerminal] = useState(false);

  // Path & User modal state (displays dynamic user path upon click)
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [editPathValue, setEditPathValue] = useState(currentDefaultPath);
  const [editUserValue, setEditUserValue] = useState(username);

  // Debug Console state
  const [debugLogs, setDebugLogs] = useState<string[]>([
    'Debug session initialized.',
    'Ready for runtime evaluation.',
  ]);
  const [debugInput, setDebugInput] = useState('');

  // Live Problems State
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [filterProblemText, setFilterProblemText] = useState('');

  // Live Port Forwarding State
  const [ports, setPorts] = useState<ForwardedPort[]>(() => {
    try {
      const saved = localStorage.getItem('codesphere_forwarded_ports');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'p-3000',
        port: 3000,
        protocol: 'HTTP',
        label: 'CodeSphere Codex Dev Server',
        address: 'http://localhost:3000',
        status: 'listening',
      },
      {
        id: 'p-5173',
        port: 5173,
        protocol: 'HTTP / Vite',
        label: 'Vite HMR Preview',
        address: 'http://localhost:5173',
        status: 'listening',
      },
    ];
  });
  const [newPortNumber, setNewPortNumber] = useState('');
  const [newPortLabel, setNewPortLabel] = useState('');
  const [newPortProtocol, setNewPortProtocol] = useState('HTTP');
  const [copiedPortId, setCopiedPortId] = useState<string | null>(null);

  // Sync ports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('codesphere_forwarded_ports', JSON.stringify(ports));
    } catch {}
  }, [ports]);

  // Live Problems Scanner
  useEffect(() => {
    const scanProblems = () => {
      const detected: ProblemItem[] = [];

      // 1. Monaco Editor markers
      try {
        const monaco = (window as any).monaco;
        if (monaco?.editor) {
          const markers = monaco.editor.getModelMarkers({});
          for (const m of markers) {
            const rawPath = m.resource?.path || m.resource?.toString() || 'file';
            const cleanPath = rawPath.replace(/^\/+/, '');
            const fileName = cleanPath.split('/').pop() || cleanPath;
            detected.push({
              id: `monaco_${cleanPath}_${m.startLineNumber}_${m.startColumn}`,
              filePath: cleanPath,
              fileName,
              message: m.message,
              severity: m.severity === 8 ? 'error' : m.severity === 4 ? 'warning' : 'info',
              line: m.startLineNumber,
              column: m.startColumn,
              source: m.source || 'Monaco LSP',
            });
          }
        }
      } catch {}

      // 2. Scan Workspace Files for common syntax diagnostics
      for (const file of files) {
        if (file.type === 'folder' || file.isFolder) continue;

        // JSON validation
        if (file.name.endsWith('.json') && file.content) {
          try {
            JSON.parse(file.content);
          } catch (jsonErr: any) {
            const match = jsonErr.message?.match(/at position (\d+)/);
            let line = 1;
            let col = 1;
            if (match) {
              const pos = parseInt(match[1], 10);
              const linesUntil = file.content.substring(0, pos).split('\n');
              line = linesUntil.length;
              col = linesUntil[linesUntil.length - 1].length + 1;
            }
            detected.push({
              id: `json_${file.id}`,
              filePath: file.path,
              fileName: file.name,
              message: `JSON syntax error: ${jsonErr.message}`,
              severity: 'error',
              line,
              column: col,
              source: 'JSON Parser',
            });
          }
        }

        // Bracket imbalance check
        if ((file.name.endsWith('.ts') || file.name.endsWith('.tsx') || file.name.endsWith('.js') || file.name.endsWith('.jsx')) && file.content) {
          const openBraces = (file.content.match(/\{/g) || []).length;
          const closeBraces = (file.content.match(/\}/g) || []).length;
          if (openBraces !== closeBraces) {
            detected.push({
              id: `brace_${file.id}`,
              filePath: file.path,
              fileName: file.name,
              message: `Mismatched braces: ${openBraces} '{' vs ${closeBraces} '}'`,
              severity: 'warning',
              line: file.content.split('\n').length,
              column: 1,
              source: 'Syntax Linter',
            });
          }
        }
      }

      setProblems(detected);
    };

    scanProblems();
    const timer = setInterval(scanProblems, 2500);
    return () => clearInterval(timer);
  }, [files]);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  const activeTerminal = terminals.find((t) => t.id === activeTerminalId) || terminals[0];

  // Sync workspace path changes into active terminal working directory
  useEffect(() => {
    if (workspacePath) {
      setTerminals((prev) =>
        prev.map((t) =>
          t.id === activeTerminalId
            ? { ...t, cwd: workspacePath }
            : t
        )
      );
      setEditPathValue(workspacePath);
    }
  }, [workspacePath, activeTerminalId]);

  useEffect(() => {
    setEditUserValue(username);
  }, [username]);

  // Focus terminal input when opening or clicking
  useEffect(() => {
    if (activeTab === 'terminal' && isOpen) {
      inputRef.current?.focus();
    }
  }, [activeTab, activeTerminalId, isOpen]);

  // Instant scroll on new output without smooth-scroll lag
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [activeTerminal?.history]);

  useEffect(() => {
    if (outputResult) {
      const activeFile = files.find((f) => f.isOpen && f.type === 'file') || files[0];
      const fileName = activeFile?.name || 'main';
      const lower = fileName.toLowerCase();
      const lang = lower.endsWith('.java')
        ? 'java'
        : lower.endsWith('.py')
        ? 'python'
        : lower.endsWith('.js') || lower.endsWith('.jsx')
        ? 'javascript'
        : lower.endsWith('.ts') || lower.endsWith('.tsx')
        ? 'typescript'
        : lower.endsWith('.cpp') || lower.endsWith('.cc')
        ? 'cpp'
        : lower.endsWith('.c')
        ? 'c'
        : lower.endsWith('.rb')
        ? 'ruby'
        : lower.endsWith('.sh') || lower.endsWith('.bash')
        ? 'bash'
        : activeFile?.language || 'plaintext';

      const runnerCmd =
        lang === 'python'
          ? `python ${fileName}`
          : lang === 'javascript' || lang === 'node'
          ? `node ${fileName}`
          : lang === 'typescript'
          ? `bun run ${fileName}`
          : lang === 'cpp' || lang === 'c++'
          ? `g++ ${fileName} -o ${fileName.replace(/\.[^/.]+$/, '')} && ./${fileName.replace(/\.[^/.]+$/, '')}`
          : lang === 'c'
          ? `gcc ${fileName} -o ${fileName.replace(/\.[^/.]+$/, '')} && ./${fileName.replace(/\.[^/.]+$/, '')}`
          : lang === 'java'
          ? `java ${fileName}`
          : lang === 'bash' || lang === 'sh'
          ? `bash ${fileName}`
          : lang === 'ruby'
          ? `ruby ${fileName}`
          : `${lang} ${fileName}`;

      const promptPrefix =
        activeTerminal?.shell === 'powershell'
          ? `PS ${activeTerminal.cwd}>`
          : `${activeTerminal?.cwd?.replace(/\\/g, '/') || '~'} $`;

      const entriesToAdd: TerminalEntry[] = [
        {
          id: `in_run_${Date.now()}`,
          type: 'stdin',
          text: `${promptPrefix} ${runnerCmd}`,
          prompt: promptPrefix,
          command: runnerCmd,
          timestamp: new Date().toLocaleTimeString(),
        },
      ];

      if (outputResult.stdout) {
        entriesToAdd.push({
          id: `out_run_${Date.now()}`,
          type: 'stdout',
          text: outputResult.stdout,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      if (outputResult.stderr) {
        entriesToAdd.push({
          id: `err_run_${Date.now()}`,
          type: 'stderr',
          text: outputResult.stderr,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      setTerminals((prev) =>
        prev.map((t) =>
          t.id === activeTerminalId
            ? {
                ...t,
                history: [...t.history, ...entriesToAdd],
                commandHistory: [...t.commandHistory, runnerCmd],
              }
            : t
        )
      );

      // Route display directly into terminal tab
      setActiveTab('terminal');
    }
  }, [outputResult]);

  // Click anywhere on terminal area focuses input
  const handleTerminalAreaClick = (e: React.MouseEvent) => {
    // If clicking directly on the interactive path text, don't steal focus
    const target = e.target as HTMLElement;
    if (target.closest('.terminal-path-interactive')) return;
    inputRef.current?.focus();
  };

  // Handle command submission
  const handleSubmitCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = currentInput;
    const trimmed = raw.trim();

    if (!activeTerminal) return;

    // Dynamic user prompt prefix
    const promptPrefix = inNodeRepl
      ? '> '
      : activeTerminal.shell === 'powershell'
      ? `PS ${activeTerminal.cwd}>`
      : `${activeTerminal.cwd.replace(/\\/g, '/')} $`;

    const userEntry: TerminalEntry = {
      id: `in_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'stdin' as const,
      text: `${promptPrefix} ${raw}`,
      prompt: promptPrefix,
      command: raw,
      timestamp: new Date().toLocaleTimeString(),
    };

    if (!trimmed) {
      setTerminals((prev) =>
        prev.map((t) =>
          t.id === activeTerminal.id
            ? { ...t, history: [...t.history, userEntry] }
            : t
        )
      );
      setCurrentInput('');
      return;
    }

    // Process command in terminal engine
    const res = await processTerminalCommand(trimmed, {
      cwd: activeTerminal.cwd,
      baseCwd: currentDefaultPath,
      username,
      files,
      shell: activeTerminal.shell,
      inNodeRepl,
      onFileCreate,
      onFileDelete,
      onFileUpdate,
    });

    const newHistory = [...activeTerminal.history, userEntry];

    if (res.clear) {
      setTerminals((prev) =>
        prev.map((t) =>
          t.id === activeTerminal.id
            ? {
                ...t,
                history: [],
                commandHistory: [...t.commandHistory, trimmed],
              }
            : t
        )
      );
      setCurrentInput('');
      setHistoryIndex(-1);
      return;
    }

    if (res.enterNodeRepl) setInNodeRepl(true);
    if (res.exitNodeRepl) setInNodeRepl(false);

    if (res.output) {
      newHistory.push({
        id: `out_${Date.now()}`,
        type: 'stdout' as const,
        text: res.output,
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    if (res.error) {
      newHistory.push({
        id: `err_${Date.now()}`,
        type: 'stderr' as const,
        text: res.error,
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    const nextCwd = res.newCwd || activeTerminal.cwd;
    if (res.newCwd && onWorkspacePathChange) {
      onWorkspacePathChange(res.newCwd);
    }

    setTerminals((prev) =>
      prev.map((t) =>
        t.id === activeTerminal.id
          ? {
              ...t,
              cwd: nextCwd,
              history: newHistory,
              commandHistory: [...t.commandHistory, trimmed],
            }
          : t
      )
    );

    setCurrentInput('');
    setHistoryIndex(-1);
  };

  // Keyboard navigation for command history & tab-autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!activeTerminal) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const history = activeTerminal.commandHistory;
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setCurrentInput(history[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const history = activeTerminal.commandHistory;
      if (historyIndex === -1) return;
      if (historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setCurrentInput(history[nextIdx]);
      } else {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const parts = currentInput.split(' ');
      const lastToken = parts[parts.length - 1].toLowerCase();
      if (lastToken) {
        const match = files.find((f) => f.name.toLowerCase().startsWith(lastToken));
        if (match) {
          parts[parts.length - 1] = match.name;
          setCurrentInput(parts.join(' '));
        }
      }
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      if (inNodeRepl) setInNodeRepl(false);
      setCurrentInput('');
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setTerminals((prev) =>
        prev.map((t) => (t.id === activeTerminal.id ? { ...t, history: [] } : t))
      );
    }
  };

  // Create new terminal instance
  const handleCreateTerminal = (shell: ShellType = 'powershell') => {
    const id = `term_${Date.now()}`;
    const newTerm: TerminalInstance = {
      id,
      name: shell,
      shell,
      cwd: activeTerminal?.cwd || currentDefaultPath,
      history: [],
      commandHistory: [],
    };
    setTerminals((prev) => [...prev, newTerm]);
    setActiveTerminalId(id);
    setShowShellDropdown(false);
  };

  // Kill terminal
  const handleKillTerminal = () => {
    if (terminals.length === 1) {
      setTerminals((prev) =>
        prev.map((t) => ({ ...t, history: [], commandHistory: [] }))
      );
      setInNodeRepl(false);
      return;
    }
    const remaining = terminals.filter((t) => t.id !== activeTerminalId);
    setTerminals(remaining);
    setActiveTerminalId(remaining[0].id);
  };

  // Click on the prompt opens user path configuration
  const handleOpenPathModal = () => {
    setEditPathValue(activeTerminal?.cwd || currentDefaultPath);
    setEditUserValue(username);
    setIsPathModalOpen(true);
  };

  const handleSavePathModal = () => {
    const trimmedPath = editPathValue.trim();
    const trimmedUser = editUserValue.trim();

    if (trimmedUser && trimmedUser !== username && onUsernameChange) {
      onUsernameChange(trimmedUser);
    }

    if (trimmedPath && activeTerminal) {
      setTerminals((prev) =>
        prev.map((t) => (t.id === activeTerminal.id ? { ...t, cwd: trimmedPath } : t))
      );
      if (onWorkspacePathChange) {
        onWorkspacePathChange(trimmedPath);
      }
    }
    setIsPathModalOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Debug Console evaluate
  const handleDebugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debugInput.trim()) return;
    try {
      const runner = new Function(`return (${debugInput})`);
      const val = runner();
      setDebugLogs((prev) => [...prev, `> ${debugInput}`, String(val)]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setDebugLogs((prev) => [...prev, `> ${debugInput}`, `Error: ${msg}`]);
    }
    setDebugInput('');
  };

  if (!isOpen) return null;

  const currentCwdDisplay = activeTerminal?.cwd || currentDefaultPath;

  return (
    <div
      className={`border-t flex flex-col z-20 shrink-0 select-none relative transition-colors ${
        isMaximized ? 'h-full' : 'h-64'
      } ${isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
    >
      {/* Dynamic User Path Customization Modal */}
      {isPathModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md border rounded-xl p-4 shadow-2xl space-y-3 font-sans text-xs ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#04AA6D]" />
                <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Terminal Environment & User Path</span>
              </div>
              <button
                onClick={() => setIsPathModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[#a1a1aa] text-[11px] leading-relaxed">
              This terminal path dynamically reflects your active user environment and current workspace.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#04AA6D]" />
                <span>Active User Identity</span>
              </label>
              <input
                type="text"
                value={editUserValue}
                onChange={(e) => setEditUserValue(e.target.value)}
                placeholder="e.g. reddymanish315"
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono text-xs focus:border-[#04AA6D] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#d4d4d8]">
                Current Working Directory (Prompt Path)
              </label>
              <input
                type="text"
                value={editPathValue}
                onChange={(e) => setEditPathValue(e.target.value)}
                placeholder="e.g. C:\Users\reddymanish315\workspace"
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono text-xs focus:border-[#04AA6D] outline-none"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1">
              <span className="text-[10px] text-[#71717a] uppercase font-bold tracking-wider">
                Quick User Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  `C:\\Users\\${editUserValue}\\workspace`,
                  `C:\\Users\\${editUserValue}\\projects`,
                  `C:\\Users\\${editUserValue}\\codex`,
                  `/home/${editUserValue}/workspace`,
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setEditPathValue(preset)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] transition cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsPathModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePathModal}
                className="px-3.5 py-1.5 rounded bg-[#04AA6D] hover:bg-[#03985e] text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Path</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Panel Tabs Header */}
      <div
        className={`h-8 border-b flex items-center justify-between px-2 text-xs shrink-0 select-none ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/90 border-slate-200'
        }`}
      >
        {/* Left: Tab selectors */}
        <div className="flex items-center space-x-1">
          {[
            { id: 'problems', label: 'Problems' },
            { id: 'output', label: 'Output' },
            { id: 'debug', label: 'Debug Console' },
            { id: 'terminal', label: 'Terminal' },
            { id: 'ports', label: 'Ports' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TerminalTabType)}
                className={`px-3 py-1 text-xs transition uppercase font-sans tracking-wide cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#04AA6D] border-b-2 border-[#04AA6D] font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'problems' && (
                  problems.length > 0 ? (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {problems.length}
                    </span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 inline-block" />
                  )
                )}
                {tab.id === 'ports' && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/30">
                    {ports.filter((p) => p.status === 'listening').length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Shell Switcher, Dynamic User Path Button, Plus, Split, Trash, Maximize, Close */}
        <div className="flex items-center space-x-1 text-slate-400">
          {/* Dynamic Active User Indicator Pill */}
          <button
            onClick={handleOpenPathModal}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-[#04AA6D] bg-[#04AA6D]/10 border border-[#04AA6D]/30 hover:bg-[#04AA6D]/20 transition cursor-pointer"
            title="Click to view and configure user workspace path"
          >
            <User className="w-3 h-3 text-[#04AA6D]" />
            <span className="max-w-[120px] truncate">{username}</span>
          </button>

          {/* Shell Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowShellDropdown(!showShellDropdown)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition text-[11px] font-mono cursor-pointer ${
                isDark ? 'hover:bg-slate-800 hover:text-white text-slate-300' : 'hover:bg-slate-200 hover:text-slate-900 text-slate-700'
              }`}
              title="Switch Active Shell"
            >
              <TerminalIcon className="w-3 h-3 text-[#04AA6D]" />
              <span className="capitalize">{activeTerminal?.shell || 'powershell'}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showShellDropdown && (
              <div className={`absolute right-0 top-7 w-40 rounded shadow-xl py-1 z-50 text-xs border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                {(['powershell', 'bash', 'node', 'cmd'] as ShellType[]).map((sh) => (
                  <button
                    key={sh}
                    onClick={() => {
                      if (activeTerminal) {
                        setTerminals((prev) =>
                          prev.map((t) => (t.id === activeTerminal.id ? { ...t, shell: sh } : t))
                        );
                      }
                      setShowShellDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 transition flex items-center justify-between cursor-pointer ${
                      activeTerminal?.shell === sh
                        ? 'text-[#04AA6D] font-bold bg-[#04AA6D]/10'
                        : isDark
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="capitalize">{sh}</span>
                    {activeTerminal?.shell === sh && <span className="text-[10px]">active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Terminal Tab (+) */}
          <button
            onClick={() => handleCreateTerminal('powershell')}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 hover:text-white text-slate-400' : 'hover:bg-slate-200 hover:text-slate-900 text-slate-600'
            }`}
            title="New Terminal"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Split Terminal */}
          <button
            onClick={() => setShowSplitTerminal(!showSplitTerminal)}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 hover:text-white text-slate-400' : 'hover:bg-slate-200 hover:text-slate-900 text-slate-600'
            }`}
            title="Split Terminal"
          >
            <Columns2 className="w-3.5 h-3.5" />
          </button>

          {/* Kill Terminal */}
          <button
            onClick={handleKillTerminal}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 hover:text-white text-slate-400' : 'hover:bg-slate-200 hover:text-slate-900 text-slate-600'
            }`}
            title="Kill Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Clear Buffer */}
          <button
            onClick={() => {
              setTerminals((prev) =>
                prev.map((t) => (t.id === activeTerminal.id ? { ...t, history: [] } : t))
              );
            }}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 hover:text-white text-slate-400' : 'hover:bg-slate-200 hover:text-slate-900 text-slate-600'
            }`}
            title="Clear Terminal Buffer"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 hover:text-white text-slate-400' : 'hover:bg-slate-200 hover:text-slate-900 text-slate-600'
            }`}
            title={isMaximized ? 'Restore Panel Size' : 'Maximize Panel Size'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close Panel */}
          <button
            onClick={onToggleOpen}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 hover:text-white text-slate-400' : 'hover:bg-slate-200 hover:text-slate-900 text-slate-600'
            }`}
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-hidden flex relative ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        {/* TAB 1: TERMINAL (Dynamic user path) */}
        {activeTab === 'terminal' && (
          <div
            ref={terminalScrollRef}
            onClick={handleTerminalAreaClick}
            className={`flex-1 p-3 overflow-y-auto cursor-text text-[13px] leading-relaxed font-mono select-text ${
              isDark ? 'bg-slate-950 text-slate-200' : 'bg-white text-slate-800'
            }`}
          >
            {/* Previous History Lines */}
            {activeTerminal?.history.map((entry) => (
              <div
                key={entry.id}
                className={`whitespace-pre-wrap ${
                  entry.type === 'stdin'
                    ? 'flex items-baseline gap-1.5'
                    : entry.type === 'stderr'
                    ? 'text-rose-400 pl-4'
                    : isDark
                    ? 'text-slate-300 pl-4'
                    : 'text-slate-800 pl-4'
                }`}
              >
                {entry.type === 'stdin' ? (
                  <>
                    {/* Status circle icon */}
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-500 shrink-0 inline-block align-middle mb-0.5" />
                    {/* Green underlined prompt prefix */}
                    <span className="font-bold text-[#04AA6D] underline decoration-[#04AA6D] underline-offset-2 shrink-0 font-mono tracking-tight">
                      {entry.prompt || `PS ${currentCwdDisplay}>`}
                    </span>
                    <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-900 font-semibold'}`}>
                      {entry.command ?? entry.text.replace(/^.*?>\s*/, '')}
                    </span>
                  </>
                ) : (
                  <span>{entry.text}</span>
                )}
              </div>
            ))}

            {/* Active Input Line With Dynamic User Path */}
            <form onSubmit={handleSubmitCommand} className="flex items-baseline gap-1.5 mt-0.5">
              {/* Status circle icon */}
              <span className="w-2.5 h-2.5 rounded-full border border-slate-500 shrink-0 inline-block align-middle mb-0.5" />

              {/* Dynamic user prompt: e.g. PS C:\Users\reddymanish315\workspace> in green with underline */}
              <span
                onClick={handleOpenPathModal}
                title="Click to view and configure user workspace path"
                className="terminal-path-interactive font-bold text-[#04AA6D] underline decoration-[#04AA6D] underline-offset-2 shrink-0 cursor-pointer hover:opacity-85 transition font-mono tracking-tight select-none"
              >
                {inNodeRepl
                  ? '> '
                  : activeTerminal?.shell === 'powershell'
                  ? `PS ${currentCwdDisplay}>`
                  : `${currentCwdDisplay.replace(/\\/g, '/')} $`}
              </span>

              {/* Snappy native Input Field with blinking vertical cursor */}
              <div className="flex-1 flex items-baseline">
                <input
                  ref={inputRef}
                  type="text"
                  autoFocus
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full bg-transparent border-none outline-none font-mono text-[13px] p-0 ${
                    isDark ? 'text-white caret-white' : 'text-zinc-950 caret-zinc-950 font-medium'
                  }`}
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: OUTPUT */}
        {activeTab === 'output' && (
          <div className="flex-1 p-3 overflow-y-auto text-xs font-mono space-y-2 select-text">
            {outputResult ? (
              <div className="space-y-2">
                <div
                  className={`flex items-center gap-3 text-[11px] pb-1 border-b ${
                    isDark ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-slate-200'
                  }`}
                >
                  <span className={outputResult.exitCode === 0 ? 'text-[#04AA6D] font-bold' : 'text-rose-400 font-bold'}>
                    [Done] exited with code={outputResult.exitCode} in {outputResult.executionTime} seconds
                  </span>
                  <span>Memory: {outputResult.memoryUsed}</span>
                </div>
                {outputResult.stdout && (
                  <pre className={`whitespace-pre-wrap ${isDark ? 'text-white' : 'text-slate-900'}`}>{outputResult.stdout}</pre>
                )}
                {outputResult.stderr && (
                  <pre className="text-rose-400 whitespace-pre-wrap">{outputResult.stderr}</pre>
                )}
              </div>
            ) : (
              <div className="text-slate-500 py-6 text-center font-sans">
                No active execution output. Click 'Run' to execute current file.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROBLEMS */}
        {activeTab === 'problems' && (
          <div className="flex-1 flex flex-col p-3 overflow-hidden text-xs font-sans">
            {/* Filter bar */}
            <div className={`flex items-center justify-between pb-2 mb-2 border-b shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] ${isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                  <Search className="w-3 h-3 text-slate-400" />
                  <input
                    type="text"
                    value={filterProblemText}
                    onChange={(e) => setFilterProblemText(e.target.value)}
                    placeholder="Filter problems (e.g. error, file.ts)..."
                    className={`bg-transparent border-none outline-none text-xs w-48 ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
                  />
                  {filterProblemText && (
                    <button onClick={() => setFilterProblemText('')} className="text-zinc-400 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <span className="text-[11px] text-zinc-400">
                  {problems.filter((p) => p.severity === 'error').length} Errors,{' '}
                  {problems.filter((p) => p.severity === 'warning').length} Warnings
                </span>
              </div>

              <div className="text-[10px] text-zinc-500 font-mono">
                Monaco LSP Engine Active
              </div>
            </div>

            {/* Problems List */}
            <div className="flex-1 overflow-y-auto space-y-1">
              {problems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                  <div className="w-9 h-9 rounded-full bg-[#04AA6D]/15 flex items-center justify-center text-[#04AA6D]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>No problems have been detected in the workspace.</div>
                  <p className="text-[11px] text-slate-500 max-w-sm">
                    Monaco syntax parsing, type inference, and AST diagnostics are continuously checking your code.
                  </p>
                </div>
              ) : (
                problems
                  .filter((p) => {
                    if (!filterProblemText) return true;
                    const query = filterProblemText.toLowerCase();
                    return (
                      p.message.toLowerCase().includes(query) ||
                      p.fileName.toLowerCase().includes(query) ||
                      p.filePath.toLowerCase().includes(query)
                    );
                  })
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onJumpToLine?.(p.filePath, p.line, p.column)}
                      className={`p-2 rounded border flex items-start justify-between cursor-pointer transition ${
                        isDark
                          ? 'bg-slate-900/70 hover:bg-slate-800 border-slate-800'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {p.severity === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        ) : p.severity === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className={`font-mono text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {p.message}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                            <span className="text-[#04AA6D] font-semibold">{p.fileName}</span>
                            <span>[{p.line}, {p.column}]</span>
                            <span>({p.source})</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        Line {p.line}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: DEBUG CONSOLE */}
        {activeTab === 'debug' && (
          <div className="flex-1 flex flex-col justify-between p-3 font-mono text-xs">
            <div className="overflow-y-auto space-y-1">
              {debugLogs.map((log, i) => (
                <div key={i} className="text-slate-400">{log}</div>
              ))}
            </div>
            <form onSubmit={handleDebugSubmit} className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <span className="text-[#04AA6D]">&gt;</span>
              <input
                type="text"
                value={debugInput}
                onChange={(e) => setDebugInput(e.target.value)}
                placeholder="Evaluate expression..."
                className="flex-1 bg-transparent border-none outline-none text-white text-xs"
              />
            </form>
          </div>
        )}

        {/* TAB 5: PORTS */}
        {activeTab === 'ports' && (
          <div className="flex-1 p-3 overflow-y-auto text-xs font-sans space-y-3">
            {/* Port Forwarding Input Bar */}
            <div className={`p-2.5 rounded-lg border flex flex-wrap items-center gap-2 justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                <input
                  type="number"
                  value={newPortNumber}
                  onChange={(e) => setNewPortNumber(e.target.value)}
                  placeholder="Port (e.g. 8000)"
                  className="w-24 px-2 py-1 rounded border border-slate-700 bg-slate-950/60 text-white font-mono text-xs outline-none focus:border-[#04AA6D]"
                />
                <input
                  type="text"
                  value={newPortLabel}
                  onChange={(e) => setNewPortLabel(e.target.value)}
                  placeholder="Label (e.g. Backend API, Fast-API)"
                  className="flex-1 px-2 py-1 rounded border border-slate-700 bg-slate-950/60 text-white text-xs outline-none focus:border-[#04AA6D]"
                />
                <select
                  value={newPortProtocol}
                  onChange={(e) => setNewPortProtocol(e.target.value)}
                  className="px-2 py-1 rounded border border-slate-700 bg-slate-900 text-white text-xs outline-none"
                >
                  <option value="HTTP">HTTP</option>
                  <option value="HTTPS">HTTPS</option>
                  <option value="WebSocket">WebSocket</option>
                  <option value="TCP">TCP</option>
                </select>
              </div>

              <button
                onClick={() => {
                  const portNum = parseInt(newPortNumber.trim(), 10);
                  if (!portNum || isNaN(portNum)) return;
                  const newPort: ForwardedPort = {
                    id: `p-${Date.now()}`,
                    port: portNum,
                    protocol: newPortProtocol,
                    label: newPortLabel.trim() || `Port ${portNum}`,
                    address: `http://localhost:${portNum}`,
                    status: 'listening',
                  };
                  setPorts((prev) => [...prev, newPort]);
                  setNewPortNumber('');
                  setNewPortLabel('');
                }}
                disabled={!newPortNumber.trim()}
                className="px-3 py-1 rounded bg-[#04AA6D] hover:bg-[#03985e] disabled:opacity-40 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Forward Port</span>
              </button>
            </div>

            {/* Ports Table */}
            <div className="border border-slate-800 rounded overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-900 px-3 py-1.5 font-bold text-slate-400 text-[11px] border-b border-slate-800">
                <span className="col-span-2">Port</span>
                <span className="col-span-2">Protocol</span>
                <span className="col-span-3">Label</span>
                <span className="col-span-3">Forwarded Address</span>
                <span className="col-span-2 text-right">Actions</span>
              </div>

              <div className="divide-y divide-slate-800">
                {ports.map((p) => (
                  <div key={p.id} className="grid grid-cols-12 px-3 py-2 text-white items-center text-xs hover:bg-slate-800/40 transition">
                    <span className="col-span-2 font-mono text-[#04AA6D] font-bold">
                      {p.port}
                    </span>
                    <span className="col-span-2 text-slate-300">
                      {p.protocol}
                    </span>
                    <span className="col-span-3 text-slate-200 truncate">
                      {p.label}
                    </span>
                    <span className="col-span-3 font-mono text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                      <span>{p.address}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'listening' ? 'bg-[#04AA6D]' : 'bg-slate-600'}`} />
                    </span>
                    <div className="col-span-2 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => window.open(p.address, '_blank', 'noopener,noreferrer')}
                        title="Open in new browser tab"
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(p.address);
                          setCopiedPortId(p.id);
                          setTimeout(() => setCopiedPortId(null), 2000);
                        }}
                        title="Copy address"
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        {copiedPortId === p.id ? (
                          <Check className="w-3.5 h-3.5 text-[#04AA6D]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => setPorts((prev) => prev.filter((item) => item.id !== p.id))}
                        title="Remove forwarded port"
                        className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
