import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';

const getEditorLanguage = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'py':
      return 'python';
    case 'json':
      return 'json';
    default:
      return 'plaintext';
  }
};

import {
  Compass, Briefcase, Bookmark, ClipboardList, Clock, ArrowRight, ChevronLeft,
  BookOpen, Lock, CheckCircle2, Play, RotateCcw, Trash2, Plus, Minus, Sun, Moon,
  Sparkles, Share2, AlertTriangle, Star, CheckSquare, HelpCircle, Terminal as TermIcon,
  Laptop as LaptopIcon, Headphones as HeadphoneIcon, Keyboard as KeyboardIcon, ExternalLink,
  FileCode, Code2, Palette, Braces, BadgeCheck, ShieldAlert
} from 'lucide-react';
import {
  fetchProjectDetailsAPI,
  fetchProjectStepsAPI,
  fetchProgressAPI,
  updateProgressAPI,
  addBookmarkAPI,
  removeBookmarkAPI,
  getBookmarkStatusAPI,
  submitProjectAPI,
  resetProgressAPI,
  fetchBookmarkedSandboxProjectsAPI,
  fetchMySubmissionsAPI,
  initWorkspaceAPI,
  syncWorkspaceAPI,
  stopWorkspaceAPI,
} from '../services/sandboxAPI.js';
import toast from 'react-hot-toast';

