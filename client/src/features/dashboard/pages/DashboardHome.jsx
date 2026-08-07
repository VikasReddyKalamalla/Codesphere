import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Code2, Users, Award, Terminal, Play,
  Layers, MessageSquare, Video, ChevronRight, CreditCard,
  ClipboardList, Compass, Briefcase, Calendar, BookOpen, User,
  CheckCircle2, ShieldCheck, MapPin, Pin, Bell, FileText, Clock, Key,
  Mic, Monitor, AlertCircle, HelpCircle, CheckSquare, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchDashboardDataAPI } from '../services/dashboardAPI.js';

// SVG Circular Progress Gauge
const CircularProgress = ({ percentage, color = '#6366f1' }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="select-none">
        <circle
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-800"
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
        <span className="text-base font-extrabold text-slate-800 dark:text-white font-mono-origin">{percentage}%</span>
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
        <circle stroke="currentColor" className="text-slate-200 dark:text-slate-800" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        {/* Segment 1: Applied (Emerald) */}
        {count > 0 && applied > 0 && (
          <circle stroke="#10b981" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - applied / count)} r={normalizedRadius} cx={radius} cy={radius} className="origin-center -rotate-90" />
        )}
        {/* Segment 2: In Review (Indigo) */}
        {count > 0 && inReview > 0 && (
          <circle stroke="#6366f1" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - (applied + inReview) / count)} r={normalizedRadius} cx={radius} cy={radius} className="origin-center rotate-[45deg]" strokeLinecap="round" />
        )}
        {/* Segment 3: Shortlisted (Yellow) */}
        {count > 0 && shortlisted > 0 && (
          <circle stroke="#f59e0b" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - (applied + inReview + shortlisted) / count)} r={normalizedRadius} cx={radius} cy={radius} className="origin-center rotate-[150deg]" strokeLinecap="round" />
        )}
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-lg font-black text-slate-800 dark:text-white font-mono-origin leading-none">{count}</span>
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
              className={`w-full rounded-t-full transition-all duration-500 ${d.active ? 'bg-indigo-600' : 'bg-slate-300'}`} 
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

  const cardClass = "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300";

  const activePath = dbData?.continueLearning?.[0] || {
    title: 'No Active Pathway Enrolled',
    completionPercentage: 0,
    continueRoute: '/learning',
    nextLesson: 'Explore 83 Tech Roadmaps to enroll in a learning path!'
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full text-left bg-slate-50 dark:bg-slate-950 transition-colors duration-200 font-sans pb-12 select-none">

      {/* Main middle dashboard content (3 cols wide) */}
      <div className="xl:col-span-3 flex flex-col gap-6">

        {/* ── Premium Hero Welcome Banner ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span>CS STUDENT PORTAL</span>
                </span>
                <span className="text-xs font-mono text-slate-400">• {currentDateStr}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                Welcome back, {user?.fullName?.split(' ')[0] || 'Developer'}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                You have active learning roadmaps waiting. Keep building your skills with our 83 PDF-backed curricula.
              </p>
            </div>

            {/* Quick Action CTA Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/sandbox"
                className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-2xl border border-slate-700 transition-all cursor-pointer shadow-sm"
              >
                <Terminal size={15} className="text-indigo-400" />
                <span>Launch Studio</span>
              </Link>
              <Link
                to="/learning"
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold rounded-2xl transition-all cursor-pointer shadow-lg shadow-indigo-900/40 border border-indigo-500/30"
              >
                <BookOpen size={15} />
                <span>Browse Roadmaps</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Active Focus Spotlight (Resume Learning Banner) ── */}
        <div className="bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/90 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/40 border border-indigo-200/80 dark:border-indigo-800/40 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-mono font-black text-xl shadow-inner">
              &lt;/&gt;
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/20">
                  CURRENT FOCUS PATHWAY
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">{activePath.completionPercentage || 0}% Complete</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white truncate font-mono">
                {activePath.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                Next: {activePath.nextLesson || 'Phase 1: Core Foundations & Setup'}
              </p>
            </div>
          </div>

          <Link
            to={activePath.continueRoute}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs rounded-2xl transition-all shadow-md shadow-indigo-600/20 shrink-0 border border-indigo-500/30"
          >
            <Play size={14} className="fill-white" />
            <span>RESUME LEARNING</span>
          </Link>
        </div>

        {/* ── Key Metrics Overview Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Courses Enrolled', value: String(dbData?.stats?.learningPathsEnrolled ?? 83), sub: `${dbData?.continueLearning?.length ?? 1} in progress`, color: 'indigo', icon: GraduationCap },
            { label: 'Assignments Due', value: String(dbData?.stats?.assignmentsDue ?? 0), sub: `${dbData?.stats?.assignmentsDueThisWeek ?? 0} due this week`, color: 'amber', icon: ClipboardList },
            { label: 'Sessions Joined', value: String(dbData?.stats?.sessionsJoined ?? 0), sub: 'Live learning slots', color: 'blue', icon: ShieldCheck },
            { label: 'Communities Joined', value: String(dbData?.stats?.communitiesJoined ?? 4), sub: 'Active tech circles', color: 'purple', icon: Briefcase },
            { label: 'Resources Saved', value: String(dbData?.stats?.resourcesSaved ?? 12), sub: 'Saved articles & tools', color: 'rose', icon: User },
          ].map(({ label, value, sub, color, icon: Icon }) => {
            const colorStyles = {
              indigo:  'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400',
              amber:   'bg-amber-500/10 border-amber-500/20 text-amber-500',
              blue:    'bg-blue-500/10 border-blue-500/20 text-blue-500 dark:text-blue-400',
              purple:  'bg-purple-500/10 border-purple-500/20 text-purple-500 dark:text-purple-400',
              rose:    'bg-rose-500/10 border-rose-500/20 text-rose-500',
            };
            return (
              <div key={label} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-3.5 select-none">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${colorStyles[color]}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono leading-none">{label}</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-1 font-mono leading-none">{value}</p>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1.5 font-sans leading-none">{sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Progress Breakdown & Deadlines Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* My Learning Progress */}
          <div className={`${cardClass} flex flex-col justify-between`}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Overall Path Completion</p>
              <div className="flex items-center justify-center gap-6 py-2">
                <CircularProgress 
                  percentage={
                    dbData?.continueLearning?.length 
                      ? Math.round(dbData.continueLearning.reduce((acc, curr) => acc + (curr.completionPercentage || 0), 0) / dbData.continueLearning.length) 
                      : 35
                  } 
                  color="#6366f1" 
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 font-mono-origin">Completed</span>
                    <span className="text-[11px] font-extrabold text-slate-900 dark:text-white ml-auto font-mono-origin">
                      {dbData?.stats?.certificatesEarned ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 font-mono-origin">In Progress</span>
                    <span className="text-[11px] font-extrabold text-slate-900 dark:text-white ml-auto font-mono-origin">
                      {dbData?.continueLearning?.length ?? 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 font-mono-origin">Not Started</span>
                    <span className="text-[11px] font-extrabold text-slate-900 dark:text-white ml-auto font-mono-origin">
                      {dbData?.stats?.notStartedPaths ?? 82}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/learning" className="mt-4 block w-full py-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-800/40 rounded-2xl text-center text-xs font-bold font-mono uppercase tracking-wider transition-all">
              View All 83 Roadmaps
            </Link>
          </div>

          {/* Currently Learning List */}
          <div className={`${cardClass} flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono-origin">Active Roadmaps</p>
                <Link to="/learning" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-mono-origin uppercase tracking-wider">View All</Link>
              </div>
              <div className="flex flex-col gap-3">
                {dbData?.continueLearning && dbData.continueLearning.length > 0 ? (
                  dbData.continueLearning.slice(0, 3).map((path) => (
                    <Link key={path.learningPathId} to={path.continueRoute} className="flex gap-3 items-center text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 p-2 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                      <div className="shrink-0">
                        <div className="w-10 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold font-mono shadow-xs select-none">
                          &lt;/&gt;
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate font-mono">{path.title}</span>
                          <span className="text-xs font-mono font-extrabold text-indigo-600 dark:text-indigo-400">{path.completionPercentage || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${path.completionPercentage || 0}%` }} />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <GraduationCap className="w-8 h-8 text-slate-350 dark:text-slate-600 mb-2" />
                    <p className="text-xs text-slate-400 font-semibold font-mono">No enrolled courses in progress.</p>
                    <Link to="/learning" className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold font-mono uppercase mt-1">Browse 83 courses</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className={`${cardClass} flex flex-col justify-between`}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Upcoming Deadlines & Schedule</p>
              <div className="flex flex-col gap-2.5">
                {dbData?.deadlines && dbData.deadlines.length > 0 ? (
                  dbData.deadlines.map((t) => (
                    <div key={t.title} className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/50 flex items-center justify-center shrink-0 text-indigo-500">
                        <CheckSquare size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate font-mono uppercase tracking-wider">{t.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-sans font-medium">{t.desc}</p>
                      </div>
                      <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono shrink-0 ${t.color}`}>
                        {t.tag}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckSquare className="w-7 h-7 text-slate-350 dark:text-slate-600 mb-1.5" />
                    <p className="text-xs text-slate-400 font-semibold font-mono">No upcoming deadlines.</p>
                  </div>
                )}
              </div>
            </div>
            <Link to="/tests" className="mt-4 block w-full py-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-800/40 rounded-2xl text-center text-xs font-bold font-mono uppercase tracking-wider transition-all">
              View Calendar Schedule
            </Link>
          </div>
        </div>

        {/* ── Applications & Smart Reminders Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Job Application Tracker */}
          <div className={`${cardClass}`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono-origin">Job Application Tracker</p>
              <Link to="/sandbox" className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline font-mono-origin uppercase tracking-wider">View All</Link>
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
                  <div className="flex flex-col gap-2 flex-1 font-mono">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Applied</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{applied}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">In Review</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{inReview}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Shortlisted</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{shortlisted}</span>
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
                  <div key={i.title} className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-extrabold text-xs text-white bg-indigo-600">
                        {i.tag}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate font-mono uppercase tracking-wider">{i.title}</p>
                            <p className="text-[10px] text-slate-400 font-sans font-semibold mt-0.5">{i.host}</p>
                          </div>
                          <span className="shrink-0 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/50 font-mono">
                            {i.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Briefcase className="w-7 h-7 text-slate-350 dark:text-slate-600 mb-1.5" />
                  <p className="text-xs text-slate-400 font-semibold font-mono">No upcoming interviews.</p>
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
                    <div key={r.title} className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${r.color}`}>
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate font-mono uppercase tracking-wider">{r.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-sans font-medium">{r.desc}</p>
                      </div>
                      <span className="shrink-0 text-[8.5px] font-bold text-indigo-500 font-mono">
                        {r.time}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="w-7 h-7 text-slate-350 dark:text-slate-600 mb-1.5" />
                  <p className="text-xs text-slate-400 font-semibold font-mono">No active reminders.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ── Right Column (Notifications & Campus Hub - 1 col wide) ── */}
      <div className="xl:col-span-1 flex flex-col gap-6 animate-fade-in">

        {/* Notifications */}
        <div className={`${cardClass} flex flex-col justify-between min-h-[380px]`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono-origin">Notifications</p>
              <button className="text-[9.5px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline font-mono-origin uppercase tracking-wider cursor-pointer">Mark all as read</button>
            </div>
            <div className="flex flex-col gap-3.5">
              {dbData?.notifications?.notifications && dbData.notifications.notifications.length > 0 ? (
                dbData.notifications.notifications.map((n, idx) => {
                  const colors = {
                    'Information': 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100/50 dark:border-indigo-900/50',
                    'Success': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border-emerald-100/50 dark:border-emerald-900/50',
                    'Warning': 'bg-amber-50 dark:bg-amber-950/40 text-amber-550 border-amber-100/50 dark:border-amber-900/50',
                    'Error': 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 border-rose-100/50 dark:border-rose-900/50',
                    'Reminder': 'bg-teal-50 dark:bg-teal-950/40 text-teal-500 border-teal-100/50 dark:border-teal-900/50',
                  };
                  const icons = {
                    'Information': ShieldCheck,
                    'Success': CheckCircle2,
                    'Warning': AlertCircle,
                    'Error': AlertCircle,
                    'Reminder': Calendar,
                  };
                  const Icon = icons[n.type] || FileText;
                  const colorClass = colors[n.type] || 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-100/50 dark:border-slate-800';

                  const timeStr = new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div key={idx} className="flex items-start gap-2.5 text-left select-none">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${colorClass}`}>
                        <Icon size={11} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate font-mono-origin uppercase tracking-wider">{n.title}</p>
                          <span className="text-[8.5px] text-slate-400 shrink-0 font-sans-origin font-medium">{timeStr}</span>
                        </div>
                        <p className="text-[9.5px] text-slate-450 truncate font-sans-origin font-medium mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Bell size={24} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No new notifications</p>
                </div>
              )}
            </div>
          </div>
          <Link to="/notifications" className="mt-4 block w-full py-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-800/40 rounded-2xl text-center text-xs font-bold font-mono uppercase tracking-wider transition-all">
            View All Notifications
          </Link>
        </div>

        {/* Campus Hub 2.0 */}
        <div className={`${cardClass}`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Campus Hub 2.0</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Notice Board', icon: Layers,         color: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50 text-blue-500 dark:text-blue-400' },
              { label: 'Events',       icon: Calendar,       color: 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50 text-rose-500 dark:text-rose-400' },
              { label: 'Clubs',        icon: ShieldCheck,    color: 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50 text-purple-500 dark:text-purple-400' },
              { label: 'Hackathons',   icon: Compass,        color: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50 text-indigo-500 dark:text-indigo-400' },
              { label: 'Podcast',      icon: Video,          color: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50 text-indigo-500 dark:text-indigo-400' },
              { label: 'Mentorship',   icon: Award,          color: 'bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/50 text-sky-500 dark:text-sky-400' },
            ].map((item) => (
              <Link 
                key={item.label} 
                to="/events" 
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs transition-all text-center group"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${item.color} group-hover:scale-105 transition-transform`}>
                  <item.icon size={14} />
                </div>
                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 font-mono leading-tight">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Student Quick Action Hub */}
        <div className={`${cardClass} flex flex-col justify-between`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono-origin">
              Quick Learning Shortcuts
            </p>
            <div className="flex flex-col gap-2">
              <Link to="/learning" className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50 flex items-center justify-between text-xs font-mono font-bold transition-all">
                <span>Explore 83 Tech Roadmaps</span>
                <ChevronRight size={14} />
              </Link>
              <Link to="/dsa" className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs font-mono font-bold transition-all">
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

