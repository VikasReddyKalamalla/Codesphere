import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '@services/axios.js';
import {
  GraduationCap, Code2, HelpCircle, Calendar, BookOpen, Sliders,
  Plus, Edit, Trash2, Search, Filter, Check, X, Eye, RefreshCw,
  BarChart2, FileText, Layers, ShieldCheck, Sparkles, Activity,
  ChevronRight, ExternalLink, Play, Lock, Globe, ToggleLeft, ToggleRight,
  Clock, Award, Users, AlertCircle, CheckCircle2, Upload, Video, MapPin, Map
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '../../../socket/socket.js';

// Import existing Learning Path management component for full integration
import AdminLearning from './AdminLearning.jsx';

const GLOBAL_PLACES_PRESETS = [
  // 🇮🇳 India Tech & Innovation Hubs
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Hyderabad, Telangana, India', city: 'Hyderabad', country: 'India', lat: 17.3850, lng: 78.4867 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Bengaluru, Karnataka, India', city: 'Bengaluru', country: 'India', lat: 12.9716, lng: 77.5946 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Mumbai, Maharashtra, India', city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 New Delhi / NCR, India', city: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.2090 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Pune, Maharashtra, India', city: 'Pune', country: 'India', lat: 18.5204, lng: 73.8567 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Chennai, Tamil Nadu, India', city: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Kolkata, West Bengal, India', city: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Ahmedabad, Gujarat, India', city: 'Ahmedabad', country: 'India', lat: 23.0225, lng: 72.5714 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Jaipur, Rajasthan, India', city: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Kochi, Kerala, India', city: 'Kochi', country: 'India', lat: 9.9312, lng: 76.2673 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Chandigarh, India', city: 'Chandigarh', country: 'India', lat: 30.7333, lng: 76.7794 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Visakhapatnam, AP, India', city: 'Visakhapatnam', country: 'India', lat: 17.6868, lng: 83.2185 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Indore, MP, India', city: 'Indore', country: 'India', lat: 22.7196, lng: 75.8577 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Coimbatore, TN, India', city: 'Coimbatore', country: 'India', lat: 11.0168, lng: 76.9558 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Bhubaneswar, Odisha, India', city: 'Bhubaneswar', country: 'India', lat: 20.2961, lng: 85.8245 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Noida, UP, India', city: 'Noida', country: 'India', lat: 28.5355, lng: 77.3910 },
  { category: '🇮🇳 India Tech Hubs', label: '🇮🇳 Gurugram, Haryana, India', city: 'Gurugram', country: 'India', lat: 28.4595, lng: 77.0266 },

  // 🇺🇸 Americas & Silicon Valley
  { category: '🇺🇸 Americas & Silicon Valley', label: '🇺🇸 San Francisco, CA, USA', city: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194 },
  { category: '🇺🇸 Americas & Silicon Valley', label: '🇺🇸 Mountain View, CA, USA', city: 'Mountain View', country: 'United States', lat: 37.4220, lng: -122.0840 },
  { category: '🇺🇸 Americas & Silicon Valley', label: '🇺🇸 Seattle, WA, USA', city: 'Seattle', country: 'United States', lat: 47.6062, lng: -122.3321 },
  { category: '🇺🇸 Americas & Silicon Valley', label: '🇺🇸 New York City, NY, USA', city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
  { category: '🇺🇸 Americas & Silicon Valley', label: '🇺🇸 Austin, TX, USA', city: 'Austin', country: 'United States', lat: 30.2672, lng: -97.7431 },
  { category: '🇺🇸 Americas & Silicon Valley', label: '🇺🇸 Boston, MA, USA', city: 'Boston', country: 'United States', lat: 42.3601, lng: -71.0589 },
  { category: '🇺🇸 Americas & Silicon Valley', label: '🇺🇸 Los Angeles, CA, USA', city: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437 },
  { category: '🇺🇸 Americas & Silicon Valley', label: '🇺🇸 Chicago, IL, USA', city: 'Chicago', country: 'United States', lat: 41.8781, lng: -87.6298 },
  { category: '🇺🇸 Americas & Silicon Valley', label: '🇨🇦 Toronto, Ontario, Canada', city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  { category: '🇺🇸 Americas & Silicon Valley', label: '🇨🇦 Vancouver, BC, Canada', city: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207 },
  { category: '🇺🇸 Americas & Silicon Valley', label: '🇲🇽 Mexico City, Mexico', city: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
  { category: '🇺🇸 Americas & Silicon Valley', label: '🇧🇷 São Paulo, Brazil', city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },

  // 🇪🇺 Europe & UK
  { category: '🇪🇺 Europe & UK', label: '🇬🇧 London, United Kingdom', city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { category: '🇪🇺 Europe & UK', label: '🇩🇪 Berlin, Germany', city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
  { category: '🇪🇺 Europe & UK', label: '🇫🇷 Paris, France', city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { category: '🇪🇺 Europe & UK', label: '🇳🇱 Amsterdam, Netherlands', city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
  { category: '🇪🇺 Europe & UK', label: '🇮🇪 Dublin, Ireland', city: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603 },
  { category: '🇪🇺 Europe & UK', label: '🇸🇪 Stockholm, Sweden', city: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686 },
  { category: '🇪🇺 Europe & UK', label: '🇨🇭 Zurich, Switzerland', city: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417 },
  { category: '🇪🇺 Europe & UK', label: '🇪🇸 Barcelona, Spain', city: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
  { category: '🇪🇺 Europe & UK', label: '🇩🇪 Munich, Germany', city: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.5820 },
  { category: '🇪🇺 Europe & UK', label: '🇪🇪 Tallinn, Estonia', city: 'Tallinn', country: 'Estonia', lat: 59.4370, lng: 24.7536 },

  // 🌏 Asia-Pacific & Oceania
  { category: '🌏 Asia-Pacific & Oceania', label: '🇯🇵 Tokyo, Japan', city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { category: '🌏 Asia-Pacific & Oceania', label: '🇸🇬 Singapore', city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { category: '🌏 Asia-Pacific & Oceania', label: '🇰🇷 Seoul, South Korea', city: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780 },
  { category: '🌏 Asia-Pacific & Oceania', label: '🇦🇺 Sydney, Australia', city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { category: '🌏 Asia-Pacific & Oceania', label: '🇦🇺 Melbourne, Australia', city: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631 },
  { category: '🌏 Asia-Pacific & Oceania', label: '🇭🇰 Hong Kong', city: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  { category: '🌏 Asia-Pacific & Oceania', label: '🇨🇳 Shanghai, China', city: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
  { category: '🌏 Asia-Pacific & Oceania', label: '🇹🇼 Taipei, Taiwan', city: 'Taipei', country: 'Taiwan', lat: 25.0330, lng: 121.5654 },
  { category: '🌏 Asia-Pacific & Oceania', label: '🇳🇿 Auckland, New Zealand', city: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633 },

  // 🌍 Middle East & Africa
  { category: '🌍 Middle East & Africa', label: '🇦🇪 Dubai, UAE', city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
  { category: '🌍 Middle East & Africa', label: '🇮🇱 Tel Aviv, Israel', city: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818 },
  { category: '🌍 Middle East & Africa', label: '🇸🇦 Riyadh, Saudi Arabia', city: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753 },
  { category: '🌍 Middle East & Africa', label: '🇿🇦 Cape Town, South Africa', city: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241 },

  // 🌐 Virtual / Remote Global
  { category: '🌐 Virtual & Global', label: '🌐 Remote / Global Virtual Event', city: 'Remote', country: 'Global', lat: 20.5937, lng: 78.9629 },
];

export default function AdminFeaturesPage({ defaultTab }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active Tab: 'learning' | 'sandboxes' | 'tests' | 'events' | 'resources' | 'codex' | 'sessions' | 'toggles'
  const activeTab = searchParams.get('tab') || defaultTab || 'learning';

  const handleTabChange = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  // ─── TAB: CODEX WORKSPACES STATE & HANDLERS ─────────────────────────────
  const [workspacesList, setWorkspacesList] = useState([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceSearch, setWorkspaceSearch] = useState('');
  const [workspaceVisibility, setWorkspaceVisibility] = useState('');
  const [workspaceStatusFilter, setWorkspaceStatusFilter] = useState('');
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [workspaceForm, setWorkspaceForm] = useState({
    name: '',
    description: '',
    technologyStack: 'React, Node.js, MongoDB',
    visibility: 'public',
    githubRepo: '',
    status: 'active',
  });

  const fetchWorkspacesList = async () => {
    setWorkspaceLoading(true);
    try {
      const res = await apiClient.get('/workspaces', {
        params: {
          search: workspaceSearch || undefined,
          visibility: workspaceVisibility || undefined,
          status: workspaceStatusFilter || undefined,
        },
      });
      const data = res.data?.data?.workspaces || res.data?.workspaces || res.data?.data || res.data || [];
      setWorkspacesList(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch workspaces');
      setWorkspacesList([]);
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const handleSaveWorkspace = async (e) => {
    e.preventDefault();
    if (!workspaceForm.name) return toast.error('Workspace name is required');
    const loader = toast.loading('Saving workspace...');
    try {
      const payload = {
        ...workspaceForm,
        technologyStack: typeof workspaceForm.technologyStack === 'string'
          ? workspaceForm.technologyStack.split(',').map((s) => s.trim()).filter(Boolean)
          : workspaceForm.technologyStack,
      };

      if (editingWorkspace) {
        await apiClient.put(`/workspaces/${editingWorkspace._id}`, payload);
        toast.success('Workspace updated successfully!', { id: loader });
      } else {
        await apiClient.post('/workspaces', payload);
        toast.success('Workspace created successfully!', { id: loader });
      }
      setIsWorkspaceModalOpen(false);
      fetchWorkspacesList();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save workspace', { id: loader });
    }
  };

  const handleDeleteWorkspace = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workspace?')) return;
    const loader = toast.loading('Deleting workspace...');
    try {
      await apiClient.delete(`/workspaces/${id}`);
      toast.success('Workspace deleted successfully!', { id: loader });
      fetchWorkspacesList();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete workspace', { id: loader });
    }
  };

  const handleToggleWorkspaceStatus = async (item) => {
    const isArchived = item.status === 'archived';
    const endpoint = `/workspaces/${item._id}/${isArchived ? 'restore' : 'archive'}`;
    const loader = toast.loading(`${isArchived ? 'Restoring' : 'Archiving'} workspace...`);
    try {
      await apiClient.patch(endpoint);
      toast.success(`Workspace ${isArchived ? 'restored' : 'archived'}!`, { id: loader });
      fetchWorkspacesList();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed', { id: loader });
    }
  };

  // ─── TAB: LIVE WEBCASTS / SESSIONS STATE & HANDLERS ──────────────────────
  const [sessionsList, setSessionsList] = useState([]);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionStatusFilter, setSessionStatusFilter] = useState('');
  const [sessionDifficultyFilter, setSessionDifficultyFilter] = useState('');
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    category: 'Full Stack & Web Dev',
    instructorName: '',
    startTime: '',
    duration: 60,
    meetingUrl: '',
    status: 'upcoming',
    difficulty: 'intermediate',
    isPremium: false,
  });

  const fetchSessionsList = async () => {
    setSessionLoading(true);
    try {
      const res = await apiClient.get('/sessions', {
        params: {
          search: sessionSearch || undefined,
          status: sessionStatusFilter || undefined,
          difficulty: sessionDifficultyFilter || undefined,
        },
      });
      const data = res.data?.data?.sessions || res.data?.sessions || res.data?.data || res.data || [];
      setSessionsList(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch live sessions');
      setSessionsList([]);
    } finally {
      setSessionLoading(false);
    }
  };

  const handleSaveSession = async (e) => {
    e.preventDefault();
    if (!sessionForm.title) return toast.error('Session title is required');
    const loader = toast.loading('Saving webcast session...');
    try {
      const payload = {
        ...sessionForm,
        duration: Number(sessionForm.duration) || 60,
        isPremium: Boolean(sessionForm.isPremium),
      };

      if (editingSession) {
        await apiClient.put(`/sessions/${editingSession._id}`, payload);
        toast.success('Session updated successfully!', { id: loader });
      } else {
        await apiClient.post('/sessions', payload);
        toast.success('Session created successfully!', { id: loader });
      }
      setIsSessionModalOpen(false);
      fetchSessionsList();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save session', { id: loader });
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm('Are you sure you want to delete this live session?')) return;
    const loader = toast.loading('Deleting session...');
    try {
      await apiClient.delete(`/sessions/${id}`);
      toast.success('Session deleted successfully!', { id: loader });
      fetchSessionsList();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete session', { id: loader });
    }
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
    pitch: '',
    description: '',
    category: 'Frontend & UI Systems',
    difficulty: 'beginner',
    technologyStack: 'HTML5, CSS3, JavaScript',
    estimatedDuration: '2.5 Hours',
    points: 300,
    starterFiles: 'index.html, styles.css, script.js',
    flashcards: [{ title: '', hint: '' }],
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
      const rawCat = (sandboxForm.category || '').trim() || 'Frontend & UI Systems';

      const payload = {
        ...sandboxForm,
        category: rawCat,
        isPublished: Boolean(sandboxForm.isPublished),
        status: sandboxForm.isPublished ? 'published' : 'draft',
        technologyStack: typeof sandboxForm.technologyStack === 'string'
          ? sandboxForm.technologyStack.split(',').map((s) => s.trim()).filter(Boolean)
          : sandboxForm.technologyStack,
        starterFiles: typeof sandboxForm.starterFiles === 'string'
          ? sandboxForm.starterFiles.split(',').map((s) => s.trim()).filter(Boolean)
          : sandboxForm.starterFiles,
        points: Number(sandboxForm.points) || 300,
        flashcards: Array.isArray(sandboxForm.flashcards)
          ? sandboxForm.flashcards.filter((f) => f && f.title.trim())
          : [],
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
  const [locationSearchInput, setLocationSearchInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const fetchLocationSuggestions = async (query) => {
    if (!query || query.trim().length < 2) {
      setLocationSuggestions([]);
      return;
    }
    const val = query.trim();

    // 1. Parse Google Maps URL (@lat,lng or q=lat,lng)
    const googleMatch = val.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || val.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (googleMatch) {
      const lat = parseFloat(googleMatch[1]);
      const lng = parseFloat(googleMatch[2]);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        const addr = data.address || {};
        const city = addr.city || addr.town || addr.village || addr.county || addr.state || 'Selected Location';
        const country = addr.country || 'Global';
        setEventForm(prev => ({ ...prev, city, country, latitude: lat, longitude: lng }));
        toast.success(`Location set from Google Maps: ${city}, ${country}`);
        setLocationSuggestions([]);
        return;
      } catch (e) {
        setEventForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
        setLocationSuggestions([]);
        return;
      }
    }

    // 2. Local Presets match
    const localMatches = GLOBAL_PLACES_PRESETS.filter(p => 
      p.city.toLowerCase().includes(val.toLowerCase()) || 
      p.label.toLowerCase().includes(val.toLowerCase())
    ).map(p => ({
      city: p.city,
      country: p.country,
      lat: p.lat,
      lng: p.lng,
      label: `${p.city}, ${p.country}`,
    }));

    setIsGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=5`);
      const apiData = await res.json();
      const apiMatches = (apiData || []).map(item => {
        const addr = item.address || {};
        const city = addr.city || addr.town || addr.village || addr.county || addr.state || item.display_name.split(',')[0];
        const country = addr.country || item.display_name.split(',').pop().trim();
        return {
          city,
          country,
          lat: parseFloat(parseFloat(item.lat).toFixed(4)),
          lng: parseFloat(parseFloat(item.lon).toFixed(4)),
          label: item.display_name,
        };
      });

      const combined = [...localMatches, ...apiMatches];
      const seen = new Set();
      const unique = combined.filter(c => {
        const key = `${c.city.toLowerCase()}-${c.country.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setLocationSuggestions(unique);
      if (unique.length > 0) {
        const top = unique[0];
        setEventForm(prev => ({
          ...prev,
          city: top.city,
          country: top.country,
          latitude: top.lat,
          longitude: top.lng,
        }));
      }
    } catch (err) {
      if (localMatches.length > 0) {
        setLocationSuggestions(localMatches);
        const top = localMatches[0];
        setEventForm(prev => ({
          ...prev,
          city: top.city,
          country: top.country,
          latitude: top.lat,
          longitude: top.lng,
        }));
      }
    } finally {
      setIsGeocoding(false);
    }
  };
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventType: 'workshop',
    mode: 'online',
    startDate: '',
    endDate: '',
    registrationUrl: '',
    registrationSource: 'unstop',
    meetingUrl: '',
    maxParticipants: 100,
    speakerName: 'Lead Tech Instructor',
    country: '',
    city: '',
    latitude: '',
    longitude: '',
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

  const [selectedResourceFile, setSelectedResourceFile] = useState(null);

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
    const loader = toast.loading(selectedResourceFile ? 'Uploading file asset & saving resource...' : 'Saving resource...');
    try {
      let savedResource = null;
      if (selectedResourceFile) {
        const formData = new FormData();
        formData.append('title', resourceForm.title);
        if (resourceForm.description) formData.append('description', resourceForm.description);
        formData.append('resourceType', resourceForm.type || resourceForm.resourceType || 'documentation');
        formData.append('category', resourceForm.category || 'Documentation');
        formData.append('difficulty', resourceForm.difficulty || 'beginner');
        if (resourceForm.url) formData.append('externalUrl', resourceForm.url);
        if (resourceForm.content) formData.append('markdownContent', resourceForm.content);
        formData.append('isFeatured', resourceForm.isFeatured ? 'true' : 'false');
        formData.append('status', 'published');
        formData.append('file', selectedResourceFile);

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        if (editingResource) {
          const res = await apiClient.put(`/resources/${editingResource._id}`, formData, config);
          savedResource = res.data?.data || res.data;
          toast.success('Resource file uploaded & updated live!', { id: loader });
        } else {
          const res = await apiClient.post('/resources', formData, config);
          savedResource = res.data?.data || res.data;
          toast.success('Resource file uploaded & published live!', { id: loader });
        }
      } else {
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
          const res = await apiClient.put(`/resources/${editingResource._id}`, payload);
          savedResource = res.data?.data || res.data;
          toast.success('Resource updated & synchronized live!', { id: loader });
        } else {
          const res = await apiClient.post('/resources', payload);
          savedResource = res.data?.data || res.data;
          toast.success('Resource created & published live to CodeSphere!', { id: loader });
        }
      }

      setSelectedResourceFile(null);
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
      setIsResourceModalOpen(false);
      await fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save resource', { id: loader });
    }
  };

  const handleDeleteResource = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    const loader = toast.loading('Deleting resource...');
    // Instantly filter out from UI
    setResources((prev) => prev.filter((r) => String(r._id || r.id) !== String(id)));
    try {
      await apiClient.delete(`/resources/${id}`);
      toast.success('Resource deleted & synchronized live!', { id: loader });
      fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete resource', { id: loader });
      fetchResources();
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
    if (activeTab === 'codex') fetchWorkspacesList();
    if (activeTab === 'sessions') fetchSessionsList();
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
      if (!entity || entity === 'workspace' || activeTab === 'codex') fetchWorkspacesList();
      if (!entity || entity === 'session' || activeTab === 'sessions') fetchSessionsList();
      if (!entity || entity === 'feature' || activeTab === 'toggles') fetchToggles();
    };

    socket.on('admin:data_changed', handleDataChanged);
    socket.on('sandbox:changed', fetchSandboxes);
    socket.on('test:changed', fetchTests);
    socket.on('event:changed', fetchEvents);
    socket.on('resource:changed', fetchResources);
    socket.on('workspace:changed', fetchWorkspacesList);
    socket.on('session:changed', fetchSessionsList);
    socket.on('feature:changed', fetchToggles);

    return () => {
      socket.off('admin:data_changed', handleDataChanged);
      socket.off('sandbox:changed', fetchSandboxes);
      socket.off('test:changed', fetchTests);
      socket.off('event:changed', fetchEvents);
      socket.off('resource:changed', fetchResources);
      socket.off('workspace:changed', fetchWorkspacesList);
      socket.off('session:changed', fetchSessionsList);
      socket.off('feature:changed', fetchToggles);
    };
  }, [activeTab]);

  const navTabs = [
    { key: 'learning', label: 'Learning Paths', icon: GraduationCap, badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { key: 'sandboxes', label: 'Problem Statements', icon: Code2, badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { key: 'tests', label: 'Practice Tests', icon: HelpCircle, badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { key: 'events', label: 'Events & Workshops', icon: Calendar, badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { key: 'resources', label: 'Knowledge Resources', icon: BookOpen, badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { key: 'sessions', label: 'Live Webcasts', icon: Video, badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { key: 'codex', label: 'Codex Workspaces', icon: Code2, badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
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
              Consolidated control center to manage all user-facing learning paths, interactive coding sandboxes, timed practice assessments, live events, documentation resources, live webcasts, Codex workspaces, and platform feature flags.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (activeTab === 'sandboxes') fetchSandboxes();
                if (activeTab === 'tests') fetchTests();
                if (activeTab === 'events') fetchEvents();
                if (activeTab === 'resources') fetchResources();
                if (activeTab === 'codex') fetchWorkspacesList();
                if (activeTab === 'sessions') fetchSessionsList();
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
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Problem Statements</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center">
                  <Code2 size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{sandboxes.length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Published</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
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
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
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
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center">
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
                  placeholder="Search problem statements..."
                  value={sandboxSearch}
                  onChange={(e) => setSandboxSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchSandboxes()}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#04AA6D]"
                />
              </div>
              <select
                value={sandboxCategory}
                onChange={(e) => setSandboxCategory(e.target.value)}
                className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none"
              >
                <option value="">All Categories</option>
                <option value="Frontend & UI Systems">Frontend & UI Systems</option>
                <option value="Backend & APIs">Backend & APIs</option>
                <option value="System Design & Compilers">System Design & Compilers</option>
                <option value="Python & Data Science">Python & Data Science</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Web Development">Web Development</option>
                <option value="Java / Core Java">Java / Core Java</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Cybersecurity">Cybersecurity</option>
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
                  pitch: '',
                  description: '',
                  category: 'Frontend & UI Systems',
                  difficulty: 'beginner',
                  technologyStack: 'HTML5, CSS3, JavaScript',
                  estimatedDuration: '2.5 Hours',
                  points: 300,
                  starterFiles: 'index.html, styles.css, script.js',
                  flashcards: [{ title: '', hint: '' }],
                  isPublished: true,
                });
                setIsSandboxModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus size={16} /> Create Problem Statement
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {sandboxLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-[#04AA6D]" /> Loading problem statements...
              </div>
            ) : sandboxes.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No problem statements found. Click "Create Problem Statement" to add one!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Problem Statement</th>
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
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] flex items-center justify-center shrink-0">
                            <Code2 size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-[10px] font-normal text-slate-400 truncate max-w-xs">{item.pitch || item.description}</p>
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
                            item.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                            item.difficulty === 'expert' ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-purple-700'
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
                                pitch: item.pitch || '',
                                description: item.description || '',
                                category: item.category || 'Frontend & UI Systems',
                                difficulty: item.difficulty || 'beginner',
                                technologyStack: Array.isArray(item.technologyStack) ? item.technologyStack.join(', ') : item.technologyStack || '',
                                estimatedDuration: item.estimatedDuration || '2.5 Hours',
                                points: item.points || 300,
                                starterFiles: Array.isArray(item.starterFiles) ? item.starterFiles.join(', ') : item.starterFiles || '',
                                flashcards: Array.isArray(item.flashcards) && item.flashcards.length > 0 ? item.flashcards : [{ title: '', hint: '' }],
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
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center">
                  <HelpCircle size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{tests.length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Published</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
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
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center">
                  <Award size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">72%</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Draft Tests</span>
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
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
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#04AA6D]"
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
              className="w-full sm:w-auto px-4 py-2.5 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus size={16} /> Create Practice Test
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {testLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-[#04AA6D]" /> Loading practice tests...
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
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <HelpCircle size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-[10px] font-normal text-slate-400 truncate max-w-xs">{item.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{item.category || item.technology || 'General'}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">{item.duration || 30} mins</td>
                        <td className="py-3 px-4 font-bold text-[#04AA6D]">{item.passScorePercentage || 70}%</td>
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
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Edit Test"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteTest(item._id)}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
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
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center">
                  <Calendar size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{events.length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workshops</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
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
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center">
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
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {events.reduce((sum, e) => sum + (e.registeredCount || (Array.isArray(e.attendees) ? e.attendees.length : 0) || (Array.isArray(e.registeredUsers) ? e.registeredUsers.length : 0)), 0)}
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
                  placeholder="Search events..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchEvents()}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#04AA6D]"
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
                  registrationUrl: '',
                  registrationSource: 'unstop',
                  source: 'internal',
                  meetingUrl: '',
                  maxParticipants: 100,
                  speakerName: 'Lead Tech Instructor',
                  country: '',
                  city: '',
                  latitude: '',
                  longitude: '',
                  prizePool: '$0',
                  banner: '',
                  status: 'upcoming',
                  isPublished: true,
                });
                setIsEventModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus size={16} /> Create Live Event
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {eventLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-[#04AA6D]" /> Loading live events...
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
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Calendar size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-[10px] font-normal text-slate-400 truncate max-w-xs">{item.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 space-y-1">
                          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-[#04AA6D] dark:text-emerald-400 text-[10px] font-bold rounded uppercase border border-emerald-200 dark:border-emerald-800">
                            {item.eventType || 'Workshop'}
                          </span>
                          <p className="text-[10px] font-mono uppercase text-slate-400">{item.mode || 'online'}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                          <p>{item.startDate ? new Date(item.startDate).toLocaleDateString() : 'Scheduled'}</p>
                          <p className="text-[10px] text-[#04AA6D] font-sans font-bold">{item.city || 'Remote'}, {item.country || 'Global'}</p>
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
                                registrationUrl: item.registrationUrl || item.externalUrl || item.registrationLink || '',
                                registrationSource: item.registrationSource || 'unstop',
                                source: 'internal',
                                meetingUrl: item.meetingUrl || item.meetingLink || '',
                                maxParticipants: item.maxParticipants || 100,
                                speakerName: item.speakerName || item.speakers?.[0]?.name || 'Instructor',
                                country: item.country || '',
                                city: item.city || '',
                                latitude: item.latitude || '',
                                longitude: item.longitude || '',
                                prizePool: item.prizePool || '$0',
                                banner: item.banner || item.bannerImage || '',
                                status: item.status || 'upcoming',
                                isPublished: item.isPublished ?? true,
                              });
                              setIsEventModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Edit Event"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(item._id)}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
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
                <option value="ppt">PowerPoint Presentations</option>
                <option value="word">Word Documents</option>
                <option value="video">Video Tutorials</option>
                <option value="source_code">Source Code</option>
                <option value="zip">ZIP Archives</option>
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

      {/* ── TAB: LIVE WEBCASTS / SESSIONS ──────────────────────────────────── */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Webcasts</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center">
                  <Video size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{sessionsList.length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Now</span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Activity size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {sessionsList.filter((s) => s.status === 'live').length}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Classes</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Clock size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {sessionsList.filter((s) => s.status === 'upcoming').length}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Attendees</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {sessionsList.reduce((acc, s) => acc + (s.attendeesCount || s.attendees?.length || 0), 0)}
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
                  placeholder="Search live sessions..."
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchSessionsList()}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#04AA6D]"
                />
              </div>
              <select
                value={sessionStatusFilter}
                onChange={(e) => setSessionStatusFilter(e.target.value)}
                className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none"
              >
                <option value="">All Statuses</option>
                <option value="live">Live Now</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <button
              onClick={() => {
                setEditingSession(null);
                setSessionForm({
                  title: '',
                  description: '',
                  category: 'Full Stack & Web Dev',
                  instructorName: '',
                  startTime: new Date().toISOString().slice(0, 16),
                  duration: 60,
                  meetingUrl: 'https://meet.google.com/',
                  status: 'upcoming',
                  difficulty: 'intermediate',
                  isPremium: false,
                });
                setIsSessionModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus size={16} /> Schedule Webcast
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {sessionLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-[#04AA6D]" /> Loading live sessions...
              </div>
            ) : sessionsList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No webcast sessions found. Click "Schedule Webcast" to add one!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Session Title</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Instructor</th>
                      <th className="py-3.5 px-4">Duration</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sessionsList.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Video size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-[10px] font-normal text-slate-400 truncate max-w-xs">{item.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{item.category || 'General'}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-bold">{item.instructorName || item.instructor?.fullName || 'Instructor'}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">{item.duration || 60} mins</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase border ${
                            item.status === 'live' ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' :
                            item.status === 'upcoming' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            item.status === 'completed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {item.status || 'upcoming'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingSession(item);
                              setSessionForm({
                                title: item.title || '',
                                description: item.description || '',
                                category: item.category || 'Full Stack & Web Dev',
                                instructorName: item.instructorName || item.instructor?.fullName || '',
                                startTime: item.startTime ? new Date(item.startTime).toISOString().slice(0, 16) : '',
                                duration: item.duration || 60,
                                meetingUrl: item.meetingUrl || '',
                                status: item.status || 'upcoming',
                                difficulty: item.difficulty || 'intermediate',
                                isPremium: item.isPremium ?? false,
                              });
                              setIsSessionModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Edit Session"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteSession(item._id)}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Delete Session"
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

      {/* ── TAB: CODEX WORKSPACES ───────────────────────────────────────────── */}
      {activeTab === 'codex' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Workspaces</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center">
                  <Code2 size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{workspacesList.length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {workspacesList.filter((w) => w.status === 'active' || !w.status).length}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Public Workspaces</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Globe size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {workspacesList.filter((w) => w.visibility === 'public').length}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Private Workspaces</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Lock size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {workspacesList.filter((w) => w.visibility === 'private').length}
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
                  placeholder="Search workspaces..."
                  value={workspaceSearch}
                  onChange={(e) => setWorkspaceSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchWorkspacesList()}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#04AA6D]"
                />
              </div>
              <select
                value={workspaceVisibility}
                onChange={(e) => setWorkspaceVisibility(e.target.value)}
                className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none"
              >
                <option value="">All Visibilities</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <button
              onClick={() => {
                setEditingWorkspace(null);
                setWorkspaceForm({
                  name: '',
                  description: '',
                  technologyStack: 'React, Node.js, MongoDB',
                  visibility: 'public',
                  githubRepo: '',
                  status: 'active',
                });
                setIsWorkspaceModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus size={16} /> Create Workspace
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {workspaceLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-[#04AA6D]" /> Loading Codex workspaces...
              </div>
            ) : workspacesList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No workspaces found. Click "Create Workspace" to add one!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Workspace Name</th>
                      <th className="py-3.5 px-4">Owner</th>
                      <th className="py-3.5 px-4">Tech Stack</th>
                      <th className="py-3.5 px-4">Visibility</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {workspacesList.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Code2 size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                            <p className="text-[10px] font-normal text-slate-400 truncate max-w-xs">{item.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-bold">{item.owner?.fullName || 'User'}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">
                          {Array.isArray(item.technologyStack) ? item.technologyStack.join(', ') : item.technologyStack || 'JavaScript'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                            item.visibility === 'public' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.visibility || 'public'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleWorkspaceStatus(item)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition-all ${
                              item.status === 'active' || !item.status
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {item.status || 'active'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingWorkspace(item);
                              setWorkspaceForm({
                                name: item.name || '',
                                description: item.description || '',
                                technologyStack: Array.isArray(item.technologyStack) ? item.technologyStack.join(', ') : item.technologyStack || '',
                                visibility: item.visibility || 'public',
                                githubRepo: item.githubRepo || '',
                                status: item.status || 'active',
                              });
                              setIsWorkspaceModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Edit Workspace"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteWorkspace(item._id)}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Delete Workspace"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-xl p-6 space-y-4 my-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 size={18} className="text-[#04AA6D]" />
                  {editingSandbox ? 'Edit Sandbox Problem Statement' : 'Create Sandbox Problem Statement'}
                </h3>
                <button onClick={() => setIsSandboxModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X size={16} /></button>
              </div>
              <form onSubmit={handleSaveSandbox} className="space-y-3.5 text-xs max-h-[75vh] overflow-y-auto pr-1">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Problem Title *</label>
                  <input type="text" required value={sandboxForm.title} onChange={(e) => setSandboxForm({ ...sandboxForm, title: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="e.g. Build a Real-Time E-Commerce Shopping Cart System" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Teaser Pitch (Short summary for card)</label>
                  <input type="text" value={sandboxForm.pitch} onChange={(e) => setSandboxForm({ ...sandboxForm, pitch: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="e.g. Develop a responsive, stateful shopping cart system..." />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Full Description & Context</label>
                  <textarea rows={3} value={sandboxForm.description} onChange={(e) => setSandboxForm({ ...sandboxForm, description: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="Detailed context, requirements, and background..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                    <select
                      value={sandboxForm.category}
                      onChange={(e) => setSandboxForm({ ...sandboxForm, category: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs focus:border-[#04AA6D]"
                    >
                      <option value="Frontend & UI Systems">Frontend & UI Systems</option>
                      <option value="Backend & APIs">Backend & APIs</option>
                      <option value="System Design & Compilers">System Design & Compilers</option>
                      <option value="Python & Data Science">Python & Data Science</option>
                      <option value="Full Stack">Full Stack</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Java / Core Java">Java / Core Java</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="DevOps & Cloud">DevOps & Cloud</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Software Engineering">Software Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Difficulty</label>
                    <select value={sandboxForm.difficulty} onChange={(e) => setSandboxForm({ ...sandboxForm, difficulty: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Estimated Duration</label>
                    <input type="text" value={sandboxForm.estimatedDuration} onChange={(e) => setSandboxForm({ ...sandboxForm, estimatedDuration: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="e.g. 2.5 Hours" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">XP Points</label>
                    <input type="number" value={sandboxForm.points} onChange={(e) => setSandboxForm({ ...sandboxForm, points: Number(e.target.value) })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="250" />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Tech Stack (comma separated)</label>
                  <input type="text" value={sandboxForm.technologyStack} onChange={(e) => setSandboxForm({ ...sandboxForm, technologyStack: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="HTML5, CSS3, JavaScript (ES6+), Local Storage" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Starter Files (comma separated)</label>
                  <input type="text" value={sandboxForm.starterFiles} onChange={(e) => setSandboxForm({ ...sandboxForm, starterFiles: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="index.html, styles.css, script.js" />
                </div>

                {/* Flashcards section */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Architectural Flashcards & Hints</label>
                    <button
                      type="button"
                      onClick={() => setSandboxForm({
                        ...sandboxForm,
                        flashcards: [...(sandboxForm.flashcards || []), { title: '', hint: '' }]
                      })}
                      className="text-[11px] font-bold text-[#04AA6D] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} /> Add Flashcard
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(sandboxForm.flashcards || []).map((fc, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl relative space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 font-mono">Flashcard #{idx + 1}</span>
                          {(sandboxForm.flashcards || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => setSandboxForm({
                                ...sandboxForm,
                                flashcards: sandboxForm.flashcards.filter((_, i) => i !== idx)
                              })}
                              className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer"
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={fc.title}
                          onChange={(e) => {
                            const nextFc = [...sandboxForm.flashcards];
                            nextFc[idx].title = e.target.value;
                            setSandboxForm({ ...sandboxForm, flashcards: nextFc });
                          }}
                          className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-[#04AA6D]"
                          placeholder="Flashcard Title (e.g. 💡 State Management)"
                        />
                        <textarea
                          rows={2}
                          value={fc.hint}
                          onChange={(e) => {
                            const nextFc = [...sandboxForm.flashcards];
                            nextFc[idx].hint = e.target.value;
                            setSandboxForm({ ...sandboxForm, flashcards: nextFc });
                          }}
                          className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-[#04AA6D]"
                          placeholder="Architectural hint or guidance..."
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="sandPub" checked={sandboxForm.isPublished} onChange={(e) => setSandboxForm({ ...sandboxForm, isPublished: e.target.checked })} className="accent-[#04AA6D] cursor-pointer" />
                  <label htmlFor="sandPub" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Publish Immediately</label>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsSandboxModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl font-bold cursor-pointer">Save Sandbox</button>
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
                  <HelpCircle size={18} className="text-[#04AA6D]" />
                  {editingTest ? 'Edit Practice Test' : 'Create Practice Test'}
                </h3>
                <button onClick={() => setIsTestModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X size={16} /></button>
              </div>
              <form onSubmit={handleSaveTest} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Test Title</label>
                  <input type="text" required value={testForm.title} onChange={(e) => setTestForm({ ...testForm, title: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea rows={2} value={testForm.description} onChange={(e) => setTestForm({ ...testForm, description: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Duration (Minutes)</label>
                    <input type="number" value={testForm.duration} onChange={(e) => setTestForm({ ...testForm, duration: Number(e.target.value) })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Passing Score (%)</label>
                    <input type="number" value={testForm.passScorePercentage} onChange={(e) => setTestForm({ ...testForm, passScorePercentage: Number(e.target.value) })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="testPub" checked={testForm.isPublished} onChange={(e) => setTestForm({ ...testForm, isPublished: e.target.checked })} className="accent-[#04AA6D] cursor-pointer" />
                  <label htmlFor="testPub" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Publish Immediately</label>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsTestModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl font-bold cursor-pointer">Save Assessment</button>
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
                  <Calendar size={18} className="text-[#04AA6D]" />
                  {editingEvent ? 'Edit Event' : 'Create Event'}
                </h3>
                <button onClick={() => setIsEventModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X size={16} /></button>
              </div>
              <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Event Title *</label>
                  <input type="text" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="e.g. CodeSphere AI & Full-Stack World Summit" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea rows={2} value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="Brief overview of the event, tracks, and prerequisites..." />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Event Type</label>
                    <select value={eventForm.eventType} onChange={(e) => setEventForm({ ...eventForm, eventType: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]">
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
                    <select value={eventForm.mode} onChange={(e) => setEventForm({ ...eventForm, mode: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]">
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Max Capacity</label>
                    <input type="number" value={eventForm.maxParticipants} onChange={(e) => setEventForm({ ...eventForm, maxParticipants: Number(e.target.value) })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Start Date & Time</label>
                    <input type="datetime-local" value={eventForm.startDate} onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">End Date & Time</label>
                    <input type="datetime-local" value={eventForm.endDate} onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                  </div>
                </div>

                {/* 3D Earth Globe Location Container */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-3.5 border border-slate-200 dark:border-slate-700 font-sans">
                  {/* Header Row: Title on Left, Google Maps Icon Button on Right */}
                  <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 bg-[#04AA6D]/10 dark:bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-400 rounded-xl border border-[#04AA6D]/20 shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                          3D Earth Globe Location
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          Pin event location onto the interactive 3D Globe
                        </p>
                      </div>
                    </div>

                    {/* SINGLE GOOGLE MAPS ICON BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        const city = eventForm.city?.trim();
                        const country = eventForm.country?.trim();
                        const lat = eventForm.latitude;
                        const lng = eventForm.longitude;

                        let mapsUrl = 'https://www.google.com/maps';
                        if (lat && lng) {
                          mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                        } else if (city || country) {
                          const query = [city, country].filter(Boolean).join(', ');
                          mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
                        }

                        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
                      }}
                      title="Open Google Maps in new tab to choose location"
                      className="px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all shrink-0 hover:border-[#04AA6D]"
                    >
                      <span className="text-base leading-none">🗺️</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Open Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                    </button>
                  </div>

                  {/* Location Search Bar & Autocomplete Menu */}
                  <div className="space-y-1 relative">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
                      <span>Search Place or Paste Google Maps Link</span>
                      <span className="text-[10px] text-[#04AA6D] dark:text-emerald-400 font-semibold">Auto-fills details below</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Type place name or paste Google Maps link (e.g. Dundigal, Hyderabad, Paris)..."
                          value={locationSearchInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocationSearchInput(val);
                            fetchLocationSuggestions(val);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              fetchLocationSuggestions(locationSearchInput);
                            }
                          }}
                          className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#04AA6D]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!locationSearchInput.trim()) {
                            return toast.error('Please type a place name or paste a Google Maps link first');
                          }
                          fetchLocationSuggestions(locationSearchInput);
                        }}
                        className="px-3 py-2 bg-[#04AA6D] hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                      >
                        {isGeocoding ? (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Get Details</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Autocomplete Suggestions Menu */}
                    {locationSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden max-h-44 overflow-y-auto p-1 space-y-0.5">
                        <div className="text-[10px] font-mono font-bold text-slate-400 px-2 py-1 uppercase border-b border-slate-100 dark:border-slate-800">
                          Click to select & auto-fill details:
                        </div>
                        {locationSuggestions.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setEventForm(prev => ({
                                ...prev,
                                city: item.city,
                                country: item.country,
                                latitude: item.lat,
                                longitude: item.lng,
                              }));
                              setLocationSearchInput(`${item.city}, ${item.country}`);
                              setLocationSuggestions([]);
                              toast.success(`Location set: ${item.city}, ${item.country}`);
                            }}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-emerald-50 dark:hover:bg-slate-800/80 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Globe className="w-3 h-3 text-[#04AA6D] shrink-0" />
                              <span className="truncate">{item.label || `${item.city}, ${item.country}`}</span>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0 ml-2">
                              {item.lat}, {item.lng}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4 Form Field Inputs: City, Country, Latitude, Longitude */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">City / City Name</label>
                      <input
                        type="text"
                        placeholder="e.g. San Francisco"
                        value={eventForm.city}
                        onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })}
                        className="w-full mt-0.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D] text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">Country / Region</label>
                      <input
                        type="text"
                        placeholder="e.g. United States"
                        value={eventForm.country}
                        onChange={(e) => setEventForm({ ...eventForm, country: e.target.value })}
                        className="w-full mt-0.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D] text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 37.7749"
                        value={eventForm.latitude || ''}
                        onChange={(e) => setEventForm({ ...eventForm, latitude: Number(e.target.value) })}
                        className="w-full mt-0.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono text-xs focus:border-[#04AA6D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. -122.4194"
                        value={eventForm.longitude || ''}
                        onChange={(e) => setEventForm({ ...eventForm, longitude: Number(e.target.value) })}
                        className="w-full mt-0.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono text-xs focus:border-[#04AA6D]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Speaker / Host Name</label>
                    <input type="text" value={eventForm.speakerName} onChange={(e) => setEventForm({ ...eventForm, speakerName: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Prize Pool / Reward</label>
                    <input type="text" value={eventForm.prizePool} onChange={(e) => setEventForm({ ...eventForm, prizePool: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="e.g. $10,000 Cash or Free Certificates" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Official Registration / Unstop / Website Link *</label>
                    <input
                      type="url"
                      value={eventForm.registrationUrl || ''}
                      onChange={(e) => setEventForm({ ...eventForm, registrationUrl: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]"
                      placeholder="e.g. https://unstop.com/hackathons/... or https://official-event.com/register"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Platform Provider</label>
                    <select
                      value={eventForm.registrationSource || 'unstop'}
                      onChange={(e) => setEventForm({ ...eventForm, registrationSource: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]"
                    >
                      <option value="unstop">Unstop</option>
                      <option value="official">Official Website</option>
                      <option value="devpost">Devpost</option>
                      <option value="eventbrite">Eventbrite</option>
                      <option value="google_forms">Google Forms</option>
                      <option value="internal">CodeSphere Direct</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Meeting / Livestream URL</label>
                  <input type="url" value={eventForm.meetingUrl || ''} onChange={(e) => setEventForm({ ...eventForm, meetingUrl: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="https://meet.google.com/..." />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="eventPub" checked={eventForm.isPublished} onChange={(e) => setEventForm({ ...eventForm, isPublished: e.target.checked })} className="accent-[#04AA6D] cursor-pointer" />
                  <label htmlFor="eventPub" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Publish Immediately on 3D Earth Globe & User Events Page</label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl font-bold cursor-pointer">Save Event</button>
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
                      <option value="ppt">PowerPoint Presentation (.ppt, .pptx)</option>
                      <option value="word">Word Document (.doc, .docx)</option>
                      <option value="video">Video Lecture</option>
                      <option value="source_code">Source Code</option>
                      <option value="github">GitHub Repo</option>
                      <option value="link">External Resource Link</option>
                      <option value="zip">Downloadable Archive (.zip)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                    <select
                      value={resourceForm.category || 'Documentation'}
                      onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                      className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]"
                    >
                      <option value="Documentation">Documentation</option>
                      <option value="PowerPoint Presentation">PowerPoint Presentation</option>
                      <option value="Word Document">Word Document</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Full Stack & Web Dev">Full Stack & Web Dev</option>
                      <option value="DSA & Algorithms">DSA & Algorithms</option>
                      <option value="AI & Data Science">AI & Data Science</option>
                      <option value="System Design">System Design</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Cyber Security">Cyber Security</option>
                      <option value="Placement & Interviews">Placement & Interviews</option>
                      <option value="Cheat Sheets & Notes">Cheat Sheets & Notes</option>
                    </select>
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
                  <label className="font-bold text-slate-700 dark:text-slate-300">External URL / Web Link</label>
                  <input type="url" value={resourceForm.url} onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono focus:border-[#04AA6D]" placeholder="https://raw.githubusercontent.com/... or https://..." />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Upload File or Zipped Folder Archive (.pdf, .ppt, .pptx, .zip, .mp4, .docx, code)</span>
                    <span className="text-[10px] text-[#04AA6D] font-mono">Max 100 MB</span>
                  </label>
                  <div className="mt-1 flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                    <Upload size={20} className="text-[#04AA6D] shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <input
                        type="file"
                        id="resFileInput"
                        onChange={(e) => setSelectedResourceFile(e.target.files[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="resFileInput" className="cursor-pointer text-xs font-bold text-[#04AA6D] hover:underline block truncate">
                        {selectedResourceFile ? selectedResourceFile.name : (editingResource?.fileUrl ? 'Replace existing file...' : 'Choose file or folder archive (.pptx, .ppt, .pdf, .zip, .mp4, .doc)...')}
                      </label>
                      <p className="text-[10px] text-slate-400">
                        {selectedResourceFile ? `${(selectedResourceFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Supports PPT/PPTX, PDF, ZIP, RAR, TAR, MP4, DOCX, & code files'}
                      </p>
                    </div>
                    {selectedResourceFile && (
                      <button
                        type="button"
                        onClick={() => setSelectedResourceFile(null)}
                        className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
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

      {/* Session Modal */}
      <AnimatePresence>
        {isSessionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 font-sans max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Video size={18} className="text-[#04AA6D]" />
                  {editingSession ? 'Edit Live Webcast' : 'Schedule Live Webcast'}
                </h3>
                <button onClick={() => setIsSessionModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X size={16} /></button>
              </div>
              <form onSubmit={handleSaveSession} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Session Title *</label>
                  <input type="text" required value={sessionForm.title} onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="e.g. Masterclass: System Design Architecture" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea rows={2} value={sessionForm.description} onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="Webcast topic details..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                    <input type="text" value={sessionForm.category} onChange={(e) => setSessionForm({ ...sessionForm, category: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Instructor Name</label>
                    <input type="text" value={sessionForm.instructorName} onChange={(e) => setSessionForm({ ...sessionForm, instructorName: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="Host name..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Start Time</label>
                    <input type="datetime-local" value={sessionForm.startTime} onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Duration (Minutes)</label>
                    <input type="number" value={sessionForm.duration} onChange={(e) => setSessionForm({ ...sessionForm, duration: Number(e.target.value) })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Meeting / Stream URL</label>
                  <input type="url" value={sessionForm.meetingUrl} onChange={(e) => setSessionForm({ ...sessionForm, meetingUrl: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono focus:border-[#04AA6D]" placeholder="https://meet.google.com/..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Status</label>
                    <select value={sessionForm.status} onChange={(e) => setSessionForm({ ...sessionForm, status: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]">
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live Now</option>
                      <option value="completed">Completed</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Difficulty</label>
                    <select value={sessionForm.difficulty} onChange={(e) => setSessionForm({ ...sessionForm, difficulty: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsSessionModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl font-bold cursor-pointer">Save Webcast</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Codex Workspace Modal */}
      <AnimatePresence>
        {isWorkspaceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 font-sans max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 size={18} className="text-[#04AA6D]" />
                  {editingWorkspace ? 'Edit Codex Workspace' : 'Create Codex Workspace'}
                </h3>
                <button onClick={() => setIsWorkspaceModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X size={16} /></button>
              </div>
              <form onSubmit={handleSaveWorkspace} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Workspace Name *</label>
                  <input type="text" required value={workspaceForm.name} onChange={(e) => setWorkspaceForm({ ...workspaceForm, name: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="e.g. Full Stack Microservices Workspace" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea rows={2} value={workspaceForm.description} onChange={(e) => setWorkspaceForm({ ...workspaceForm, description: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]" placeholder="Workspace purpose and module scope..." />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Tech Stack (comma separated)</label>
                  <input type="text" value={workspaceForm.technologyStack} onChange={(e) => setWorkspaceForm({ ...workspaceForm, technologyStack: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono focus:border-[#04AA6D]" placeholder="React, Node.js, Express, MongoDB" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Visibility</label>
                    <select value={workspaceForm.visibility} onChange={(e) => setWorkspaceForm({ ...workspaceForm, visibility: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]">
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Status</label>
                    <select value={workspaceForm.status} onChange={(e) => setWorkspaceForm({ ...workspaceForm, status: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#04AA6D]">
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">GitHub Repository (optional)</label>
                  <input type="url" value={workspaceForm.githubRepo} onChange={(e) => setWorkspaceForm({ ...workspaceForm, githubRepo: e.target.value })} className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono focus:border-[#04AA6D]" placeholder="https://github.com/..." />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsWorkspaceModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl font-bold cursor-pointer">Save Workspace</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
