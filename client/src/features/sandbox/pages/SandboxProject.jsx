import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Compass, Briefcase, Bookmark, ClipboardList, Clock, ArrowRight, ChevronLeft,
  BookOpen, Lock, CheckCircle2, Play, RotateCcw, Sparkles, Share2, Star,
  CheckSquare, HelpCircle, Code2, ExternalLink, ShieldCheck, Flame, Zap,
  Layers, Terminal, FileCode, Check, X, Award, Eye, Search, Filter, Lightbulb,
  FolderGit2, LogOut
} from 'lucide-react';
import {
  fetchProjectDetailsAPI,
  fetchSandboxProjectsAPI,
  fetchProgressAPI,
  updateProgressAPI,
  addBookmarkAPI,
  removeBookmarkAPI,
  getBookmarkStatusAPI,
  initWorkspaceAPI,
  terminateWorkspaceAPI,
} from '../services/sandboxAPI.js';
import { SessionManagerModal } from '../../../components/SessionManagerModal.jsx';
import toast from 'react-hot-toast';

// ─── Default Problem Statements & Flashcards Catalog ──────────────────────────
const FEATURED_PROBLEM_STATEMENTS = [
  {
    _id: 'ps-ecommerce-cart',
    title: 'Build a Real-Time E-Commerce Shopping Cart System',
    category: 'Frontend & UI Systems',
    difficulty: 'Intermediate',
    pitch: 'Develop a responsive, stateful shopping cart system with real-time price calculation, quantity updates, duplicate prevention, and persistent localStorage state.',
    description: 'In modern web applications, the shopping cart is the heart of e-commerce conversions. You will construct a modular, component-driven cart system that seamlessly updates totals, handles item removal animations, and syncs cart state across browser reloads.',
    technologyStack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Local Storage'],
    estimatedDuration: '2.5 Hours',
    points: 250,
    enrolledCount: '3.4K',
    flashcards: [
      {
        title: '💡 Algorithmic State Management',
        hint: 'Use JavaScript Array.reduce() to dynamically calculate cart total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).'
      },
      {
        title: '🛠️ LocalStorage Synchronization',
        hint: 'Serialize your cart array using JSON.stringify(cart) before saving to localStorage.getItem("cs_cart") and JSON.parse() on load.'
      },
      {
        title: '📚 MDN Web API References',
        hint: 'Explore Element.querySelectorAll(), Event Bubbling for cart item removal, and CustomEvents for badge updates.'
      }
    ],
    starterFiles: ['index.html', 'styles.css', 'script.js']
  },
  {
    _id: 'ps-vite-ast-compiler',
    title: 'High-Performance Custom Vite AST Compiler Plugin',
    category: 'Compilers & Tooling',
    difficulty: 'Advanced',
    pitch: 'Build a custom Vite plugin that parses JavaScript Abstract Syntax Trees (AST), rewrites imports, injects telemetry hooks, and optimizes production bundles.',
    description: 'Compilers and bundler plugins are essential for modern web infrastructure. You will implement a custom Vite build plugin using Babel AST transforms to automate code instrumentation, strip debug code, and analyze bundle dependency graphs in real-time.',
    technologyStack: ['TypeScript', 'Vite', 'Babel AST', 'Node.js'],
    estimatedDuration: '4 Hours',
    points: 450,
    enrolledCount: '1.8K',
    flashcards: [
      {
        title: '💡 AST Node Manipulation',
        hint: 'Use @babel/traverse to visit Identifier and CallExpression nodes in the AST to safely inject diagnostic metrics without altering execution flow.'
      },
      {
        title: '🛠️ Vite Rollup Plugin Lifecycle',
        hint: 'Implement standard Vite hooks: resolveId(), load(), and transform(code, id) to intercept source code before module bundling.'
      },
      {
        title: '📚 Official Specs & Documentation',
        hint: 'Refer to ESTree AST Specification and Vite Plugin API reference for plugin configuration patterns.'
      }
    ],
    starterFiles: ['vite.config.ts', 'plugin.ts', 'index.ts']
  },
  {
    _id: 'ps-distributed-lru-cache',
    title: 'Distributed Key-Value Store & LRU Cache Engine',
    category: 'System Design & C++',
    difficulty: 'Expert',
    pitch: 'Design and implement an in-memory Key-Value store with O(1) Least Recently Used (LRU) cache eviction using a Doubly Linked List and Hash Map.',
    description: 'High-concurrency cache servers like Redis rely on O(1) lookup and eviction strategies. In this challenge, you will implement a thread-safe LRU cache engine in C++/Go featuring atomic operations, expiration TTL, and memory compaction algorithms.',
    technologyStack: ['C++', 'Go', 'Data Structures', 'System Architecture'],
    estimatedDuration: '5 Hours',
    points: 600,
    enrolledCount: '1.2K',
    flashcards: [
      {
        title: '💡 O(1) Eviction Mechanism',
        hint: 'Combine a std::unordered_map for O(1) key lookup with a std::list (doubly linked list) to maintain access order. Move accessed nodes to head in O(1).'
      },
      {
        title: '🛠️ Concurrency & Lock Management',
        hint: 'Use std::shared_mutex or read-write locks to permit concurrent reads while enforcing exclusive write locks during node eviction.'
      },
      {
        title: '📚 Systems Architecture References',
        hint: 'Review Memory Layout, Cache Line Alignment, and Lock-Free Queue primitives.'
      }
    ],
    starterFiles: ['lru_cache.cpp', 'main.cpp', 'Makefile']
  },
  {
    _id: 'ps-jwt-rbac-server',
    title: 'JWT Authentication & RBAC Access Control Microservice',
    category: 'Backend & APIs',
    difficulty: 'Intermediate',
    pitch: 'Construct a secure REST API authentication server featuring JSON Web Tokens, refresh token rotation, password hashing with bcrypt, and Role-Based Access Control (RBAC).',
    description: 'Security is paramount in backend software engineering. You will build a production-grade authentication microservice with Express & MongoDB, featuring encrypted cookie management, role authorization middleware (admin vs student vs instructor), and rate limiting.',
    technologyStack: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Bcrypt'],
    estimatedDuration: '3 Hours',
    points: 350,
    enrolledCount: '4.1K',
    flashcards: [
      {
        title: '💡 Token Rotation Strategy',
        hint: 'Store short-lived Access Tokens (15m) in memory/authorization headers and HTTP-only Secure Refresh Tokens (7d) in encrypted cookies.'
      },
      {
        title: '🛠️ RBAC Middleware Pattern',
        hint: 'Create a reusable restrictTo(...allowedRoles) higher-order function that verifies req.user.role before executing protected route controllers.'
      },
      {
        title: '📚 OWASP Security Guidelines',
        hint: 'Review OWASP API Security Top 10 for preventing Broken Object Level Authorization (BOLA) and Brute Force attacks.'
      }
    ],
    starterFiles: ['server.js', 'auth.controller.js', 'auth.middleware.js']
  },
  {
    _id: 'ps-websocket-chat-engine',
    title: 'Real-Time Collaborative Web Socket Chat Engine',
    category: 'Fullstack & WebSockets',
    difficulty: 'Intermediate',
    pitch: 'Develop a real-time multi-room messaging engine with Socket.IO, typing indicators, user online presence tracking, and message history persistence.',
    description: 'Real-time collaboration powers modern platforms like CodeSphere. You will build a WebSocket server and client UI that broadcasts real-time chat messages, syncs active typing states across rooms, and handles re-connections smoothly.',
    technologyStack: ['React', 'Socket.IO', 'Express.js', 'Node.js'],
    estimatedDuration: '3.5 Hours',
    points: 400,
    enrolledCount: '2.9K',
    flashcards: [
      {
        title: '💡 WebSocket Room Broadcasting',
        hint: 'Use io.to(roomId).emit("message:received", data) to deliver events exclusively to participants in the active room.'
      },
      {
        title: '🛠️ Debounced Typing Indicators',
        hint: 'Emit "typing:start" on keypress and set a 2-second timeout to automatically emit "typing:stop" when user stops typing.'
      },
      {
        title: '📚 Socket.IO Protocol Docs',
        hint: 'Study Socket.IO heartbeat ping/pong timeouts, fallback polling transports, and room join/leave lifecycle.'
      }
    ],
    starterFiles: ['server.js', 'socket.js', 'ChatRoom.jsx']
  },
  {
    _id: 'ps-core-web-vitals',
    title: 'Core Web Vitals Performance Optimization Engine',
    category: 'Performance & Web API',
    difficulty: 'Advanced',
    pitch: 'Diagnose and optimize a web application to achieve 95+ Lighthouse scores across Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS).',
    description: 'Web performance directly impacts user retention and search engine rankings. You will profile memory leaks, optimize font loading, implement code splitting, defer non-critical scripts, and optimize image rendering for instant loads.',
    technologyStack: ['JavaScript', 'Web Vitals API', 'CSS Grid', 'Lighthouse'],
    estimatedDuration: '3 Hours',
    points: 350,
    enrolledCount: '1.9K',
    flashcards: [
      {
        title: '💡 LCP & CLS Optimization',
        hint: 'Preload critical hero images using <link rel="preload"> and specify width/height attributes on img tags to eliminate layout shifts.'
      },
      {
        title: '🛠️ PerformanceObserver API',
        hint: 'Use PerformanceObserver to programmatically record LCP, FID, and CLS entries directly in your web app for analytics monitoring.'
      },
      {
        title: '📚 Web.dev Performance Guidelines',
        hint: 'Review Google Core Web Vitals threshold benchmarks and Chrome DevTools Performance Profiler workflows.'
      }
    ],
    starterFiles: ['index.html', 'perf-tracker.js', 'styles.css']
  }
];