export const SandboxProject = () => {
  const { projectId: id } = useParams();
  const navigate = useNavigate();

  // Project data states
  const [project, setProject] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // VS Code workspace states
  // wsStatus: 'idle' | 'connecting' | 'ready' | 'error' | 'retrying'
  const [wsStatus, setWsStatus]       = useState('ready');
  const [iframeUrl, setIframeUrl]     = useState('http://localhost:8107/?folder=/home/coder');
  const [wsPort, setWsPort]           = useState(8107);
  const wsRetryCount                  = useRef(0);
  const wsRetryTimer                  = useRef(null);
  const isMounted                     = useRef(true);

  // Tab & Editor states
  const [activeFile, setActiveFile] = useState('script.js');
  const [activeConsoleTab, setActiveConsoleTab] = useState('output');
  const [compileOutput, setCompileOutput] = useState([
    'Initializing CodeSphere playpen compiler...',
    'Secure sandbox sandbox environment initialized.',
    'Playpen listener active.'
  ]);
  const [running, setRunning] = useState(false);
  const [editorTheme, setEditorTheme] = useState('dark'); // 'dark' or 'light'

  // Dynamic Shopping Cart preview state matching the screenshot
  const [cartItems, setCartItems] = useState([
    { id: 'laptop', name: 'Laptop', price: 999, quantity: 2, icon: LaptopIcon },
    { id: 'headphones', name: 'Headphones', price: 199, quantity: 1, icon: HeadphoneIcon },
    { id: 'keyboard', name: 'Keyboard', price: 79, quantity: 1, icon: KeyboardIcon },
  ]);

  // Returns project-specific starter file templates based on title/stack
  const getProjectTemplates = (proj) => {
    if (!proj) return { 'index.html': '', 'styles.css': '', 'script.js': '' };
    const t = (proj.title || '').toLowerCase();
    const s = (proj.technologyStack || []).map(x => x.toLowerCase());

    if (t.includes('rest api') || t.includes('node') || t.includes('express') || s.includes('node.js')) {
      return {
        'server.js': `const express = require('express');\nconst mongoose = require('mongoose');\nrequire('dotenv').config();\n\nconst app = express();\napp.use(express.json());\n\n// Connect to MongoDB\nmongoose.connect(process.env.MONGO_URI)\n  .then(() => console.log('MongoDB connected'))\n  .catch(err => console.error(err));\n\n// TODO: Add routes here\n// app.use('/api/auth', require('./routes/auth'));\n\nconst PORT = process.env.PORT || 5000;\napp.listen(PORT, () => console.log('Server on port ' + PORT));`,
        '.env': `PORT=5000\nMONGO_URI=mongodb://localhost:27017/myapi\nJWT_SECRET=your_secret_key\nJWT_EXPIRES_IN=7d`,
        'routes/auth.js': `const express = require('express');\nconst router = express.Router();\nconst bcrypt = require('bcryptjs');\nconst jwt = require('jsonwebtoken');\n\n// POST /api/auth/register\nrouter.post('/register', async (req, res) => {\n  const { name, email, password } = req.body;\n  // TODO: hash password and create user\n  res.json({ message: 'Registered' });\n});\n\n// POST /api/auth/login\nrouter.post('/login', async (req, res) => {\n  const { email, password } = req.body;\n  // TODO: verify credentials and return JWT\n  res.json({ token: 'your-jwt-token' });\n});\n\nmodule.exports = router;`,
      };
    }

    if (t.includes('react') || t.includes('dashboard') || t.includes('chart') || s.includes('react')) {
      return {
        'App.jsx': `import React from 'react';\nimport Dashboard from './components/Dashboard';\nimport './index.css';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-gray-100">\n      <Dashboard />\n    </div>\n  );\n}`,
        'components/Dashboard.jsx': `import React from 'react';\nimport StatCard from './StatCard';\n\nconst stats = [\n  { label: 'Total Sales',  value: '$42,500', trend: '+12%' },\n  { label: 'New Users',    value: '1,284',   trend: '+8%'  },\n  { label: 'Revenue',      value: '$18,900', trend: '+5%'  },\n  { label: 'Orders',       value: '326',     trend: '-2%'  },\n];\n\nexport default function Dashboard() {\n  return (\n    <div className="p-6">\n      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>\n      <div className="grid grid-cols-4 gap-4">\n        {stats.map(s => <StatCard key={s.label} {...s} />)}\n      </div>\n    </div>\n  );\n}`,
        'components/StatCard.jsx': `import React from 'react';\n\nexport default function StatCard({ label, value, trend }) {\n  const pos = trend.startsWith('+');\n  return (\n    <div className="bg-white rounded-xl p-5 shadow">\n      <p className="text-sm text-gray-500">{label}</p>\n      <p className="text-2xl font-bold">{value}</p>\n      <p className={\`text-xs \${pos ? 'text-green-500' : 'text-red-500'}\`}>{trend}</p>\n    </div>\n  );\n}`,
      };
    }

    if (t.includes('python') || t.includes('pandas') || t.includes('data') || s.includes('python')) {
      return {
        'pipeline.py': `import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Step 1: Load dataset\ndf = pd.read_csv('data/sales.csv')\nprint("Shape:", df.shape)\nprint(df.head())\n\n# Step 2: Inspect\nprint(df.dtypes)\nprint(df.isnull().sum())\n\n# Step 3: Clean\n# TODO: df.dropna(inplace=True)\n# TODO: df.drop_duplicates(inplace=True)\n\n# Step 4: Transform\n# TODO: df['total'] = df['qty'] * df['price']\n# TODO: monthly = df.groupby('month')['total'].sum()\n\n# Step 5: Visualize\n# TODO: plt.plot(monthly)\n# TODO: plt.show()\n\nprint("Pipeline complete.")`,
        'requirements.txt': `pandas==2.1.0\nnumpy==1.25.0\nmatplotlib==3.8.0\nseaborn==0.13.0`,
        'data/README.md': `# Dataset\n\nPlace your CSV as data/sales.csv\nExpected columns: date, product, category, quantity, unit_price, total_sales`,
      };
    }

    // Generic fallback
    return {
      'index.html': `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8"/>\n  <title>${proj.title}</title>\n  <link rel="stylesheet" href="styles.css"/>\n</head>\n<body>\n  <div id="app"><h1>${proj.title}</h1></div>\n  <script src="script.js"></script>\n</body>\n</html>`,
      'styles.css': `* { box-sizing: border-box; margin: 0; padding: 0; }\nbody { font-family: sans-serif; padding: 20px; background: #f5f5f5; }\n#app { max-width: 800px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; }`,
      'script.js': `// ${proj.title}\nconsole.log("Project initialized: ${proj.title}");`,
    };
  };

  const [editorCodes, setEditorCodes] = useState({ 'index.html': '', 'styles.css': '', 'script.js': '' });

  useEffect(() => {
    if (!id) return;

    const fallbackSteps = [
      { stepNumber: 1, title: 'Project Setup',   description: 'Initialize the HTML, CSS and JS files.' },
      { stepNumber: 2, title: 'Add Products',     description: 'Display product list with name, price, and add to cart button.' },
      { stepNumber: 3, title: 'Add to Cart',      description: 'Add functionality to add selected product to cart.', objectives: ['Add product to cart when Add to Cart is clicked', 'Prevent duplicate items', 'Update cart count in navbar', 'Show success message'], resources: ['MDN LocalStorage', 'JavaScript Array Methods'] },
      { stepNumber: 4, title: 'Update Quantity',  description: 'Allow users to increase or decrease item quantity.' },
      { stepNumber: 5, title: 'Remove Items',     description: 'Remove items from the cart.' },
      { stepNumber: 6, title: 'Calculate Total',  description: 'Calculate and display total price of items.' },
      { stepNumber: 7, title: 'Persist Cart',     description: 'Store cart data in localStorage.' },
      { stepNumber: 8, title: 'Polish UI',         description: 'Improve UI/UX and make it responsive.' }
    ];

    const load = async () => {
      setLoading(true);
      try {
        // 1. Project details
        let projData = null;
        try { projData = (await fetchProjectDetailsAPI(id))?.data || null; } catch {}
        if (!projData) projData = { title: 'Build an E-commerce Cart', description: 'Build a dynamic shopping cart with add/remove items, update quantity, and calculate total price.', difficulty: 'Intermediate', category: 'Frontend', technologyStack: ['HTML', 'CSS', 'JavaScript', 'Local Storage'], estimatedDuration: '4-6 hours', enrolledCount: '2.4K', averageRating: 4.8 };
        setProject(projData);

        // 2. Steps
        let stepsData = [];
        try {
          const r = await fetchProjectStepsAPI(id);
          stepsData = Array.isArray(r?.data) ? r.data : [];
        } catch {}
        setSteps(stepsData.length > 0 ? stepsData : fallbackSteps);

        // 3. Progress (auto-created by backend if none exists)
        let progressData = null;
        try { progressData = (await fetchProgressAPI(id))?.data || null; } catch {}
        if (progressData) {
          setProgress(progressData);
          setCurrentStepIdx(Math.max(0, (progressData.currentStep || 1) - 1));
          if (progressData.codeFiles && Object.keys(progressData.codeFiles).length > 0) {
            const files = progressData.codeFiles;
            setEditorCodes(files);
            setActiveFile(Object.keys(files)[0]);
          } else {
            const templates = getProjectTemplates(projData);
            setEditorCodes(templates);
            setActiveFile(Object.keys(templates)[0]);
          }
        } else {
          setProgress({ currentStep: 1, completedSteps: [] });
          setCurrentStepIdx(0);
          const templates = getProjectTemplates(projData);
          setEditorCodes(templates);
          setActiveFile(Object.keys(templates)[0]);
        }

        // 4. Bookmark status
        try {
          const r = await getBookmarkStatusAPI(id);
          setBookmarked(r?.data?.bookmarked || false);
        } catch {}

        // 5. Sidebar lists
        try {
          const subsRes = await fetchMySubmissionsAPI();
          setSubmissions(subsRes?.data || subsRes || []);
        } catch {}
        try {
          const bmsRes = await fetchBookmarkedSandboxProjectsAPI();
          setBookmarks(bmsRes?.data || bmsRes || []);
        } catch {}

      } catch (err) {
        console.error('Workspace load error:', err);
        setSteps(fallbackSteps);
        setEditorCodes(fileContents);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // Periodic background auto-sync from VS Code workspace disk to MongoDB database
  // ─── VS Code workspace lifecycle ─────────────────────────────────────────────

  // initWorkspace (fetches URL, defaults safely to http://localhost:8107/?folder=/home/coder)
  const startWorkspace = useCallback(async (projectId) => {
    try {
      const res = await initWorkspaceAPI(projectId);
      const url  = res?.data?.iframeUrl;
      const port = res?.data?.port;
      if (isMounted.current && url) {
        const backendOrigin = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
        const fullUrl = url.startsWith('http') ? url : `${backendOrigin}${url}`;
        setIframeUrl(fullUrl);
        setWsPort(port ?? 8107);
        setWsStatus('ready');
      }
    } catch {
      if (isMounted.current) {
        setIframeUrl('http://localhost:8107/?folder=/home/coder');
        setWsStatus('ready');
      }
    }
  }, []);

  // Launch workspace once project data is loaded
  useEffect(() => {
    if (!id || loading) return;
    isMounted.current = true;
    startWorkspace(id);

    return () => {
      isMounted.current = false;
      clearTimeout(wsRetryTimer.current);
    };
  }, [id, loading, startWorkspace]);

  // Best-effort sync when navigating away
  useEffect(() => {
    return () => {
      if (!id) return;
      syncWorkspaceAPI(id).catch(() => {});
    };
  }, [id]);

  // Periodic auto-sync: VS Code disk → MongoDB every 15 s (only when server is ready)
  useEffect(() => {
    if (!id || wsStatus !== 'ready') return;

    const interval = setInterval(() => {
      syncWorkspaceAPI(id)
        .then(res => {
          if (res?.data?.codeFiles && Object.keys(res.data.codeFiles).length > 0) {
            setEditorCodes(res.data.codeFiles);
          }
        })
        .catch(() => {});
    }, 15000);

    return () => clearInterval(interval);
  }, [id, wsStatus]);

  // Manual retry handler
  const handleRetryWorkspace = useCallback(() => {
    clearTimeout(wsRetryTimer.current);
    wsRetryCount.current = 0;
    startWorkspace(id);
  }, [id, startWorkspace]);

  // Listen for reconnect signals from iframe error page
  useEffect(() => {
    const handleMsg = (e) => {
      if (e.data === 'RECONNECT_VSCODE') {
        handleRetryWorkspace();
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, [handleRetryWorkspace]);

  // Open VS Code in a dedicated tab at the absolute URL
  const handleOpenInNewTab = () => {
    // Open VS Code IDE in a new tab
    const vscodeUrl = `/vscode/${id}`;
    window.open(vscodeUrl, '_blank', 'width=1400,height=900,noopener,noreferrer');
  };

  // Handle clicking the prominent "Code" button to launch VS Code Web Studio in a new tab
  const handleCodeButtonClick = () => {
    const targetUrl = iframeUrl || 'http://localhost:8107/?folder=/home/coder';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Realtime compiler logic that parses script.js content to update shopping cart details
  useEffect(() => {
    try {
      const code = editorCodes['script.js'] || '';
      const itemRegex = /name\s*:\s*['"]([^'"]+)['"]\s*,\s*price\s*:\s*(\d+)/g;
      const found = [];
      let match;
      
      while ((match = itemRegex.exec(code)) !== null) {
        const name = match[1];
        const price = parseInt(match[2], 10);
        found.push({ name, price });
      }
      
      if (found.length === 0) {
        setCartItems([]);
        return;
      }
      
      setCartItems(prev => {
        return found.map(f => {
          const key = f.name.toLowerCase();
          const existing = prev.find(item => item.name.toLowerCase() === key);
          const quantity = existing ? existing.quantity : 1;
          const icon = key.includes('laptop') ? LaptopIcon
                     : key.includes('headphone') ? HeadphoneIcon
                     : KeyboardIcon;
          return {
            id: key,
            name: f.name,
            price: f.price,
            quantity,
            icon
          };
        });
      });
    } catch (err) {
      console.error('Realtime playpen compiler error:', err);
    }
  }, [editorCodes['script.js']]);

  // Realtime style compiler that injects CSS modifications from styles.css into head
  useEffect(() => {
    let styleTag = document.getElementById('playpen-custom-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'playpen-custom-styles';
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = editorCodes['styles.css'] || '';
    
    return () => {
      const tag = document.getElementById('playpen-custom-styles');
      if (tag) tag.remove();
    };
  }, [editorCodes['styles.css']]);

  const handleQtyChange = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nextQty };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleRunCode = async () => {
    setRunning(true);
    let currentCodes = editorCodes;
    try {
      const syncRes = await syncWorkspaceAPI(id);
      if (syncRes?.data?.codeFiles) {
        currentCodes = syncRes.data.codeFiles;
        setEditorCodes(currentCodes);
      }
    } catch (syncErr) {
      console.warn('Workspace sync failed, compiling memory state:', syncErr);
    }

    setCompileOutput(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Starting build process...`,
      `[${new Date().toLocaleTimeString()}] Compiling files: ${Object.keys(currentCodes).join(', ')}`,
      `[${new Date().toLocaleTimeString()}] CodeSphere sandbox deployment successful.`
    ]);

    // Auto-save code files to DB progress record
    updateProgressAPI(id, { codeFiles: currentCodes })
      .then((res) => { if (res?.data) setProgress(res.data); })
      .catch(err => console.warn('Auto-save failed:', err));

    setTimeout(() => {
      setRunning(false);
      setActiveConsoleTab('output');
      toast.success('Code compiled and saved!');
    }, 1500);
  };

  const toggleBookmark = () => {
    const apiCall = bookmarked ? removeBookmarkAPI(id) : addBookmarkAPI(id);
    apiCall
      .then((res) => {
        if (res.success) {
          setBookmarked(!bookmarked);
          toast.success(bookmarked ? 'Bookmark removed' : 'Project bookmarked');
        }
      })
      .catch(() => toast.error('Failed to toggle bookmark'));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Workspace link copied to clipboard!');
  };

  const handleStepSubmit = async () => {
    const totalCount = steps.length || 8;
    if (progress?.currentStep > totalCount) {
      toast.success('Project completed!');
      navigate('/sandbox');
      return;
    }
    const stepToSubmit = currentStepIdx + 1;
    const nextStepNum  = Math.min(totalCount, stepToSubmit + 1);
    const pct          = Math.round((stepToSubmit / totalCount) * 100);

    let currentCodes = editorCodes;
    try {
      const syncRes = await syncWorkspaceAPI(id);
      if (syncRes?.data?.codeFiles) {
        currentCodes = syncRes.data.codeFiles;
        setEditorCodes(currentCodes);
      }
    } catch (syncErr) {
      console.warn('Workspace sync failed, using memory state:', syncErr);
    }

    try {
      // Save submission
      await submitProjectAPI(id, {
        submissionType: 'github',
        githubUrl: 'https://github.com/codesphere/project',
        notes: `Step ${stepToSubmit} submission`,
      });

      // Update progress + persist code files
      const pRes = await updateProgressAPI(id, {
        stepNumber:  stepToSubmit,
        codeFiles:   currentCodes,
      });
      if (pRes?.data) {
        setProgress(pRes.data);
        setCurrentStepIdx(nextStepNum - 1);
        toast.success(`Step ${stepToSubmit} submitted! Step ${nextStepNum} unlocked.`);
      }
    } catch {
      // Optimistic local update
      setProgress(prev => ({
        ...prev,
        currentStep:       stepToSubmit + 1,
        completedSteps:    [...(prev?.completedSteps || []), stepToSubmit],
        completionPercent: pct,
      }));
      setCurrentStepIdx(nextStepNum - 1);
      toast.success(`Step ${stepToSubmit} marked complete!`);
    }
  };

  const handleStepUnmark = async (stepNum) => {
    const totalCount = steps.length || 8;
    let currentCodes = editorCodes;
    try {
      const syncRes = await syncWorkspaceAPI(id);
      if (syncRes?.data?.codeFiles) {
        currentCodes = syncRes.data.codeFiles;
        setEditorCodes(currentCodes);
      }
    } catch (syncErr) {
      console.warn('Workspace sync failed, using memory state:', syncErr);
    }

    try {
      const pRes = await updateProgressAPI(id, {
        stepNumber: stepNum,
        unmark: true,
        codeFiles: currentCodes,
      });
      if (pRes?.data) {
        setProgress(pRes.data);
        toast.success(`Step ${stepNum} unmarked successfully.`);
      }
    } catch (err) {
      console.error('Failed to unmark step:', err);
      // Optimistic local update
      setProgress(prev => {
        const nextCompleted = (prev?.completedSteps || []).filter(s => s !== stepNum);
        const nextPct = Math.round((nextCompleted.length / totalCount) * 100);
        return {
          ...prev,
          currentStep: Math.min(prev?.currentStep || 1, stepNum),
          completedSteps: nextCompleted,
          completionPercent: nextPct,
          status: 'in_progress',
        };
      });
      toast.success(`Step ${stepNum} unmarked.`);
    }
  };

  const handleResetProject = () => {
    if (!window.confirm('Reset this project? All code edits and step progress will be cleared.')) return;
    resetProgressAPI(id)
      .then((res) => {
        if (res?.data) {
          setProgress(res.data);
          const templates = getProjectTemplates(project);
          setEditorCodes(templates);
          setActiveFile(Object.keys(templates)[0]);
          setCurrentStepIdx(0);
          setCompileOutput(['Initializing CodeSphere sandbox...', 'Playpen reset. Ready.']);
          toast.success('Project reset successfully.');
        }
      })
      .catch(() => toast.error('Failed to reset project.'));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3 bg-[#F8FAFC]">
        <div className="w-9 h-9 rounded-full border-4 border-slate-200 border-t-[#04AA6D] animate-spin" />
        <span className="text-xs font-bold text-slate-400 font-mono uppercase">Loading compiler workspace...</span>
      </div>
    );
  }

  const currentStep = steps[currentStepIdx] || {
    title: 'Add to Cart',
    description: 'Add functionality to add selected product to cart. Hint: Use array to store cart items and update UI dynamically.',
    objectives: [
      'Add product to cart when Add to Cart is clicked',
      'Prevent duplicate items',
      'Update cart count in navbar',
      'Show success message'
    ],
    resources: ['MDN LocalStorage', 'JavaScript Array Methods']
  };

  const objectivesList = (currentStep.objectives && currentStep.objectives.length > 0)
    ? currentStep.objectives
    : [
        'Add product to cart when Add to Cart is clicked',
        'Prevent duplicate items',
        'Update cart count in navbar',
        'Show success message'
      ];

  const resourcesList = (currentStep.resources && currentStep.resources.length > 0)
    ? currentStep.resources
    : ['MDN LocalStorage', 'JavaScript Array Methods'];

  const htmlContent = editorCodes['index.html'] || '';
  const headerMatch = htmlContent.match(/class=["']cart-header["'][^>]*>([^<]+)</i) || htmlContent.match(/<h1>([^<]+)</i);
  const cartTitle = headerMatch ? headerMatch[1].trim() : 'Shopping Cart';

  const completedCount = progress?.completedSteps?.length || 0;
  const totalStepsCount = steps.length || 8;
  const calculatedPct = progress?.completionPercent || Math.round((completedCount / totalStepsCount) * 100);
  const strokeDashoffset = 125.6 - (125.6 * calculatedPct) / 100;

  return (
    <div className="flex flex-col gap-4 w-full bg-[#F8FAFC] text-slate-650 text-left select-none min-h-screen">
      
      {/* Subheader Navigation */}
      <div className="flex items-center gap-1.5 select-none border-b border-slate-200/60 pb-1.5">
        <button
          onClick={() => navigate('/sandbox')}
          className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold font-mono uppercase tracking-wider rounded-xl bg-[#04AA6D] text-white shadow-sm transition-all cursor-pointer"
        >
          <Compass size={13} />
          Explore
        </button>
        <button
          onClick={() => navigate('/sandbox?tab=projects')}
          className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold font-mono uppercase tracking-wider rounded-xl text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 transition-all cursor-pointer"
        >
          <Briefcase size={13} />
          My Projects
        </button>
        <button
          onClick={() => navigate('/sandbox?tab=bookmarks')}
          className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold font-mono uppercase tracking-wider rounded-xl text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 transition-all cursor-pointer"
        >
          <Bookmark size={13} />
          Bookmarks
        </button>
        <button
          onClick={() => navigate('/sandbox?tab=submissions')}
          className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold font-mono uppercase tracking-wider rounded-xl text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 transition-all cursor-pointer"
        >
          <ClipboardList size={13} />
          Submissions
        </button>
      </div>

      {/* Breadcrumbs Row & Editor Actions */}
      <div className="flex items-center justify-between select-none py-1">
        <Link to="/sandbox" className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider transition-colors">
          <ChevronLeft size={14} />
          Back to Projects
        </Link>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenInNewTab} 
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold text-white uppercase tracking-wider transition-all shadow-md cursor-pointer"
            title="Open VS Code in full screen"
          >
            <ExternalLink size={12} />
            Open VS Code
          </button>
          <button onClick={() => setEditorTheme(prev => prev === 'dark' ? 'light' : 'dark')} className="p-2 rounded-xl bg-white border border-slate-200/60 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm cursor-pointer" title={editorTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {editorTheme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button onClick={handleResetProject} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/60 text-[10px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 uppercase tracking-wider transition-all shadow-sm cursor-pointer">
            <RotateCcw size={12} />
            Reset
          </button>
          <button onClick={handleRunCode} disabled={running} className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-[10px] font-bold text-white uppercase tracking-wider cursor-pointer shadow-md transition-all">
            <Play size={11} fill="white" />
            Run Code
          </button>
        </div>
      </div>

      {/* Main Grid Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch w-full max-w-full overflow-hidden">
        
        {/* Left Column: Project Overview, Current Step & Instructions (xl:col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex-1 flex flex-col gap-4 shadow-sm min-w-0">
            
            {/* Project Banner & Tech Tags */}
            <div className="flex flex-col gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                  <Code2 size={24} className="text-[#04AA6D]" />
                </div>
                <div className="leading-tight text-left min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider truncate">{project?.title || 'Build an E-commerce Cart'}</h3>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase bg-amber-50 text-amber-600 border border-amber-100">
                      {project?.difficulty || 'Intermediate'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-sans line-clamp-2">
                    {project?.description || 'Build a dynamic shopping cart with add/remove items, update quantity, and calculate total price.'}
                  </p>
                </div>
              </div>

              {/* Technologies Stack tags */}
              <div className="flex flex-wrap gap-1">
                {(project?.technologyStack || ['HTML', 'CSS', 'JavaScript', 'Local Storage']).map((tech) => (
                  <span key={tech} className="text-[8.5px] font-semibold bg-slate-50 text-slate-500 border border-slate-100 rounded px-1.5 py-0.5 font-sans">{tech}</span>
                ))}
              </div>
            </div>

            {/* Current Step & Instructions */}
            <div className="flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-[#04AA6D] uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 font-mono">
                  Step {currentStepIdx + 1} of {steps.length}
                </span>
                {(progress?.completedSteps?.includes(currentStepIdx + 1) || (currentStepIdx + 1 < (progress?.currentStep || 1))) && (
                  <button
                    onClick={() => handleStepUnmark(currentStepIdx + 1)}
                    className="text-[9px] font-bold text-rose-500 hover:text-rose-600 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw size={10} />
                    Unmark
                  </button>
                )}
              </div>

              <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentStep.title}</h2>
              <p className="text-[10px] text-slate-600 leading-relaxed font-sans">
                {currentStep.description}
              </p>

              {/* Requirements Checklist */}
              <div className="mt-2 bg-slate-50/60 p-3 rounded-xl border border-slate-200/60">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">Requirements</p>
                <div className="flex flex-col gap-1.5">
                  {objectivesList.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-left">
                      <CheckCircle2 size={13} className="text-[#04AA6D] mt-0.5 shrink-0" />
                      <span className="text-[10px] text-slate-600 leading-snug">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources Links */}
              {resourcesList.length > 0 && (
                <div className="mt-1">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Resources</p>
                  <div className="flex flex-wrap gap-2">
                    {resourcesList.map(res => (
                      <a key={res} href="#" className="text-[9.5px] font-bold text-[#04AA6D] hover:underline uppercase tracking-wider flex items-center gap-1">
                        <BookOpen size={11} />
                        {res}
                        <ExternalLink size={9} className="text-[#04AA6D] inline" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Project Steps Navigation Accordion */}
            <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>All Project Steps</span>
                <span className="bg-slate-100 text-slate-500 text-[8px] px-1.5 py-0.5 rounded-md border border-slate-200/60 font-mono">{steps.length} Steps</span>
              </div>
              <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto pr-1">
                {steps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const active = currentStepIdx === idx;
                  const completed = (progress?.completedSteps || []).includes(stepNum) || stepNum < (progress?.currentStep || 1);
                  const locked = stepNum > (progress?.currentStep || 1) && !completed;
                  
                  return (
                    <button
                      key={idx}
                      disabled={locked}
                      onClick={() => setCurrentStepIdx(idx)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left border transition-all ${
                        active 
                          ? 'bg-emerald-50/60 border-[#04AA6D] text-[#04AA6D] shadow-sm font-bold' 
                          : completed 
                            ? 'bg-slate-50/40 border-slate-200/40 text-slate-600 hover:bg-slate-50' 
                            : 'bg-slate-50/20 border-slate-200/40 text-slate-400 hover:bg-slate-50'
                      } ${locked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {completed ? (
                          <CheckCircle2 size={12} className="text-[#04AA6D] shrink-0" />
                        ) : locked ? (
                          <Lock size={10} className="text-slate-350 shrink-0" />
                        ) : (
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 text-[8px] font-bold border ${
                            active ? 'bg-[#04AA6D] text-white border-[#04AA6D]' : 'border-slate-300 text-slate-500'
                          }`}>{stepNum}</span>
                        )}
                        <span className="text-[9.5px] truncate uppercase tracking-wider">
                          Step {stepNum}: {step.title || 'Step'}
                        </span>
                      </div>
                      <ChevronLeft size={10} className="rotate-180 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Column 2: Current Step Instructions (col-span-3) */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex-1 flex flex-col justify-between shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Current Step</span>
                {(progress?.completedSteps?.includes(currentStepIdx + 1) || (currentStepIdx + 1 < (progress?.currentStep || 1))) && (
                  <button
                    onClick={() => handleStepUnmark(currentStepIdx + 1)}
                    className="text-[9px] font-bold text-rose-500 hover:text-rose-600 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw size={10} />
                    Unmark Complete
                  </button>
                )}
              </div>
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider mt-0.5">Step {currentStepIdx + 1}: {currentStep.title}</h2>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                {currentStep.description}
              </p>

              {/* Requirements Checklist */}
              <div className="mt-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">Requirements</p>
                <div className="flex flex-col gap-1.5">
                  {objectivesList.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-left">
                      <CheckCircle2 size={13} className="text-[#04AA6D] mt-0.5 shrink-0" />
                      <span className="text-[10px] text-slate-600 leading-snug">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources Links */}
              <div className="mt-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Resources</p>
                <div className="flex flex-col gap-1">
                  {resourcesList.map(res => (
                    <a key={res} href="#" className="text-[9.5px] font-bold text-[#04AA6D] hover:underline uppercase tracking-wider flex items-center gap-1">
                      <BookOpen size={11} />
                      {res}
                      <ExternalLink size={9} className="text-[#04AA6D] inline" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Example Output Mockup Card — dynamic per project */}
            <div className="mt-4 border-t border-slate-200/60 pt-4 select-none">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">Example Output</p>
              <div className="p-3.5 bg-[#0B0F17] border border-[#1A202F] rounded-xl flex flex-col gap-2.5 text-slate-300">
                {(() => {
                  const t = (project?.title || '').toLowerCase();
                  if (t.includes('rest api') || t.includes('node') || t.includes('express')) {
                    return (
                      <>
                        <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
                          <span className="text-[9.5px] font-bold text-white uppercase tracking-wider">API Server</span>
                          <span className="w-2 h-2 rounded-full bg-[#04AA6D] animate-pulse" />
                        </div>
                        {['> Server running on port 5000', '> MongoDB connected', '> POST /api/auth/register 201', '> POST /api/auth/login 200', '> Token: eyJhbGci...'].map((line, i) => (
                          <p key={i} className="text-[9px] font-mono" style={{ color: line.includes('201') || line.includes('200') ? '#04AA6D' : line.includes('Token') ? '#60a5fa' : '#94a3b8' }}>{line}</p>
                        ))}
                      </>
                    );
                  }
                  if (t.includes('react') || t.includes('dashboard') || t.includes('chart')) {
                    return (
                      <>
                        <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
                          <span className="text-[9.5px] font-bold text-white uppercase tracking-wider">Dashboard Preview</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[{ l: 'Total Sales', v: '$42,500', t: '+12%' }, { l: 'New Users', v: '1,284', t: '+8%' }, { l: 'Revenue', v: '$18,900', t: '+5%' }, { l: 'Orders', v: '326', t: '-2%' }].map((s, i) => (
                            <div key={i} className="bg-[#121824] border border-[#1A202F] rounded-lg p-2">
                              <p className="text-[8px] text-slate-500 uppercase">{s.l}</p>
                              <p className="text-[11px] font-bold text-white">{s.v}</p>
                              <p className={`text-[8px] font-bold ${s.t.startsWith('+') ? 'text-[#04AA6D]' : 'text-rose-400'}`}>{s.t}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  }
                  if (t.includes('python') || t.includes('pandas') || t.includes('data')) {
                    return (
                      <>
                        <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
                          <span className="text-[9.5px] font-bold text-white uppercase tracking-wider">Pipeline Output</span>
                        </div>
                        {['>>> Shape: (1000, 6)', '>>> Columns: date, product, qty, price', '>>> Missing values: 0', '>>> Groups: Electronics 480, Accessories 520', '>>> Pipeline complete. ✓'].map((line, i) => (
                          <p key={i} className="text-[9px] font-mono" style={{ color: line.includes('complete') ? '#04AA6D' : line.includes('>>>') ? '#60a5fa' : '#94a3b8' }}>{line}</p>
                        ))}
                      </>
                    );
                  }
                  // Generic
                  return (
                    <>
                      <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
                        <span className="text-[9.5px] font-bold text-white uppercase tracking-wider">Output</span>
                      </div>
                      <p className="text-[9px] font-mono text-[#04AA6D]">{'> Project initialized. ✓'}</p>
                      <p className="text-[9px] font-mono text-slate-400">{'> Ready. Start coding...'}</p>
                    </>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>

        {/* Column 3: VS Code Web Studio Code Button Launcher (col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="border border-slate-200/60 bg-[#0d1117] rounded-3xl p-8 shadow-md flex-1 flex flex-col items-center justify-center text-center relative min-h-[500px] overflow-hidden select-none">
            {/* Background Gradient & Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(4,170,109,0.15)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1)_0%,transparent_60%)] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-sm">
              {/* Glowing Hexagon Icon Badge */}
              <div className="w-20 h-20 rounded-3xl bg-[#04AA6D]/15 border border-[#04AA6D]/40 flex items-center justify-center text-[#04AA6D] mb-6 shadow-2xl shadow-emerald-950/80 backdrop-blur-md">
                <Code2 className="w-10 h-10" />
              </div>

              <h3 className="text-xl font-black text-white font-mono uppercase tracking-wider">VS Code Web Studio</h3>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-sans">
                Launch your dedicated cloud development workspace in a new browser tab to view and edit project files in real-time.
              </p>

              {/* Prominent Centered Code Button */}
              <button
                onClick={handleCodeButtonClick}
                className="mt-8 px-10 py-4 bg-[#04AA6D] hover:bg-emerald-600 text-white font-black text-base uppercase tracking-widest rounded-2xl flex items-center gap-3 shadow-2xl shadow-emerald-950/80 cursor-pointer transition-all hover:scale-105 active:scale-95 border border-emerald-400/40 font-mono"
              >
                <Code2 className="w-6 h-6" />
                <span>Code</span>
                <ExternalLink className="w-4 h-4 opacity-80 ml-1" />
              </button>

              {/* Realtime Server Status Indicator */}
              <div className="mt-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 shadow-md">
                <span className={`w-2.5 h-2.5 rounded-full ${wsStatus === 'ready' ? 'bg-[#04AA6D]' : wsStatus === 'error' ? 'bg-rose-500' : 'bg-amber-400 animate-pulse'}`} />
                <span>
                  {wsStatus === 'ready' 
                    ? 'VS Code Server Ready' 
                    : wsStatus === 'connecting' || wsStatus === 'retrying'
                    ? 'Launching Code Server...'
                    : wsStatus === 'error'
                    ? 'Server Offline (Click Code to Launch)'
                    : 'Code Server Ready'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Progress & Project Stats (xl:col-span-3) */}
        <div className="xl:col-span-3 flex flex-col gap-4 min-w-0">
          
          {/* Your Progress */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex flex-col justify-between shadow-sm text-left">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Your Progress</p>
              <div className="flex items-center gap-3 justify-center select-none py-1">
                <div className="relative flex items-center justify-center shrink-0">
                  <svg height="52" width="52">
                    <circle stroke="#E2E8F0" fill="transparent" strokeWidth="4.5" r="20" cx="26" cy="26" />
                    <circle stroke="#04AA6D" fill="transparent" strokeWidth="4.5" strokeDasharray="125.6" strokeDashoffset={strokeDashoffset} strokeLinecap="round" r="20" cx="26" cy="26" className="origin-center -rotate-90 transition-all duration-300" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black text-slate-800">{calculatedPct}%</span>
                  </div>
                </div>
                <div className="text-left font-mono min-w-0">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-none">Steps</span>
                  <p className="text-[10px] font-black text-slate-700 leading-none mt-0.5 truncate">{completedCount} / {totalStepsCount} Completed</p>
                </div>
              </div>
            </div>
            <button onClick={handleStepSubmit} className="mt-4 block w-full py-2 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl text-center text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm">
              {progress?.currentStep > totalStepsCount ? 'Project Completed' : 'Continue Step ' + (progress?.currentStep || 1)}
            </button>
            {(progress?.completedSteps?.includes(currentStepIdx + 1) || (currentStepIdx + 1 < (progress?.currentStep || 1))) && (
              <button
                onClick={() => handleStepUnmark(currentStepIdx + 1)}
                className="mt-2 block w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-center text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Unmark Step {currentStepIdx + 1}
              </button>
            )}
          </div>

          {/* Project Info */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 text-left shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">Project Info</p>
            <div className="flex flex-col gap-2.5">
              {[
                { name: 'Difficulty', val: project?.difficulty || 'Intermediate', style: 'text-amber-600 font-bold capitalize bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100/60 w-max' },
                { name: 'Enrolled Students', val: project?.enrolledCount || '2.4K', style: 'text-slate-800 font-bold' },
                { name: 'Estimated Time', val: project?.estimatedDuration || '4-6 hours', style: 'text-slate-800 font-bold' },
                { name: 'Project ID', val: `CS-SBX-${id || '1024'}`, style: 'text-slate-400 font-mono' },
              ].map((info) => (
                <div key={info.name} className="flex flex-col gap-0.5 text-[8.5px] font-bold text-slate-400 uppercase leading-none select-none">
                  <span>{info.name}</span>
                  <span className={`text-[10px] mt-1 ${info.style}`}>{info.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 text-left shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Actions</p>
            <div className="flex flex-col gap-1.5">
              <button onClick={toggleBookmark} className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 text-[9.5px] font-bold text-slate-600 uppercase tracking-wider border border-slate-200/60 cursor-pointer">
                <span>{bookmarked ? 'Remove Bookmark' : 'Bookmark Project'}</span>
                <Star size={12} className={bookmarked ? 'text-amber-500 fill-amber-500' : 'text-slate-400'} />
              </button>
              <button onClick={handleShare} className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 text-[9.5px] font-bold text-slate-600 uppercase tracking-wider border border-slate-200/60 cursor-pointer">
                <span>Share Project</span>
                <Share2 size={12} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Submissions */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 text-left shadow-sm">
            <div className="flex items-center justify-between mb-3 text-[10px] font-bold">
              <span className="uppercase text-slate-400">Submissions</span>
              <span className="text-[#04AA6D] hover:underline cursor-pointer text-[9.5px]">View All</span>
            </div>
            <div className="flex flex-col gap-2">
              {submissions && submissions.length > 0 ? (
                submissions.map((sub, idx) => {
                  const tag = sub.status === 'submitted' ? 'Under Review' : sub.score !== undefined ? `${sub.score}/100` : 'Submitted';
                  const color = sub.status === 'submitted' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100';
                  const dateStr = new Date(sub.createdAt || sub.submittedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                  return (
                    <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1">
                      <div className="flex items-center justify-between select-none">
                        <span className="text-[10px] font-bold text-slate-800 font-mono">Submission #{submissions.length - idx}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase border ${color}`}>{tag}</span>
                      </div>
                      <span className="text-[8.5px] text-slate-400 mt-0.5">{dateStr}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-450 font-semibold py-1.5">No submissions yet.</p>
              )}
            </div>
          </div>

          {/* Bookmarked Projects */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 text-left shadow-sm">
            <div className="flex items-center justify-between mb-3 text-[10px] font-bold">
              <span className="uppercase text-slate-400">Bookmarks</span>
              <span className="text-[#04AA6D] hover:underline cursor-pointer text-[9.5px]">View All</span>
            </div>
            <div className="flex flex-col gap-3">
              {bookmarks && bookmarks.length > 0 ? (
                bookmarks.map((bm, idx) => {
                  const title = bm.projectId?.title || bm.title;
                  const tag = bm.projectId?.difficulty || bm.difficulty || 'Beginner';
                  return (
                    <Link to={`/sandbox/${bm.projectId?._id || bm.projectId}`} key={idx} className="flex items-start justify-between gap-1 select-none hover:opacity-80 transition-opacity">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-700 truncate uppercase tracking-wider font-mono">{title}</p>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{tag}</span>
                      </div>
                      <Bookmark size={11} className="text-[#04AA6D] shrink-0 mt-0.5 fill-[#04AA6D]" />
                    </Link>
                  );
                })
              ) : (
                <p className="text-xs text-slate-455 font-semibold py-1.5">No bookmarked projects.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default SandboxProject;
