import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Award, ClipboardList, ShieldCheck, CreditCard, ChevronRight,
  TrendingUp, Activity, HardDrive, CheckCircle2, AlertCircle, Calendar, PlusCircle, Server,
  GraduationCap, Code2
} from 'lucide-react';
import { motion } from 'framer-motion';

// User Analytics double curved line chart
const UserAnalyticsChart = () => {
  return (
    <div className="relative w-full h-44 select-none">
      <div className="absolute inset-0 flex flex-col justify-between py-1 text-[9px] font-bold text-slate-400 font-mono-origin text-right pr-2">
        <span>15K</span>
        <span>10K</span>
        <span>5K</span>
        <span>0</span>
      </div>
      <div className="pl-10 h-36 flex flex-col justify-between relative border-b border-slate-100 pb-1">
        {/* Horizontal grid lines */}
        <div className="border-t border-dashed border-slate-100/70 w-full" />
        <div className="border-t border-dashed border-slate-100/70 w-full" />
        <div className="border-t border-dashed border-slate-100/70 w-full" />
        
        {/* Curved Paths */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
          {/* Path 1: New Users (Cyan) */}
          <path 
            d="M 0 95 Q 50 50 100 70 T 200 45 T 300 35" 
            fill="none" 
            stroke="#06b6d4" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
          {/* Path 2: Active Users (Green) */}
          <path 
            d="M 0 85 Q 50 35 100 55 T 200 30 T 300 15" 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
          {/* Cyan nodes */}
          <circle cx="100" cy="70" r="3.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="200" cy="45" r="3.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
          {/* Green nodes */}
          <circle cx="100" cy="55" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="200" cy="30" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
      </div>
      {/* Days labels */}
      <div className="pl-10 flex justify-between text-[9px] font-bold text-slate-450 font-mono-origin mt-2 px-1 text-center font-semibold">
        <span>1 May</span>
        <span>7 May</span>
        <span>14 May</span>
        <span>21 May</span>
        <span>28 May</span>
      </div>
    </div>
  );
};

// Segmented User Distribution Doughnut Chart
const UserDistributionChart = () => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <div className="relative flex items-center justify-center shrink-0 select-none">
      <svg height="100" width="100" className="select-none">
        <circle stroke="#f1f5f9" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx="50" cy="50" />
        {/* Segment 1: Students (81% - Blue) */}
        <circle stroke="#3b82f6" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * 0.19} r={normalizedRadius} cx="50" cy="50" className="origin-center -rotate-90" />
        {/* Segment 2: Instructors (13% - Orange) */}
        <circle stroke="#f59e0b" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * 0.87} r={normalizedRadius} cx="50" cy="50" className="origin-center rotate-[200deg]" strokeLinecap="round" />
        {/* Segment 3: Admins (6% - Purple) */}
        <circle stroke="#8b5cf6" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * 0.94} r={normalizedRadius} cx="50" cy="50" className="origin-center rotate-[280deg]" strokeLinecap="round" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-base font-black text-slate-800 font-mono-origin leading-none">12,543</span>
        <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-widest font-mono-origin mt-0.5">Total Users</span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const cardClass = "bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between";

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-800 bg-[#F8FAFC]">

      {/* Top 5 Stats widgets row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', value: '12,543', sub: '+12% this week', color: 'indigo', icon: Users },
          { label: 'Instructors', value: '342', sub: '+8% this week', color: 'blue', icon: GraduationCap },
          { label: 'Courses', value: '1,245', sub: '+15% this week', color: 'amber', icon: ClipboardList },
          { label: 'Active Projects', value: '128', sub: '+10% this week', color: 'emerald', icon: Code2 },
          { label: 'Revenue', value: '₹24.8L', sub: '+18% this week', color: 'rose', icon: CreditCard },
        ].map(({ label, value, sub, color, icon: Icon }) => {
          const colors = {
            indigo:  'bg-indigo-50 border-indigo-100/50 text-indigo-500',
            blue:    'bg-blue-50 border-blue-100/50 text-blue-500',
            amber:   'bg-amber-50 border-amber-100/50 text-amber-500',
            emerald: 'bg-emerald-50 border-emerald-100/50 text-emerald-500',
            rose:    'bg-rose-50 border-rose-100/50 text-rose-500',
          };
          return (
            <div key={label} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex items-center justify-between select-none">
              <div className="flex items-center gap-3.5">
                <div>
                  <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider font-mono-origin leading-none">{label}</p>
                  <p className="text-xl font-extrabold text-slate-800 mt-1 font-mono-origin leading-none">{value}</p>
                  <p className="text-[9px] font-bold text-emerald-600 mt-1.5 font-sans-origin leading-none flex items-center gap-0.5">
                    <TrendingUp size={11} /> {sub}
                  </p>
                </div>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${colors[color]}`}>
                <Icon size={16} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Row 1 (User Analytics, User Distribution, System Health) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* User Analytics */}
        <div className={cardClass}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono-origin">User Analytics</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono-origin font-bold bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/60 select-none">
                <span>This Month</span>
                <ChevronRight size={11} className="rotate-90 text-slate-400" />
              </div>
            </div>
            <UserAnalyticsChart />
          </div>
          {/* Chart legends */}
          <div className="flex items-center justify-center gap-4 mt-2 select-none">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 font-mono-origin">
              <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
              <span>New Users</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 font-mono-origin">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>Active Users</span>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className={cardClass}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">User Distribution</p>
            <div className="flex items-center gap-6 py-2 select-none">
              <UserDistributionChart />
              <div className="flex-1 flex flex-col gap-2.5">
                {[
                  { label: 'Students', value: '10,210', ratio: '81%', color: 'bg-blue-500' },
                  { label: 'Instructors', value: '1,680', ratio: '13%', color: 'bg-amber-500' },
                  { label: 'Admins', value: '653', ratio: '6%', color: 'bg-purple-500' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px] font-bold text-slate-550 font-mono-origin">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-extrabold text-slate-800 ml-auto">{item.value} ({item.ratio})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className={cardClass}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">System Health</p>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Server Status', val: 'Online', style: 'text-emerald-600 font-bold' },
                { name: 'Database', val: 'Online', style: 'text-emerald-600 font-bold' },
                { name: 'Storage', val: '78% Used', style: 'text-amber-600 font-bold' },
                { name: 'API Response', val: '120ms', style: 'text-emerald-600 font-bold' },
                { name: 'Uptime', val: '99.9%', style: 'text-emerald-600 font-bold' },
              ].map((h) => (
                <div key={h.name} className="flex items-center justify-between text-[10.5px] font-bold text-slate-550 font-mono-origin select-none">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${h.val.includes('Online') || h.val === '99.9%' || h.val === '120ms' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span>{h.name}</span>
                  </div>
                  <span className={h.style}>{h.val}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/admin/health" className="mt-4 block w-full py-2 bg-indigo-50/60 hover:bg-indigo-50 text-[#6366f1] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
            View System Logs
          </Link>
        </div>
      </div>

      {/* Grid Row 2 (Pending Approvals, Assignment queue table, project collaboration, recent system alerts) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Pending Approvals */}
        <div className={cardClass}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Pending Approvals</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Instructor Applications', count: '12 Pending', icon: GraduationCap, color: 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' },
                { label: 'Course Approvals', count: '8 Pending', icon: ClipboardList, color: 'bg-amber-50 text-amber-600 border border-amber-100/50' },
                { label: 'Resource Approvals', count: '15 Pending', icon: HardDrive, color: 'bg-indigo-50 text-indigo-650 border border-indigo-100/50' },
                { label: 'Event Approvals', count: '5 Pending', icon: Calendar, color: 'bg-rose-50 text-rose-600 border border-rose-100/50' },
              ].map((p, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/60 border border-slate-100 select-none">
                  <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center shrink-0 border ${p.color}`}>
                    <p.icon size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10.5px] font-bold text-slate-700 truncate font-mono-origin uppercase tracking-wider">{p.label}</p>
                  </div>
                  <span className="shrink-0 text-[8.5px] font-bold text-slate-450 font-mono-origin uppercase">
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/admin/moderation" className="mt-4 block w-full py-2 bg-indigo-50/60 hover:bg-indigo-50 text-[#6366f1] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
            View All
          </Link>
        </div>

        {/* Assignment Review Queue */}
        <div className={`${cardClass} md:col-span-1`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono-origin">Assignment Review Queue</p>
            <div className="overflow-x-auto w-full no-scrollbar">
              <table className="w-full text-left border-collapse select-none">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-2 text-[9px] font-black text-slate-400 uppercase font-mono-origin">Assignment</th>
                    <th className="py-2 text-[9px] font-black text-slate-400 uppercase font-mono-origin">Course</th>
                    <th className="py-2 text-[9px] font-black text-slate-400 uppercase font-mono-origin text-right">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { a: 'React Project', c: 'Full Stack Web Dev', s: 24 },
                    { a: 'Node.js API', c: 'Backend Development', s: 18 },
                    { a: 'UI/UX Case Study', c: 'UI/UX Design', s: 12 },
                    { a: 'DBMS Lab Report', c: 'Database Systems', s: 30 },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30">
                      <td className="py-2 text-[10px] font-bold text-slate-700 font-mono-origin uppercase tracking-wide">{row.a}</td>
                      <td className="py-2 text-[9.5px] font-semibold text-slate-500 font-sans-origin">{row.c}</td>
                      <td className="py-2 text-[10px] font-bold text-slate-800 text-right font-mono-origin">{row.s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Link to="/admin/content" className="mt-4 block w-full py-2 bg-indigo-50/60 hover:bg-indigo-50 text-[#6366f1] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
            Review All
          </Link>
        </div>

        {/* Project Collaborations */}
        <div className={cardClass}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Project Collaborations</p>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 select-none">
              <div>
                <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider font-mono-origin leading-none">Active Collabs</p>
                <p className="text-lg font-black text-slate-800 font-mono-origin mt-1.5 leading-none">128 <span className="text-emerald-500 text-[10px] font-bold ml-1">+15%</span></p>
              </div>
              <div className="text-right">
                <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider font-mono-origin leading-none">New This Week</p>
                <p className="text-lg font-black text-slate-800 font-mono-origin mt-1.5 leading-none">24 <span className="text-emerald-500 text-[10px] font-bold ml-1">+10%</span></p>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-3.5">
              {[
                { title: 'CodeSphere 2.0', count: '12 Teams' },
                { title: 'NeuroHabit', count: '8 Teams' },
                { title: 'Campus Hub 2.0', count: '6 Teams' },
              ].map((p, idx) => (
                <div key={idx} className="flex items-center justify-between select-none">
                  <span className="text-[10.5px] font-bold text-slate-700 font-mono-origin uppercase tracking-wider truncate">{p.title}</span>
                  <span className="shrink-0 text-[10px] font-bold text-slate-500 font-mono-origin">{p.count}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/admin/features" className="mt-4 block w-full py-2 bg-indigo-50/60 hover:bg-indigo-50 text-[#6366f1] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
            View All Projects
          </Link>
        </div>

        {/* Recent System Alerts */}
        <div className={cardClass}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">Recent System Alerts</p>
            <div className="flex flex-col gap-3">
              {[
                { text: 'High CPU Usage', sub: 'Server 02', time: '10m ago', color: 'bg-rose-50 text-rose-550 border-rose-100/50' },
                { text: 'Database Backup', sub: 'Completed', time: '1h ago', color: 'bg-blue-50 text-blue-500 border-blue-100/50' },
                { text: 'New User Spike', sub: '+342 users', time: '2h ago', color: 'bg-amber-50 text-amber-550 border-amber-100/50' },
              ].map((a, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/60 border border-slate-100 select-none text-left">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${a.color}`}>
                    <AlertCircle size={11} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-800 truncate font-mono-origin uppercase tracking-wider">{a.text}</p>
                    <p className="text-[9px] text-slate-450 mt-0.5 font-sans-origin font-medium">{a.sub}</p>
                  </div>
                  <span className="shrink-0 text-[8.5px] text-slate-450 font-sans-origin font-medium">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/admin/dashboard" className="mt-4 block w-full py-2 bg-indigo-50/60 hover:bg-indigo-50 text-[#6366f1] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
            View All Alerts
          </Link>
        </div>
      </div>

    </div>
  );
}
