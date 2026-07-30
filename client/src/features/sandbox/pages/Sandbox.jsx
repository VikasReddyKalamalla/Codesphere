import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Compass, Briefcase, Bookmark, ClipboardList,
  GraduationCap, Code2, Award, Clock, ArrowRight, User, CheckCircle2
} from 'lucide-react';
import {
  fetchSandboxProjectsAPI,
  fetchMySandboxProjectsAPI,
  fetchBookmarkedSandboxProjectsAPI,
  fetchMySubmissionsAPI,
  fetchAllMyProgressAPI
} from '../services/sandboxAPI.js';
import { socket } from '../../../socket/socket.js';
import toast from 'react-hot-toast';

export const Sandbox = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?tab= from URL so clicking tabs in SandboxProject.jsx navigates here
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(urlTab || 'explore');
  const [projects, setProjects] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMyProgressAPI()
      .then(res => {
        if (res.success && res.data) {
          setProgressList(res.data || []);
        }
      })
      .catch(err => console.error('Failed to load progress list:', err));
  }, []);

  const loadProjects = () => {
    setLoading(true);
    let fetchPromise;
    if (activeTab === 'explore') {
      fetchPromise = fetchSandboxProjectsAPI();
    } else if (activeTab === 'projects') {
      fetchPromise = fetchMySandboxProjectsAPI();
    } else if (activeTab === 'bookmarks') {
      fetchPromise = fetchBookmarkedSandboxProjectsAPI();
    } else {
      fetchPromise = fetchMySubmissionsAPI();
    }

    fetchPromise
      .then((res) => {
        if (res) {
          const payloadData = res.data || res;
          if (activeTab === 'explore') {
            setProjects(payloadData.projects || (Array.isArray(payloadData) ? payloadData : []));
          } else if (activeTab === 'projects') {
            setProjects(payloadData.projects || (Array.isArray(payloadData) ? payloadData : []));
          } else if (activeTab === 'bookmarks') {
            setProjects(payloadData.projects || payloadData.bookmarks || (Array.isArray(payloadData) ? payloadData : []));
          } else {
            setProjects(payloadData.submissions || (Array.isArray(payloadData) ? payloadData : []));
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching sandbox projects:', err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, [activeTab]);

  useEffect(() => {
    const handleSandboxUpdate = (msg) => {
      loadProjects();
    };

    socket.on('sandbox:changed', handleSandboxUpdate);
    socket.on('admin:data_changed', (evt) => {
      if (!evt || evt.entity === 'sandbox') loadProjects();
    });

    return () => {
      socket.off('sandbox:changed', handleSandboxUpdate);
      socket.off('admin:data_changed');
    };
  }, [activeTab]);

  const tabs = [
    { id: 'explore',   label: 'Explore',      icon: Compass },
    { id: 'projects',  label: 'My Projects',  icon: Briefcase },
    { id: 'bookmarks', label: 'Bookmarks',    icon: Bookmark },
    { id: 'submissions', label: 'Submissions', icon: ClipboardList },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-800 bg-[#F8FAFC] select-none text-left">
      
      {/* ── Subheader navigation tabs bar ── */}
      <div className="flex items-center gap-2 border-b border-slate-200/60 pb-1 select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono-origin uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                active 
                  ? 'bg-[#04AA6D] text-white shadow-sm shadow-indigo-200' 
                  : 'text-slate-450 hover:bg-slate-100/80 hover:text-slate-700'
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-1 select-none">
        <h2 className="text-xl font-black text-slate-800 tracking-tight font-mono-origin">Sandbox Compiler Playpens</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-sans-origin font-medium">Launch dynamic, instructor-led playpens to learn stack technologies and build production apps.</p>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-150 border-t-indigo-600 animate-spin" />
          <span className="text-xs font-bold text-slate-400 font-mono-origin uppercase">Fetching playpen records...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-2xl bg-white text-center">
          <Code2 size={32} className="text-slate-350" />
          <p className="text-sm font-bold text-slate-500 mt-3 font-mono-origin uppercase">No records found</p>
          <p className="text-xs text-slate-400 mt-1 font-sans-origin">Explore the playpen lists or build custom systems.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((proj) => {
            // Resolve project model if sub/bookmark structures wrap it
            const item = proj.projectId || proj;
            if (!item || !item.title) return null;

            const progressRecord = progressList.find(p => p.projectId === item._id || (p.projectId && p.projectId._id === item._id));
            const isCompleted = progressRecord?.status === 'completed' || progressRecord?.completionPercent === 100;

            return (
              <div 
                key={item._id} 
                onClick={() => navigate(`/sandbox/${item._id}`)}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-200/80 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5 flex-wrap gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-50 text-[#04AA6D] border border-indigo-100/50 font-mono-origin">
                        {item.difficulty}
                      </span>
                      <span className="text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-50 text-slate-505 border border-slate-100 font-mono-origin">
                        {item.category}
                      </span>
                    </div>
                    {isCompleted && (
                      <span className="text-[8.5px] font-extrabold px-2 py-0.5 rounded-full uppercase bg-emerald-50 text-[#04AA6D] border border-emerald-100 flex items-center gap-1 font-mono-origin">
                        <CheckCircle2 size={10} className="stroke-[3]" />
                        COMPLETED
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-black text-slate-800 font-mono-origin uppercase tracking-wider group-hover:text-[#04AA6D] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-450 mt-2 font-sans-origin leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {item.technologyStack?.map((tech) => (
                      <span key={tech} className="text-[9px] font-semibold bg-slate-50 text-slate-500 rounded px-1.5 py-0.5 border border-slate-100 font-sans-origin">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 font-mono-origin uppercase">
                    <Clock size={12} />
                    <span>{item.estimatedDuration || '4-6 hours'}</span>
                  </div>
                  <span className="text-xs font-bold text-[#04AA6D] font-mono-origin uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Launch
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
export default Sandbox;
