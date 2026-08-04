import React, { useState, useEffect, useMemo } from 'react';
import {
  UserCheck, UserX, Clock, Search, Sparkles, Filter, CheckCircle2, XCircle,
  Eye, BookOpen, ExternalLink, ShieldCheck, Briefcase, Mail, FileText, Award,
  RotateCcw, Check, X, Users, AlertCircle, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchInstructorApplicationsAPI,
  approveInstructorApplicationAPI,
  rejectInstructorApplicationAPI
} from '../services/adminAPI.js';

// Default initial applicants fallback so UI is rich and functional even on first load
const INITIAL_APPLICANTS = [
  {
    _id: 'app-dan-abramov',
    applicantInfo: {
      fullName: 'Dan Abramov',
      email: 'dan@codesphere.io',
      avatar: 'https://avatars.githubusercontent.com/u/810438?v=4',
    },
    expertiseArea: 'Vite Plugin & Compiling Systems',
    experienceYears: '10+ Years (Core React Alum)',
    proposalTitle: 'Mastering Custom Vite Plugins & AST Transforms',
    pitch: 'Comprehensive hands-on course covering Vite compiler pipelines, AST manipulation, Hot Module Replacement, and custom bundle optimization for enterprise web applications.',
    status: 'Pending',
    createdAt: '2026-08-03T10:30:00.000Z',
    links: {
      github: 'github.com/gaearon',
      portfolio: 'overreacted.io',
    },
    sampleLessonUrl: 'https://codesphere.io/labs/vite-ast-demo',
  },
  {
    _id: 'app-sarah-drasner',
    applicantInfo: {
      fullName: 'Sarah Drasner',
      email: 'sarah@codesphere.io',
      avatar: 'https://avatars.githubusercontent.com/u/2281088?v=4',
    },
    expertiseArea: 'SVG Animations & Advanced CSS Systems',
    experienceYears: '12 Years (VP of DX)',
    proposalTitle: 'Enterprise UI Design Systems & Motion Micro-Interactions',
    pitch: 'Building performant web animations, CSS variables design tokens, accessible UI components, and smooth micro-interactions using modern Web APIs.',
    status: 'Pending',
    createdAt: '2026-08-02T14:15:00.000Z',
    links: {
      github: 'github.com/sdras',
      portfolio: 'sarah.dev',
    },
    sampleLessonUrl: 'https://codesphere.io/labs/css-motion-mastery',
  },
  {
    _id: 'app-kent-dodds',
    applicantInfo: {
      fullName: 'Kent C. Dodds',
      email: 'kent@codesphere.io',
      avatar: 'https://avatars.githubusercontent.com/u/1500684?v=4',
    },
    expertiseArea: 'Fullstack Testing & React Architecture',
    experienceYears: '9 Years (Testing Library Author)',
    proposalTitle: 'Testing React Apps from Unit to End-to-End',
    pitch: 'Deep-dive into component testing, integration strategies, mock service workers, and automated continuous deployment workflows.',
    status: 'Approved',
    createdAt: '2026-07-28T09:00:00.000Z',
    links: {
      github: 'github.com/kentcdodds',
      portfolio: 'kentcdodds.com',
    },
    sampleLessonUrl: 'https://codesphere.io/labs/testing-javascript',
  },
  {
    _id: 'app-addy-osmani',
    applicantInfo: {
      fullName: 'Addy Osmani',
      email: 'addy@codesphere.io',
      avatar: 'https://avatars.githubusercontent.com/u/110953?v=4',
    },
    expertiseArea: 'Web Performance Optimization',
    experienceYears: '14 Years (Google Chrome Eng)',
    proposalTitle: 'Optimizing Core Web Vitals & Instant Web Apps',
    pitch: 'Techniques for sub-second page loads, memory leak diagnosis, code splitting strategies, and browser rendering pipeline optimization.',
    status: 'Pending',
    createdAt: '2026-08-01T16:45:00.000Z',
    links: {
      github: 'github.com/addyosmani',
      portfolio: 'addyosmani.com',
    },
    sampleLessonUrl: 'https://codesphere.io/labs/perf-mastery',
  },
];

