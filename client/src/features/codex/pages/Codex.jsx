import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceCard } from '../components/WorkspaceCard.jsx';
import { WorkspaceHeader } from '../components/WorkspaceHeader.jsx';
import { Button } from '@components/common/Button.jsx';
import { Plus, FolderOpen, Search, ArrowUpDown, Filter, Sparkles, Code2 } from 'lucide-react';
import { fetchWorkspacesAPI, createWorkspaceAPI, fetchCodexProjectsAPI, duplicateWorkspaceAPI } from '../services/codexAPI.js';
import toast from 'react-hot-toast';

export const Codex = () => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Filters & Sorting
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Load Workspaces and Projects list
  const loadData = () => {
    setLoading(true);
    Promise.all([fetchWorkspacesAPI(), fetchCodexProjectsAPI()])
      .then(([wsRes, projRes]) => {
        if (wsRes.success) {
          setWorkspaces(wsRes.data.workspaces || wsRes.data || []);
        }
        if (projRes.success) {
          setProjects(projRes.data.projects || projRes.data || []);
        }
      })
      .catch((err) => {
        console.error('Failed to load codex data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();

    const handleWorkspaceChanged = (evt) => {
      const entity = evt?.entity;
      if (!entity || entity === 'workspace' || entity === 'all') {
        loadData();
      }
    };

    import('../../../socket/socket.js').then((m) => {
      m.socket.on('admin:data_changed', handleWorkspaceChanged);
      m.socket.on('workspace:changed', handleWorkspaceChanged);
    });

    return () => {
      import('../../../socket/socket.js').then((m) => {
        m.socket.off('admin:data_changed', handleWorkspaceChanged);
        m.socket.off('workspace:changed', handleWorkspaceChanged);
      });
    };
  }, []);

  // Templates seeding trigger
  const handleLaunchTemplate = async (templateName, lang, framework) => {
    // Prevent duplicate workspaces for the user
    const existing = workspaces.find(w => w.name === `${templateName} Sandbox`);
    if (existing) {
      toast.success(`Opening existing ${templateName} workspace!`);
      navigate(`/codex/${existing._id || existing.id}`);
      return;
    }

    const payload = {
      name: `${templateName} Sandbox`,
      description: `Collaborative workspace template for ${templateName} projects.`,
      technologyStack: [lang],
      framework,
      database: 'Local Sandbox',
      deployment: 'Static Serve',
      visibility: 'private',
      status: 'active'
    };

    setLoading(true);
    try {
      const res = await createWorkspaceAPI(payload);
      const wsData = res?.data || res;
      const createdId = wsData?._id || wsData?.id || (typeof wsData === 'string' ? wsData : null);
      if (createdId) {
        toast.success(`Launched ${templateName} template!`);
        navigate(`/codex/${createdId}`);
      } else {
        toast.error(res?.message || 'Failed to launch template');
      }
    } catch (err) {
      console.error('Launch template error:', err);
      toast.error(err?.response?.data?.message || 'Failed to launch template');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateWorkspace = async (e, id) => {
    setLoading(true);
    try {
      const res = await duplicateWorkspaceAPI(id);
      if (res.success) {
        toast.success('Workspace duplicated successfully!');
        loadData();
      } else {
        toast.error(res.message || 'Failed to duplicate workspace');
        setLoading(false);
      }
    } catch (err) {
      toast.error('Failed to duplicate workspace');
      setLoading(false);
    }
  };

  // Perform search, filter, and sorting calculations on state
  const filteredWorkspaces = workspaces
    .filter(w => {
      const matchesSearch = search.trim() === '' || 
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
      const matchesVisibility = visibilityFilter === 'all' || w.visibility === visibilityFilter;

      return matchesSearch && matchesStatus && matchesVisibility;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'members') return (b.memberCount || 0) - (a.memberCount || 0);
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  // Fallback default templates if database projects are empty
  const defaultTemplates = [
    { title: 'HTML5 Web App', description: 'Precompiled HTML, Custom JS, CSS', technologyStack: ['HTML/CSS'], framework: 'Vanilla' },
    { title: 'React Node Sandbox', description: 'Interactive SPA development structure', technologyStack: ['JavaScript'], framework: 'React' },
    { title: 'Python compiler', description: 'Console automation script environment', technologyStack: ['Python'], framework: 'Native' }
  ];

  const templatesList = projects.length > 0 ? projects : defaultTemplates;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-left select-none bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-100px)] p-6 text-slate-800 dark:text-slate-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <WorkspaceHeader title="Codex Collaboration Hub" />
        <Button variant="primary" icon={Plus} onClick={() => navigate('/codex/create')} className="bg-[#04AA6D] hover:bg-[#03935e] border-emerald-500/20 shadow-lg shadow-emerald-500/20 cursor-pointer">
          New Workspace
        </Button>
      </div>

      {/* Templates Row */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-bold text-[#04AA6D] uppercase tracking-widest font-mono flex items-center gap-1.5">
          <Sparkles size={11} /> Quick Launch templates
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templatesList.slice(0, 3).map((tmpl, idx) => {
            const lang = tmpl.technologyStack?.[0] || 'JavaScript';
            const framework = tmpl.framework || 'Vanilla';
            return (
              <div 
                key={idx} 
                onClick={() => handleLaunchTemplate(tmpl.title, lang, framework)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 hover:border-[#6366f1]/40 transition-all cursor-pointer shadow-sm hover:shadow-indigo-500/5 group"
              >
                <div className="flex justify-between items-start">
                  <Code2 className="w-5 h-5 text-[#6366f1] group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/30 text-[#6366f1] px-1.5 py-0.5 rounded uppercase">{lang}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white mt-3 font-mono">{tmpl.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{tmpl.description || tmpl.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search, Filter, Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-[280px]">
          <Search size={14} className="absolute left-3 top-3 text-slate-455 dark:text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workspaces..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-9 pr-3 py-2 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-200 focus:border-[#6366f1] font-sans"
          />
        </div>

        {/* Filters/Sorts */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={11} className="text-slate-455" />
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold uppercase py-1.5 px-3.5 rounded-xl outline-none text-slate-605 dark:text-slate-355 focus:border-[#6366f1] cursor-pointer"
            >
              <option value="all">All Visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="invite_only">Invite Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold uppercase py-1.5 px-3.5 rounded-xl outline-none text-slate-605 dark:text-slate-355 focus:border-[#6366f1] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown size={11} className="text-slate-455" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold uppercase py-1.5 px-3.5 rounded-xl outline-none text-slate-605 dark:text-slate-355 focus:border-[#6366f1] cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="name">Alphabetical</option>
              <option value="members">Most Members</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workspaces List Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-[#6366f1] animate-spin" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Querying Codex Servers...</span>
        </div>
      ) : filteredWorkspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950/20 text-center gap-3">
          <FolderOpen size={40} className="text-slate-400 dark:text-slate-650 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase font-mono">No matching workspaces found</p>
            <p className="text-[11px] text-slate-455 dark:text-slate-555 mt-1">Adjust search parameters or launch a new template to start.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkspaces.map((w) => {
            const mappedWorkspace = {
              id: w._id,
              name: w.name,
              description: w.description,
              language: w.technologyStack?.[0] || 'JavaScript',
              framework: w.framework || 'Vanilla',
              owner: w.owner?.fullName || 'Collaborator',
              memberCount: w.memberCount || 1,
              status: w.status || 'active',
              visibility: w.visibility || 'private'
            };
            return (
              <div key={w._id} onClick={() => navigate(`/codex/${w._id}`)} className="cursor-pointer">
                <WorkspaceCard workspace={mappedWorkspace} onDuplicate={handleDuplicateWorkspace} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Codex;
