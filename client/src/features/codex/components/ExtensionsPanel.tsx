import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Blocks,
  Search,
  Check,
  Download,
  Star,
  ExternalLink,
  RefreshCw,
  Trash2,
  Sparkles,
  ShieldCheck,
  X,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export interface ExtensionItem {
  id: string; // namespace.name
  name: string;
  displayName: string;
  publisher: string;
  description: string;
  version: string;
  downloadCount: number;
  rating: number;
  iconUrl?: string;
  isBuiltIn?: boolean;
  verified?: boolean;
  url?: string;
}

interface ExtensionsPanelProps {
  isDark: boolean;
}

// Built-in core capabilities that power CodeSphere Codex
const BUILT_IN_EXTENSIONS: ExtensionItem[] = [
  {
    id: 'codesphere.monaco-ts',
    name: 'monaco-typescript',
    displayName: 'Monaco TypeScript & JavaScript Server',
    publisher: 'CodeSphere Core',
    description: 'Built-in Monaco language server providing IntelliSense, AST syntax parsing, diagnostics, and autocompletion.',
    version: 'v0.52.0',
    downloadCount: 15400000,
    rating: 5.0,
    isBuiltIn: true,
    verified: true,
  },
  {
    id: 'codesphere.pyodide-worker',
    name: 'pyodide-runtime',
    displayName: 'Pyodide Python 3.11 Runtime',
    publisher: 'CodeSphere WebAssembly',
    description: 'Full in-browser Python scientific runtime supporting NumPy, SymPy, Pandas, and micro-benchmarking.',
    version: 'v0.26.1',
    downloadCount: 8200000,
    rating: 4.9,
    isBuiltIn: true,
    verified: true,
  },
  {
    id: 'codesphere.isomorphic-git',
    name: 'isomorphic-git',
    displayName: 'Git Version Control Engine',
    publisher: 'CodeSphere Core',
    description: 'LightningFS persistent Git workspace engine with remote GitHub PAT push, commit logging, and diffing.',
    version: 'v1.27.0',
    downloadCount: 6100000,
    rating: 4.9,
    isBuiltIn: true,
    verified: true,
  },
  {
    id: 'codesphere.gemini-copilot',
    name: 'gemini-assistant',
    displayName: 'Gemini 2.5 Flash AI Assistant',
    publisher: 'Google DeepMind',
    description: 'Multi-turn neural pair programmer for code refactoring, test suite generation, and terminal diagnostics.',
    version: 'v2.5.0',
    downloadCount: 12400000,
    rating: 5.0,
    isBuiltIn: true,
    verified: true,
  },
];

const CURATED_FALLBACK: ExtensionItem[] = [
  {
    id: 'ms-python.python',
    name: 'python',
    displayName: 'Python',
    publisher: 'ms-python',
    description: 'Python language support with extension access points for IntelliSense, debugging, formatting, and tests.',
    version: 'v2026.4.0',
    downloadCount: 61350000,
    rating: 4.8,
    verified: true,
    url: 'https://open-vsx.org/extension/ms-python/python',
  },
  {
    id: 'esbenp.prettier-vscode',
    name: 'prettier-vscode',
    displayName: 'Prettier - Code formatter',
    publisher: 'esbenp',
    description: 'Opinionated code formatter for JavaScript, TypeScript, CSS, JSON, Markdown, and YAML.',
    version: 'v12.4.0',
    downloadCount: 9616000,
    rating: 4.4,
    verified: true,
    url: 'https://open-vsx.org/extension/esbenp/prettier-vscode',
  },
  {
    id: 'dbaeumer.vscode-eslint',
    name: 'vscode-eslint',
    displayName: 'ESLint',
    publisher: 'dbaeumer',
    description: 'Integrates ESLint JavaScript and TypeScript linter directly into your editor.',
    version: 'v3.0.10',
    downloadCount: 38400000,
    rating: 4.7,
    verified: true,
    url: 'https://open-vsx.org/extension/dbaeumer/vscode-eslint',
  },
  {
    id: 'dracula-theme.theme-dracula',
    name: 'theme-dracula',
    displayName: 'Dracula Official',
    publisher: 'dracula-theme',
    description: 'Famous dark theme for CodeSphere, Monaco, and 300+ apps.',
    version: 'v2.24.3',
    downloadCount: 8200000,
    rating: 4.9,
    verified: true,
    url: 'https://open-vsx.org/extension/dracula-theme/theme-dracula',
  },
  {
    id: 'bradlc.vscode-tailwindcss',
    name: 'vscode-tailwindcss',
    displayName: 'Tailwind CSS IntelliSense',
    publisher: 'bradlc',
    description: 'Intelligent Tailwind CSS tooling for VS Code including autocomplete, syntax highlighting, and linting.',
    version: 'v0.14.3',
    downloadCount: 19500000,
    rating: 4.9,
    verified: true,
    url: 'https://open-vsx.org/extension/bradlc/vscode-tailwindcss',
  },
];

