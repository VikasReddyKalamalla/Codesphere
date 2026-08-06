import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Code2, Users, Award, Terminal, Play,
  Layers, MessageSquare, Video, ChevronRight, CreditCard,
  ClipboardList, Compass, Briefcase, Calendar, BookOpen, User,
  CheckCircle2, ShieldCheck, MapPin, Pin, Bell, FileText, Clock, Key,
  Mic, Monitor, AlertCircle, HelpCircle, CheckSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchDashboardDataAPI } from '../services/dashboardAPI.js';

// SVG Circular Progress Gauge
const CircularProgress = ({ percentage, color = '#04AA6D' }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="select-none">
        <circle
          stroke="#f1f5f9"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500 origin-center -rotate-90"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-base font-extrabold text-slate-800 font-mono-origin">{percentage}%</span>
        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest font-mono-origin">Overall</span>
      </div>
    </div>
  );
};

// Segmented circular tracker for applications
const JobProgress = ({ count = 0, applied = 0, inReview = 0, shortlisted = 0 }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="select-none">
        {/* Base Track */}
        <circle stroke="#f1f5f9" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        {/* Segment 1: Applied (Green) */}
        {count > 0 && applied > 0 && (
          <circle stroke="#10b981" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - applied / count)} r={normalizedRadius} cx={radius} cy={radius} className="origin-center -rotate-90" />
        )}
        {/* Segment 2: In Review (Blue) */}
        {count > 0 && inReview > 0 && (
          <circle stroke="#04AA6D" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - (applied + inReview) / count)} r={normalizedRadius} cx={radius} cy={radius} className="origin-center rotate-[45deg]" strokeLinecap="round" />
        )}
        {/* Segment 3: Shortlisted (Yellow) */}
        {count > 0 && shortlisted > 0 && (
          <circle stroke="#f59e0b" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - (applied + inReview + shortlisted) / count)} r={normalizedRadius} cx={radius} cy={radius} className="origin-center rotate-[150deg]" strokeLinecap="round" />
        )}
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-lg font-black text-slate-800 font-mono-origin leading-none">{count}</span>
        <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-widest font-mono-origin mt-0.5">Apps</span>
      </div>
    </div>
  );
};

// Bar chart for weekly streak active days
const StreakChart = ({ streak = 0 }) => {
  const days = [
    { name: 'M', active: streak >= 1,  height: streak >= 1 ? 25 : 10 },
    { name: 'T', active: streak >= 2,  height: streak >= 2 ? 35 : 10 },
    { name: 'W', active: streak >= 3,  height: streak >= 3 ? 18 : 10 },
    { name: 'T', active: streak >= 4,  height: streak >= 4 ? 40 : 10 },
    { name: 'F', active: streak >= 5,  height: streak >= 5 ? 28 : 10 },
    { name: 'S', active: streak >= 6,  height: streak >= 6 ? 12 : 10 },
    { name: 'S', active: streak >= 7,  height: streak >= 7 ? 44 : 10 },
  ];
  return (
    <div className="flex items-end justify-between w-full h-12 px-2 mt-4 select-none">
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
          <div className="w-1.5 rounded-t-full bg-slate-100 flex-1 flex items-end h-8 overflow-hidden">
            <div 
              className={`w-full rounded-t-full transition-all duration-500 ${d.active ? 'bg-[#04AA6D]' : 'bg-slate-300'}`} 
              style={{ height: `${d.height}%` }}
            />
          </div>
          <span className={`text-[8px] font-bold font-mono-origin ${d.active ? 'text-indigo-600' : 'text-slate-400'}`}>{d.name}</span>
        </div>
      ))}
    </div>
  );
};

