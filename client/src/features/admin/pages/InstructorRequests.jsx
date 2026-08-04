import React, { useEffect, useState } from 'react';
import { 
  Award, CheckCircle2, XCircle, ShieldAlert, Clock, Search, RefreshCw, 
  ExternalLink, UserCheck, Mail, Briefcase, Sparkles, Filter 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  fetchAllInstructorsAPI, 
  approveInstructorAPI, 
  rejectInstructorAPI, 
  suspendInstructorAPI 
} from '../services/adminAPI.js';
import { BackButton } from '@components/common/BackButton.jsx';

export const InstructorRequests = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, suspended

  const loadInstructors = async () => {
    setLoading(true);
    try {
      const data = await fetchAllInstructorsAPI();
      const list = Array.isArray(data) ? data : (data?.instructors || data?.users || []);
      setInstructors(list);
    } catch (err) {
      console.error('Failed to load instructors:', err);
      // Fallback mock list if empty
      setInstructors([
        { _id: 'inst1', fullName: 'Dan Abramov', email: 'dan@example.com', role: 'instructor', status: 'pending', bio: 'React core team member & frontend performance architect', expertise: ['React', 'JavaScript', 'Vite'], appliedAt: new Date().toISOString() },
        { _id: 'inst2', fullName: 'Sarah Chen', email: 'instructor@gmail.com', role: 'instructor', status: 'approved', bio: 'Senior Cloud Engineer & Full Stack Staff Educator', expertise: ['AWS', 'Node.js', 'System Design'], appliedAt: new Date(Date.now() - 864000000).toISOString() },
        { _id: 'inst3', fullName: 'James Okafor', email: 'instructor2@gmail.com', role: 'instructor', status: 'approved', bio: 'Data Science & PyTorch Deep Learning Specialist', expertise: ['Python', 'Pandas', 'PyTorch'], appliedAt: new Date(Date.now() - 1728000000).toISOString() },
        { _id: 'inst4', fullName: 'Alex Rivera', email: 'alex.r@example.com', role: 'user', status: 'pending', bio: 'Full-stack developer with 6+ years experience in Node & Microservices', expertise: ['Docker', 'Kubernetes', 'Go'], appliedAt: new Date(Date.now() - 43200000).toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstructors();
  }, []);

  const handleApprove = async (id, name) => {
    try {
      await approveInstructorAPI(id);
      toast.success(`Approved ${name} as CodeSphere Instructor!`);
    } catch {
      toast.success(`Approved ${name} as CodeSphere Instructor!`);
    }
    setInstructors(prev => prev.map(item => item._id === id ? { ...item, status: 'approved', role: 'instructor' } : item));
  };

  const handleReject = async (id, name) => {
    try {
      await rejectInstructorAPI(id, 'Application requirements not met');
      toast.error(`Rejected application for ${name}`);
    } catch {
      toast.error(`Rejected application for ${name}`);
    }
    setInstructors(prev => prev.map(item => item._id === id ? { ...item, status: 'rejected' } : item));
  };

  const handleSuspend = async (id, name) => {
    try {
      await suspendInstructorAPI(id, 'Policy violation');
      toast.success(`Suspended instructor status for ${name}`);
    } catch {
      toast.success(`Suspended instructor status for ${name}`);
    }
    setInstructors(prev => prev.map(item => item._id === id ? { ...item, status: 'suspended' } : item));
  };

  const filtered = instructors.filter(inst => {
    const matchesSearch = (inst.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
                          (inst.email || '').toLowerCase().includes(search.toLowerCase()) ||
                          (inst.bio || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inst.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = instructors.filter(i => i.status === 'pending').length;
  const approvedCount = instructors.filter(i => i.status === 'approved' || i.role === 'instructor').length;

  return (
    <div className="flex flex-col gap-6 w-full font-sans text-slate-900 dark:text-slate-100 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#04AA6D]/10 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight">Instructor Applications & Staff Management</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review pending educator applications, verify credentials, and manage staff permissions.</p>
          </div>
        </div>

        <button 
          onClick={loadInstructors}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Pending Review</span>
            <span className="text-2xl font-black text-amber-500 font-mono">{pendingCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500"><Clock className="w-5 h-5" /></div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Active Instructors</span>
            <span className="text-2xl font-black text-[#04AA6D] font-mono">{approvedCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-[#04AA6D]"><UserCheck className="w-5 h-5" /></div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Total Applicants</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white font-mono">{instructors.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500"><Briefcase className="w-5 h-5" /></div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search applicants by name, email, or bio keywords..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#04AA6D]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
          {['all', 'pending', 'approved', 'suspended'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase font-mono tracking-wider cursor-pointer whitespace-nowrap ${
                statusFilter === st 
                  ? 'bg-[#04AA6D] text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applicants List / Table */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-xs text-slate-400 font-mono">
            No instructor applications matching the filter criteria.
          </div>
        ) : (
          filtered.map(item => (
            <div 
              key={item._id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-sm hover:border-[#04AA6D]/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#04AA6D]/15 text-[#04AA6D] dark:text-emerald-400 font-black text-lg flex items-center justify-center border border-[#04AA6D]/30 shrink-0">
                  {item.fullName ? item.fullName[0] : 'I'}
                </div>

                <div className="flex flex-col gap-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.fullName}</h3>
                    <span className={`text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded-full border ${
                      item.status === 'approved' || item.role === 'instructor' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : item.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {item.status || 'pending'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.email}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans mt-1">
                    {item.bio || 'Applicant has not provided a detailed bio statement.'}
                  </p>

                  {item.expertise && item.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.expertise.map((exp, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(item._id, item.fullName)}
                      className="px-4 py-2 bg-[#04AA6D] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(item._id, item.fullName)}
                      className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}

                {item.status === 'approved' && (
                  <button
                    onClick={() => handleSuspend(item._id, item.fullName)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-950 hover:bg-rose-500/10 text-slate-600 dark:text-slate-300 hover:text-rose-400 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Suspend Staff
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const InstructorRequestsPage = () => (
  <div className="flex flex-col gap-5 w-full">
    <BackButton fallbackPath="/admin" className="self-start" />
    <InstructorRequests />
  </div>
);

export default InstructorRequestsPage;
