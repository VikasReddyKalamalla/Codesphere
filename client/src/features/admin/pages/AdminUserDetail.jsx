import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '@services/axios.js';
import {
  ArrowLeft, User as UserIcon, Mail, Phone, MapPin, Calendar, Clock,
  FileText, GraduationCap, Trophy, Award, BookOpen,
  Code2, Database, GitPullRequest, GitCommit, FileCode, MessageSquare,
  ThumbsUp, Users, Activity, BarChart2, Shield, Settings, Key, Ban,
  CheckCircle, RefreshCw, Smartphone, Monitor
} from 'lucide-react';
import { FiGithub as Github, FiLinkedin as Linkedin } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminUserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // State management
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Actions states
  const [suspensionReason, setSuspensionReason] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMsg, setNotificationMsg] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/admin/users/${userId}`);
      setProfile(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Error fetching user profile');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleAction = async (action, body = {}) => {
    const loader = toast.loading('Applying admin action...');
    try {
      let res;
      if (action === 'suspend') {
        res = await apiClient.put(`/admin/users/${userId}/suspend`, { reason: body.reason });
      } else if (action === 'activate') {
        res = await apiClient.put(`/admin/users/${userId}/activate`);
      } else if (action === 'role') {
        res = await apiClient.put(`/admin/users/${userId}/role`, { role: body.role });
      } else if (action === 'resetPassword') {
        res = await apiClient.post(`/admin/users/${userId}/reset-password`);
        alert(`Temporary credentials generated:\nPassword: ${res.data.data.tempPassword}\n\nPlease share this securely with the user.`);
      } else if (action === 'notify') {
        res = await apiClient.post(`/admin/users/${userId}/notify`, { title: body.title, message: body.message });
      } else if (action === 'email') {
        res = await apiClient.post(`/admin/users/${userId}/email`, { subject: body.subject, body: body.body });
      }

      toast.success(res?.data?.message || 'Success', { id: loader });
      fetchProfile();
    } catch (err) {
      toast.error(err.message || 'Action failed', { id: loader });
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="animate-spin text-emerald-600" size={36} />
        <span className="text-xs text-slate-450 font-bold font-mono-origin">Compiling detailed profile metrics...</span>
      </div>
    );
  }

  if (!profile) return null;

  const { personal, learning, sandbox, codex, community, assessments, timeline, devices } = profile;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-800">
      
      {/* Back button */}
      <button
        onClick={() => navigate('/admin/users')}
        className="self-start flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 border border-slate-200 rounded-xl"
      >
        <ArrowLeft size={14} />
        <span>Back to Registry</span>
      </button>

      {/* Grid Layout (Left: Personal Details Info-Panel, Right: Tabbed Metric Sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Personal Info Card & quick status actions */}
        <div className="flex flex-col gap-5 lg:col-span-1">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.015)] text-center relative overflow-hidden">
            {/* Status light */}
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${personal.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="text-[9px] uppercase font-bold text-slate-400">{personal.isActive ? 'Active' : 'Suspended'}</span>
            </div>

            {/* Avatar Photo */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 mx-auto mt-4 shrink-0 shadow-sm">
              <img
                src={personal.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80'}
                alt={personal.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-base font-black text-slate-900 mt-4 leading-none">{personal.fullName}</h2>
            <p className="text-[10px] font-mono-origin text-slate-400 mt-1">@{personal.username}</p>

            <div className="flex items-center justify-center gap-1.5 mt-3 select-none">
              <span className={`px-2.5 py-0.5 rounded-lg text-[9px] uppercase font-black tracking-wide leading-none
                ${personal.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                  personal.role === 'instructor' ? 'bg-rose-100 text-rose-700' :
                  personal.role === 'mentor' ? 'bg-orange-100 text-orange-700' :
                  personal.role === 'recruiter' ? 'bg-indigo-100 text-indigo-700' :
                  personal.role === 'organization' ? 'bg-pink-100 text-pink-700' :
                  'bg-sky-100 text-sky-700'}`}>
                {personal.role}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-[9px] uppercase font-black tracking-wide bg-emerald-100 text-emerald-700 leading-none">
                {personal.plan} plan
              </span>
            </div>

            {/* bio */}
            {personal.bio && (
              <p className="text-[11px] text-slate-500 mt-4 italic line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{personal.bio}"
              </p>
            )}

            {/* Social link buttons */}
            <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-slate-100">
              {personal.github && (
                <a href={personal.github} target="_blank" rel="noreferrer" className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all">
                  <Github size={15} />
                </a>
              )}
              {personal.linkedin && (
                <a href={personal.linkedin} target="_blank" rel="noreferrer" className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all">
                  <Linkedin size={15} />
                </a>
              )}
              {personal.resume && (
                <a href={personal.resume} target="_blank" rel="noreferrer" className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase">
                  <FileText size={15} />
                  <span>Resume</span>
                </a>
              )}
            </div>
          </div>

          {/* Contact Details Info list */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.015)] flex flex-col gap-3">
            <h3 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 font-mono-origin">Contact & Metadata</h3>
            {[
              { icon: Mail, label: 'Email Address', val: personal.email },
              { icon: Phone, label: 'Phone Number', val: personal.phone || 'Not Specified' },
              { icon: MapPin, label: 'Location', val: personal.city ? `${personal.city}, ${personal.state}, ${personal.country}` : personal.country },
              { icon: Calendar, label: 'Joined Date', val: new Date(personal.createdAt).toLocaleDateString() },
              { icon: Clock, label: 'Last active', val: new Date(personal.lastLogin).toLocaleString() },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 text-xs">
                <item.icon size={15} className="text-slate-450 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9.5px] uppercase font-bold text-slate-400 leading-none">{item.label}</p>
                  <p className="font-bold text-slate-750 font-mono-origin mt-1.5 leading-tight">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Admin Actions Box */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.015)] flex flex-col gap-3.5">
            <h3 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 font-mono-origin">Quick Account Actions</h3>
            
            {/* Suspend / Activate toggles */}
            <div className="flex gap-2">
              {personal.isActive ? (
                <button
                  onClick={() => {
                    const reason = prompt('Specify suspension reason:') || 'Administrative suspension';
                    handleAction('suspend', { reason });
                  }}
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                >
                  <Ban size={13} />
                  <span>Suspend</span>
                </button>
              ) : (
                <button
                  onClick={() => handleAction('activate')}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={13} />
                  <span>Activate</span>
                </button>
              )}
              <button
                onClick={() => handleAction('resetPassword')}
                className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5"
              >
                <Key size={13} />
                <span>Reset Pass</span>
              </button>
            </div>

            {/* Role Modifier Dropdown */}
            <div>
              <p className="text-[9.5px] uppercase font-bold text-slate-400 mb-2 font-mono-origin">Update Role</p>
              <select
                value={personal.role}
                onChange={(e) => handleAction('role', { role: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-full focus:outline-none font-bold text-slate-650"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="mentor">Mentor</option>
                <option value="recruiter">Recruiter</option>
                <option value="organization">Organization</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

        </div>

        {/* Right Side: Tabbed Interface for Activities, Sandbox, Codex, Timelines */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          
          {/* Tabs Selector Bar */}
          <div className="bg-white border border-slate-200/80 p-1.5 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.01)] flex gap-1 select-none overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'learning', label: 'Learning & progress', icon: GraduationCap },
              { id: 'developer', label: 'Sandbox & Codex', icon: Code2 },
              { id: 'community', label: 'Social & Community', icon: MessageSquare },
              { id: 'history', label: 'Security & history', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-[10.5px] font-bold tracking-wide uppercase transition-all flex items-center gap-2 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.015)] flex-1 min-h-[500px] flex flex-col">
            
            {/* TAB 1: OVERVIEW & ACTIVITY TIMELINE */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-none">Interactive Profile Timeline</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Audit trail of the most recent active events and learning milestones logged on CodeSphere.</p>
                </div>

                {/* Timeline display */}
                {timeline.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">
                    <Activity size={32} className="mx-auto mb-2 opacity-50 animate-pulse" />
                    <span className="text-xs font-semibold">No recent activity logs recorded</span>
                  </div>
                ) : (
                  <div className="relative border-l-2 border-slate-100 pl-6 ml-3 flex-1 flex flex-col gap-6">
                    {timeline.map((item, idx) => {
                      const iconMap = {
                        'Community': MessageSquare,
                        'Codex': Database,
                        'Session': Clock,
                        'Admin': Shield,
                        'General': Activity,
                      };
                      const Icon = iconMap[item.module] || Activity;
                      return (
                        <div key={idx} className="relative">
                          {/* Node circle */}
                          <span className="absolute -left-[33px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10.5px] font-extrabold text-slate-800">{item.action}</span>
                              <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded leading-none">
                                {item.module}
                              </span>
                            </div>
                            <p className="text-[9px] font-semibold text-slate-400 font-mono-origin mt-1">
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                            {item.details && Object.keys(item.details).length > 0 && (
                              <pre className="text-[8.5px] font-mono-origin bg-slate-55 p-2 rounded-lg border border-slate-100 text-slate-500 mt-2 max-w-full overflow-x-auto">
                                {JSON.stringify(item.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: LEARNING & ASSESSMENTS */}
            {activeTab === 'learning' && (
              <div className="flex flex-col gap-6">
                
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 select-none">
                  {[
                    { label: 'Streak Days', value: learning.learningStreak, icon: Flame, color: 'text-orange-500 bg-orange-50' },
                    { label: 'Lessons Done', value: learning.lessonsCompleted, icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Study Hours', value: `${learning.totalLearningHours} hrs`, icon: Clock, color: 'text-blue-500 bg-blue-50' },
                    { label: 'Bookmarks', value: learning.bookmarksCount, icon: Award, color: 'text-yellow-600 bg-yellow-50' },
                  ].map((card, idx) => (
                    <div key={idx} className="p-4 border border-slate-100 rounded-2xl flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                        <card.icon size={18} />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wide font-extrabold text-slate-400 leading-none">{card.label}</p>
                        <p className="text-base font-black text-slate-800 mt-1 font-mono-origin leading-none">{card.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Course Progress bars */}
                <div className="border border-slate-100 rounded-2xl p-5">
                  <h4 className="text-xs font-black text-slate-850 mb-4">Course Enrolments & Progress</h4>
                  {learning.courseProgress.length === 0 ? (
                    <p className="text-xs text-slate-450 italic py-4">No active learning paths enrolled.</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {learning.courseProgress.map((cp, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                            <span>{cp.title}</span>
                            <span className="font-mono-origin">{cp.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${cp.progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Completed Certs List */}
                <div className="border border-slate-100 rounded-2xl p-5">
                  <h4 className="text-xs font-black text-slate-850 mb-4">Certificates Earned ({learning.certificatesEarned.length})</h4>
                  {learning.certificatesEarned.length === 0 ? (
                    <p className="text-xs text-slate-450 italic py-2">No certificates issued yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {learning.certificatesEarned.map((cert, idx) => (
                        <div key={idx} className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black text-slate-800 line-clamp-1">{cert.course?.title || 'Course Certificate'}</p>
                            <p className="text-[9.5px] text-slate-400 font-mono-origin mt-1">Issued: {new Date(cert.issuedDate).toLocaleDateString()}</p>
                          </div>
                          <a
                            href={cert.certificateUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 border border-slate-200 hover:bg-white bg-slate-50 text-slate-650 rounded-lg text-[9.5px] font-bold uppercase transition-all whitespace-nowrap"
                          >
                            View PDF
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: DEVELOPER WORKSPACE */}
            {activeTab === 'developer' && (
              <div className="flex flex-col gap-6">
                
                {/* Codex & Sandbox Quick Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Sandbox Card */}
                  <div className="border border-slate-150 rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <FileCode size={18} className="text-cyan-500" />
                        <h4 className="text-xs font-black text-slate-850">Sandbox Projects</h4>
                      </div>
                      <span className="font-mono-origin text-xs font-black text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded-full">
                        {sandbox.projectsCreated} created
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center select-none">
                      <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-[8px] uppercase tracking-wide font-extrabold text-slate-400">Deployments</p>
                        <p className="text-sm font-black text-slate-800 mt-1 font-mono-origin">{sandbox.deployments}</p>
                      </div>
                      <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-[8px] uppercase tracking-wide font-extrabold text-slate-400">Executions</p>
                        <p className="text-sm font-black text-slate-800 mt-1 font-mono-origin">{sandbox.executionCount}</p>
                      </div>
                      <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-[8px] uppercase tracking-wide font-extrabold text-slate-400">Languages</p>
                        <p className="text-xs font-black text-slate-800 mt-1.5 truncate font-mono-origin">{sandbox.languagesUsed.join(', ') || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Recent Sandbox projects list */}
                    <div>
                      <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 font-mono-origin">Recent Projects</h5>
                      {sandbox.recentProjects.length === 0 ? (
                        <p className="text-[11px] text-slate-450 italic">No project repository initialized.</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {sandbox.recentProjects.map((proj, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs font-bold bg-slate-50 p-2 border border-slate-100 rounded-xl">
                              <span className="truncate">{proj.title}</span>
                              <span className="text-[9.5px] uppercase font-bold text-cyan-600 font-mono-origin">{proj.language}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Codex Card */}
                  <div className="border border-slate-150 rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Database size={18} className="text-violet-500" />
                        <h4 className="text-xs font-black text-slate-850">Codex Collaborative Workspaces</h4>
                      </div>
                      <span className="font-mono-origin text-xs font-black text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full">
                        {codex.workspaces.length} workspaces
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center select-none">
                      <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-[8.5px] uppercase tracking-wide font-extrabold text-slate-400">Git Commits</p>
                        <p className="text-xs font-black text-slate-800 mt-1 font-mono-origin">{codex.gitCommits}</p>
                      </div>
                      <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-[8.5px] uppercase tracking-wide font-extrabold text-slate-400">Tasks Completed</p>
                        <p className="text-xs font-black text-slate-800 mt-1 font-mono-origin">{codex.tasksCompleted}</p>
                      </div>
                      <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-[8.5px] uppercase tracking-wide font-extrabold text-slate-400">Pull Requests</p>
                        <p className="text-xs font-black text-slate-800 mt-1 font-mono-origin">{codex.pullRequests}</p>
                      </div>
                      <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-[8.5px] uppercase tracking-wide font-extrabold text-slate-400">Issues</p>
                        <p className="text-xs font-black text-slate-800 mt-1 font-mono-origin">{codex.issues}</p>
                      </div>
                    </div>

                    {/* Workspaces List */}
                    <div>
                      <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 font-mono-origin">Active workspaces</h5>
                      {codex.workspaces.length === 0 ? (
                        <p className="text-[11px] text-slate-450 italic">No workspace instances detected.</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {codex.workspaces.map((ws, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs font-bold bg-slate-50 p-2 border border-slate-100 rounded-xl">
                              <span className="truncate">{ws.name}</span>
                              <span className="text-[8px] uppercase tracking-wider font-extrabold bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded leading-none">{ws.role}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 4: SOCIAL & COMMUNITY */}
            {activeTab === 'community' && (
              <div className="flex flex-col gap-6">
                
                {/* Stats cards grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 select-none">
                  {[
                    { label: 'Discussion Posts', value: community.postsCount, icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Comments Left', value: community.commentsCount, icon: ThumbsUp, color: 'text-sky-600 bg-sky-50' },
                    { label: 'Followers', value: community.followersCount, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
                    { label: 'Following', value: community.followingCount, icon: Users, color: 'text-purple-600 bg-purple-50' },
                  ].map((card, idx) => (
                    <div key={idx} className="p-4 border border-slate-100 rounded-2xl flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                        <card.icon size={18} />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wide font-extrabold text-slate-400 leading-none">{card.label}</p>
                        <p className="text-base font-black text-slate-800 mt-1 font-mono-origin leading-none">{card.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Communities and Likes indicators */}
                <div className="border border-slate-100 rounded-2xl p-5">
                  <h4 className="text-xs font-black text-slate-850 mb-3">Community Interaction Statistics</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700 text-center">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] uppercase font-extrabold text-slate-400 mb-1">Joined Communities</p>
                      <p className="text-xl font-black text-slate-800 font-mono-origin">{community.communitiesJoinedCount}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] uppercase font-extrabold text-slate-400 mb-1">Interaction Likes</p>
                      <p className="text-xl font-black text-slate-800 font-mono-origin">{community.likesCount}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: SECURITY & DEVICES */}
            {activeTab === 'history' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-none">Login History & Device Sessions</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Audit active sessions, browser versions, operating systems, and IP locations.</p>
                </div>

                {devices.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">
                    <Monitor size={36} className="mx-auto mb-2 opacity-50" />
                    <span className="text-xs font-semibold">No device sessions tracked for this user</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {devices.map((dev) => (
                      <div
                        key={dev.id}
                        className={`p-4 border rounded-2xl flex items-center justify-between transition-all
                          ${dev.isCurrent ? 'bg-emerald-50/40 border-emerald-100' : 'border-slate-100 bg-slate-50/50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-150 flex items-center justify-center shrink-0 text-slate-500 shadow-xs">
                            {dev.os.toLowerCase().includes('windows') || dev.os.toLowerCase().includes('mac')
                              ? <Monitor size={18} />
                              : <Smartphone size={18} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-slate-850">{dev.deviceName}</span>
                              {dev.isCurrent && (
                                <span className="text-[8px] uppercase tracking-wider font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded leading-none">
                                  Current tab
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {dev.browser} • IP: <span className="font-mono-origin font-bold text-slate-650">{dev.ipAddress}</span> ({dev.location})
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-450 font-mono-origin">
                          Active: {new Date(dev.lastActiveAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