export const DashboardHome = () => {
  const { user } = useSelector((s) => s.auth);
  const [dbData, setDbData]   = useState(null);

  useEffect(() => {
    fetchDashboardDataAPI()
      .then((r) => r.success && r.data && setDbData(r.data))
      .catch(() => {});
  }, []);

  const cardClass = "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors duration-200";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full text-left bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

      {/* Main middle dashboard content (3 cols wide) */}
      <div className="xl:col-span-3 flex flex-col gap-6">

        {/* Welcome Banner */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono flex items-center gap-2">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Developer'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans font-medium">Keep learning, keep building, keep growing.</p>
        </div>

        {/* Stats widgets Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Courses Enrolled', value: String(dbData?.stats?.learningPathsEnrolled ?? 0), sub: `${dbData?.continueLearning?.length ?? 0} in progress`, color: 'indigo', icon: GraduationCap, pin: true },
            { label: 'Assignments Due', value: String(dbData?.stats?.assignmentsDue ?? 0), sub: `${dbData?.stats?.assignmentsDueThisWeek ?? 0} due this week`, color: 'amber', icon: ClipboardList },
            { label: 'Sessions Joined', value: String(dbData?.stats?.sessionsJoined ?? 0), sub: 'Live learning slots', color: 'blue', icon: ShieldCheck },
            { label: 'Communities Joined', value: String(dbData?.stats?.communitiesJoined ?? 0), sub: 'Active tech circles', color: 'emerald', icon: Briefcase },
            { label: 'Resources Saved', value: String(dbData?.stats?.resourcesSaved ?? 0), sub: 'Saved articles & tools', color: 'rose', icon: User },
          ].map(({ label, value, sub, color, icon: Icon, pin }) => {
            const colors = {
              indigo:  'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50 text-indigo-500',
              amber:   'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50 text-amber-500',
              blue:    'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50 text-blue-500',
              emerald: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50 text-emerald-500',
              rose:    'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50 text-rose-500',
            };
            return (
              <div key={label} className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 select-none transition-colors">
                {pin && (
                  <Pin size={10} className="absolute top-2.5 right-2.5 text-slate-400 rotate-45" />
                )}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${colors[color]}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-[9.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider font-mono leading-none">{label}</p>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono leading-none">{value}</p>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-400 mt-1.5 font-sans leading-none">{sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* First Row: My Learning, Currently Learning, Upcoming Deadlines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* My Learning Progress */}
          <div className={`${cardClass} flex flex-col justify-between`}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">My Learning Progress</p>
              <div className="flex items-center justify-center gap-6 py-2">
                <CircularProgress 
                  percentage={
                    dbData?.continueLearning?.length 
                      ? Math.round(dbData.continueLearning.reduce((acc, curr) => acc + (curr.completionPercentage || 0), 0) / dbData.continueLearning.length) 
                      : 0
                  } 
                  color="#04AA6D" 
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-500 font-mono-origin">Completed</span>
                    <span className="text-[11px] font-extrabold text-slate-700 ml-auto font-mono-origin">
                      {dbData?.stats?.certificatesEarned ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[10px] font-bold text-slate-500 font-mono-origin">In Progress</span>
                    <span className="text-[11px] font-extrabold text-slate-700 ml-auto font-mono-origin">
                      {dbData?.continueLearning?.length ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-bold text-slate-500 font-mono-origin">Not Started</span>
                    <span className="text-[11px] font-extrabold text-slate-700 ml-auto font-mono-origin">
                      {dbData?.stats?.notStartedPaths ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/learning" className="mt-4 block w-full py-2 bg-emerald-50/60 hover:bg-emerald-100/80 text-[#04AA6D] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
              View All Courses
            </Link>
          </div>

          {/* Currently Learning */}
          <div className={`${cardClass} flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono-origin">Currently Learning</p>
                <Link to="/learning" className="text-[10px] font-bold text-[#04AA6D] hover:text-[#03935e] font-mono-origin uppercase tracking-wider">View All</Link>
              </div>
              <div className="flex flex-col gap-3.5">
                {dbData?.continueLearning && dbData.continueLearning.length > 0 ? (
                  dbData.continueLearning.slice(0, 3).map((path) => (
                    <Link key={path.learningPathId} to={path.continueRoute} className="flex gap-2.5 items-center text-left hover:bg-slate-50/50 p-1.5 rounded-xl transition-all">
                      <div className="shrink-0">
                        <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold font-mono-origin shadow-sm select-none">
                          &lt;/&gt;
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] font-bold text-slate-700 truncate font-sans-origin">{path.title}</span>
                          <span className="text-[10.5px] font-mono-origin font-extrabold text-slate-800">{path.completionPercentage || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${path.completionPercentage || 0}%` }} />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <GraduationCap className="w-8 h-8 text-slate-350 mb-2" />
                    <p className="text-xs text-slate-400 font-semibold font-mono-origin">No enrolled courses in progress.</p>
                    <Link to="/learning" className="text-[10px] text-[#04AA6D] hover:underline font-bold font-mono-origin uppercase mt-1">Browse courses</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className={`${cardClass} flex flex-col justify-between`}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Upcoming Deadlines</p>
              <div className="flex flex-col gap-2.5">
                {dbData?.deadlines && dbData.deadlines.length > 0 ? (
                  dbData.deadlines.map((t) => (
                    <div key={t.title} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/60 border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center shrink-0 text-indigo-500">
                        <CheckSquare size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10.5px] font-bold text-slate-700 truncate font-mono-origin uppercase tracking-wider">{t.title}</p>
                        <p className="text-[9.5px] text-slate-450 mt-0.5 font-sans-origin font-medium">{t.desc}</p>
                      </div>
                      <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono-origin shrink-0 ${t.color}`}>
                        {t.tag}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckSquare className="w-7 h-7 text-slate-350 mb-1.5" />
                    <p className="text-xs text-slate-400 font-semibold font-mono-origin">No upcoming deadlines.</p>
                  </div>
                )}
              </div>
            </div>
            <Link to="/tests" className="mt-4 block w-full py-2 bg-emerald-50/60 hover:bg-emerald-100/80 text-[#04AA6D] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
              View Calendar
            </Link>
          </div>
        </div>

        {/* Second Row: Job Application Tracker, Interview Tracker, Smart Reminders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Job Application Tracker */}
          <div className={`${cardClass}`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono-origin">Job Application Tracker</p>
              <Link to="/sandbox" className="text-[10px] font-bold text-[#04AA6D] hover:underline font-mono-origin uppercase tracking-wider">View All</Link>
            </div>
            {(() => {
              const applied = dbData?.jobStats?.applied ?? 0;
              const inReview = dbData?.jobStats?.inReview ?? 0;
              const shortlisted = dbData?.jobStats?.shortlisted ?? 0;
              const rejected = dbData?.jobStats?.rejected ?? 0;
              const totalApps = applied + inReview + shortlisted + rejected;

              return (
                <div className="flex items-center justify-center gap-6 py-1">
                  <JobProgress count={totalApps} applied={applied} inReview={inReview} shortlisted={shortlisted} />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9.5px] font-bold text-slate-500 font-mono-origin">Applied</span>
                      </div>
                      <span className="text-[10.5px] font-extrabold text-slate-700 font-mono-origin">{applied}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="text-[9.5px] font-bold text-slate-500 font-mono-origin">In Review</span>
                      </div>
                      <span className="text-[10.5px] font-extrabold text-slate-700 font-mono-origin">{inReview}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="text-[9.5px] font-bold text-slate-500 font-mono-origin">Shortlisted</span>
                      </div>
                      <span className="text-[10.5px] font-extrabold text-slate-700 font-mono-origin">{shortlisted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="text-[9.5px] font-bold text-slate-500 font-mono-origin">Rejected</span>
                      </div>
                      <span className="text-[10.5px] font-extrabold text-slate-700 font-mono-origin">{rejected}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Interview Tracker */}
          <div className={`${cardClass}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Interview Tracker</p>
            <div className="flex flex-col gap-3">
              {dbData?.interviews && dbData.interviews.length > 0 ? (
                dbData.interviews.map((i) => (
                  <div key={i.title} className="p-3 rounded-xl bg-slate-50/60 border border-slate-100 flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-extrabold text-xs text-white bg-[#04AA6D]">
                        {i.tag}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10.5px] font-bold text-slate-800 truncate font-mono-origin uppercase tracking-wider">{i.title}</p>
                            <p className="text-[9.5px] text-slate-450 font-sans-origin font-semibold mt-0.5">{i.host}</p>
                          </div>
                          <span className="shrink-0 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-50 text-indigo-600 border border-indigo-100/50 font-mono-origin">
                            {i.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-450 font-mono-origin uppercase font-semibold pl-11">
                      <Calendar size={11} className="text-slate-400" />
                      <span>{i.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Briefcase className="w-7 h-7 text-slate-350 mb-1.5" />
                  <p className="text-xs text-slate-400 font-semibold font-mono-origin">No upcoming interviews.</p>
                </div>
              )}
            </div>
          </div>

          {/* Smart Reminders */}
          <div className={`${cardClass}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Smart Reminders</p>
            <div className="flex flex-col gap-3">
              {dbData?.reminders && dbData.reminders.length > 0 ? (
                dbData.reminders.map((r) => {
                  const icons = { BookOpen, ClipboardList, Video, Calendar };
                  const Icon = icons[r.icon] || BookOpen;
                  return (
                    <div key={r.title} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${r.color}`}>
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10.5px] font-bold text-slate-800 truncate font-mono-origin uppercase tracking-wider">{r.title}</p>
                        <p className="text-[9.5px] text-slate-450 mt-0.5 font-sans-origin font-medium">{r.desc}</p>
                      </div>
                      <span className="shrink-0 text-[8.5px] font-bold text-indigo-500 font-mono-origin">
                        {r.time}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="w-7 h-7 text-slate-350 mb-1.5" />
                  <p className="text-xs text-slate-400 font-semibold font-mono-origin">No active reminders.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Right Column (Notifications, Campus Hub, bookings, daily streak - 1 col wide) */}
      <div className="xl:col-span-1 flex flex-col gap-6 animate-fade-in">

        {/* Notifications */}
        <div className={`${cardClass} flex flex-col justify-between min-h-[380px]`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono-origin">Notifications</p>
              <button className="text-[9.5px] font-bold text-[#04AA6D] hover:underline font-mono-origin uppercase tracking-wider cursor-pointer">Mark all as read</button>
            </div>
            <div className="flex flex-col gap-3.5">
              {dbData?.notifications?.notifications && dbData.notifications.notifications.length > 0 ? (
                dbData.notifications.notifications.map((n, idx) => {
                  const colors = {
                    'Information': 'bg-emerald-50 text-[#04AA6D] border-emerald-100/50',
                    'Success': 'bg-emerald-50 text-emerald-500 border-emerald-100/50',
                    'Warning': 'bg-amber-50 text-amber-550 border-amber-100/50',
                    'Error': 'bg-rose-50 text-rose-500 border-rose-100/50',
                    'Reminder': 'bg-teal-50 text-teal-500 border-teal-100/50',
                  };
                  const icons = {
                    'Information': ShieldCheck,
                    'Success': CheckCircle2,
                    'Warning': AlertCircle,
                    'Error': AlertCircle,
                    'Reminder': Calendar,
                  };
                  const Icon = icons[n.type] || FileText;
                  const colorClass = colors[n.type] || 'bg-slate-50 text-slate-500 border-slate-100/50';

                  const timeStr = new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div key={idx} className="flex items-start gap-2.5 text-left select-none">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${colorClass}`}>
                        <Icon size={11} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] font-bold text-slate-800 truncate font-mono-origin uppercase tracking-wider">{n.title}</p>
                          <span className="text-[8.5px] text-slate-400 shrink-0 font-sans-origin font-medium">{timeStr}</span>
                        </div>
                        <p className="text-[9.5px] text-slate-450 truncate font-sans-origin font-medium mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Bell size={24} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No new notifications</p>
                </div>
              )}
            </div>
          </div>
          <Link to="/notifications" className="mt-4 block w-full py-2 bg-emerald-50/60 hover:bg-emerald-100/80 text-[#04AA6D] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
            View All Notifications
          </Link>
        </div>

        {/* Campus Hub 2.0 */}
        <div className={`${cardClass}`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Campus Hub 2.0</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Notice Board', icon: Layers,         color: 'bg-blue-50 border-blue-100 text-blue-500' },
              { label: 'Events',       icon: Calendar,       color: 'bg-rose-50 border-rose-100 text-rose-500' },
              { label: 'Clubs',        icon: ShieldCheck,    color: 'bg-purple-50 border-purple-100 text-purple-500' },
              { label: 'Hackathons',   icon: Compass,        color: 'bg-emerald-50 border-emerald-100 text-emerald-500' },
              { label: 'Podcast',      icon: Video,          color: 'bg-indigo-50 border-indigo-100 text-indigo-500' },
              { label: 'Mentorship',   icon: Award,          color: 'bg-sky-50 border-sky-100 text-sky-500' },
            ].map((item) => (
              <Link 
                key={item.label} 
                to="/events" 
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all text-center group"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${item.color} group-hover:scale-105 transition-transform`}>
                  <item.icon size={13} />
                </div>
                <span className="text-[8.5px] font-bold text-slate-655 font-mono-origin leading-tight">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Resource Booking */}
        <div className={`${cardClass}`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Resource Booking</p>
          <div className="flex flex-col gap-3">
            {dbData?.bookings && dbData.bookings.length > 0 ? (
              dbData.bookings.map((b, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50/60 border border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-550">
                      <Monitor size={12} />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-[10.5px] font-bold text-slate-800 truncate font-mono-origin uppercase tracking-wider">{b.title}</p>
                      <p className="text-[9.5px] text-slate-450 font-sans-origin font-medium mt-0.5">{b.time}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[9px] font-bold border border-indigo-100/50 font-mono-origin uppercase tracking-wider cursor-pointer shrink-0">
                    Check In
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Monitor className="w-7 h-7 text-slate-350 mb-1.5" />
                <p className="text-xs text-slate-400 font-semibold font-mono-origin">No active bookings.</p>
              </div>
            )}
          </div>
        </div>

        {/* Student Quick Action Hub */}
        <div className={`${cardClass} flex flex-col justify-between`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono-origin">
              Quick Learning Shortcuts
            </p>
            <div className="flex flex-col gap-2">
              <Link to="/learning" className="p-3 rounded-xl bg-[#04AA6D]/10 hover:bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/30 flex items-center justify-between text-xs font-mono font-bold transition-all">
                <span>Explore 83 Tech Roadmaps</span>
                <ChevronRight size={14} />
              </Link>
              <Link to="/dsa" className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs font-mono font-bold transition-all">
                <span>DSA Compiler Playpen</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