export const ExtensionsPanel: React.FC<ExtensionsPanelProps> = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'installed'>('marketplace');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [marketplaceExtensions, setMarketplaceExtensions] = useState<ExtensionItem[]>(CURATED_FALLBACK);
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [selectedExt, setSelectedExt] = useState<ExtensionItem | null>(null);

  // Load user installed extensions from localStorage
  const [installedExtensions, setInstalledExtensions] = useState<ExtensionItem[]>(() => {
    try {
      const saved = localStorage.getItem('codesphere_installed_extensions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    // Default installed extensions includes Prettier by default
    return [
      CURATED_FALLBACK[1], // Prettier
    ];
  });

  // Save installed extensions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('codesphere_installed_extensions', JSON.stringify(installedExtensions));
    } catch {}
  }, [installedExtensions]);

  // Set of installed extension IDs
  const installedIdSet = useMemo(() => {
    return new Set(installedExtensions.map((e) => e.id));
  }, [installedExtensions]);

  // Fetch extensions from live Open VSX Registry
  const fetchMarketplace = useCallback(async (searchQuery: string) => {
    setLoading(true);
    try {
      const endpoint = searchQuery.trim()
        ? `https://open-vsx.org/api/-/search?query=${encodeURIComponent(searchQuery.trim())}&size=20`
        : `https://open-vsx.org/api/-/search?sortBy=downloadCount&sortOrder=desc&size=20`;

      const res = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data && Array.isArray(data.extensions) && data.extensions.length > 0) {
        const mapped: ExtensionItem[] = data.extensions.map((ext: any) => ({
          id: `${ext.namespace}.${ext.name}`,
          name: ext.name,
          displayName: ext.displayName || ext.name,
          publisher: ext.namespace,
          description: ext.description || 'No description provided.',
          version: ext.version ? `v${ext.version}` : 'v1.0.0',
          downloadCount: ext.downloadCount || 0,
          rating: ext.averageRating ? Math.round(ext.averageRating * 10) / 10 : 4.5,
          iconUrl: ext.files?.icon,
          verified: !!ext.verified,
          url: ext.url || `https://open-vsx.org/extension/${ext.namespace}/${ext.name}`,
        }));
        setMarketplaceExtensions(mapped);
      } else if (searchQuery.trim()) {
        setMarketplaceExtensions([]);
      }
    } catch (err) {
      console.warn('Open VSX Registry fetch failed, using fallback:', err);
      // Fallback filter
      const q = searchQuery.toLowerCase().trim();
      if (!q) {
        setMarketplaceExtensions(CURATED_FALLBACK);
      } else {
        setMarketplaceExtensions(
          CURATED_FALLBACK.filter(
            (e) =>
              e.displayName.toLowerCase().includes(q) ||
              e.description.toLowerCase().includes(q) ||
              e.publisher.toLowerCase().includes(q)
          )
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search on query change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMarketplace(query);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, fetchMarketplace]);

  const handleInstall = async (ext: ExtensionItem) => {
    setInstallingId(ext.id);
    // Simulate natural plugin packaging / loading time
    await new Promise((resolve) => setTimeout(resolve, 550));
    setInstalledExtensions((prev) => {
      if (prev.some((e) => e.id === ext.id)) return prev;
      return [...prev, ext];
    });
    setInstallingId(null);
  };

  const handleUninstall = (id: string) => {
    setInstalledExtensions((prev) => prev.filter((e) => e.id !== id));
  };

  const formatDownloads = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div
      className={`h-full flex flex-col border-r select-none ${
        isDark
          ? 'bg-slate-950 border-slate-800 text-slate-100'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <div className={`flex items-center justify-between px-3 py-2 border-b shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-1.5">
          <Blocks className="w-3.5 h-3.5 text-[#04AA6D]" />
          <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Extensions Marketplace
          </span>
        </div>

        <button
          onClick={() => fetchMarketplace(query)}
          disabled={loading}
          className={`p-1 rounded transition cursor-pointer ${
            isDark
              ? 'hover:bg-[#1e293b] text-[#94a3b8] hover:text-white'
              : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
          }`}
          title="Refresh Extensions"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#04AA6D]' : ''}`} />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className={`flex items-center border-b shrink-0 text-xs font-semibold px-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center gap-1.5 py-2 px-3 border-b-2 transition cursor-pointer ${
            activeTab === 'marketplace'
              ? `border-[#04AA6D] ${isDark ? 'text-white' : 'text-slate-900'}`
              : `border-transparent ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`
          }`}
        >
          <span>Marketplace</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
            Open VSX
          </span>
        </button>

        <button
          onClick={() => setActiveTab('installed')}
          className={`flex items-center gap-1.5 py-2 px-3 border-b-2 transition cursor-pointer ${
            activeTab === 'installed'
              ? `border-[#04AA6D] ${isDark ? 'text-white' : 'text-slate-900'}`
              : `border-transparent ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`
          }`}
        >
          <span>Installed</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#04AA6D]/20 text-[#04AA6D] font-mono">
            {installedExtensions.length + BUILT_IN_EXTENSIONS.length}
          </span>
        </button>
      </div>

      {/* Search Input (Active for marketplace) */}
      {activeTab === 'marketplace' && (
        <div className={`p-2 border-b shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 3,000+ Open VSX Extensions..."
              className={`w-full pl-7 pr-7 py-1.5 rounded-lg border focus:border-[#04AA6D] text-xs outline-none transition ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-[#04AA6D]'
              }`}
            />
            <Search className={`w-3.5 h-3.5 absolute left-2 pointer-none ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            {query && (
              <button
                onClick={() => setQuery('')}
                className={`absolute right-2 ${isDark ? 'text-[#94a3b8] hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 text-xs">
        {activeTab === 'marketplace' ? (
          <>
            {loading && (
              <div className="py-4 text-center space-y-2">
                <RefreshCw className="w-5 h-5 mx-auto animate-spin text-[#04AA6D]" />
                <div className={`text-[11px] ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>Querying Open VSX Registry...</div>
              </div>
            )}

            {!loading && marketplaceExtensions.length === 0 && (
              <div className={`p-6 text-center space-y-2 border border-dashed rounded-xl my-4 ${
                isDark ? 'border-[#334155]' : 'border-slate-300 bg-white'
              }`}>
                <Blocks className="w-8 h-8 mx-auto text-[#64748b]" />
                <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>No extensions found</div>
                <div className={`text-[11px] ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                  Try searching for keywords like "python", "theme", "prettier", or "git".
                </div>
              </div>
            )}

            {!loading &&
              marketplaceExtensions.map((ext) => {
                const isInstalled = installedIdSet.has(ext.id);
                const isInstalling = installingId === ext.id;

                return (
                  <div
                    key={ext.id}
                    onClick={() => setSelectedExt(ext)}
                    className={`p-2.5 rounded-xl border transition space-y-1.5 cursor-pointer shadow-xs ${
                      isDark
                        ? 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-[#04AA6D]/50'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-[#04AA6D]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 overflow-hidden">
                        {ext.iconUrl ? (
                          <img
                            src={ext.iconUrl}
                            alt={ext.displayName}
                            className={`w-8 h-8 rounded-lg object-contain p-1 border shrink-0 ${
                              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                            }`}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#04AA6D] to-[#3b82f6] text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
                            {ext.displayName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="overflow-hidden">
                          <div className={`font-semibold leading-tight truncate flex items-center gap-1 ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            <span>{ext.displayName}</span>
                            {ext.verified && (
                              <ShieldCheck className="w-3 h-3 text-[#3b82f6] shrink-0" />
                            )}
                          </div>
                          <div className={`text-[10px] flex items-center gap-1.5 truncate ${
                            isDark ? 'text-[#94a3b8]' : 'text-slate-500'
                          }`}>
                            <span>{ext.publisher}</span>
                            <span>•</span>
                            <span className={`font-mono ${isDark ? 'text-[#64748b]' : 'text-slate-400'}`}>{ext.version}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isInstalled) {
                            handleUninstall(ext.id);
                          } else {
                            handleInstall(ext);
                          }
                        }}
                        disabled={isInstalling}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition shrink-0 cursor-pointer flex items-center gap-1 active:scale-95 ${
                          isInstalled
                            ? 'bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/50 hover:bg-[#ef4444]/20 hover:text-[#ef4444] hover:border-[#ef4444]/50'
                            : 'bg-[#04AA6D] hover:bg-[#03945e] text-white shadow-xs'
                        }`}
                        title={isInstalled ? 'Click to uninstall' : 'Install extension'}
                      >
                        {isInstalling ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Installing...</span>
                          </>
                        ) : isInstalled ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Installed</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3" />
                            <span>Install</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className={`text-[11px] leading-tight line-clamp-2 ${isDark ? 'text-[#cbd5e1]' : 'text-slate-600'}`}>
                      {ext.description}
                    </p>

                    <div className={`flex items-center gap-3 text-[10px] font-mono pt-0.5 border-t ${
                      isDark ? 'border-[#334155]/30 text-[#71717a]' : 'border-slate-100 text-slate-500'
                    }`}>
                      <span className="flex items-center gap-1">
                        <Download className="w-2.5 h-2.5" />
                        <span>{formatDownloads(ext.downloadCount)}</span>
                      </span>
                      <span className="flex items-center gap-0.5 text-[#fbbf24]">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>{ext.rating}</span>
                      </span>
                      {ext.url && (
                        <a
                          href={ext.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="ml-auto text-[#04AA6D] hover:underline flex items-center gap-0.5"
                        >
                          <span>Open VSX</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
          </>
        ) : (
          /* Installed Extensions Tab */
          <div className="space-y-4">
            {/* Core Built-in Extensions */}
            <div className="space-y-2">
              <div className={`text-[10px] font-bold uppercase tracking-wider px-1 flex items-center justify-between ${
                isDark ? 'text-[#94a3b8]' : 'text-slate-600'
              }`}>
                <span>Core IDE Engines ({BUILT_IN_EXTENSIONS.length})</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/40">
                  ACTIVE
                </span>
              </div>

              {BUILT_IN_EXTENSIONS.map((ext) => (
                <div
                  key={ext.id}
                  className={`p-2.5 rounded-xl border space-y-1 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`font-semibold flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <span>{ext.displayName}</span>
                        <Sparkles className="w-3 h-3 text-[#04AA6D]" />
                      </div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ext.publisher} • {ext.version}</div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                      isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}>
                      Built-in
                    </span>
                  </div>
                  <p className={`text-[11px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {ext.description}
                  </p>
                </div>
              ))}
            </div>

            {/* User Installed Extensions */}
            <div className="space-y-2">
              <div className={`text-[10px] font-bold uppercase tracking-wider px-1 flex items-center justify-between ${
                isDark ? 'text-[#94a3b8]' : 'text-slate-600'
              }`}>
                <span>User Installed ({installedExtensions.length})</span>
                <span className={`text-[10px] ${isDark ? 'text-[#64748b]' : 'text-slate-500'}`}>Marketplace</span>
              </div>

              {installedExtensions.length === 0 ? (
                <div className={`p-4 rounded-xl border border-dashed text-center space-y-1 ${
                  isDark ? 'border-[#334155]' : 'border-slate-300 bg-white'
                }`}>
                  <div className={`text-xs ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>No marketplace extensions installed yet.</div>
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="text-xs font-semibold text-[#04AA6D] hover:underline cursor-pointer"
                  >
                    Browse Open VSX Marketplace →
                  </button>
                </div>
              ) : (
                installedExtensions.map((ext) => (
                  <div
                    key={ext.id}
                    className={`p-2.5 rounded-xl border space-y-1.5 ${
                      isDark ? 'bg-[#0f172a] border-[#334155]' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="overflow-hidden">
                        <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{ext.displayName}</div>
                        <div className={`text-[10px] ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>{ext.publisher} • {ext.version}</div>
                      </div>

                      <button
                        onClick={() => handleUninstall(ext.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          isDark
                            ? 'bg-[#1e293b] hover:bg-[#ef4444]/20 text-[#94a3b8] hover:text-[#ef4444]'
                            : 'bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600'
                        }`}
                        title="Uninstall Extension"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className={`text-[11px] leading-tight line-clamp-2 ${isDark ? 'text-[#cbd5e1]' : 'text-slate-600'}`}>
                      {ext.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#04AA6D] pt-0.5">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#04AA6D]" />
                        <span>Enabled globally</span>
                      </span>
                      {ext.url && (
                        <a
                          href={ext.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center gap-0.5 ${isDark ? 'text-[#94a3b8] hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                          <span>Docs</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Extension Details Modal Drawer */}
      {selectedExt && (
        <div className={`p-3 border-t space-y-2 shrink-0 animate-in slide-in-from-bottom-2 duration-150 ${
          isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white shadow-lg'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedExt.displayName}</div>
              <div className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedExt.id} • {selectedExt.version}</div>
            </div>
            <button
              onClick={() => setSelectedExt(null)}
              className={`p-1 rounded ${isDark ? 'text-[#94a3b8] hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className={`text-[11px] leading-tight ${isDark ? 'text-[#cbd5e1]' : 'text-slate-600'}`}>
            {selectedExt.description}
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className={`text-[10px] font-mono ${isDark ? 'text-[#71717a]' : 'text-slate-400'}`}>
              ⭐ {selectedExt.rating} • {formatDownloads(selectedExt.downloadCount)} installs
            </span>

            {selectedExt.url && (
              <a
                href={selectedExt.url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-[#04AA6D] hover:underline flex items-center gap-1"
              >
                <span>View on Open VSX</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
