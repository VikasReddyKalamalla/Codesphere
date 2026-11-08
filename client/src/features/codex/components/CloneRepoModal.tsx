import React, { useState } from 'react';
import { GitFork, X, Terminal, Check, Loader2, Sparkles, Folder } from 'lucide-react';
import { WorkspaceFile } from '../types/codex';

interface CloneRepoModalProps {
  isOpen: boolean;
  username: string;
  onClose: () => void;
  onCloneSuccess: (
    folderName: string,
    workspacePath: string,
    files: WorkspaceFile[]
  ) => void;
  isDark: boolean;
}

export const CloneRepoModal: React.FC<CloneRepoModalProps> = ({
  isOpen,
  username,
  onClose,
  onCloneSuccess,
  isDark,
}) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [targetFolder, setTargetFolder] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [cloneLogs, setCloneLogs] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  if (!isOpen) return null;

  const templates = [
    {
      id: 'react',
      name: 'React + TypeScript',
      url: 'https://github.com/codesphere/react-ts-starter.git',
      folder: 'react-starter',
      files: [
        {
          name: 'App.tsx',
          path: 'src/App.tsx',
          lang: 'typescript',
          code: `import React, { useState } from 'react';\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n  return (\n    <main className="p-8 text-center">\n      <h1 className="text-2xl font-bold">CodeSphere React Project</h1>\n      <button onClick={() => setCount(c => c + 1)} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded">\n        Count: {count}\n      </button>\n    </main>\n  );\n}`,
        },
        {
          name: 'index.html',
          path: 'index.html',
          lang: 'html',
          code: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <title>React App</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>`,
        },
        {
          name: 'package.json',
          path: 'package.json',
          lang: 'json',
          code: `{\n  "name": "react-ts-starter",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}`,
        },
      ],
    },
    {
      id: 'fastapi',
      name: 'Python FastAPI Microservice',
      url: 'https://github.com/codesphere/fastapi-backend.git',
      folder: 'fastapi-service',
      files: [
        {
          name: 'main.py',
          path: 'main.py',
          lang: 'python',
          code: `from fastapi import FastAPI\n\napp = FastAPI(title="Codex Microservice")\n\n@app.get("/")\ndef read_root():\n    return {"status": "ok", "engine": "CodeSphere Codex"}\n\n@app.get("/items/{item_id}")\ndef read_item(item_id: int, q: str = None):\n    return {"item_id": item_id, "q": q}`,
        },
        {
          name: 'requirements.txt',
          path: 'requirements.txt',
          lang: 'plaintext',
          code: `fastapi>=0.100.0\nuvicorn>=0.22.0\npydantic>=2.0.0`,
        },
      ],
    },
    {
      id: 'dsa',
      name: 'DSA & Algorithms Suite',
      url: 'https://github.com/codesphere/dsa-algorithms.git',
      folder: 'dsa-roadmap',
      files: [
        {
          name: 'binary_search.js',
          path: 'algorithms/binary_search.js',
          lang: 'javascript',
          code: `// Binary Search implementation\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n\nconsole.log(binarySearch([1, 3, 5, 7, 9, 11], 7));`,
        },
        {
          name: 'graph_traversal.py',
          path: 'algorithms/graph_traversal.py',
          lang: 'python',
          code: `def bfs(graph, start):\n    visited = set()\n    queue = [start]\n    while queue:\n        vertex = queue.pop(0)\n        if vertex not in visited:\n            visited.add(vertex)\n            print(vertex, end=" ")\n            queue.extend(graph[vertex] - visited)\n\ngraph = {'A': {'B', 'C'}, 'B': {'A', 'D'}, 'C': {'A', 'E'}, 'D': {'B'}, 'E': {'C'}}\nbfs(graph, 'A')`,
        },
      ],
    },
  ];

  const handleUrlChange = (val: string) => {
    setRepoUrl(val);
    const parts = val.split('/');
    const lastPart = parts[parts.length - 1]?.replace('.git', '') || '';
    if (lastPart) {
      setTargetFolder(lastPart);
    }
  };

  const handleSelectTemplate = (t: typeof templates[0]) => {
    setSelectedTemplate(t.id);
    setRepoUrl(t.url);
    setTargetFolder(t.folder);
  };

  const handleStartClone = async () => {
    const finalFolder = targetFolder.trim() || 'cloned-repository';
    const finalUrl = repoUrl.trim() || 'https://github.com/codesphere/project.git';

    setIsCloning(true);
    setCloneLogs([`git clone ${finalUrl} ${finalFolder}`]);

    await new Promise((r) => setTimeout(r, 400));
    setCloneLogs((prev) => [...prev, `Cloning into '${finalFolder}'...`]);

    await new Promise((r) => setTimeout(r, 500));
    setCloneLogs((prev) => [
      ...prev,
      `remote: Enumerating objects: 38, done.`,
      `remote: Counting objects: 100% (38/38), done.`,
      `remote: Compressing objects: 100% (29/29), done.`,
    ]);

    await new Promise((r) => setTimeout(r, 500));
    setCloneLogs((prev) => [
      ...prev,
      `Receiving objects: 100% (38/38), 16.42 KiB | 2.14 MiB/s, done.`,
      `Resolving deltas: 100% (8/8), done.`,
      `Successfully cloned repository into ${finalFolder}.`,
    ]);

    await new Promise((r) => setTimeout(r, 400));

    // Choose files from matching template or generate default clean README
    const tmpl = templates.find((t) => t.id === selectedTemplate);
    const newFiles: WorkspaceFile[] = tmpl
      ? tmpl.files.map((f, idx) => ({
          id: `clone_${Date.now()}_${idx}`,
          name: f.name,
          path: f.path,
          language: f.lang,
          type: 'file',
          content: f.code,
          isOpen: idx === 0,
          isModified: false,
        }))
      : [
          {
            id: `clone_${Date.now()}_0`,
            name: 'README.md',
            path: 'README.md',
            language: 'markdown',
            type: 'file',
            content: `# ${finalFolder}\n\nCloned from ${finalUrl}\n\nReady for collaboration and development in CodeSphere Codex.\n`,
            isOpen: true,
            isModified: false,
          },
        ];

    const workspacePath = `C:\\Users\\${username}\\${finalFolder}`;
    onCloneSuccess(finalFolder, workspacePath, newFiles);
    setIsCloning(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-xl shadow-2xl border overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-[#04AA6D]" />
            <h3 className="text-sm font-semibold">Clone Git Repository</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isCloning}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs">
          {/* Preset templates */}
          <div>
            <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Popular Starters / Templates
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTemplate(t)}
                  className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                    selectedTemplate === t.id
                      ? `border-[#04AA6D] bg-[#04AA6D]/15 ${isDark ? 'text-white' : 'text-emerald-950 font-bold'}`
                      : isDark
                      ? 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="font-semibold text-[11px] truncate">{t.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{t.folder}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Repo URL input */}
          <div className="space-y-1.5">
            <label className={`text-[11px] font-medium block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Repository URL:
            </label>
            <div className="relative">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://github.com/username/repository.git"
                disabled={isCloning}
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition font-mono ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 focus:border-[#04AA6D] text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 focus:border-[#04AA6D] text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Target Folder */}
          <div className="space-y-1.5">
            <label className={`text-[11px] font-medium block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Destination Folder Name:
            </label>
            <div className="relative">
              <Folder className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={targetFolder}
                onChange={(e) => setTargetFolder(e.target.value)}
                placeholder="my-repository-folder"
                disabled={isCloning}
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs outline-none transition font-mono ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 focus:border-[#04AA6D] text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 focus:border-[#04AA6D] text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Terminal output simulation */}
          {cloneLogs.length > 0 && (
            <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-white pb-1 border-b border-slate-800">
                <Terminal className="w-3.5 h-3.5 text-[#04AA6D]" />
                <span>Git Console</span>
              </div>
              {cloneLogs.map((log, idx) => (
                <div key={idx} className="leading-tight">
                  {log.startsWith('Successfully') ? (
                    <span className="text-[#04AA6D] font-bold">{log}</span>
                  ) : (
                    log
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className={`flex items-center justify-end gap-2 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={onClose}
              disabled={isCloning}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                isDark
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartClone}
              disabled={isCloning || (!repoUrl.trim() && !selectedTemplate)}
              className="px-4 py-1.5 rounded-lg bg-[#04AA6D] hover:bg-[#03985e] disabled:opacity-40 text-white font-medium text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              {isCloning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cloning...</span>
                </>
              ) : (
                <>
                  <GitFork className="w-3.5 h-3.5" />
                  <span>Clone</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
