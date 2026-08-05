import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Award, ClipboardList, ShieldCheck, CreditCard, ChevronRight,
  TrendingUp, Activity, HardDrive, AlertCircle, Calendar,
  GraduationCap, Code2
} from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin.js';

// User Analytics double curved line chart
const UserAnalyticsChart = ({ registrationStats }) => {
  const counts = registrationStats?.map(s => s.count) || [0, 0, 0, 0, 0, 0, 0];
  const maxCount = Math.max(...counts, 1);

  // Plotting a clean line using the counts
  const points = counts.map((count, idx) => {
    const x = idx * 50;
    const y = 100 - (count / maxCount) * 80;
    return `${x} ${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  return (
    <div className="relative w-full h-44 select-none">
      <div className="absolute inset-0 flex flex-col justify-between py-1 text-[9px] font-bold text-slate-400 font-mono-origin text-right pr-2">
        <span>{maxCount}</span>
        <span>{Math.round(maxCount / 2)}</span>
        <span>0</span>
      </div>
      <div className="pl-10 h-36 flex flex-col justify-between relative border-b border-slate-100 pb-1">
        {/* Horizontal grid lines */}
        <div className="border-t border-dashed border-slate-100/70 w-full" />
        <div className="border-t border-dashed border-slate-100/70 w-full" />
        <div className="border-t border-dashed border-slate-100/70 w-full" />

        {/* Curved Paths */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
          <path
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {counts.map((count, idx) => {
            const x = idx * 50;
            const y = 100 - (count / maxCount) * 80;
            return (
              <circle key={idx} cx={x} cy={y} r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            );
          })}
        </svg>
      </div>
      {/* Days labels */}
      <div className="pl-10 flex justify-between text-[9px] font-bold text-slate-400 font-mono-origin mt-2 px-1 text-center font-semibold">
        {registrationStats?.map((s, idx) => (
          <span key={idx}>{s.label}</span>
        ))}
      </div>
    </div>
  );
};

// Segmented User Distribution Doughnut Chart
const UserDistributionChart = ({ students = 0, instructors = 0, admins = 0 }) => {
  const total = students + instructors + admins;
  const studentPct = total > 0 ? students / total : 0.81;
  const instructorPct = total > 0 ? instructors / total : 0.13;
  const adminPct = total > 0 ? admins / total : 0.06;

  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <div className="relative flex items-center justify-center shrink-0 select-none">
      <svg height="100" width="100" className="select-none">
        <circle stroke="#f1f5f9" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx="50" cy="50" />
        {/* Segment 1: Students (Blue) */}
        <circle stroke="#3b82f6" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - studentPct)} r={normalizedRadius} cx="50" cy="50" className="origin-center -rotate-90" />
        {/* Segment 2: Instructors (Orange) */}
        <circle stroke="#f59e0b" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - instructorPct)} r={normalizedRadius} cx="50" cy="50" className="origin-center rotate-[120deg]" strokeLinecap="round" />
        {/* Segment 3: Admins (Purple) */}
        <circle stroke="#8b5cf6" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - adminPct)} r={normalizedRadius} cx="50" cy="50" className="origin-center rotate-[240deg]" strokeLinecap="round" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-base font-black text-slate-800 font-mono-origin leading-none">{total}</span>
        <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-widest font-mono-origin mt-0.5">Total Users</span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { stats, status, error, refetch } = useAdmin();
  const cardClass = "bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between";

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-bold text-slate-500 animate-pulse font-mono">Loading Admin Dashboard Data...</div>
      </div>
    );
  }

  if (status === 'failed' || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="text-sm font-bold text-rose-500 font-mono">Failed to load admin dashboard data: {error || 'Unknown error'}</div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const {
    totalUsers,
    students,
    instructors,
    admins,
    totalCourses,
    totalSandboxProjects,
    totalRevenue,
    activeCollabs,
    registrationStats,
    health,
    pending,
    recentSubmissions,
    recentAlerts,
    monthlyGrowth,
  } = stats;

  const formatRevenue = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-800 bg-[#F8FAFC]">

      {/* Top 5 Stats widgets row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, sub: `${monthlyGrowth >= 0 ? '+' : ''}${monthlyGrowth}% this month`, color: 'indigo', icon: Users },
          { label: 'Instructors', value: instructors, sub: 'Seeded in system', color: 'blue', icon: GraduationCap },
          { label: 'Courses', value: totalCourses, sub: 'Active learning paths', color: 'amber', icon: ClipboardList },
          { label: 'Active Projects', value: totalSandboxProjects, sub: 'Practice environments', color: 'emerald', icon: Code2 },
          { label: 'Revenue', value: formatRevenue(totalRevenue), sub: 'Lifetime sales', color: 'rose', icon: CreditCard },
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
                    <TrendingUp size={11} className="shrink-0" /> {sub}
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
            </div>
            <UserAnalyticsChart registrationStats={registrationStats} />
          </div>
          {/* Chart legends */}
          <div className="flex items-center justify-center gap-4 mt-2 select-none">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 font-mono-origin">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>Daily Registrations</span>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className={cardClass}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono-origin">User Distribution</p>
            <div className="flex items-center gap-6 py-2 select-none">
              <UserDistributionChart students={students} instructors={instructors} admins={admins} />
              <div className="flex-1 flex flex-col gap-2.5">
                {[
                  { label: 'Students', value: students, ratio: `${students + instructors + admins > 0 ? Math.round((students / (students + instructors + admins)) * 100) : 0}%`, color: 'bg-blue-500' },
                  { label: 'Instructors', value: instructors, ratio: `${students + instructors + admins > 0 ? Math.round((instructors / (students + instructors + admins)) * 100) : 0}%`, color: 'bg-amber-500' },
                  { label: 'Admins', value: admins, ratio: `${students + instructors + admins > 0 ? Math.round((admins / (students + instructors + admins)) * 100) : 0}%`, color: 'bg-purple-500' },
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
                { name: 'Server Status', val: health?.api?.status === 'up' ? 'Online' : 'Offline', style: 'text-emerald-600 font-bold' },
                { name: 'Database', val: health?.mongodb?.status === 'up' ? 'Online' : 'Offline', style: 'text-emerald-600 font-bold' },
                { name: 'Storage', val: `${health?.memory?.usagePercent || 0}% Used`, style: 'text-amber-600 font-bold' },
                { name: 'API Response', val: `${health?.averageResponseTimeMs || 0}ms`, style: 'text-emerald-600 font-bold' },
                { name: 'Uptime', val: `${Math.round((health?.api?.uptimeSeconds || 0) / 3600)}h`, style: 'text-emerald-600 font-bold' },
              ].map((h) => (
                <div key={h.name} className="flex items-center justify-between text-[10.5px] font-bold text-slate-550 font-mono-origin select-none">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${h.val.includes('Online') || h.val.includes('ms') ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span>{h.name}</span>
                  </div>
                  <span className={h.style}>{h.val}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/admin/system-health" className="mt-4 block w-full py-2 bg-indigo-50/60 hover:bg-indigo-50 text-[#6366f1] rounded-xl text-center text-xs font-bold font-mono-origin uppercase tracking-wider transition-all">
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
                { label: 'Instructor Applications', count: `${pending?.applications || 0} Pending`, icon: GraduationCap, color: 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' },
                { label: 'Course Approvals', count: `${pending?.courses || 0} Pending`, icon: ClipboardList, color: 'bg-amber-50 text-amber-600 border border-amber-100/50' },
                { label: 'Resource Approvals', count: `${pending?.reports || 0} Pending`, icon: HardDrive, color: 'bg-indigo-50 text-indigo-650 border border-indigo-100/50' },
                { label: 'Event Approvals', count: `${pending?.events || 0} Pending`, icon: Calendar, color: 'bg-rose-50 text-rose-600 border border-rose-100/50' },
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
                    <th className="py-2 text-[9px] font-black text-slate-400 uppercase font-mono-origin">Submitted By</th>
                    <th className="py-2 text-[9px] font-black text-slate-400 uppercase font-mono-origin text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentSubmissions && recentSubmissions.length > 0 ? (
                    recentSubmissions.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30">
                        <td className="py-2 text-[10px] font-bold text-slate-700 font-mono-origin uppercase tracking-wide truncate max-w-[120px]">{row.a}</td>
                        <td className="py-2 text-[9.5px] font-semibold text-slate-505 text-slate-500 font-sans-origin truncate max-w-[100px]">{row.c}</td>
                        <td className="py-2 text-[10px] font-bold text-slate-800 text-right font-mono-origin">{row.s}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-4 text-center text-xs text-slate-400 font-mono">No recent submissions</td>
                    </tr>
                  )}
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
                <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider font-mono-origin leading-none">Active Workspaces</p>
                <p className="text-lg font-black text-slate-800 font-mono-origin mt-1.5 leading-none">{activeCollabs}</p>
              </div>
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
              {recentAlerts && recentAlerts.length > 0 ? (
                recentAlerts.map((a, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/60 border border-slate-100 select-none text-left">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border bg-rose-50 text-rose-550 border-rose-100/50">
                      <AlertCircle size={11} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-800 truncate font-mono-origin uppercase tracking-wider">{a.text}</p>
                      <p className="text-[9px] text-slate-450 mt-0.5 font-sans-origin font-medium">{a.sub}</p>
                    </div>
                    <span className="shrink-0 text-[8.5px] text-slate-450 font-sans-origin font-medium">{a.time}</span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-slate-400 font-mono">No recent actions logged</div>
              )}
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
