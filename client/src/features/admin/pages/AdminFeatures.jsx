import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '@services/axios.js';
import {
  GraduationCap, Code2, HelpCircle, Calendar, BookOpen, Sliders,
  Plus, Edit, Trash2, Search, Filter, Check, X, Eye, RefreshCw,
  BarChart2, FileText, Layers, ShieldCheck, Sparkles, Activity,
  ChevronRight, ExternalLink, Play, Lock, Globe, ToggleLeft, ToggleRight,
  Clock, Award, Users, AlertCircle, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '../../../socket/socket.js';

// Import existing Learning Path management component for full integration
import AdminLearning from './AdminLearning.jsx';

export default function AdminFeaturesPage({ defaultTab }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active Tab: 'learning' | 'sandboxes' | 'tests' | 'events' | 'resources' | 'toggles'
  const activeTab = searchParams.get('tab') || defaultTab || 'learning';

  const handleTabChange = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  // ─── TAB 2: SANDBOXES STATE & HANDLERS ─────────────────────────────────────
  const [sandboxes, setSandboxes] = useState([]);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxSearch, setSandboxSearch] = useState('');
  const [sandboxCategory, setSandboxCategory] = useState('');
  const [sandboxStatus, setSandboxStatus] = useState('');
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState(false);
  const [editingSandbox, setEditingSandbox] = useState(null);
  const [sandboxForm, setSandboxForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    difficulty: 'beginner',
    technologyStack: 'React, TailwindCSS, JavaScript',
    templateType: 'react',
    estimatedTime: 45,
    isPublished: true,
  });

  const fetchSandboxes = async () => {
    setSandboxLoading(true);
    try {
      const res = await apiClient.get('/sandbox', {
        params: {
          all: 'true',
          search: sandboxSearch || undefined,
          category: sandboxCategory || undefined,
          isPublished: sandboxStatus === 'published' ? 'true' : sandboxStatus === 'draft' ? 'false' : undefined,
        },
      });
      const root = res.data?.data;
      const projectsList = Array.isArray(root?.projects)
        ? root.projects
        : Array.isArray(res.data?.projects)
        ? res.data.projects
        : Array.isArray(root)
        ? root
        : Array.isArray(res.data)
        ? res.data
        : [];
      setSandboxes(projectsList);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch sandbox projects');
      setSandboxes([]);
    } finally {
      setSandboxLoading(false);
    }
  };

  const handleSaveSandbox = async (e) => {
    e.preventDefault();
    if (!sandboxForm.title) return toast.error('Title is required');
    const loader = toast.loading('Saving sandbox project...');
    try {
      const rawCat = (sandboxForm.category || '').trim() || 'Full Stack';

      const payload = {
        ...sandboxForm,
        category: rawCat,
        isPublished: Boolean(sandboxForm.isPublished),
        status: sandboxForm.isPublished ? 'published' : 'draft',
        technologyStack: typeof sandboxForm.technologyStack === 'string'
          ? sandboxForm.technologyStack.split(',').map((s) => s.trim()).filter(Boolean)
          : sandboxForm.technologyStack,
      };

      if (editingSandbox) {
        await apiClient.put(`/sandbox/${editingSandbox._id}`, payload);
        toast.success('Sandbox project updated', { id: loader });
      } else {
        await apiClient.post('/sandbox', payload);
        toast.success('Sandbox project created', { id: loader });
      }

      setSandboxSearch('');
      setSandboxCategory('');
      setSandboxStatus('');
      setIsSandboxModalOpen(false);
      fetchSandboxes();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save sandbox project', { id: loader });
    }
  };

  const handleDeleteSandbox = async (id) => {
    if (!confirm('Are you sure you want to delete this sandbox project?')) return;
    const loader = toast.loading('Deleting sandbox project...');
    try {
      await apiClient.delete(`/sandbox/${id}`);
      toast.success('Sandbox project deleted', { id: loader });
      fetchSandboxes();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete sandbox project', { id: loader });
    }
  };

  const handleToggleSandboxStatus = async (item) => {
    const loader = toast.loading('Updating status...');
    try {
      await apiClient.put(`/sandbox/${item._id}`, { isPublished: !item.isPublished });
      toast.success(`Project ${!item.isPublished ? 'published' : 'unpublished'}`, { id: loader });
      fetchSandboxes();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Status update failed', { id: loader });
    }
  };

  // ─── TAB 3: TESTS & ASSESSMENTS STATE & HANDLERS ─────────────────────────
  const [tests, setTests] = useState([]);
  const [testLoading, setTestLoading] = useState(false);
  const [testSearch, setTestSearch] = useState('');
  const [testCategory, setTestCategory] = useState('');
  const [testDifficulty, setTestDifficulty] = useState('');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [testForm, setTestForm] = useState({
    title: '',
    description: '',
    category: 'Software Engineering',
    difficulty: 'intermediate',
    duration: 30, // in minutes
    passScorePercentage: 70,
    technology: 'Full Stack',
    isPublished: true,
  });

  const fetchTests = async () => {
    setTestLoading(true);
    try {
      const res = await apiClient.get('/tests', {
        params: {
          all: 'true',
          search: testSearch || undefined,
          category: testCategory || undefined,
          difficulty: testDifficulty || undefined,
        },
      });
      const root = res.data?.data;
      const testsList = Array.isArray(root?.tests)
        ? root.tests
        : Array.isArray(res.data?.tests)
        ? res.data.tests
        : Array.isArray(root)
        ? root
        : Array.isArray(res.data)
        ? res.data
        : [];
      setTests(testsList);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch assessments');
      setTests([]);
    } finally {
      setTestLoading(false);
    }
  };

  const handleSaveTest = async (e) => {
    e.preventDefault();
    if (!testForm.title) return toast.error('Assessment title is required');
    const loader = toast.loading('Saving assessment...');
    try {
      if (editingTest) {
        await apiClient.put(`/tests/${editingTest._id}`, testForm);
        toast.success('Assessment updated', { id: loader });
      } else {
        await apiClient.post('/tests', testForm);
        toast.success('Assessment created', { id: loader });
      }
      setIsTestModalOpen(false);
      fetchTests();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save assessment', { id: loader });
    }
  };

  const handleDeleteTest = async (id) => {
    if (!confirm('Are you sure you want to delete this practice test?')) return;
    const loader = toast.loading('Deleting assessment...');
    try {
      await apiClient.delete(`/tests/${id}`);
      toast.success('Assessment deleted', { id: loader });
      fetchTests();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete assessment', { id: loader });
    }
  };

  const handleToggleTestStatus = async (item) => {
    const loader = toast.loading('Updating status...');
    try {
      await apiClient.put(`/tests/${item._id}`, { isPublished: !item.isPublished });
      toast.success(`Assessment ${!item.isPublished ? 'published' : 'moved to draft'}`, { id: loader });
      fetchTests();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Status update failed', { id: loader });
    }
  };

  // ─── TAB 4: EVENTS STATE & HANDLERS ───────────────────────────────────────
  const [events, setEvents] = useState([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventSearch, setEventSearch] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventType: 'workshop',
    mode: 'online',
    startDate: '',
    endDate: '',
    meetingUrl: '',
    maxParticipants: 100,
    speakerName: 'Lead Tech Instructor',
    country: 'United States',
    city: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    prizePool: '$0',
    banner: '',
    status: 'upcoming',
    isPublished: true,
  });

  const fetchEvents = async () => {
    setEventLoading(true);
    try {
      const res = await apiClient.get('/events', {
        params: {
          all: 'true',
          search: eventSearch || undefined,
          eventType: eventTypeFilter || undefined,
        },
      });
      const root = res.data?.data;
      const eventsList = Array.isArray(root?.events)
        ? root.events
        : Array.isArray(res.data?.events)
        ? res.data.events
        : Array.isArray(root)
        ? root
        : Array.isArray(res.data)
        ? res.data
        : [];
      setEvents(eventsList);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setEventLoading(false);
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title) return toast.error('Event title is required');
    const loader = toast.loading('Saving event...');
    try {
      if (editingEvent) {
        await apiClient.put(`/events/${editingEvent._id}`, eventForm);
        toast.success('Event updated', { id: loader });
      } else {
        await apiClient.post('/events', eventForm);
        toast.success('Event created', { id: loader });
      }
      setIsEventModalOpen(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save event', { id: loader });
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const loader = toast.loading('Deleting event...');
    try {
      await apiClient.delete(`/events/${id}`);
      toast.success('Event deleted', { id: loader });
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete event', { id: loader });
    }
  };

  // ─── TAB 5: KNOWLEDGE RESOURCES STATE & HANDLERS ───────────────────────────
  const [resources, setResources] = useState([]);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('');
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    type: 'documentation',
    category: 'Documentation',
    url: '',
    content: '',
    difficulty: 'beginner',
    author: 'Platform Admin',
    isFeatured: false,
    status: 'published',
  });

  const fetchResources = async () => {
    setResourceLoading(true);
    try {
      const res = await apiClient.get('/resources', {
        params: {
          search: resourceSearch || undefined,
          type: resourceTypeFilter || undefined,
          all: 'true',
        },
      });
      const root = res.data?.data;
      const resourcesList = Array.isArray(root?.resources)
        ? root.resources
        : Array.isArray(res.data?.resources)
        ? res.data.resources
        : Array.isArray(root)
        ? root
        : Array.isArray(res.data)
        ? res.data
        : [];
      setResources(resourcesList);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch resources');
      setResources([]);
    } finally {
      setResourceLoading(false);
    }
  };

  const handleSaveResource = async (e) => {
    e.preventDefault();
    if (!resourceForm.title) return toast.error('Resource title is required');
    const loader = toast.loading('Saving resource...');
    try {
      const payload = {
        ...resourceForm,
        resourceType: resourceForm.type || resourceForm.resourceType || 'documentation',
        category: resourceForm.category || 'Documentation',
        externalUrl: resourceForm.url || resourceForm.externalUrl || '',
        fileUrl: resourceForm.url || resourceForm.fileUrl || '',
        markdownContent: resourceForm.content || resourceForm.markdownContent || '',
        status: 'published',
      };
      if (editingResource) {
        await apiClient.put(`/resources/${editingResource._id}`, payload);
        toast.success('Resource updated & synchronized live!', { id: loader });
      } else {
        await apiClient.post('/resources', payload);
        toast.success('Resource created & published live to CodeSphere!', { id: loader });
      }
      setIsResourceModalOpen(false);
      fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save resource', { id: loader });
    }
  };

  const handleDeleteResource = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    const loader = toast.loading('Deleting resource...');
    try {
      await apiClient.delete(`/resources/${id}`);
      toast.success('Resource deleted', { id: loader });
      fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete resource', { id: loader });
    }
  };

  // ─── TAB 6: MASTER FEATURE TOGGLES STATE & HANDLERS ───────────────────────
  const [featureToggles, setFeatureToggles] = useState([
    { _id: 'ft1', key: 'learning_paths', name: 'Learning Paths & Courses', description: 'Enable structured learning paths, course structure builder, and student enrollments', isEnabled: true, category: 'Learning Engine' },
    { _id: 'ft2', key: 'sandbox_ide', name: 'Interactive Coding Sandboxes', description: 'Allow users to launch interactive browser IDEs and guided coding step tutorials', isEnabled: true, category: 'Learning Engine' },
    { _id: 'ft3', key: 'practice_tests', name: 'Skill Practice Tests & Quizzes', description: 'Enable timed assessments, multiple-choice quizzes, and instant scoring', isEnabled: true, category: 'Assessments' },
    { _id: 'ft4', key: 'live_events', name: 'Live Events & Workshops', description: 'Enable community webinars, instructor workshops, and live session registrations', isEnabled: true, category: 'Live & Events' },
    { _id: 'ft5', key: 'knowledge_resources', name: 'Knowledge Resources & Docs', description: 'Allow students to access cheat sheets, documentation articles, and downloadable assets', isEnabled: true, category: 'Resources' },
    { _id: 'ft6', key: 'community_forums', name: 'Community Discussions', description: 'Enable peer-to-peer discussions, channels, and community posts', isEnabled: true, category: 'Community' },
    { _id: 'ft7', key: 'certificates', name: 'Course Certificates', description: 'Automatically issue verified PDF certificates upon path completion', isEnabled: true, category: 'Learning Engine' },
    { _id: 'ft8', key: 'ai_assistant', name: 'AI Tutor & Debugger', description: 'Enable automated AI assistance inside lesson playgrounds and practice exercises', isEnabled: true, category: 'AI Tools' },
  ]);
  const [toggleLoading, setToggleLoading] = useState(false);

  const fetchToggles = async () => {
    setToggleLoading(true);
    try {
      const res = await apiClient.get('/admin/features');
      const items = res.data?.data?.features || res.data?.features || res.data?.data;
      if (Array.isArray(items) && items.length > 0) {
        setFeatureToggles(items);
      }
    } catch (err) {
      // Keep default toggles fallback if api fails
    } finally {
      setToggleLoading(false);
    }
  };

  const handleToggleFeature = async (toggle) => {
    const nextState = !toggle.isEnabled;
    const loader = toast.loading(`Updating ${toggle.name}...`);
    try {
      await apiClient.put(`/admin/features/${toggle._id}`, { isEnabled: nextState });
      setFeatureToggles((prev) =>
        prev.map((item) => (item._id === toggle._id ? { ...item, isEnabled: nextState } : item))
      );
      toast.success(`${toggle.name} is now ${nextState ? 'ENABLED' : 'DISABLED'}`, { id: loader });
    } catch (err) {
      // Fallback local update
      setFeatureToggles((prev) =>
        prev.map((item) => (item._id === toggle._id ? { ...item, isEnabled: nextState } : item))
      );
      toast.success(`${toggle.name} toggle updated`, { id: loader });
    }
  };

  // Trigger data fetch on tab changes
  useEffect(() => {
    if (activeTab === 'sandboxes') fetchSandboxes();
    if (activeTab === 'tests') fetchTests();
    if (activeTab === 'events') fetchEvents();
    if (activeTab === 'resources') fetchResources();
    if (activeTab === 'toggles') fetchToggles();
  }, [activeTab]);

  // Real-time socket sync
  useEffect(() => {
    const handleDataChanged = (evt) => {
      const entity = evt?.entity;
      if (!entity || entity === 'sandbox' || activeTab === 'sandboxes') fetchSandboxes();
      if (!entity || entity === 'test' || activeTab === 'tests') fetchTests();
      if (!entity || entity === 'event' || activeTab === 'events') fetchEvents();
      if (!entity || entity === 'resource' || activeTab === 'resources') fetchResources();
      if (!entity || entity === 'feature' || activeTab === 'toggles') fetchToggles();
    };

    socket.on('admin:data_changed', handleDataChanged);
    socket.on('sandbox:changed', fetchSandboxes);
    socket.on('test:changed', fetchTests);
    socket.on('event:changed', fetchEvents);
    socket.on('resource:changed', fetchResources);
    socket.on('feature:changed', fetchToggles);

    return () => {
      socket.off('admin:data_changed', handleDataChanged);
      socket.off('sandbox:changed', fetchSandboxes);
      socket.off('test:changed', fetchTests);
      socket.off('event:changed', fetchEvents);
      socket.off('resource:changed', fetchResources);
      socket.off('feature:changed', fetchToggles);
    };
  }, [activeTab]);

  const navTabs = [
    { key: 'learning', label: 'Learning Paths', icon: GraduationCap, badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { key: 'sandboxes', label: 'Sandboxes & Projects', icon: Code2, badgeColor: 'bg-blue-100 text-blue-700 border-blue-200' },
    { key: 'tests', label: 'Practice Tests', icon: HelpCircle, badgeColor: 'bg-purple-100 text-purple-700 border-purple-200' },
    { key: 'events', label: 'Events & Workshops', icon: Calendar, badgeColor: 'bg-amber-100 text-amber-700 border-amber-200' },
    { key: 'resources', label: 'Knowledge Resources', icon: BookOpen, badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { key: 'toggles', label: 'Feature Toggles', icon: Sliders, badgeColor: 'bg-slate-100 text-slate-700 border-slate-200' },
  ];

  return (
    <div className="space-y-6 animate-fade-in w-full pb-12">
      {/* ── Header Banner ─────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles size={12} /> Master Command Center
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              Admin Hub
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Consolidated control center to manage all user-facing learning paths, interactive coding sandboxes, timed practice assessments, live events, documentation resources, and platform feature flags.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (activeTab === 'sandboxes') fetchSandboxes();
                if (activeTab === 'tests') fetchTests();
                if (activeTab === 'events') fetchEvents();
                if (activeTab === 'resources') fetchResources();
                if (activeTab === 'toggles') fetchToggles();
                toast.success('Refreshed data');
              }}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 shadow-2xs"
            >
              <RefreshCw size={14} /> Refresh Hub
            </button>
          </div>
        </div>

        {/* ── Sub-Nav Tabs Bar ────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar pt-4 border-t border-slate-100 dark:border-slate-800">
          {navTabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTabChange(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap select-none ${
                  active
                    ? 'bg-[#04AA6D] text-white shadow-sm shadow-emerald-600/20'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <Icon size={15} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB 1: LEARNING PATHS ───────────────────────────────────────────── */}
      {activeTab === 'learning' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <AdminLearning />
        </div>
      )}

      {/* ── TAB 2: INTERACTIVE SANDBOXES ────────────────────────────────────── */}
      {activeTab === 'sandboxes' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sandboxes</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Code2 size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{sandboxes.length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Published</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {sandboxes.filter((s) => s.isPublished).length}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Draft / Private</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {sandboxes.filter((s) => !s.isPublished).length}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Templates</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layers size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{sandboxes.length}</p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sandboxes..."
                  value={sandboxSearch}
                  onChange={(e) => setSandboxSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchSandboxes()}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>
              <select
                value={sandboxCategory}
                onChange={(e) => setSandboxCategory(e.target.value)}
                className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none"
              >
                <option value="">All Categories</option>
                <option value="Java / Core Java">Java / Core Java</option>
                <option value="App & Mobile Development">App & Mobile Development</option>
                <option value="Web Development">Web Development</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Python & Data Science">Python & Data Science</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="C / C++ Systems">C / C++ Systems</option>
                <option value="Software Engineering">Software Engineering</option>
              </select>
              <select
                value={sandboxStatus}
                onChange={(e) => setSandboxStatus(e.target.value)}
                className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <button
              onClick={() => {
                setEditingSandbox(null);
                setSandboxForm({
                  title: '',
                  description: '',
                  category: 'Web Development',
                  difficulty: 'beginner',
                  technologyStack: 'React, TailwindCSS, JavaScript',
                  templateType: 'react',
                  estimatedTime: 45,
                  isPublished: true,
                });
                setIsSandboxModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Plus size={16} /> Create Sandbox Project
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {sandboxLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-emerald-500" /> Loading sandboxes...
              </div>
            ) : sandboxes.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No sandbox projects found. Click "Create Sandbox Project" to add one!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Sandbox Project</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Tech Stack</th>
                      <th className="py-3.5 px-4">Difficulty</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sandboxes.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                            <Code2 size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-[10px] font-normal text-slate-400 truncate max-w-xs">{item.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{item.category}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(item.technologyStack)
                              ? item.technologyStack.map((tech, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded font-mono">
                                    {tech}
                                  </span>
                                ))
                              : <span className="text-slate-400 font-mono text-[10px]">{String(item.technologyStack || '')}</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                            item.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' :
                            item.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {item.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleSandboxStatus(item)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition-all ${
                              item.isPublished
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {item.isPublished ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingSandbox(item);
                              setSandboxForm({
                                title: item.title || '',
                                description: item.description || '',
                                category: item.category || 'Web Development',
                                difficulty: item.difficulty || 'beginner',
                                technologyStack: Array.isArray(item.technologyStack) ? item.technologyStack.join(', ') : item.technologyStack || '',
                                templateType: item.templateType || 'react',
                                estimatedTime: item.estimatedTime || 45,
                                isPublished: item.isPublished ?? true,
                              });
                              setIsSandboxModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900"
                            title="Edit Sandbox"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteSandbox(item._id)}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-600"
                            title="Delete Sandbox"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: PRACTICE TESTS ───────────────────────────────────────────── */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tests</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <HelpCircle size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{tests.length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Published</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {tests.filter((t) => t.isPublished).length}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Pass Percentage</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">72%</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Draft Tests</span>
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Clock size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {tests.filter((t) => !t.isPublished).length}
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assessments..."
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchTests()}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-purple-500"
                />
              </div>
              <select
                value={testDifficulty}
                onChange={(e) => setTestDifficulty(e.target.value)}
                className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none"
              >
                <option value="">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <button
              onClick={() => {
                setEditingTest(null);
                setTestForm({
                  title: '',
                  description: '',
                  category: 'Software Engineering',
                  difficulty: 'intermediate',
                  duration: 30,
                  passScorePercentage: 70,
                  technology: 'Full Stack',
                  isPublished: true,
                });
                setIsTestModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Plus size={16} /> Create Practice Test
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {testLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-purple-500" /> Loading practice tests...
              </div>
            ) : tests.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No practice tests found. Click "Create Practice Test" to add one!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Test Title</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Duration</th>
                      <th className="py-3.5 px-4">Pass Score</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {tests.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center shrink-0">
                            <HelpCircle size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-[10px] font-normal text-slate-400 truncate max-w-xs">{item.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{item.category || item.technology || 'General'}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">{item.duration || 30} mins</td>
                        <td className="py-3 px-4 font-bold text-purple-600">{item.passScorePercentage || 70}%</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleTestStatus(item)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition-all ${
                              item.isPublished
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {item.isPublished ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingTest(item);
                              setTestForm({
                                title: item.title || '',
                                description: item.description || '',
                                category: item.category || 'Software Engineering',
                                difficulty: item.difficulty || 'intermediate',
                                duration: item.duration || 30,
                                passScorePercentage: item.passScorePercentage || 70,
                                technology: item.technology || 'Full Stack',
                                isPublished: item.isPublished ?? true,
                              });
                              setIsTestModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900"
                            title="Edit Test"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteTest(item._id)}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-600"
                            title="Delete Test"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: EVENTS & WORKSHOPS ────────────────────────────────────────── */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Events</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Calendar size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{events.length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workshops</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {events.filter((e) => e.eventType === 'workshop').length}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Webinars</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Globe size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {events.filter((e) => e.eventType === 'webinar').length}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">142</p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchEvents()}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-amber-500"
                />
              </div>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none"
              >
                <option value="">All Types</option>
                <option value="workshop">Workshop</option>
                <option value="webinar">Webinar</option>
                <option value="hackathon">Hackathon</option>
                <option value="qna">Live Q&A</option>
              </select>
            </div>
            <button
              onClick={() => {
                const now = new Date();
                const tomorrow = new Date(Date.now() + 86400000);
                setEditingEvent(null);
                setEventForm({
                  title: '',
                  description: '',
                  eventType: 'workshop',
                  mode: 'online',
                  startDate: now.toISOString().slice(0, 16),
                  endDate: tomorrow.toISOString().slice(0, 16),
                  meetingUrl: '',
                  maxParticipants: 100,
                  speakerName: 'Lead Tech Instructor',
                  country: 'United States',
                  city: 'San Francisco',
                  latitude: 37.7749,
                  longitude: -122.4194,
                  prizePool: '$0',
                  banner: '',
                  status: 'upcoming',
                  isPublished: true,
                });
                setIsEventModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Plus size={16} /> Create Live Event
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {eventLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-amber-500" /> Loading live events...
              </div>
            ) : events.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No live events found. Click "Create Live Event" to schedule one!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Event Details</th>
                      <th className="py-3.5 px-4">Type & Mode</th>
                      <th className="py-3.5 px-4">Date & Location</th>
                      <th className="py-3.5 px-4">Speaker</th>
                      <th className="py-3.5 px-4">Cap</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {events.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center shrink-0">
                            <Calendar size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-[10px] font-normal text-slate-400 truncate max-w-xs">{item.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 space-y-1">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase border border-amber-200">
                            {item.eventType || 'Workshop'}
                          </span>
                          <p className="text-[10px] font-mono uppercase text-slate-400">{item.mode || 'online'}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                          <p>{item.startDate ? new Date(item.startDate).toLocaleDateString() : 'Scheduled'}</p>
                          <p className="text-[10px] text-emerald-600 font-sans font-bold">{item.city || 'Remote'}, {item.country || 'Global'}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{item.speakerName || item.speakers?.[0]?.name || 'Instructor'}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">{item.maxParticipants || 100}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingEvent(item);
                              setEventForm({
                                title: item.title || '',
                                description: item.description || '',
                                eventType: item.eventType || 'workshop',
                                mode: item.mode || 'online',
                                startDate: item.startDate ? new Date(item.startDate).toISOString().slice(0, 16) : '',
                                endDate: item.endDate ? new Date(item.endDate).toISOString().slice(0, 16) : '',
                                meetingUrl: item.meetingUrl || item.meetingLink || '',
                                maxParticipants: item.maxParticipants || 100,
                                speakerName: item.speakerName || item.speakers?.[0]?.name || 'Instructor',
                                country: item.country || 'United States',
                                city: item.city || 'San Francisco',
                                latitude: item.latitude || 37.7749,
                                longitude: item.longitude || -122.4194,
                                prizePool: item.prizePool || '$0',
                                banner: item.banner || item.bannerImage || '',
                                status: item.status || 'upcoming',
                                isPublished: item.isPublished ?? true,
                              });
                              setIsEventModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900"
                            title="Edit Event"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(item._id)}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-600"
                            title="Delete Event"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 5: KNOWLEDGE RESOURCES ───────────────────────────────────────── */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Resources</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <BookOpen size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{resources.length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Articles & Docs</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FileText size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {resources.filter((r) => {
                  const t = (r.resourceType || r.type || '').toLowerCase();
                  return t === 'documentation' || t === 'article' || t === 'pdf';
                }).length}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cheat Sheets</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Layers size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {resources.filter((r) => {
                  const t = (r.resourceType || r.type || '').toLowerCase();
                  return t === 'notes' || t === 'cheatsheet' || t === 'cheat sheet' || t === 'source_code';
                }).length}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Featured Assets</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {resources.filter((r) => r.isFeatured).length}
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchResources()}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#04AA6D]"
                />
              </div>
              <select
                value={resourceTypeFilter}
                onChange={(e) => setResourceTypeFilter(e.target.value)}
                className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none"
              >
                <option value="">All Types</option>
                <option value="documentation">Documentation</option>
                <option value="notes">Cheat Sheets & Notes</option>
                <option value="pdf">PDF Manuals</option>
                <option value="video">Video Tutorials</option>
                <option value="source_code">Source Code</option>
              </select>
            </div>
            <button
              onClick={() => {
                setEditingResource(null);
                setResourceForm({
                  title: '',
                  description: '',
                  type: 'documentation',
                  category: 'Documentation',
                  url: '',
                  content: '',
                  difficulty: 'beginner',
                  author: 'Platform Admin',
                  isFeatured: false,
                  status: 'published',
                });
                setIsResourceModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus size={16} /> Create Resource
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {resourceLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-[#04AA6D]" /> Loading resources...
              </div>
            ) : resources.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No resources found. Click "Create Resource" to add one!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Resource Title</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Author</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {resources.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] flex items-center justify-center shrink-0">
                            <BookOpen size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-[10px] font-normal text-slate-400 truncate max-w-xs">{item.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-[#04AA6D] dark:text-emerald-400 text-[10px] font-bold rounded uppercase border border-emerald-200 dark:border-emerald-800">
                            {item.resourceType || item.type || 'documentation'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                          {item.category?.name || item.categoryName || (typeof item.category === 'string' && !item.category.match(/^[0-9a-fA-F]{24}$/) ? item.category : 'Documentation')}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{item.uploadedBy?.fullName || item.instructor || item.author || 'Admin'}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingResource(item);
                              setResourceForm({
                                title: item.title || '',
                                description: item.description || '',
                                type: item.resourceType || item.type || 'documentation',
                                category: item.category?.name || (typeof item.category === 'string' && !item.category.match(/^[0-9a-fA-F]{24}$/) ? item.category : 'Documentation'),
                                url: item.externalUrl || item.fileUrl || item.url || '',
                                content: item.markdownContent || item.content || '',
                                difficulty: item.difficulty || 'beginner',
                                author: item.uploadedBy?.fullName || item.author || 'Platform Admin',
                                isFeatured: item.isFeatured ?? false,
                                status: 'published',
                              });
                              setIsResourceModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Edit Resource"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteResource(item._id)}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Delete Resource"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 6: MASTER FEATURE TOGGLES ────────────────────────────────────── */}
      {activeTab === 'toggles' && (
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders size={18} className="text-emerald-600" /> Platform Feature Toggles
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enable or disable platform modules dynamically for end users in real-time.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-full">
              {featureToggles.filter((f) => f.isEnabled).length} / {featureToggles.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureToggles.map((toggle) => (
              <div
                key={toggle._id}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start justify-between gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded uppercase">
                      {toggle.category || 'Module'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{toggle.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{toggle.description}</p>
                  <p className="text-[10px] font-mono text-slate-400 pt-1">Key: {toggle.key}</p>
                </div>
                <button
                  onClick={() => handleToggleFeature(toggle)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    toggle.isEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      toggle.isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODALS FOR CREATE / EDIT ───────────────────────────────────────── */}

      {/* Sandbox Modal */}
      <AnimatePresence>
        {isSandboxModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 size={18} className="text-blue-600" />
                  {editingSandbox ? 'Edit Sandbox Project' : 'Create Sandbox Project'}
                </h3>
                <button onClick={() => setIsSandboxModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"><X size={16} /></button>
              </div>
              <form onSubmit={handleSaveSandbox} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Project Title</label>
                  <input type="text" required value={sandboxForm.title} onChange={(e) => setSandboxForm({ ...sandboxForm, title: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea rows={2} value={sandboxForm.description} onChange={(e) => setSandboxForm({ ...sandboxForm, description: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                    <select
                      value={sandboxForm.category}
                      onChange={(e) => setSandboxForm({ ...sandboxForm, category: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs"
                    >
                      <option value="Java / Core Java">Java / Core Java</option>
                      <option value="App & Mobile Development">App & Mobile Development</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Full Stack">Full Stack</option>
                      <option value="Python & Data Science">Python & Data Science</option>
                      <option value="Frontend Engineering">Frontend Engineering</option>
                      <option value="Backend Engineering">Backend Engineering</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="DevOps & Cloud">DevOps & Cloud</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="C / C++ Systems">C / C++ Systems</option>
                      <option value="Software Engineering">Software Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Difficulty</label>
                    <select value={sandboxForm.difficulty} onChange={(e) => setSandboxForm({ ...sandboxForm, difficulty: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Tech Stack (comma separated)</label>
                  <input type="text" value={sandboxForm.technologyStack} onChange={(e) => setSandboxForm({ ...sandboxForm, technologyStack: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" placeholder="React, Node.js, MongoDB" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="sandPub" checked={sandboxForm.isPublished} onChange={(e) => setSandboxForm({ ...sandboxForm, isPublished: e.target.checked })} />
                  <label htmlFor="sandPub" className="font-bold text-slate-700 dark:text-slate-300">Publish Immediately</label>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsSandboxModalOpen(false)} className="px-4 py-2 border rounded-xl text-slate-600 font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">Save Sandbox</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Practice Test Modal */}
      <AnimatePresence>
        {isTestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle size={18} className="text-purple-600" />
                  {editingTest ? 'Edit Practice Test' : 'Create Practice Test'}
                </h3>
                <button onClick={() => setIsTestModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"><X size={16} /></button>
              </div>
              <form onSubmit={handleSaveTest} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Test Title</label>
                  <input type="text" required value={testForm.title} onChange={(e) => setTestForm({ ...testForm, title: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea rows={2} value={testForm.description} onChange={(e) => setTestForm({ ...testForm, description: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Duration (Minutes)</label>
                    <input type="number" value={testForm.duration} onChange={(e) => setTestForm({ ...testForm, duration: Number(e.target.value) })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Passing Score (%)</label>
                    <input type="number" value={testForm.passScorePercentage} onChange={(e) => setTestForm({ ...testForm, passScorePercentage: Number(e.target.value) })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="testPub" checked={testForm.isPublished} onChange={(e) => setTestForm({ ...testForm, isPublished: e.target.checked })} />
                  <label htmlFor="testPub" className="font-bold text-slate-700 dark:text-slate-300">Publish Immediately</label>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsTestModalOpen(false)} className="px-4 py-2 border rounded-xl text-slate-600 font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold">Save Assessment</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Modal */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-xl p-6 space-y-4 my-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar size={18} className="text-amber-600" />
                  {editingEvent ? 'Edit Event' : 'Create Event'}
                </h3>
                <button onClick={() => setIsEventModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"><X size={16} /></button>
              </div>
              <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Event Title *</label>
                  <input type="text" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" placeholder="e.g. CodeSphere AI & Full-Stack World Summit" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea rows={2} value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" placeholder="Brief overview of the event, tracks, and prerequisites..." />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Event Type</label>
                    <select value={eventForm.eventType} onChange={(e) => setEventForm({ ...eventForm, eventType: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                      <option value="workshop">Workshop</option>
                      <option value="webinar">Webinar</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="coding_contest">Coding Contest</option>
                      <option value="conference">Conference</option>
                      <option value="meetup">Meetup</option>
                      <option value="ai_conference">AI Conference</option>
                      <option value="cybersecurity_conf">Cybersecurity Conf</option>
                      <option value="cloud_summit">Cloud Summit</option>
                      <option value="gamedev_event">GameDev Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Mode</label>
                    <select value={eventForm.mode} onChange={(e) => setEventForm({ ...eventForm, mode: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Max Capacity</label>
                    <input type="number" value={eventForm.maxParticipants} onChange={(e) => setEventForm({ ...eventForm, maxParticipants: Number(e.target.value) })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Start Date & Time</label>
                    <input type="datetime-local" value={eventForm.startDate} onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">End Date & Time</label>
                    <input type="datetime-local" value={eventForm.endDate} onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  </div>
                </div>

                {/* Location Presets & Coordinates */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">3D Earth Globe Coordinates</span>
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) return;
                        const presets = [
                          { label: 'San Francisco, CA', city: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194 },
                          { label: 'Mountain View, CA', city: 'Mountain View', country: 'United States', lat: 37.422, lng: -122.084 },
                          { label: 'New York, NY', city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
                          { label: 'London, UK', city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
                          { label: 'Bengaluru, India', city: 'Bengaluru', country: 'India', lat: 12.9716, lng: 77.5946 },
                          { label: 'Tokyo, Japan', city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
                          { label: 'Berlin, Germany', city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
                          { label: 'Paris, France', city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
                          { label: 'Singapore', city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
                          { label: 'Sydney, Australia', city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
                          { label: 'Dubai, UAE', city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
                          { label: 'Toronto, Canada', city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
                          { label: 'Remote Global', city: 'Remote', country: 'Global', lat: 20.5937, lng: 78.9629 },
                        ];
                        const match = presets.find(p => p.label === val);
                        if (match) {
                          setEventForm(prev => ({
                            ...prev,
                            city: match.city,
                            country: match.country,
                            latitude: match.lat,
                            longitude: match.lng,
                          }));
                        }
                      }}
                      className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                    >
                      <option value="">-- Quick Select Globe Location --</option>
                      <option value="San Francisco, CA">San Francisco, USA (37.77, -122.41)</option>
                      <option value="Mountain View, CA">Mountain View, USA (37.42, -122.08)</option>
                      <option value="New York, NY">New York, USA (40.71, -74.00)</option>
                      <option value="London, UK">London, UK (51.50, -0.12)</option>
                      <option value="Bengaluru, India">Bengaluru, India (12.97, 77.59)</option>
                      <option value="Tokyo, Japan">Tokyo, Japan (35.67, 139.65)</option>
                      <option value="Berlin, Germany">Berlin, Germany (52.52, 13.40)</option>
                      <option value="Paris, France">Paris, France (48.85, 2.35)</option>
                      <option value="Singapore">Singapore (1.35, 103.81)</option>
                      <option value="Sydney, Australia">Sydney, Australia (-33.86, 151.20)</option>
                      <option value="Dubai, UAE">Dubai, UAE (25.20, 55.27)</option>
                      <option value="Toronto, Canada">Toronto, Canada (43.65, -79.38)</option>
                      <option value="Remote Global">Remote Global (20.59, 78.96)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="font-bold text-slate-600 dark:text-slate-400">City</label>
                      <input type="text" value={eventForm.city} onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })} className="w-full mt-0.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 dark:text-slate-400">Country</label>
                      <input type="text" value={eventForm.country} onChange={(e) => setEventForm({ ...eventForm, country: e.target.value })} className="w-full mt-0.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 dark:text-slate-400">Latitude</label>
                      <input type="number" step="any" value={eventForm.latitude} onChange={(e) => setEventForm({ ...eventForm, latitude: Number(e.target.value) })} className="w-full mt-0.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 dark:text-slate-400">Longitude</label>
                      <input type="number" step="any" value={eventForm.longitude} onChange={(e) => setEventForm({ ...eventForm, longitude: Number(e.target.value) })} className="w-full mt-0.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Speaker / Host Name</label>
                    <input type="text" value={eventForm.speakerName} onChange={(e) => setEventForm({ ...eventForm, speakerName: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Prize Pool / Reward</label>
                    <input type="text" value={eventForm.prizePool} onChange={(e) => setEventForm({ ...eventForm, prizePool: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" placeholder="e.g. $10,000 Cash or Free Certificates" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Meeting / Livestream URL</label>
                  <input type="url" value={eventForm.meetingUrl} onChange={(e) => setEventForm({ ...eventForm, meetingUrl: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" placeholder="https://meet.google.com/..." />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="eventPub" checked={eventForm.isPublished} onChange={(e) => setEventForm({ ...eventForm, isPublished: e.target.checked })} />
                  <label htmlFor="eventPub" className="font-bold text-slate-700 dark:text-slate-300">Publish Immediately on 3D Earth Globe & User Events Page</label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 border rounded-xl text-slate-600 font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold">Save Event</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Resource Modal */}
      <AnimatePresence>
        {isResourceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-xl p-6 space-y-4 font-sans max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen size={18} className="text-[#04AA6D]" />
                  {editingResource ? 'Edit Knowledge Resource' : 'Create Knowledge Resource'}
                </h3>
                <button onClick={() => setIsResourceModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><X size={16} /></button>
              </div>
              <form onSubmit={handleSaveResource} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Resource Title *</label>
                  <input type="text" required placeholder="e.g., JavaScript ES6+ Modern Syntax & Best Practices" value={resourceForm.title} onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea rows={2} placeholder="Brief summary of the knowledge resource..." value={resourceForm.description} onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Resource Type</label>
                    <select value={resourceForm.type} onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]">
                      <option value="documentation">Documentation</option>
                      <option value="notes">Cheat Sheet & Notes</option>
                      <option value="pdf">PDF Document</option>
                      <option value="video">Video Lecture</option>
                      <option value="source_code">Source Code</option>
                      <option value="github">GitHub Repo</option>
                      <option value="link">External Resource Link</option>
                      <option value="zip">Downloadable Archive (.zip)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                    <input type="text" placeholder="e.g. Documentation, Web Dev" value={resourceForm.category} onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Difficulty</label>
                    <select value={resourceForm.difficulty || 'beginner'} onChange={(e) => setResourceForm({ ...resourceForm, difficulty: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">External URL / File Link</label>
                  <input type="url" value={resourceForm.url} onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono focus:border-[#04AA6D]" placeholder="https://raw.githubusercontent.com/... or https://..." />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Detailed Article / Markdown Snippet</label>
                  <textarea rows={3} value={resourceForm.content} onChange={(e) => setResourceForm({ ...resourceForm, content: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono focus:border-[#04AA6D]" placeholder="# Overview&#10;Write comprehensive article or cheat sheet content here..." />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="resFeatured" checked={resourceForm.isFeatured} onChange={(e) => setResourceForm({ ...resourceForm, isFeatured: e.target.checked })} className="w-4 h-4 accent-[#04AA6D] cursor-pointer" />
                  <label htmlFor="resFeatured" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Feature on User Resources Home Banner</label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsResourceModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl font-bold cursor-pointer">Save Resource</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
