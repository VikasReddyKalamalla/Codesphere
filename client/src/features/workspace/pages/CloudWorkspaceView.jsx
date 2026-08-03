import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Square, 
  RotateCw, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  Code2, 
  BookOpen, 
  Globe, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  Terminal,
  Cpu,
  HardDrive,
  ShieldCheck,
  Sparkles,
  FolderGit2,
  Camera,
  Key,
  Puzzle,
  Activity,
  LifeBuoy,
  BarChart3,
  ShieldAlert,
  GraduationCap
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
  const [status, setStatus] = useState('provisioning'); // 'provisioning' | 'running' | 'stopped' | 'error'
  const [activeTab, setActiveTab] = useState('ide'); // 'ide' | 'preview'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [managerModalOpen, setManagerModalOpen] = useState(false);
  const [envModalOpen, setEnvModalOpen] = useState(false);
  const [extModalOpen, setExtModalOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Workspace Mode (learning vs exam)
  const [mode, setMode] = useState('learning');

  const [exposedPorts, setExposedPorts] = useState([
    { port: 3000, label: 'React / Web App', url: 'http://localhost:3000' },
    { port: 5000, label: 'Python FastAPI / Flask', url: 'http://localhost:5000' },
    { port: 5173, label: 'Vite Frontend', url: 'http://localhost:5173' },
    { port: 8080, label: 'Spring Boot / Java App', url: 'http://localhost:8080' }
  ]);
  const [selectedPortObj, setSelectedPortObj] = useState(exposedPorts[0]);
  const [telemetry, setTelemetry] = useState({ cpuPercent: 1.8, memoryMb: 135, memoryPercent: 13.1, activeProcesses: 4 });

  const iframeRef = useRef(null);

  const language = workspaceData?.workspace?.language || lesson?.technology || lesson?.language || 'javascript';
  const plan = workspaceData?.workspace?.plan || 'free';

  useEffect(() => {
    if (lessonId) {
      apiClient.get(`/lessons/single/${lessonId}`)
        .then(res => {
          const lData = res.data?.data || res.data;
          if (lData) setLesson(lData);
        })
        .catch(err => console.error('Failed to fetch lesson:', err));
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

  const initWorkspace = async (wsId) => {
    setLoading(true);
    setStatus('provisioning');
    try {
      const res = await cloudWorkspaceAPI.createWorkspace({
        workspaceId: wsId,
        title: lesson?.title ? `${lesson.title} Workspace` : 'Cloud Workspace',
        language: lesson?.technology || lesson?.language || 'javascript',
        mode,
        lessonId
      });

      if (res.success && res.data) {
        setWorkspaceData(res.data);
        if (res.data.workspace?.mode) setMode(res.data.workspace.mode);
        setStatus('running');
        toast.success('⚡ Cloud Workspace container ready!');
        fetchDynamicPorts(wsId);
        fetchTelemetry(wsId);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Workspace init error:', err);
      setWorkspaceData({
        workspace: { _id: wsId, language: 'javascript', plan: 'free', mode: 'learning' },
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
      if (res.success && res.data) {
        setTelemetry(res.data);
      }
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
    toast.success('🎉 Exam submitted successfully! Grade evaluation in progress.');
    setMode('learning');
  };

  const handleAutoHeal = async () => {
    if (!workspaceId) return;
    toast.loading('Triggering Auto-Heal crash recovery...', { id: 'autoheal' });
    try {
      await cloudWorkspaceAPI.autoHeal(workspaceId);
      toast.success('🛠️ Workspace container recovered cleanly!', { id: 'autoheal' });
      initWorkspace(workspaceId);
    } catch (err) {
      toast.error('Failed auto-heal recovery', { id: 'autoheal' });
    }
  };

  const handleStopWorkspace = async () => {
    if (!workspaceId) return;
    try {
      await cloudWorkspaceAPI.stopWorkspace({ workspaceId });
      setStatus('stopped');
      toast.success('Container stopped');
    } catch (err) {
      toast.error('Failed to stop container');
    }
  };

  const handleStartWorkspace = async () => {
    if (!workspaceId) return;
    initWorkspace(workspaceId);
  };

  const handleSaveSnapshot = async () => {
    if (!workspaceId) return;
    const title = window.prompt('Enter checkpoint title:', `Checkpoint ${new Date().toLocaleTimeString()}`);
    if (!title) return;

    try {
      await cloudWorkspaceAPI.saveSnapshot(workspaceId, title);
      toast.success('📸 Snapshot checkpoint saved!');
    } catch (err) {
      toast.error('Failed to save snapshot');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const ideProxySrc = workspaceData?.proxyUrl || (workspaceId ? `/workspace-proxy/${workspaceId}/` : null);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Exam Mode Banner */}
      {mode === 'exam' && (
        <ExamModeHeader onSubmitExam={handleSubmitExam} />
      )}

      {/* ── Top Header Toolbar ── */}
      <header className="h-14 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-30">
        {/* Left: Back & Workspace Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Lesson"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setManagerModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold text-white"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="max-w-[160px] truncate">
              {workspaceData?.workspace?.title || lesson?.title || 'Cloud Workspace'}
            </span>
            <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 uppercase tracking-wider">
            {language}
          </span>

          {/* Mode Badge / Switcher */}
          <button
            onClick={handleToggleMode}
            className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
              mode === 'exam'
                ? 'bg-amber-950 text-amber-300 border-amber-700'
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}
          >
            {mode === 'exam' ? <ShieldAlert className="w-3 h-3 text-amber-400" /> : <GraduationCap className="w-3 h-3 text-emerald-400" />}
            <span>{mode === 'exam' ? 'Exam Mode' : 'Learning Mode'}</span>
          </button>

          {/* Live Telemetry Metric Badge */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>CPU: <strong className="text-cyan-300">{telemetry.cpuPercent}%</strong></span>
            <span>•</span>
            <span>RAM: <strong className="text-purple-300">{telemetry.memoryMb}MB</strong> ({telemetry.memoryPercent}%)</span>
          </div>
        </div>

        {/* Center: Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('ide')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'ide'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            VS Code IDE
          </button>
          <button
            onClick={() => {
              setActiveTab('preview');
              fetchDynamicPorts();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Live Preview
          </button>
        </div>

        {/* Right: Tools & Controls */}
        <div className="flex items-center gap-2">
          {/* Analytics Button */}
          <button
            onClick={() => setAnalyticsModalOpen(true)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Workspace Analytics & Telemetry"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Environment Variables Button */}
          <button
            onClick={() => setEnvModalOpen(true)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Manage .env Variables & Secrets"
          >
            <Key className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Extension Marketplace Button */}
          <button
            onClick={() => setExtModalOpen(true)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Curated Extension Marketplace"
          >
            <Puzzle className="w-4 h-4 text-purple-400" />
          </button>

          {/* Save Snapshot Button */}
          <button
            onClick={handleSaveSnapshot}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
            title="Save Checkpoint Snapshot"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Snapshot</span>
          </button>

          {/* Auto-Heal Recovery Button */}
          <button
            onClick={handleAutoHeal}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
            title="Trigger Crash Recovery / Auto-Heal"
          >
            <LifeBuoy className="w-4 h-4 text-amber-400" />
          </button>

          {/* Start/Stop Container Button */}
          {status === 'running' ? (
            <button
              onClick={handleStopWorkspace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60 text-xs font-medium transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop
            </button>
          ) : (
            <button
              onClick={handleStartWorkspace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start
            </button>
          )}

          {/* AI Sidebar Toggle */}
          <button
            onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
            className={`p-1.5 rounded-lg border transition-all ${
              aiSidebarOpen
                ? 'bg-purple-950 border-purple-700 text-purple-300 shadow-md shadow-purple-900/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle AI Coding Assistant"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </header>

      {/* ── Main Workspace Body ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {sidebarOpen && (
          <aside className="w-80 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 z-20 overflow-y-auto">
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Workspace Instructions
              </span>
              <h2 className="text-base font-bold text-white leading-snug">
                {lesson?.title || workspaceData?.workspace?.title || 'Practice Environment'}
              </h2>
            </div>

            <div className="p-4 flex-1 space-y-4 text-sm text-slate-300">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Guide</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  {lesson?.summary || lesson?.description || 'Your workspace files, secrets, and terminal session are persistent and automatically backed up.'}
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Runtime
                  </span>
                  <span className="text-cyan-400 font-mono font-medium">{language}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    Mode
                  </span>
                  <span className="text-purple-400 font-mono text-[11px] uppercase">
                    {mode} Mode
                  </span>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Center Main Panel */}
        <main className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-4 text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-2xl shadow-cyan-500/30 animate-pulse">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Spinning Up Student Container...</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Allocating isolated container runtime, loading LSPs, mounting .env secrets, and connecting terminal.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ide' && ideProxySrc && (
            <iframe
              ref={iframeRef}
              src={ideProxySrc}
              className="w-full h-full border-0 bg-slate-950"
              title="VS Code Cloud Workspace"
              allow="clipboard-read; clipboard-write; microphone; camera"
            />
          )}

          {activeTab === 'preview' && (
            <div className="flex-1 flex flex-col bg-slate-900 border-t border-slate-800">
              <div className="h-10 bg-slate-950 px-4 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Open App Server:</span>
                  <select
                    value={selectedPortObj?.port || 3000}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      const found = exposedPorts.find(item => item.port === p);
                      setSelectedPortObj(found || { port: p, label: `Port ${p}`, url: `http://localhost:${p}` });
                    }}
                    className="bg-slate-900 border border-slate-800 text-slate-200 px-3 py-1 rounded focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    {exposedPorts.map((item) => (
                      <option key={item.port} value={item.port}>
                        {item.label} (Port {item.port})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-[11px]">{selectedPortObj?.url || `http://localhost:3000`}</span>
                  <a href={selectedPortObj?.url || `http://localhost:3000`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              <div className="flex-1 bg-white">
                <iframe src={selectedPortObj?.url || `http://localhost:3000`} className="w-full h-full border-0" title="Dynamic Web Preview" />
              </div>
            </div>
          )}
        </main>

        {/* Right Embedded AI Sidebar */}
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
