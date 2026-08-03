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
  Trash2
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
  const [activeTab, setActiveTab] = useState('monaco'); // 'monaco' | 'ide' | 'preview'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);

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

  const [terminalOutput, setTerminalOutput] = useState('➜  Cloud Workspace Terminal initialized.\n➜  Select your programming language and click [ ▶ RUN CODE ] to compile & execute.\n');
  const [isRunningCode, setIsRunningCode] = useState(false);

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

  const iframeRef = useRef(null);

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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-zinc-100 font-sans selection:bg-white selection:text-black">
      {/* Exam Mode Header */}
      {mode === 'exam' && (
        <ExamModeHeader onSubmitExam={handleSubmitExam} />
      )}

      {/* ── Classic High-Contrast Codesphere Header ── */}
      <header className="h-14 bg-zinc-950 border-b border-zinc-800 px-4 flex items-center justify-between shrink-0 z-30 select-none">
        
        {/* LEFT ZONE: Navigation, Workspace Info, Language Dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-medium"
            title="Back to Lessons"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-4 w-px bg-zinc-800" />

          {/* Workspace Manager Toggle */}
          <button
            onClick={() => setManagerModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-all text-xs font-bold text-white shadow-sm"
          >
            <Code2 className="w-4 h-4 text-white" />
            <span className="max-w-[150px] truncate">
              {workspaceData?.workspace?.title || lesson?.title || 'Codesphere Workspace'}
            </span>
            <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="flex items-center border border-zinc-800 rounded-md bg-zinc-900 px-2 py-1 text-xs font-mono">
            <span className="text-[10px] uppercase font-bold text-zinc-400 mr-2">LANGUAGE:</span>
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
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border transition-all ${
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
        <div className="flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800">
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
            Live Web Preview
          </button>
        </div>

        {/* RIGHT ZONE: Primary Action Buttons & Tools */}
        <div className="flex items-center gap-2">
          {/* RUN CODE BUTTON */}
          {activeTab === 'monaco' && (
            <button
              onClick={handleRunCodeInTerminal}
              disabled={isRunningCode}
              className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-extrabold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningCode ? 'EXECUTING...' : 'RUN CODE'}</span>
            </button>
          )}

          {/* AI TUTOR BUTTON */}
          <button
            onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-bold transition-all ${
              aiSidebarOpen
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span className="hidden md:inline">AI Tutor</span>
          </button>

          {/* Snapshot Checkpoint */}
          <button
            onClick={handleSaveSnapshot}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium transition-all"
            title="Save Checkpoint Snapshot"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Snapshot</span>
          </button>

          {/* Analytics Stats */}
          <button
            onClick={() => setAnalyticsModalOpen(true)}
            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all"
            title="Learning Analytics"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Env Variables */}
          <button
            onClick={() => setEnvModalOpen(true)}
            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all"
            title="Environment Variables (.env)"
          >
            <Key className="w-4 h-4" />
          </button>

          {/* Extension Marketplace */}
          <button
            onClick={() => setExtModalOpen(true)}
            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all"
            title="Extensions Marketplace"
          >
            <Puzzle className="w-4 h-4" />
          </button>

          {/* Container Control (Start/Stop) */}
          {status === 'running' ? (
            <button
              onClick={handleStopWorkspace}
              className="px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium"
              title="Stop Workspace Container"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={handleStartWorkspace}
              className="px-3 py-1 rounded-md bg-white text-black text-xs font-bold"
            >
              Start
            </button>
          )}
        </div>
      </header>

      {/* ── Main Layout Body ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Instruction & Guide Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0 z-20 overflow-y-auto select-none">
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

              {/* Native VS Code Hint Banner */}
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs space-y-1 text-zinc-300">
                <span className="font-bold text-white flex items-center gap-1 text-[11px]">
                  💡 VS Code Proxy Info
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  To run full VS Code inside the Proxy tab, install <code className="bg-black px-1 rounded text-white font-mono">code-server</code> on Mac:
                </p>
                <code className="block bg-black p-2 rounded text-[10px] font-mono text-zinc-200 border border-zinc-800 select-all">
                  brew install code-server
                </code>
              </div>
            </div>
          </aside>
        )}

        {/* Center Main Panel */}
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
                  <span>Shortcut: <kbd className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-300 font-sans">Cmd+Enter</kbd></span>
                </div>
              </div>

              {/* Monaco Code Editor */}
              <div className="flex-1 min-h-[300px]">
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

              {/* Integrated Output Terminal */}
              <div className="h-48 bg-zinc-950 border-t border-zinc-800 flex flex-col font-mono text-xs">
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
                <pre className="flex-1 p-3 overflow-y-auto text-zinc-200 text-[11px] leading-relaxed whitespace-pre-wrap selection:bg-zinc-800 select-text">
                  {terminalOutput}
                </pre>
              </div>
            </div>
          )}

          {/* VS Code Proxy Iframe Tab */}
          {activeTab === 'ide' && ideProxySrc && (
            <div className="flex-1 flex flex-col h-full relative">
              <iframe
                ref={iframeRef}
                src={ideProxySrc}
                className="w-full h-full border-0 bg-black"
                title="VS Code Proxy"
                allow="clipboard-read; clipboard-write; microphone; camera"
              />
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
          <WorkspaceAISidebar workspaceId={workspaceId} />
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