export const SandboxProject = () => {
  const { projectId: id } = useParams();
  const navigate = useNavigate();

  const [problems, setProblems]                 = useState(FEATURED_PROBLEM_STATEMENTS);
  const [selectedProblem, setSelectedProblem]   = useState(null);
  const [activeTab, setActiveTab]               = useState('all'); // 'all' | 'frontend' | 'backend' | 'system' | 'python'
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [searchQuery, setSearchQuery]           = useState('');
  const [loading, setLoading]                   = useState(false);
  const [vscodeUrl, setVscodeUrl]               = useState('http://localhost:8107/?folder=/home/coder');

  // Session Manager Modal state (Start / End of Session flow)
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionModalMode, setSessionModalMode]     = useState('start'); // 'start' | 'end'
  const [isGitHubImported, setIsGitHubImported]     = useState(false);
  const [activeRepoUrl, setActiveRepoUrl]           = useState('');

  // Load problem statements from backend MongoDB API
  const loadProblemStatements = async () => {
    setLoading(true);
    try {
      const data = await fetchSandboxProjectsAPI();
      const fetchedProjects = data?.projects || (Array.isArray(data) ? data : []);
      if (fetchedProjects && fetchedProjects.length > 0) {
        const formatted = fetchedProjects.map((p, idx) => ({
          _id: p._id || `ps-${idx}`,
          title: p.title,
          category: p.category || 'Full Stack',
          difficulty: p.difficulty || 'intermediate',
          pitch: p.description || 'Interactive hands-on programming challenge.',
          description: p.description || 'Build a production-grade application or microservice.',
          technologyStack: Array.isArray(p.technologyStack) ? p.technologyStack : ['JavaScript', 'HTML5'],
          estimatedDuration: p.estimatedDuration || '2 Hours',
          points: p.points || 300,
          enrolledCount: p.enrolledCount || '1.5K',
          flashcards: p.flashcards || FEATURED_PROBLEM_STATEMENTS[idx % FEATURED_PROBLEM_STATEMENTS.length].flashcards,
          starterFiles: p.starterFiles || ['index.html', 'script.js', 'styles.css']
        }));
        setProblems(formatted);
      }
    } catch {
      // Quiet fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblemStatements();
  }, []);

  // Filtered problem statements
  const filteredProblems = useMemo(() => {
    return problems.filter((item) => {
      const name = item.title.toLowerCase();
      const cat  = item.category.toLowerCase();
      const diff = item.difficulty.toLowerCase();
      const q    = searchQuery.toLowerCase();

      const matchesSearch = !q || name.includes(q) || cat.includes(q);

      let matchesTab = true;
      if (activeTab === 'frontend') matchesTab = cat.includes('frontend') || cat.includes('ui');
      else if (activeTab === 'backend') matchesTab = cat.includes('backend') || cat.includes('api');
      else if (activeTab === 'system') matchesTab = cat.includes('system') || cat.includes('compiler');
      else if (activeTab === 'python') matchesTab = cat.includes('python') || cat.includes('ml');

      let matchesDiff = true;
      if (difficultyFilter !== 'all') matchesDiff = diff === difficultyFilter.toLowerCase();

      return matchesSearch && matchesTab && matchesDiff;
    });
  }, [problems, searchQuery, activeTab, difficultyFilter]);

  // Handle clicking "YES, LET'S DO IT!" -> Initializes per-user isolated workspace & launches VS Code
  const handleLaunchVSCode = async (problem) => {
    const probId = problem?._id || 'scratch';
    const toastId = toast.loading(`Preparing isolated VS Code workspace for "${problem.title}"...`);
    try {
      const res = await initWorkspaceAPI(probId, { repoUrl: activeRepoUrl });
      const targetUrl = res?.data?.iframeUrl || `http://localhost:8107/?folder=/home/coder/workspaces/session_${probId}`;
      toast.success(`Opening VS Code Web Studio for "${problem.title}"!`, {
        id: toastId,
        icon: '🚀',
        style: { background: '#0B0F17', color: '#04AA6D', border: '1px solid #04AA6D' }
      });
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(`http://localhost:8107/?folder=/home/coder/workspaces/session_${probId}`, '_blank', 'noopener,noreferrer');
      toast.dismiss(toastId);
    } finally {
      setSelectedProblem(null);
    }
  };

  // Start Session handler
  const handleStartSession = ({ isGitHub, repoUrl }) => {
    setIsGitHubImported(isGitHub);
    setActiveRepoUrl(repoUrl);
    setIsSessionModalOpen(false);
    if (isGitHub && repoUrl) {
      toast.success(`GitHub Repo "${repoUrl}" linked to session!`);
    }
  };

  // End Session handler -> cleans cloud container storage or pushes to GitHub
  const handleEndSession = async ({ pushToGit, repoUrl, terminateStorage }) => {
    setIsSessionModalOpen(false);
    const activeId = selectedProblem?._id || 'scratch';
    if (terminateStorage) {
      const toastId = toast.loading('Terminating session and cleaning cloud storage...');
      try {
        await terminateWorkspaceAPI(activeId, { pushToGit, repoUrl });
        toast.success('Session terminated. Cloud storage cleared successfully.', { id: toastId });
      } catch {
        toast.dismiss(toastId);
      }
      localStorage.removeItem('cs_active_session');
      navigate('/sandbox');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto font-sans pb-16 text-slate-800 select-none">
      
      {/* ── Top Header & Platform Statistics Banner ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#04AA6D]">
            <Sparkles size={16} />
            <span>CodeSphere Hands-On Challenges</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
            Problem Statements & Technical Challenges
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Select a problem statement, review interactive architectural flashcards & requirements, and launch your dedicated online VS Code Web workspace with 1 click.
          </p>
        </div>

        {/* Action Buttons: Session Manager & Launch VS Code */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setSessionModalMode('end');
              setIsSessionModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all cursor-pointer border border-slate-200"
          >
            <FolderGit2 size={16} className="text-purple-600" />
            <span>End Session / GitHub Sync</span>
          </button>

          <button
            onClick={() => handleLaunchVSCode({ _id: 'blank', title: 'New Workspace Project' })}
            className="flex items-center gap-2.5 px-5 py-3 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-md shadow-emerald-950/20 border border-emerald-500/30"
          >
            <Code2 size={16} />
            <span>Launch Blank VS Code Studio</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* ── Filter Bar & Search Box ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { key: 'all', label: 'All Problem Statements' },
            { key: 'frontend', label: 'Frontend & UI' },
            { key: 'backend', label: 'Backend & APIs' },
            { key: 'system', label: 'System Design & Compilers' },
            { key: 'python', label: 'Python & Data Science' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap font-mono ${
                activeTab === tab.key
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Difficulty Filter & Search Input */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#04AA6D]"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>

          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems or tech stack..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#04AA6D] focus:bg-white transition-all"
            />
          </div>
        </div>

      </div>

      {/* ── Problem Statements Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((prob) => {
            const diff = (prob.difficulty || 'beginner').toLowerCase();
            const diffColor = diff === 'expert' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                            : diff === 'advanced' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                            : diff === 'intermediate' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            : 'bg-emerald-500/10 text-[#04AA6D] border-emerald-500/20';

            return (
              <div
                key={prob._id}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group border-t-4 border-t-[#04AA6D]"
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                      <Layers size={12} className="text-[#04AA6D]" />
                      <span>{prob.category}</span>
                    </span>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${diffColor}`}>
                      {prob.difficulty}
                    </span>
                  </div>

                  {/* Problem Title */}
                  <h3 className="text-base font-black text-slate-800 tracking-tight leading-snug group-hover:text-[#04AA6D] transition-colors mb-2">
                    {prob.title}
                  </h3>

                  {/* Teaser Pitch */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                    {prob.pitch}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-5">
                    {(prob.technologyStack || []).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-600 text-[10px] font-semibold font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Duration & Points Metadata */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 font-mono pt-3 border-t border-slate-100 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-slate-400" />
                      {prob.estimatedDuration}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-black">
                      <Zap size={13} className="fill-amber-400" />
                      +{prob.points || 300} XP
                    </span>
                  </div>

                  {/* Action Button: View Details */}
                  <button
                    onClick={() => setSelectedProblem(prob)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-[#04AA6D] text-slate-700 hover:text-white font-bold text-xs rounded-2xl transition-all cursor-pointer border border-slate-200 hover:border-[#04AA6D] shadow-sm"
                  >
                    <Eye size={14} />
                    <span>View Problem Flashcards & Details</span>
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-3 bg-white border border-slate-200/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Code2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">No Problem Statements Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              No challenge matches your current search or category filter.
            </p>
          </div>
        )}
      </div>

      {/* ── Problem Statement Flashcards & Detailed View Modal ── */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-3xl w-full shadow-2xl relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto font-sans">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-xl bg-[#04AA6D]/10 text-[#04AA6D] border border-[#04AA6D]/20 text-[10px] font-bold font-mono uppercase tracking-wider">
                    {selectedProblem.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold font-mono uppercase tracking-wider">
                    {selectedProblem.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight mt-1">
                  {selectedProblem.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedProblem(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Problem Overview Description */}
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1">
                  Problem Statement & Context
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60 font-sans">
                  {selectedProblem.description}
                </p>
              </div>

              {/* Interactive Flashcards / Hints Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2.5 flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-amber-500" />
                  <span>Key Concepts & Architectural Flashcards</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(selectedProblem.flashcards || []).map((fc, idx) => (
                    <div key={idx} className="bg-emerald-50/40 border border-[#04AA6D]/30 rounded-2xl p-3.5 flex flex-col justify-between">
                      <h5 className="text-[11px] font-bold text-slate-800 font-mono mb-1.5">{fc.title}</h5>
                      <p className="text-[10.5px] text-slate-600 leading-relaxed font-sans">{fc.hint}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Starter Code Files Preview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2 flex items-center gap-1.5">
                  <FileCode size={14} className="text-[#04AA6D]" />
                  <span>Pre-Configured Starter Workspace Files</span>
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {(selectedProblem.starterFiles || ['index.html', 'script.js']).map((file) => (
                    <span key={file} className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold">
                      📄 {file}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Primary Action Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
                <Clock size={14} />
                <span>Est. {selectedProblem.estimatedDuration}</span>
                <span>•</span>
                <span className="text-amber-500">+{selectedProblem.points || 300} XP</span>
              </div>

              {/* YES, LET'S DO IT! BUTTON */}
              <button
                onClick={() => handleLaunchVSCode(selectedProblem)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-black text-sm tracking-wide transition-all cursor-pointer shadow-lg shadow-emerald-950/20 border border-emerald-500/30"
              >
                <CheckCircle2 size={18} />
                <span>YES, LET'S DO IT!</span>
                <ExternalLink size={14} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── SESSION MANAGER MODAL (GitHub & Storage Workflow) ── */}
      <SessionManagerModal
        isOpen={isSessionModalOpen}
        mode={sessionModalMode}
        isGitHubImported={isGitHubImported}
        githubRepoUrl={activeRepoUrl}
        onStartSession={handleStartSession}
        onEndSession={handleEndSession}
        onClose={() => setIsSessionModalOpen(false)}
      />

    </div>
  );
};
