import React, { useState, useContext } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, GraduationCap, Code2, Layers, MessageSquare,
  Video, Calendar, BookOpen, Award, User, CreditCard, Settings,
  ShieldAlert, Trophy, LogOut, Bell, Sun, Moon,
  ChevronLeft, ChevronRight, Menu, ClipboardList, Compass, Briefcase, Search, Users
} from 'lucide-react';
import { logoutThunk } from '@features/auth/redux/authThunk.js';
import toast from 'react-hot-toast';
import Logo from '../components/Logo.jsx';
import { ThemeContext } from '../providers/ThemeProvider.jsx';

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
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutThunk());
    toast.success('Signed out');
    navigate('/login');
  };

  const isInstructorPath = location.pathname.startsWith('/instructor');
  const isAdminPath = location.pathname.startsWith('/admin');
  const currentNavItems = studentNavItems;

  const sidebarBg    = '#fff';
  const sidebarBorder = 'rgba(0,0,0,0.06)';
  const mainBg       = '#f8fafc';

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
    <div className="min-h-screen flex" style={{ background: mainBg }}>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300
          ${sidebarOpen ? 'w-56' : 'w-[60px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: sidebarBg, borderRight: `1px solid ${sidebarBorder}` }}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4"
          style={{ borderBottom: `1px solid ${sidebarBorder}` }}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Logo size="w-7 h-7" showText={sidebarOpen} textColor="text-slate-800" />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-1 rounded-lg transition-colors text-slate-400 hover:text-slate-700"
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
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-bold tracking-wide uppercase transition-all font-mono-origin select-none"
                style={{
                  background: active ? '#04AA6D' : 'transparent',
                  color: active ? '#ffffff' : '#64748b',
                  boxShadow: active ? '0 4px 12px -2px rgba(4, 170, 109, 0.25)' : 'none',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#1e293b'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}
              >
                <Icon size={16} className="shrink-0" />
                {sidebarOpen && <span>{name}</span>}
              </NavLink>
            );
          })}

          {/* Role-specific panels toggle */}
          {!isInstructorPath && !isAdminPath && user && (user.role === 'admin' || user.role === 'instructor') && (
            <div className="mt-3 pt-3 flex flex-col gap-1"
              style={{ borderTop: `1px solid ${sidebarBorder}` }}>
              {user.role === 'admin' && (
                <NavLink to="/admin/dashboard"
                  title={!sidebarOpen ? 'Admin' : undefined}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-bold tracking-wide uppercase transition-colors font-mono-origin"
                  style={{ color: '#64748b' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#1e293b'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <ShieldAlert size={16} className="shrink-0" />
                  {sidebarOpen && <span>Admin panel</span>}
                </NavLink>
              )}
              <NavLink to="/instructor/dashboard"
                title={!sidebarOpen ? 'Instructor' : undefined}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-bold tracking-wide uppercase transition-colors font-mono-origin"
                style={{ color: '#64748b' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#1e293b'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
              >
                <Trophy size={16} className="shrink-0" />
                {sidebarOpen && <span>Instructor panel</span>}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Profile / Sign out bottom slot */}
        <div className="p-2 flex flex-col gap-2" style={{ borderTop: `1px solid ${sidebarBorder}` }}>
          {isAdminPath ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100 mt-1 cursor-pointer hover:bg-slate-100 transition-colors"
                 onClick={() => navigate('/profile')}>
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Admin" 
                  className="w-full h-full object-cover"
                />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[11px] font-bold text-slate-800 truncate font-mono-origin">Admin</p>
                  <p className="text-[9px] text-slate-400 font-sans-origin leading-none mt-0.5">Super Admin</p>
                </div>
              )}
            </div>
          ) : isInstructorPath ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100 mt-1 cursor-pointer hover:bg-slate-100 transition-colors"
                 onClick={() => navigate('/profile')}>
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Prof. Riya Sharma" 
                  className="w-full h-full object-cover"
                />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[11px] font-bold text-slate-800 truncate font-mono-origin">Prof. Riya Sharma</p>
                  <p className="text-[9px] text-slate-400 font-sans-origin leading-none mt-0.5">Web Development</p>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogout}
              title={!sidebarOpen ? 'Sign out' : undefined}
              className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-[11px] font-bold tracking-wide uppercase transition-colors font-mono-origin"
              style={{ color: '#94a3b8' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.color = '#e11d48'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <LogOut size={16} className="shrink-0" />
              {sidebarOpen && <span>Sign out</span>}
            </button>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:pl-56' : 'lg:pl-[60px]'}`}>

        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between gap-4 px-5 bg-white/95 backdrop-blur-md"
          style={{ borderBottom: `1px solid ${sidebarBorder}` }}>

          {isAdminPath ? (
            <div className="flex items-center gap-3 flex-1 select-none">
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors text-slate-500 hover:bg-slate-100"
              >
                <Menu size={18} />
              </button>
              <h1 className="text-base sm:text-lg font-black text-slate-800 font-mono-origin uppercase tracking-wider">Admin Dashboard</h1>
            </div>
          ) : isInstructorPath ? (
            <div className="flex items-center gap-3 flex-1 select-none">
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors text-slate-500 hover:bg-slate-100"
              >
                <Menu size={18} />
              </button>
              <h1 className="text-base sm:text-lg font-black text-slate-800 font-mono-origin uppercase tracking-wider">Instructor Dashboard</h1>
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-1">
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors text-slate-500 hover:bg-slate-100"
              >
                <Menu size={18} />
              </button>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold tracking-wide uppercase font-mono-origin select-none text-slate-400">
                <span>Workspace</span>
                <span>/</span>
                <span className="font-semibold capitalize text-slate-700">
                  {location.pathname.split('/')[1] || 'dashboard'}
                </span>
              </div>
            </div>
          )}

          {/* Search bar in center */}
          {isAdminPath ? (
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-80 text-slate-400 focus-within:border-indigo-400 transition-all select-none">
              <Search size={15} />
              <span className="text-xs flex-1 text-left">Search users, courses, projects...</span>
              <span className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono">⌘ K</span>
            </div>
          ) : !isInstructorPath && (
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-80 text-slate-400 focus-within:border-indigo-400 transition-all select-none">
              <Search size={15} />
              <span className="text-xs flex-1 text-left">Search anything...</span>
              <span className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono">⌘ K</span>
            </div>
          )}

          {/* Right side items */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {isInstructorPath && (
              <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-505 text-[10px] font-bold font-mono-origin select-none">
                <Calendar size={12} className="text-indigo-500" />
                <span>May 18 - May 25, 2025</span>
                <ChevronRight size={11} className="rotate-90 text-slate-400 ml-1" />
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications */}
            <NavLink to="/notifications"
              className="p-2 rounded-lg relative text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </NavLink>

            {/* Chat Icon */}
            <NavLink to="/messages"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <MessageSquare size={16} />
            </NavLink>

            <div className="w-px h-5 bg-slate-200" />

            {/* User Dropdown Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative flex items-center justify-center p-0.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="User Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : isAdminPath ? (
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80" 
                      alt="Admin" 
                      className="w-full h-full object-cover"
                    />
                  ) : isInstructorPath ? (
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80" 
                      alt="Instructor" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-700 uppercase">
                      {(user?.fullName || 'U').slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-44 rounded-xl py-1 z-20 shadow-lg bg-white border border-slate-150 animate-fade-in">
                    {[
                      { label: 'My Profile', to: '/profile' },
                      { label: 'Settings',   to: '/settings' },
                    ].map(item => (
                      <NavLink key={item.to} to={item.to}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors font-sans-origin"
                      >
                        {item.label}
                      </NavLink>
                    ))}
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="block w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50/50 transition-colors font-sans-origin"
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
          ? "flex-1 flex flex-col overflow-hidden p-0 bg-slate-50 dark:bg-[#080d1a]" 
          : "flex-1 overflow-y-auto p-6 bg-[#F8FAFC] dark:bg-[#080d1a]"}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
