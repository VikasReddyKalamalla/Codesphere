import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, Users, GraduationCap, Award, ShieldAlert,
  Settings, BarChart2, Bell, Radio, EyeOff, ClipboardList,
  Activity, ArrowLeft, LogOut
} from 'lucide-react';
import { logoutThunk } from '@features/auth/redux/authThunk.js';
import toast from 'react-hot-toast';
import Logo from '../components/Logo.jsx';

const adminNavItems = [
  { name: 'Dashboard',      path: '/admin/dashboard',     icon: LayoutDashboard },
  { name: 'User Registry',  path: '/admin/users',         icon: Users },
  { name: 'Learning Paths', path: '/admin/learning',      icon: GraduationCap },
  { name: 'Instructors',    path: '/admin/instructors',   icon: Award },
  { name: 'Reports',        path: '/admin/reports',       icon: ClipboardList },
  { name: 'Moderation',     path: '/admin/moderation',    icon: EyeOff },
  { name: 'Analytics',      path: '/admin/analytics',     icon: BarChart2 },
  { name: 'Announcements',  path: '/admin/announcements', icon: Bell },
  { name: 'Features',       path: '/admin/features',      icon: Radio },
  { name: 'System Health',  path: '/admin/system-health', icon: Activity },
  { name: 'Settings',       path: '/admin/settings',      icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutThunk());
    toast.success('Signed out');
    navigate('/login');
  };

  const sidebarBorder = 'rgba(0,0,0,0.06)';

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-white border-r border-slate-200/80
          ${sidebarOpen ? 'w-56' : 'w-[64px]'}`}
      >
        {/* Logo and Brand */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Logo size="w-7 h-7" showText={sidebarOpen} textColor="text-slate-800" />
            {sidebarOpen && (
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase leading-none">
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
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[10.5px] font-bold tracking-wide uppercase transition-all font-mono-origin select-none"
                style={{
                  background: active ? '#04AA6D' : 'transparent',
                  color: active ? '#ffffff' : '#64748b',
                  boxShadow: active ? '0 4px 12px -2px rgba(4, 170, 109, 0.25)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.color = '#1e293b';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#64748b';
                  }
                }}
              >
                <Icon size={15} className="shrink-0" />
                {sidebarOpen && <span>{name}</span>}
              </NavLink>
            );
          })}

          {/* Quick exit to Student Dashboard */}
          <div className="mt-4 pt-4 border-t border-slate-150">
            <NavLink
              to="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[10.5px] font-bold tracking-wide uppercase transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft size={15} className="shrink-0" />
              {sidebarOpen && <span>Back to Dashboard</span>}
            </NavLink>
          </div>
        </nav>

        {/* Profile and Logout Bottom Block */}
        <div className="p-2 border-t border-slate-100 flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80'}
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-800 truncate leading-none">{user?.fullName || 'Super Admin'}</p>
                <p className="text-[8px] text-slate-400 mt-1 uppercase font-semibold leading-none">System Admin</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-[10.5px] font-bold tracking-wide uppercase transition-colors text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut size={15} className="shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-[64px]'}`}>
        <header
          className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50"
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-500"
          >
            {sidebarOpen ? 'Collapse menu' : 'Expand menu'}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-200/50 px-2.5 py-1 rounded-full">
              ADMIN SECURE ZONE
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
