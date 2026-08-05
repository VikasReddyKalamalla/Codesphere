import React, { useState, useContext } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, Users, Award,
  Settings, BarChart2, Bell, Radio, EyeOff, ClipboardList,
  Activity, LogOut, Sun, Moon, ChevronLeft, ChevronRight
} from 'lucide-react';
import { logoutThunk } from '@features/auth/redux/authThunk.js';
import toast from 'react-hot-toast';
import Logo from '../components/Logo.jsx';
import { ThemeContext } from '../providers/ThemeProvider.jsx';

const adminNavItems = [
  { name: 'Dashboard',      path: '/admin/dashboard',        icon: LayoutDashboard },
  { name: 'User Registry',  path: '/admin/users',            icon: Users },
  { name: 'Admin Hub',      path: '/admin/features',         icon: Radio },
  { name: 'Instructors',    path: '/admin/instructors',      icon: Award },
  { name: 'Reports',        path: '/admin/reports',          icon: ClipboardList },
  { name: 'Moderation',     path: '/admin/moderation',       icon: EyeOff },
  { name: 'Analytics',      path: '/admin/analytics',        icon: BarChart2 },
  { name: 'Announcements',  path: '/admin/announcements',    icon: Bell },
  { name: 'System Health',  path: '/admin/system-health',    icon: Activity },
  { name: 'Settings',       path: '/admin/settings',         icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useContext(ThemeContext) || {};
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutThunk());
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          ${sidebarOpen ? 'w-56' : 'w-[64px]'}`}
      >
        {/* Logo and Brand */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Logo size="w-7 h-7" showText={sidebarOpen} textColor="text-slate-900 dark:text-white" />
            {sidebarOpen && (
              <span className="text-[10px] font-mono font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase leading-none">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 flex flex-col gap-1">
          {adminNavItems.map(({ name, path, icon: Icon }) => {
            const active = location.pathname === path || (path !== '/admin/dashboard' && location.pathname.startsWith(path));
            return (
              <NavLink
                key={path}
                to={path}
                title={!sidebarOpen ? name : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-mono font-bold tracking-wider uppercase transition-all select-none ${
                  active
                    ? 'bg-[#04AA6D] text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={15} className="shrink-0" />
                {sidebarOpen && <span>{name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Profile and Logout Bottom Block */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80'}
                alt="Admin Profile"
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover shrink-0"
              />
              {sidebarOpen && (
                <div className="min-w-0 flex flex-col">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.fullName || 'Super Admin'}</p>
                  <p className="text-[9px] text-slate-400 font-mono uppercase">System Admin</p>
                </div>
              )}
            </div>

            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-600" />}
              </button>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors text-rose-500 hover:bg-rose-500/10 cursor-pointer"
          >
            <LogOut size={14} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-[64px]'}`}>
        <header
          className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 cursor-pointer text-xs font-mono font-bold flex items-center gap-1.5"
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            <span>{sidebarOpen ? 'Collapse Menu' : 'Expand Menu'}</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              ADMIN CONTROL PANEL
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
