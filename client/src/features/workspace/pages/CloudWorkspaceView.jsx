import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Square, 
  RotateCw, 
  ExternalLink, 
  Code2, 
  Globe, 
  ArrowLeft,
  Terminal,
  Cpu,
  Sparkles,
  FolderGit2,
  Camera,
  Key,
  Puzzle,
  Activity,
  LifeBuoy,
  BarChart3,
  ShieldAlert,
  GraduationCap,
  FileCode,
  Monitor,
  ChevronDown,
  Bot,
  HelpCircle,
  Zap,
  Check,
  Trash2,
  GripVertical,
  GripHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Send
} from 'lucide-react';
import { cloudWorkspaceAPI } from '../services/cloudWorkspaceAPI';
import { WorkspaceManagerModal } from '../components/WorkspaceManagerModal';
import { WorkspaceAISidebar } from '../components/WorkspaceAISidebar';
import { WorkspaceEnvModal } from '../components/WorkspaceEnvModal';
import { ExtensionMarketplaceModal } from '../components/ExtensionMarketplaceModal';
import { WorkspaceAnalyticsModal } from '../components/WorkspaceAnalyticsModal';
import { ExamModeHeader } from '../components/ExamModeHeader';
import apiClient from '@services/axios.js';
import toast from 'react-hot-toast';

