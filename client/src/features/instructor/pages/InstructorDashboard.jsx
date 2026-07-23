import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Users, ClipboardList, Award, Calendar, ChevronRight,
  ShieldCheck, MessageSquare, Play, Video, FileText, Bell, Trophy, BookOpen, AlertCircle, PlusCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

// SVG line graph chart component
const LineChart = () => {
  return (
    <div className="relative w-full h-44 select-none">
      <div className="absolute inset-0 flex flex-col justify-between py-1 text-[9px] font-bold text-slate-400 font-mono-origin text-right pr-2">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>
      <div className="pl-10 h-36 flex flex-col justify-between relative border-b border-slate-100 pb-1">
        {/* Horizontal grid lines */}
        <div className="border-t border-dashed border-slate-100/70 w-full" />
        <div className="border-t border-dashed border-slate-100/70 w-full" />
        <div className="border-t border-dashed border-slate-100/70 w-full" />
        <div className="border-t border-dashed border-slate-100/70 w-full" />
        
        {/* Curved Path */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#04AA6D" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#04AA6D" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Area under curve */}
          <path 
            d="M 0 90 Q 50 40 100 65 T 200 45 T 300 20 L 300 120 L 0 120 Z" 
            fill="url(#lineChartGrad)" 
          />
          {/* Wave line */}
          <path 
            d="M 0 90 Q 50 40 100 65 T 200 45 T 300 20" 
            fill="none" 
            stroke="#04AA6D" 
            strokeWidth="3.5" 
            strokeLinecap="round"
          />
          {/* Dots on peak vertices */}
          <circle cx="50" cy="52" r="4" fill="#04AA6D" stroke="#ffffff" strokeWidth="1.8" />
          <circle cx="100" cy="65" r="4" fill="#04AA6D" stroke="#ffffff" strokeWidth="1.8" />
          <circle cx="150" cy="48" r="4" fill="#04AA6D" stroke="#ffffff" strokeWidth="1.8" />
          <circle cx="200" cy="45" r="4" fill="#04AA6D" stroke="#ffffff" strokeWidth="1.8" />
          <circle cx="250" cy="30" r="4" fill="#04AA6D" stroke="#ffffff" strokeWidth="1.8" />
          <circle cx="300" cy="20" r="4" fill="#04AA6D" stroke="#ffffff" strokeWidth="1.8" />
        </svg>
      </div>
      {/* Days labels */}
      <div className="pl-10 flex justify-between text-[9px] font-bold text-slate-450 font-mono-origin mt-2 px-1.5 uppercase">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
};

// Feedback Overview chart
const FeedbackOverview = () => {
  const ratings = [
    { stars: '5 Star', percentage: 80, color: 'bg-[#04AA6D]' },
    { stars: '4 Star', percentage: 15, color: 'bg-amber-500' },
    { stars: '3 Star', percentage: 4,  color: 'bg-yellow-500' },
    { stars: '2 Star', percentage: 1,  color: 'bg-blue-500' },
    { stars: '1 Star', percentage: 0,  color: 'bg-red-500' },
  ];
  return (
    <div className="flex items-center gap-6 py-2 select-none">
      <div className="relative flex items-center justify-center shrink-0">
        <svg height="90" width="90" className="select-none">
          <circle stroke="#f1f5f9" fill="transparent" strokeWidth="7" r="33" cx="45" cy="45" />
          <circle stroke="#04AA6D" fill="transparent" strokeWidth="7" strokeDasharray="207.3" strokeDashoffset="41.4" strokeLinecap="round" r="33" cx="45" cy="45" className="origin-center -rotate-90 animate-pulse" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-slate-800 font-mono-origin leading-none">4.8</span>
          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest font-mono-origin mt-0.5">Rating</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        {ratings.map((r, i) => (
          <div key={i} className="flex items-center justify-between text-[10px] font-bold text-slate-500 font-mono-origin">
            <span className="w-10 text-left">{r.stars}</span>
            <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden mx-2">
              <div className={`h-1.5 rounded-full ${r.color}`} style={{ width: `${r.percentage}%` }} />
            </div>
            <span className="w-7 text-right font-extrabold text-slate-850">{r.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function InstructorDashboard() {
  const cardClass = "bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between";

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-800 bg-[#F8FAFC]">

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Courses', value: '8', sub: 'Active Courses', color: 'indigo', icon: GraduationCap },
          { label: 'Students', value: '243', sub: 'Total Enrolled', color: 'blue', icon: Users },
          { label: 'Assignments', value: '12', sub: 'Pending Review', color: 'amber', icon: ClipboardList },
          { label: 'Avg. Rating', value: '4.8', sub: 'From 128 Reviews', color: 'rose', icon: Award },
        ].map(({ label, value, sub, color, icon: Icon }) => {
          const colors = {
            indigo:  'bg-indigo-50 border-indigo-100/50 text-indigo-500',
            blue:    'bg-blue-50 border-blue-100/50 text-blue-500',
            amber:   'bg-amber-50 border-amber-100/50 text-amber-500',
            rose:    'bg-rose-50 border-rose-100/50 text-rose-500',
          };
          return (
            <div key={label} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex items-center justify-between select-none">
              <div className="flex items-center gap-3.5">
                <div>
                  <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider font-mono-origin leading-none">{label}</p>
                  <p className="text-xl font-extrabold text-slate-800 mt-1 font-mono-origin leading-none">{value}</p>
                  <p className="text-[9px] font-bold text-slate-400/80 mt-1.5 font-sans-origin leading-none">{sub}</p>
                </div>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${colors[color]}`}>
                <Icon size={16} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Row 1 (Line chart, Recent Assignments, Upcoming Sessions) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Student Progress Overview */}
        <div className={cardClass}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono-origin">Student Progress Overview</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono-origin font-bold bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/60 select-none">
                <span>This Week</span>
                <ChevronRight size={11} className="rotate-90 text-slate-400" />
              </div>
            </div>
            <LineChart />
          </div>
        </div>

        {/* Recent Assignments */}
        <div className={cardClass}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Recent Assignments</p>
            <div className="flex flex-col gap-3">
              {[
                { title: 'React Project Submission', count: '12 Pending' },
                { title: 'Node.js API Assignment', count: '8 Pending' },
                { title: 'MongoDB Schema Design', count: '15 Pending' },
                { title: 'UI/UX Case Study', count: '5 Pending' },
              ].map((a) => (
                <div key={a.title} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/60 border border-slate-100 select-none">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center shrink-0 text-[#04AA6D]">
                    <ClipboardList size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10.5px] font-bold text-slate-800 truncate font-mono-origin uppercase tracking-wider">{a.title}</p>
                  </div>
                  <span className="shrink-0 text-[8.5px] font-bold text-slate-450 font-mono-origin uppercase">
                    {a.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/instructor/requests" className="mt-4 block w-full py-2 bg-indigo-50/60 hover:bg-indigo-50 text-[#04AA6D] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
            View All Assignments
          </Link>
        </div>

        {/* Upcoming Live Sessions */}
        <div className={cardClass}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Upcoming Live Sessions</p>
            <div className="flex flex-col gap-3">
              {[
                { day: '20', month: 'MAY', title: 'Advanced React Patterns', time: '10:00 AM - 11:30 AM' },
                { day: '22', month: 'MAY', title: 'Building REST APIs', time: '02:00 PM - 03:30 PM' },
                { day: '24', month: 'MAY', title: 'Career Guidance Session', time: '04:00 PM - 06:00 PM' },
              ].map((s) => (
                <div key={s.title} className="p-2.5 rounded-xl bg-slate-50/60 border border-slate-100 flex items-center gap-3 select-none">
                  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/70 flex flex-col items-center justify-center shrink-0 leading-none shadow-sm">
                    <span className="text-xs font-black text-slate-800 font-mono-origin">{s.day}</span>
                    <span className="text-[8px] font-black text-indigo-500 font-mono-origin uppercase tracking-wider mt-0.5">{s.month}</span>
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[10.5px] font-bold text-slate-850 truncate font-mono-origin uppercase tracking-wider leading-snug">{s.title}</p>
                    <p className="text-[9.5px] text-slate-400 mt-0.5 font-sans-origin font-medium flex items-center gap-1">
                      <Clock size={10} className="text-slate-400 shrink-0" />
                      <span>{s.time}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link to="/instructor/live-sessions" className="mt-4 block w-full py-2 bg-indigo-50/60 hover:bg-indigo-50 text-[#04AA6D] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
            View Calendar
          </Link>
        </div>
      </div>

      {/* Grid Row 2 (Recent activity feeds, Feedback rating, Smart reminders) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Recent Student Activity */}
        <div className={cardClass}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Recent Student Activity</p>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Arjun Verma', action: 'submitted React Project', time: '10m ago', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80' },
                { name: 'Priya Singh', action: 'completed Node.js Assignment', time: '25m ago', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80' },
                { name: 'Rohan Mehta', action: 'asked a question in DSA', time: '45m ago', photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80' },
                { name: 'Sneha Kapoor', action: 'uploaded new resource', time: '1h ago', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80' },
              ].map((a, idx) => (
                <div key={idx} className="flex items-center gap-3 text-left select-none">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <img src={a.photo} alt={a.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10.5px] font-bold text-slate-800 font-sans-origin leading-tight">
                      {a.name} <span className="font-normal text-slate-500">{a.action}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-[8.5px] text-slate-400 font-sans-origin font-medium">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/instructor/students" className="mt-4 block w-full py-2 bg-indigo-50/60 hover:bg-indigo-50 text-[#04AA6D] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
            View All Activity
          </Link>
        </div>

        {/* Feedback Overview */}
        <div className={cardClass}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Feedback Overview</p>
            <FeedbackOverview />
          </div>
          <Link to="/instructor/feedback" className="mt-4 block w-full py-2 bg-indigo-50/60 hover:bg-indigo-50 text-[#04AA6D] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
            View All Feedback
          </Link>
        </div>

        {/* Smart Reminders */}
        <div className={cardClass}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Smart Reminders</p>
            <div className="flex flex-col gap-3">
              {[
                { text: 'You have 12 assignments to review', icon: ClipboardList, color: 'bg-amber-50 text-amber-500 border border-amber-100/50' },
                { text: 'Next live session in 2 days', icon: Video, color: 'bg-blue-50 text-blue-500 border border-blue-100/50' },
                { text: '3 students need attention', icon: AlertCircle, color: 'bg-emerald-50 text-emerald-550 border border-emerald-100/50' },
              ].map((r, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/60 border border-slate-100 select-none text-left">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${r.color}`}>
                    <r.icon size={13} />
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700 font-sans-origin leading-snug">{r.text}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/instructor/dashboard" className="mt-4 block w-full py-2 bg-indigo-50/60 hover:bg-indigo-50 text-[#04AA6D] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all font-semibold">
            View All Reminders
          </Link>
        </div>
      </div>

    </div>
  );
}
