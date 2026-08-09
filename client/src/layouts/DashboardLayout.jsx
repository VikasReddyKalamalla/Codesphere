import React, { useState, useContext } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, GraduationCap, Code2, Layers, MessageSquare,
  Video, Calendar, BookOpen, Award, User, CreditCard, Settings,
  ShieldAlert, Trophy, LogOut, Bell, Sun, Moon,
  ChevronLeft, ChevronRight, Menu, Search
} from 'lucide-react';
import { logoutThunk } from '@features/auth/redux/authThunk.js';
import toast from 'react-hot-toast';
import Logo from '../components/Logo.jsx';
import { ThemeContext } from '../providers/ThemeProvider.jsx';
import FriendsSidebar from '../features/network/components/FriendsSidebar.jsx';

const studentNavItems = [
  { name: 'Dashboard',    path: '/dashboard',    icon: LayoutDashboard },
  { name: 'Learning',     path: '/learning',     icon: GraduationCap   },
  { name: 'Sandbox',      path: '/sandbox',      icon: Code2           },
  { name: 'Codex',        path: '/codex',        icon: Layers          },
  { name: 'Community',    path: '/community',    icon: MessageSquare   },
  { name: 'Sessions',     path: '/sessions',     icon: Video           },
  { name: 'Events',       path: '/events',       icon: Calendar        },
  { name: 'Resources',    path: '/resources',    icon: BookOpen        },
  { name: 'Assessments',  path: '/tests',        icon: Award           },
  { name: 'Profile',      path: '/profile',      icon: User            },
  { name: 'Subscription', path: '/subscription', icon: CreditCard      },
  { name: 'Settings',     path: '/settings',     icon: Settings        },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [friendsSidebarOpen, setFriendsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext) || {};
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  if (user && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogout = () => {
    dispatch(logoutThunk());
    toast.success('Signed out');
    navigate('/login');
  };

  const isInstructorPath = location.pathname.startsWith('/instructor');
  const isAdminPath = location.pathname.startsWith('/admin');
  const currentNavItems = studentNavItems;

  const isCommunityFullBleed = location.pathname.startsWith('/community') && 
                                !location.pathname.includes('/create') && 
                                !location.pathname.endsWith('/settings');

  const isFullBleed = (
    isCommunityFullBleed ||
    location.pathname.startsWith('/sandbox') ||
    location.pathname.startsWith('/codex') ||
    location.pathname.startsWith('/workspace') ||
    location.pathname.startsWith('/learning/lesson') ||
    location.pathname.startsWith('/sessions/live')
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          ${sidebarOpen ? 'w-56' : 'w-[60px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Logo size="w-7 h-7" showText={sidebarOpen} textColor="text-slate-900 dark:text-white" />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-1 rounded-lg transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 flex flex-col gap-1">
          {currentNavItems.map(({ name, path, icon: Icon }) => {
            const active = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                title={!sidebarOpen ? name : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-mono font-bold tracking-wider uppercase transition-all select-none ${
                  active
                    ? 'bg-[#04AA6D] text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {sidebarOpen && <span>{name}</span>}
              </NavLink>
            );
          })}

          {/* Role-specific panels toggle */}
          {!isInstructorPath && !isAdminPath && user && (user.role === 'admin' || user.role === 'instructor') && (
            <div className="mt-3 pt-3 flex flex-col gap-1 border-t border-slate-200 dark:border-slate-800">
              {user.role === 'admin' && (
                <NavLink to="/admin/dashboard"
                  title={!sidebarOpen ? 'Admin' : undefined}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-mono font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  <ShieldAlert size={16} className="shrink-0 text-amber-500" />
                  {sidebarOpen && <span>Admin panel</span>}
                </NavLink>
              )}
              <NavLink to="/instructor/dashboard"
                title={!sidebarOpen ? 'Instructor' : undefined}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-mono font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <Trophy size={16} className="shrink-0 text-purple-500" />
                {sidebarOpen && <span>Instructor panel</span>}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Profile / Sign out bottom slot */}
        <div className="p-3 flex flex-col gap-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2.5 min-w-0 flex-1 text-left p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || 'User'}`} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 shrink-0" 
              />
              {sidebarOpen && (
                <div className="min-w-0 flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{user?.fullName || 'CodeSphere User'}</span>
                  <span className="text-[9px] text-slate-400 font-mono capitalize">{user?.role || 'Student'}</span>
                </div>
              )}
            </button>

            {!sidebarOpen && toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                title="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
              </button>
            )}

            {sidebarOpen && (
              <div className="flex items-center gap-1 shrink-0">
                {toggleTheme && (
                  <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  >
                    {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-600" />}
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  title="Sign out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:pl-56' : 'lg:pl-[60px]'}`}>

        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between gap-4 px-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">

          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase select-none text-slate-400 dark:text-slate-500">
              <span>Workspace</span>
              <span>/</span>
              <span className="font-bold capitalize text-slate-800 dark:text-slate-200">
                {location.pathname.split('/')[1] || 'dashboard'}
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 w-80 text-slate-400 focus-within:border-[#04AA6D] transition-all select-none">
            <Search size={14} />
            <input 
              placeholder="Search challenges, courses, code..." 
              className="w-full bg-transparent border-none outline-none text-xs font-mono text-slate-800 dark:text-slate-200"
            />
            <span className="text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 rounded px-1.5 py-0.5 font-mono">⌘ K</span>
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
            </button>

            <NavLink to="/notifications"
              className="p-2 rounded-xl relative text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </NavLink>

            <button
              onClick={() => setFriendsSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-[#04AA6D] hover:bg-[#04AA6D]/10 transition-colors cursor-pointer"
              title="Network & Friends"
            >
              <User size={16} />
            </button>

            <NavLink to="/community"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MessageSquare size={16} />
            </NavLink>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-800" />

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-[#04AA6D] transition-all cursor-pointer"
              >
                <img 
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || 'User'}`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl py-1.5 z-20 shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-fade-in font-sans">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.fullName || 'User'}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email}</p>
                    </div>
                    {[
                      { label: 'My Profile', to: '/profile' },
                      { label: 'Settings',   to: '/settings' },
                    ].map(item => (
                      <NavLink key={item.to} to={item.to}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        {item.label}
                      </NavLink>
                    ))}
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                    <button
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="block w-full text-left px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={isFullBleed 
          ? "flex-1 flex flex-col overflow-hidden p-0 bg-slate-50 dark:bg-slate-950" 
          : "flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950"}>
          <Outlet />
        </main>
      </div>
      <FriendsSidebar isOpen={friendsSidebarOpen} onClose={() => setFriendsSidebarOpen(false)} />
    </div>
  );
}