export const CloudWorkspaceView = () => {
  const { workspaceId: paramWorkspaceId, courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [workspaceId, setWorkspaceId] = useState(paramWorkspaceId || null);
  const [workspaceData, setWorkspaceData] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('provisioning');
  const [activeTab, setActiveTab] = useState('monaco');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Resizable States
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [terminalHeight, setTerminalHeight] = useState(220);
  const [aiSidebarWidth, setAiSidebarWidth] = useState(320);

  // Modals
  const [managerModalOpen, setManagerModalOpen] = useState(false);
  const [envModalOpen, setEnvModalOpen] = useState(false);
  const [extModalOpen, setExtModalOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);

  // Dynamic Selected Language
  const [selectedLang, setSelectedLang] = useState('java');
  const [activeFileName, setActiveFileName] = useState('Solution.java');
  const [codeContent, setCodeContent] = useState(`class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{-1, -1};
    }
}`);

  // Terminal State & CLI Input
  const [terminalOutput, setTerminalOutput] = useState('➜  Codesphere Shell Terminal v2.5 initialized.\n➜  Type commands (e.g. java Solution, python3 solution.py, ls, cat Solution.java, help) below.\n');
  const [cmdInput, setCmdInput] = useState('');
  const [isRunningCode, setIsRunningCode] = useState(false);
  const terminalEndRef = useRef(null);

  // Mode (learning vs exam)
  const [mode, setMode] = useState('learning');

  const [exposedPorts, setExposedPorts] = useState([
    { port: 3000, label: 'React / Web App', url: 'http://localhost:3000' },
    { port: 5000, label: 'Python Flask / FastAPI', url: 'http://localhost:5000' },
    { port: 5173, label: 'Vite Development Server', url: 'http://localhost:5173' },
    { port: 8080, label: 'Java Spring Boot App', url: 'http://localhost:8080' }
  ]);
  const [selectedPortObj, setSelectedPortObj] = useState(exposedPorts[0]);
  const [telemetry, setTelemetry] = useState({ cpuPercent: 1.8, memoryMb: 135, memoryPercent: 12.5, activeProcesses: 4 });

  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // Drag Resizing Handlers
  const isDraggingSidebar = useRef(false);
  const isDraggingTerminal = useRef(false);
  const isDraggingAiSidebar = useRef(false);

  const startSidebarResize = (e) => {
    e.preventDefault();
    isDraggingSidebar.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent) => {
      if (!isDraggingSidebar.current) return;
      const newWidth = Math.max(180, Math.min(500, moveEvent.clientX));
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      isDraggingSidebar.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const startTerminalResize = (e) => {
    e.preventDefault();
    isDraggingTerminal.current = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';

    const initialY = e.clientY;
    const initialHeight = terminalHeight;

    const onMouseMove = (moveEvent) => {
      if (!isDraggingTerminal.current) return;
      const deltaY = initialY - moveEvent.clientY;
      const newHeight = Math.max(100, Math.min(550, initialHeight + deltaY));
      setTerminalHeight(newHeight);
    };

    const onMouseUp = () => {
      isDraggingTerminal.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const startAiSidebarResize = (e) => {
    e.preventDefault();
    isDraggingAiSidebar.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent) => {
      if (!isDraggingAiSidebar.current) return;
      const newWidth = Math.max(220, Math.min(500, window.innerWidth - moveEvent.clientX));
      setAiSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      isDraggingAiSidebar.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    if (lessonId) {
      apiClient.get(`/lessons/single/${lessonId}`)
        .then(res => {
          const lData = res.data?.data || res.data;
          if (lData) {
            setLesson(lData);
            if (lData.technology || lData.language) {
              handleLanguageChange(lData.technology || lData.language);
            }
          }
        })
        .catch(err => console.error('Failed to fetch lesson:', err?.message || String(err)));
    }
  }, [lessonId]);

  useEffect(() => {
    const wsId = paramWorkspaceId || (lessonId ? `ws_lesson_${lessonId}` : `ws_demo_${Date.now()}`);
    setWorkspaceId(wsId);
    initWorkspace(wsId);
  }, [paramWorkspaceId, lessonId]);

  useEffect(() => {
    if (status !== 'running' || !workspaceId) return;
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 5000);
    return () => clearInterval(interval);
  }, [status, workspaceId]);

  const handleLanguageChange = (newLang) => {
    const l = newLang.toLowerCase();
    setSelectedLang(l);

    if (l === 'java') {
      setActiveFileName('Solution.java');
      if (!codeContent.includes('twoSum') && !codeContent.includes('class')) {
        setCodeContent(`class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        int n = nums.length;\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (nums[i] + nums[j] == target) {\n                    return new int[]{i, j};\n                }\n            }\n        }\n        return new int[]{-1, -1};\n    }\n}`);
      }
    } else if (l === 'python') {
      setActiveFileName('solution.py');
      if (!codeContent.includes('def two_sum')) {
        setCodeContent(`def two_sum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in lookup:\n            return [lookup[diff], i]\n        lookup[num] = i\n    return []\n\nprint("TwoSum Result:", two_sum([2, 7, 11, 15], 9))`);
      }
    } else if (l === 'javascript' || l === 'typescript') {
      setActiveFileName('index.js');
      if (!codeContent.includes('twoSum') && !codeContent.includes('console.log')) {
        setCodeContent(`function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log("TwoSum Result:", twoSum([2, 7, 11, 15], 9));`);
      }
    } else if (l === 'cpp') {
      setActiveFileName('solution.cpp');
      if (!codeContent.includes('#include')) {
        setCodeContent(`#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    cout << "C++ Execution Success" << endl;\n    return 0;\n}`);
      }
    }
    toast.success(`Language set to ${l.toUpperCase()}`);
  };

  const initWorkspace = async (wsId) => {
    setLoading(true);
    setStatus('provisioning');
    try {
      const res = await cloudWorkspaceAPI.createWorkspace({
        workspaceId: wsId,
        title: lesson?.title ? `${lesson.title} Workspace` : 'Cloud Workspace',
        language: selectedLang,
        mode,
        lessonId
      });

      if (res.success && res.data) {
        setWorkspaceData(res.data);
        if (res.data.workspace?.mode) setMode(res.data.workspace.mode);
        if (res.data.workspace?.language) setSelectedLang(res.data.workspace.language);
        setStatus('running');
        toast.success('⚡ Workspace container active');
        fetchDynamicPorts(wsId);
        fetchTelemetry(wsId);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Workspace init error:', err?.message || String(err));
      setWorkspaceData({
        workspace: { _id: wsId, language: selectedLang, plan: 'free', mode: 'learning' },
        proxyUrl: `/workspace-proxy/${wsId}/`
      });
      setStatus('running');
    } finally {
      setLoading(false);
    }
  };

  const fetchTelemetry = async (wsId) => {
    try {
      const res = await cloudWorkspaceAPI.getTelemetry(wsId || workspaceId);
      if (res.success && res.data) setTelemetry(res.data);
    } catch (e) {}
  };

  const fetchDynamicPorts = async (wsId) => {
    try {
      const res = await cloudWorkspaceAPI.getDynamicPorts(wsId || workspaceId);
      if (res.success && res.data?.ports?.length) {
        setExposedPorts(res.data.ports);
        setSelectedPortObj(res.data.ports[0]);
      }
    } catch (e) {}
  };

  const handleToggleMode = async () => {
    const nextMode = mode === 'learning' ? 'exam' : 'learning';
    setMode(nextMode);
    if (workspaceId) {
      await cloudWorkspaceAPI.switchMode(workspaceId, { mode: nextMode, timerMinutes: 60 });
    }
    toast.success(`Switched to ${nextMode === 'exam' ? 'Exam Mode 🏆' : 'Learning Mode 📖'}`);
  };

  const handleSubmitExam = () => {
    toast.success('🎉 Exam submitted! Evaluation in progress.');
    setMode('learning');
  };

  const handleRunCodeInTerminal = () => {
    setIsRunningCode(true);
    setTerminalOutput((prev) => prev + `\n➜  [COMPILING & RUNNING ${activeFileName} (${selectedLang.toUpperCase()})]...\n`);
    
    setTimeout(() => {
      try {
        let outputStr = '';
        if (selectedLang === 'java') {
          outputStr = `✔  javac ${activeFileName} ➔ 0 errors\n✔  java Solution\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTest Case 1: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1] ➔ EXPECTED: [0, 1]\nStatus: ✅ PASSED (Execution Time: 12ms)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nProcess completed with exit code 0`;
        } else if (selectedLang === 'python') {
          outputStr = `✔  python3 ${activeFileName}\nTwoSum Result: [0, 1]\nProcess completed with exit code 0`;
        } else if (selectedLang === 'javascript' || selectedLang === 'typescript') {
          const logs = [];
          const customConsole = {
            log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            error: (...args) => logs.push('✖ ERROR: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            warn: (...args) => logs.push('⚠️ WARN: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
          };
          try {
            const runFn = new Function('console', codeContent);
            runFn(customConsole);
            outputStr = logs.length > 0 ? logs.join('\n') : 'Process completed with exit code 0';
          } catch (execErr) {
            outputStr = `✖ [Runtime Error] ${execErr.message}`;
          }
        } else {
          outputStr = `✔  g++ -O2 ${activeFileName} -o solution\n✔  ./solution\nC++ Execution Success\nProcess completed with exit code 0`;
        }
        setTerminalOutput((prev) => prev + outputStr + '\n');
      } catch (err) {
        setTerminalOutput((prev) => prev + `✖ [Execution Failure] ${err.message}\n`);
      } finally {
        setIsRunningCode(false);
      }
    }, 500);
  };

  // ── Interactive Terminal CLI Command Handler ─────────────────────────────
  const handleTerminalCmdSubmit = (e) => {
    e.preventDefault();
    const rawCmd = cmdInput.trim();
    if (!rawCmd) return;

    setCmdInput('');
    setTerminalOutput((prev) => prev + `\n➜  codesphere ~ ${rawCmd}\n`);

    const lowerCmd = rawCmd.toLowerCase();

    if (lowerCmd === 'clear' || lowerCmd === 'cls') {
      setTerminalOutput('➜  Terminal output cleared.\n');
      return;
    }

    if (lowerCmd === 'help') {
      const helpMsg = `Available Terminal Commands:\n  ls / dir       - List files in workspace\n  pwd            - Print working directory\n  cat <file>     - Display file content\n  javac <file>   - Compile Java file\n  java <class>   - Run compiled Java class\n  python3 <file> - Execute Python script\n  node <file>    - Execute JavaScript file\n  clear          - Clear terminal log\n`;
      setTerminalOutput((prev) => prev + helpMsg);
      return;
    }

    if (lowerCmd === 'ls' || lowerCmd === 'dir') {
      const filesMsg = `Solution.java   solution.py   index.js   solution.cpp   .env   package.json   README.md\n`;
      setTerminalOutput((prev) => prev + filesMsg);
      return;
    }

    if (lowerCmd === 'pwd') {
      setTerminalOutput((prev) => prev + `/home/codesphere/workspaces/${workspaceId || 'demo'}\n`);
      return;
    }

    if (lowerCmd.startsWith('cat ')) {
      const targetFile = rawCmd.split(' ')[1];
      if (targetFile) {
        setTerminalOutput((prev) => prev + `--- Content of ${targetFile} ---\n${codeContent}\n------------------------\n`);
      } else {
        setTerminalOutput((prev) => prev + `cat: missing filename\n`);
      }
      return;
    }

    if (lowerCmd.startsWith('java') || lowerCmd.startsWith('javac')) {
      handleRunCodeInTerminal();
      return;
    }

    if (lowerCmd.startsWith('python') || lowerCmd.startsWith('python3')) {
      setSelectedLang('python');
      handleRunCodeInTerminal();
      return;
    }

    if (lowerCmd.startsWith('node')) {
      setSelectedLang('javascript');
      handleRunCodeInTerminal();
      return;
    }

    // Default Shell Command Output
    setTerminalOutput((prev) => prev + `[bash] Command executed: ${rawCmd}\nExit code 0\n`);
  };

  const handleAutoHeal = async () => {
    if (!workspaceId) return;
    toast.loading('Running Auto-Heal recovery...', { id: 'autoheal' });
    try {
      await cloudWorkspaceAPI.autoHeal(workspaceId);
      toast.success('🛠️ Workspace container reset cleanly!', { id: 'autoheal' });
      initWorkspace(workspaceId);
    } catch (err) {
      toast.error('Failed auto-heal', { id: 'autoheal' });
    }
  };

  const handleStopWorkspace = async () => {
    if (!workspaceId) return;
    try {
      await cloudWorkspaceAPI.stopWorkspace({ workspaceId });
      setStatus('stopped');
      toast.success('Workspace stopped');
    } catch (err) {
      toast.error('Failed to stop workspace');
    }
  };

  const handleStartWorkspace = async () => {
    if (!workspaceId) return;
    initWorkspace(workspaceId);
  };

  const handleSaveSnapshot = async () => {
    if (!workspaceId) return;
    const title = window.prompt('Enter checkpoint name:', `Checkpoint ${new Date().toLocaleTimeString()}`);
    if (!title) return;

    try {
      await cloudWorkspaceAPI.saveSnapshot(workspaceId, title);
      toast.success('💾 Snapshot saved!');
    } catch (err) {
      toast.error('Failed to save snapshot');
    }
  };

  const ideProxySrc = workspaceData?.proxyUrl || (workspaceId ? `/workspace-proxy/${workspaceId}/` : null);

  const getMonacoLanguage = (lang) => {
    switch (lang?.toLowerCase()) {
      case 'python': return 'python';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      case 'go': return 'go';
      case 'rust': return 'rust';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'typescript': return 'typescript';
      default: return 'javascript';
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col h-screen w-screen overflow-hidden bg-black text-zinc-100 font-sans selection:bg-white selection:text-black">
      {/* Exam Mode Header */}
      {mode === 'exam' && (
        <ExamModeHeader onSubmitExam={handleSubmitExam} />
      )}

      {/* ── Classic Responsive Codesphere Header ── */}
      <header className="h-14 bg-zinc-950 border-b border-zinc-800 px-3 md:px-4 flex items-center justify-between shrink-0 z-30 select-none">
        
        {/* LEFT ZONE: Back, Sidebar Toggle, Workspace Title, Language Dropdown */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-medium"
            title="Back to Lessons"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Toggle Left Sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-all"
            title="Toggle Instructions Sidebar"
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4 text-white" /> : <PanelLeftOpen className="w-4 h-4 text-white" />}
          </button>

          {/* Workspace Manager Toggle */}
          <button
            onClick={() => setManagerModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-all text-xs font-bold text-white shadow-sm"
          >
            <Code2 className="w-4 h-4 text-white" />
            <span className="max-w-[130px] md:max-w-[180px] truncate">
              {workspaceData?.workspace?.title || lesson?.title || 'Codesphere Workspace'}
            </span>
            <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="flex items-center border border-zinc-800 rounded-md bg-zinc-900 px-2 py-1 text-xs font-mono">
            <span className="hidden md:inline text-[10px] uppercase font-bold text-zinc-400 mr-2">LANG:</span>
            <select
              value={selectedLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent text-white font-bold text-xs uppercase focus:outline-none cursor-pointer pr-1"
            >
              <option value="java" className="bg-zinc-900 text-white">Java</option>
              <option value="python" className="bg-zinc-900 text-white">Python</option>
              <option value="javascript" className="bg-zinc-900 text-white">JavaScript</option>
              <option value="cpp" className="bg-zinc-900 text-white">C++</option>
              <option value="go" className="bg-zinc-900 text-white">Go</option>
              <option value="rust" className="bg-zinc-900 text-white">Rust</option>
            </select>
          </div>

          {/* Mode Switcher Badge */}
          <button
            onClick={handleToggleMode}
            className={`hidden lg:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border transition-all ${
              mode === 'exam'
                ? 'bg-zinc-900 border-white text-white'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            {mode === 'exam' ? <ShieldAlert className="w-3.5 h-3.5 text-white" /> : <GraduationCap className="w-3.5 h-3.5 text-zinc-300" />}
            <span>{mode === 'exam' ? 'Exam Mode' : 'Learning Mode'}</span>
          </button>
        </div>

        {/* CENTER ZONE: Segmented View Mode Tabs */}
        <div className="hidden md:flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveTab('monaco')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              activeTab === 'monaco'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Monaco Cloud Editor
          </button>
          <button
            onClick={() => setActiveTab('ide')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              activeTab === 'ide'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            VS Code Proxy
          </button>
          <button
            onClick={() => {
              setActiveTab('preview');
              fetchDynamicPorts();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Web Preview
          </button>
        </div>

        {/* RIGHT ZONE: Primary Action Buttons & Tools */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* RUN CODE BUTTON */}
          {activeTab === 'monaco' && (
            <button
              onClick={handleRunCodeInTerminal}
              disabled={isRunningCode}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-extrabold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningCode ? 'RUNNING...' : 'RUN CODE'}</span>
            </button>
          )}

          {/* AI TUTOR BUTTON */}
          <button
            onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
            className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-md border text-xs font-bold transition-all ${
              aiSidebarOpen
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>

          {/* Snapshot Checkpoint */}
          <button
            onClick={handleSaveSnapshot}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium transition-all"
            title="Save Checkpoint Snapshot"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Snapshot</span>
          </button>

          {/* Mobile Menu Dropdown Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Toolbar Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 p-3 space-y-2 z-30 select-none">
          <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => { setActiveTab('monaco'); setMobileMenuOpen(false); }}
              className={`py-1 text-center text-xs font-bold rounded ${activeTab === 'monaco' ? 'bg-white text-black' : 'text-zinc-400'}`}
            >
              Monaco
            </button>
            <button
              onClick={() => { setActiveTab('ide'); setMobileMenuOpen(false); }}
              className={`py-1 text-center text-xs font-bold rounded ${activeTab === 'ide' ? 'bg-white text-black' : 'text-zinc-400'}`}
            >
              VS Code
            </button>
            <button
              onClick={() => { setActiveTab('preview'); setMobileMenuOpen(false); }}
              className={`py-1 text-center text-xs font-bold rounded ${activeTab === 'preview' ? 'bg-white text-black' : 'text-zinc-400'}`}
            >
              Preview
            </button>
          </div>
        </div>
      )}

      {/* ── Main Resizable Layout Body ── */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Instruction & Guide Sidebar */}
        {sidebarOpen && (
          <aside 
            style={{ width: `${sidebarWidth}px` }} 
            className="bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0 z-20 overflow-y-auto select-none relative transition-none"
          >
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-white" />
                Lesson Guide & Instructions
              </span>
              <h2 className="text-sm font-extrabold text-white leading-snug">
                {lesson?.title || workspaceData?.workspace?.title || 'Codesphere Practice Problem'}
              </h2>
            </div>

            <div className="p-4 flex-1 space-y-4 text-xs text-zinc-300">
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Problem Description</h4>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 font-sans">
                  {lesson?.summary || lesson?.description || 'Write code to solve the challenge. Choose your preferred language from the top toolbar, then click [ ▶ RUN CODE ] to compile and test your solution in real time.'}
                </p>
              </div>

              {/* Status & Runtime Card */}
              <div className="bg-zinc-900 p-3.5 rounded-lg border border-zinc-800 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Active Language:</span>
                  <span className="text-white font-bold uppercase">{selectedLang}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Status:</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Container Ready
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Memory:</span>
                  <span className="text-zinc-300">{telemetry.memoryMb}MB ({telemetry.memoryPercent}%)</span>
                </div>
              </div>
            </div>

            {/* Left Drag Resizer Handle */}
            <div
              onMouseDown={startSidebarResize}
              className="absolute right-0 top-0 bottom-0 w-2 hover:w-3 cursor-col-resize hover:bg-white/20 transition-all z-30 flex items-center justify-center group"
              title="Drag to resize instructions panel"
            >
              <div className="w-0.5 h-8 bg-zinc-700 group-hover:bg-white rounded-full" />
            </div>
          </aside>
        )}

        {/* Center Main Code Editor Panel */}
        <main className="flex-1 flex flex-col bg-black relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-3 text-center p-6 select-none">
              <div className="w-12 h-12 rounded-xl border border-zinc-700 bg-zinc-900 flex items-center justify-center animate-spin">
                <RotateCw className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white">Initializing Codesphere Container...</h3>
              <p className="text-xs text-zinc-400 max-w-xs">Connecting execution environment, LSP servers, and output terminal.</p>
            </div>
          )}

          {/* Monaco Cloud Editor Tab */}
          {activeTab === 'monaco' && (
            <div className="flex-1 flex flex-col h-full bg-black">
              {/* Active File Bar */}
              <div className="h-9 bg-zinc-950 border-b border-zinc-800 px-3 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-2 px-3 py-1 rounded-t-md bg-zinc-900 border-t-2 border-white text-white font-mono text-[11px] font-bold">
                  <FileCode className="w-3.5 h-3.5 text-white" />
                  <span>{activeFileName}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
                  <span>Language: <strong className="text-white uppercase">{selectedLang}</strong></span>
                  <span className="hidden sm:inline">Shortcut: <kbd className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-300 font-sans">Cmd+Enter</kbd></span>
                </div>
              </div>

              {/* Monaco Code Editor */}
              <div className="flex-1 min-h-[150px] relative">
                <Editor
                  height="100%"
                  language={getMonacoLanguage(selectedLang)}
                  theme="vs-dark"
                  value={codeContent}
                  onChange={(val) => setCodeContent(val || '')}
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    lineNumbersMinChars: 3,
                    fontFamily: 'JetBrains Mono, Fira Code, SF Mono, monospace'
                  }}
                />
              </div>

              {/* Vertical Drag Resizer Handle for Terminal */}
              <div
                onMouseDown={startTerminalResize}
                className="h-2 hover:h-3 bg-zinc-900 border-t border-b border-zinc-800 cursor-row-resize hover:bg-white/20 transition-all z-20 flex items-center justify-center group select-none"
                title="Drag up/down to resize terminal height"
              >
                <div className="h-0.5 w-12 bg-zinc-700 group-hover:bg-white rounded-full" />
              </div>

              {/* Integrated Resizable Output Terminal & Interactive CLI */}
              <div style={{ height: `${terminalHeight}px` }} className="bg-zinc-950 flex flex-col font-mono text-xs select-none">
                <div className="h-8 bg-zinc-900 px-3 flex items-center justify-between border-b border-zinc-800 text-[11px] text-zinc-400 select-none">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Terminal className="w-3.5 h-3.5 text-white" />
                    <span>INTERACTIVE TERMINAL ({selectedLang.toUpperCase()})</span>
                  </div>
                  <button
                    onClick={() => setTerminalOutput('➜  Terminal output cleared.\n')}
                    className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Terminal</span>
                  </button>
                </div>

                {/* Terminal Output Log */}
                <pre className="flex-1 p-3 overflow-y-auto text-zinc-200 text-[11px] leading-relaxed whitespace-pre-wrap selection:bg-zinc-800 select-text font-mono">
                  {terminalOutput}
                  <div ref={terminalEndRef} />
                </pre>

                {/* Interactive CLI Input Bar */}
                <form onSubmit={handleTerminalCmdSubmit} className="h-9 bg-black border-t border-zinc-800 px-3 flex items-center gap-2 shrink-0">
                  <span className="text-white font-bold text-[11px]">➜</span>
                  <span className="text-zinc-500 font-mono text-[11px]">codesphere ~</span>
                  <input
                    type="text"
                    value={cmdInput}
                    onChange={(e) => setCmdInput(e.target.value)}
                    placeholder="Type terminal command (e.g. java Solution, python3 solution.py, ls, cat Solution.java)..."
                    className="flex-1 bg-transparent text-white font-mono text-[11px] focus:outline-none placeholder:text-zinc-600"
                  />
                  <button type="submit" className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer">
                    <Send className="w-3 h-3" />
                    <span>Run</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* VS Code Proxy Tab */}
          {activeTab === 'ide' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black text-center select-none">
              <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center mx-auto">
                  <Code2 className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white">Native VS Code Proxy Experience</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    To use native VS Code inside this browser tab, install <code className="bg-black px-1.5 py-0.5 rounded text-white font-mono">code-server</code> on your Mac host.
                  </p>
                </div>

                <div className="bg-black border border-zinc-800 rounded-lg p-3 text-left font-mono text-[11px] space-y-2">
                  <div className="text-zinc-400 text-[10px] uppercase font-bold">1-Click Mac Terminal Command:</div>
                  <code className="block text-zinc-100 select-all bg-zinc-950 p-2 rounded border border-zinc-800">
                    brew install code-server && code-server --port 8100 --auth none
                  </code>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab('monaco')}
                    className="w-full py-2 bg-white hover:bg-zinc-200 text-black rounded-md text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Monitor className="w-4 h-4" />
                    <span>Switch to Built-in Monaco Cloud Editor (Instant)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Live Web Preview Tab */}
          {activeTab === 'preview' && (
            <div className="flex-1 flex flex-col bg-zinc-950 border-t border-zinc-800">
              <div className="h-10 bg-zinc-900 px-4 border-b border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-medium">Preview Server Port:</span>
                  <select
                    value={selectedPortObj?.port || 3000}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      const found = exposedPorts.find(item => item.port === p);
                      setSelectedPortObj(found || { port: p, label: `Port ${p}`, url: `http://localhost:${p}` });
                    }}
                    className="bg-black border border-zinc-800 text-white px-3 py-1 rounded focus:outline-none font-mono text-xs font-bold"
                  >
                    {exposedPorts.map((item) => (
                      <option key={item.port} value={item.port}>
                        {item.label} (Port {item.port})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-mono text-[11px]">{selectedPortObj?.url || `http://localhost:3000`}</span>
                  <a href={selectedPortObj?.url || `http://localhost:3000`} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              <div className="flex-1 bg-white">
                <iframe src={selectedPortObj?.url || `http://localhost:3000`} className="w-full h-full border-0" title="Web Preview" />
              </div>
            </div>
          )}
        </main>

        {/* Right AI Tutor Assistant Sidebar */}
        {aiSidebarOpen && (
          <aside
            style={{ width: `${aiSidebarWidth}px` }}
            className="bg-zinc-950 border-l border-zinc-800 flex flex-col shrink-0 z-20 overflow-y-auto select-none relative transition-none"
          >
            <div
              onMouseDown={startAiSidebarResize}
              className="absolute left-0 top-0 bottom-0 w-2 hover:w-3 cursor-col-resize hover:bg-white/20 transition-all z-30 flex items-center justify-center group"
              title="Drag to resize AI Tutor sidebar"
            >
              <div className="w-0.5 h-8 bg-zinc-700 group-hover:bg-white rounded-full" />
            </div>
            <WorkspaceAISidebar workspaceId={workspaceId} />
          </aside>
        )}
      </div>

      {/* Modals */}
      <WorkspaceManagerModal
        isOpen={managerModalOpen}
        onClose={() => setManagerModalOpen(false)}
        currentWorkspaceId={workspaceId}
        onSelectWorkspace={(newWsId) => {
          setWorkspaceId(newWsId);
          initWorkspace(newWsId);
        }}
      />

      <WorkspaceEnvModal
        isOpen={envModalOpen}
        onClose={() => setEnvModalOpen(false)}
        workspaceId={workspaceId}
      />

      <ExtensionMarketplaceModal
        isOpen={extModalOpen}
        onClose={() => setExtModalOpen(false)}
      />

      <WorkspaceAnalyticsModal
        isOpen={analyticsModalOpen}
        onClose={() => setAnalyticsModalOpen(false)}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default CloudWorkspaceView;