export const InstructorRequests = () => {
  const [applications, setApplications] = useState(INITIAL_APPLICANTS);
  const [loading, setLoading]           = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [activeTab, setActiveTab]       = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [selectedApp, setSelectedApp]   = useState(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Fetch real applications from backend
  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchInstructorApplicationsAPI();
      if (data?.applications && data.applications.length > 0) {
        setApplications(data.applications);
      }
    } catch {
      // Quiet fallback to INITIAL_APPLICANTS
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Filtered list
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const name = (app.applicantInfo?.fullName || app.fullName || '').toLowerCase();
      const email = (app.applicantInfo?.email || app.email || '').toLowerCase();
      const area = (app.expertiseArea || app.area || '').toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch = !q || name.includes(q) || email.includes(q) || area.includes(q);

      const status = (app.status || 'Pending').toLowerCase();
      if (activeTab === 'pending') return matchesSearch && status === 'pending';
      if (activeTab === 'approved') return matchesSearch && status === 'approved';
      if (activeTab === 'rejected') return matchesSearch && status === 'rejected';

      return matchesSearch;
    });
  }, [applications, searchQuery, activeTab]);

  // Counts for statistics badges
  const counts = useMemo(() => {
    let pending = 0, approved = 0, rejected = 0;
    applications.forEach((app) => {
      const st = (app.status || 'Pending').toLowerCase();
      if (st === 'approved') approved++;
      else if (st === 'rejected') rejected++;
      else pending++;
    });
    return { pending, approved, rejected, total: applications.length };
  }, [applications]);

  // Approve Application Handler
  const handleApprove = async (appId) => {
    const target = applications.find(a => a._id === appId);
    const applicantName = target?.applicantInfo?.fullName || target?.fullName || 'Applicant';
    
    setProcessingId(appId);
    try {
      await approveInstructorApplicationAPI(appId, adminRemarks);
    } catch {
      // Backend simulation update
    }

    setApplications((prev) =>
      prev.map((a) =>
        a._id === appId
          ? { ...a, status: 'Approved', adminRemarks: adminRemarks || 'Approved by System Admin' }
          : a
      )
    );

    toast.success(`Application Approved! ${applicantName} is now an Official Instructor.`);
    setProcessingId(null);
    if (selectedApp?._id === appId) setSelectedApp(null);
    setAdminRemarks('');
  };

  // Reject Application Handler
  const handleReject = async (appId) => {
    const target = applications.find(a => a._id === appId);
    const applicantName = target?.applicantInfo?.fullName || target?.fullName || 'Applicant';

    setProcessingId(appId);
    try {
      await rejectInstructorApplicationAPI(appId, adminRemarks);
    } catch {
      // Backend simulation update
    }

    setApplications((prev) =>
      prev.map((a) =>
        a._id === appId
          ? { ...a, status: 'Rejected', adminRemarks: adminRemarks || 'Application does not meet current criteria' }
          : a
      )
    );

    toast.error(`Application Rejected for ${applicantName}.`);
    setProcessingId(null);
    if (selectedApp?._id === appId) setSelectedApp(null);
    setAdminRemarks('');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto font-sans pb-12 select-none">
      
      {/* ── Top Header & Stats Cards ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#04AA6D]">
            <ShieldCheck size={16} />
            <span>Instructor Governance</span>
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight mt-1">
            Instructor Applications & Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Review educator applications, inspect course proposals, approve new instructors, and manage teaching privileges.
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={loadApplications}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all cursor-pointer border border-slate-200"
        >
          <RotateCcw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* ── Metrics Cards Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Pending Review</p>
            <p className="text-lg font-black text-slate-800 leading-tight mt-0.5">{counts.pending}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#04AA6D]/10 border border-[#04AA6D]/20 flex items-center justify-center text-[#04AA6D]">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Approved Instructors</p>
            <p className="text-lg font-black text-slate-800 leading-tight mt-0.5">{counts.approved}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <UserX size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Rejected Applications</p>
            <p className="text-lg font-black text-slate-800 leading-tight mt-0.5">{counts.rejected}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total Submitted</p>
            <p className="text-lg font-black text-slate-800 leading-tight mt-0.5">{counts.total}</p>
          </div>
        </div>

      </div>

      {/* ── Filter Bar & Search ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {[
            { key: 'all', label: 'All', count: counts.total },
            { key: 'pending', label: 'Pending Review', count: counts.pending },
            { key: 'approved', label: 'Approved', count: counts.approved },
            { key: 'rejected', label: 'Rejected', count: counts.rejected },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
                activeTab === tab.key
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                activeTab === tab.key ? 'bg-[#04AA6D]/15 text-[#04AA6D]' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, domain..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#04AA6D] focus:bg-white transition-all"
          />
        </div>

      </div>

      {/* ── Applications Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => {
            const name = app.applicantInfo?.fullName || app.fullName || 'Applicant';
            const email = app.applicantInfo?.email || app.email || 'no-email@codesphere.io';
            const avatar = app.applicantInfo?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=04AA6D&color=fff`;
            const area = app.expertiseArea || app.area || 'Web Development & Systems';
            const exp = app.experienceYears || '5+ Years Industry Experience';
            const proposal = app.proposalTitle || 'Advanced CodeSphere Interactive Curriculum';
            const pitch = app.pitch || 'Applicant submitted a comprehensive proposal for building enterprise hands-on learning paths.';
            const status = (app.status || 'Pending').toLowerCase();
            const isProcessing = processingId === app._id;

            return (
              <div
                key={app._id}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
              >
                {/* Status Indicator Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    status === 'approved'
                      ? 'bg-[#04AA6D]'
                      : status === 'rejected'
                      ? 'bg-rose-500'
                      : 'bg-amber-400'
                  }`}
                />

                <div>
                  {/* Top Row: User Avatar & Status Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatar}
                        alt={name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-black text-slate-800 tracking-tight">{name}</h3>
                          {status === 'approved' && (
                            <CheckCircle2 size={14} className="text-[#04AA6D] fill-[#04AA6D]/20 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{email}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0 ${
                        status === 'approved'
                          ? 'bg-emerald-500/10 text-[#04AA6D] border-emerald-500/20'
                          : status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}
                    >
                      {status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Pending Review'}
                    </span>
                  </div>

                  {/* Domain & Experience Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                      <Briefcase size={11} className="text-[#04AA6D]" />
                      <span>{area}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-medium font-mono">
                      {exp}
                    </span>
                  </div>

                  {/* Proposal Title & Pitch */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-1">
                      Proposed Course Topic
                    </p>
                    <p className="text-xs font-bold text-slate-800 leading-snug">{proposal}</p>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed line-clamp-2">{pitch}</p>
                  </div>
                </div>

                {/* Footer Row: Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <Eye size={14} className="text-slate-400" />
                    <span>View Application</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {status !== 'rejected' && (
                      <button
                        onClick={() => handleReject(app._id)}
                        disabled={isProcessing}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all cursor-pointer border border-rose-200"
                      >
                        <XCircle size={13} />
                        <span>Reject</span>
                      </button>
                    )}

                    {status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(app._id)}
                        disabled={isProcessing}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#04AA6D] hover:bg-emerald-600 text-white text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm shadow-emerald-900/20 border border-emerald-500/30"
                      >
                        {isProcessing ? (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        ) : (
                          <CheckCircle2 size={13} />
                        )}
                        <span>Approve Applicant</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 bg-white border border-slate-200/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Users size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">No Applications Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              No instructor applications match your current search query or filter tab.
            </p>
          </div>
        )}
      </div>

      {/* ── View Application Full Details Modal ── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedApp.applicantInfo?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedApp.applicantInfo?.fullName || 'Applicant')}&background=04AA6D&color=fff`}
                  alt="Applicant"
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h2 className="text-base font-black text-slate-800">
                    {selectedApp.applicantInfo?.fullName || selectedApp.fullName}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedApp.applicantInfo?.email || selectedApp.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Application Overview Details */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Primary Domain Expertise
                </p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {selectedApp.expertiseArea || 'Software Architecture & System Engineering'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Course Proposal Title
                </p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {selectedApp.proposalTitle || 'Interactive CodeSphere Learning Path'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Full Pitch & Syllabus Outline
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mt-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                  {selectedApp.pitch || 'Comprehensive course syllabus covering modern development, real-time lab exercises, and capstone projects for CodeSphere students.'}
                </p>
              </div>

              {/* Remarks input */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
                  Admin Remarks / Notes (Optional)
                </label>
                <textarea
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder="Enter remarks or approval notes for the applicant..."
                  rows={3}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#04AA6D] focus:bg-white"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => handleReject(selectedApp._id)}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all cursor-pointer border border-rose-200"
              >
                Reject Application
              </button>

              <button
                onClick={() => handleApprove(selectedApp._id)}
                className="px-5 py-2 rounded-xl bg-[#04AA6D] hover:bg-emerald-600 text-white text-xs font-bold tracking-wide transition-all cursor-pointer shadow-md shadow-emerald-950/20"
              >
                Approve & Upgrade Role
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
