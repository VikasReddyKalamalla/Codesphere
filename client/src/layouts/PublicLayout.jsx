import React, { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import Logo from '../components/Logo.jsx';
import { ThemeContext } from '../providers/ThemeProvider.jsx';

const navLinks = [
  { label: 'Features', href: '/features', public: true  },
  { label: 'Pricing',  href: '/pricing',  public: false },
  { label: 'About',    href: '/about',    public: false },
  { label: 'Contact',  href: '/contact',  public: false },
];

const footerCols = [
  {
    title: 'Product',
    links: [
      { label: 'Features',  href: '/features', public: true  },
      { label: 'Pricing',   href: '/pricing',  public: false },
      { label: 'Learning',  href: '/learning', public: false },
      { label: 'Community', href: '/community',public: false },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',   href: '/about',   public: false },
      { label: 'Blog',    href: '/blog',    public: false },
      { label: 'Careers', href: '/careers', public: false },
      { label: 'Contact', href: '/contact', public: false },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy', public: true },
      { label: 'Terms',   href: '/terms',   public: true },
      { label: 'Cookies', href: '/cookies', public: true },
    ],
  },
];

const isLoggedIn = () =>
  !!localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'codesphere_token');

const PublicLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const { theme, toggleTheme }     = useContext(ThemeContext) || {};
  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleNavClick = (e, link) => {
    if (!link.public && !isLoggedIn()) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: link.href } } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">

      {/* ── Navbar ── */}
      <header className={clsx(
        'sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b',
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/90 shadow-xs border-slate-200 dark:border-slate-800'
          : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-800/60',
      )}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">

          {/* Logo */}
          <Logo size="w-8 h-8" textColor="text-slate-900 dark:text-white" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 font-mono">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all',
                  location.pathname === link.href
                    ? 'text-[#04AA6D] bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#04AA6D] dark:hover:text-[#04AA6D] hover:bg-slate-100 dark:hover:bg-slate-800/60',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-3 font-mono">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
              </button>
            )}

            <Link
              to="/login"
              className="hidden md:inline text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#04AA6D] dark:hover:text-[#04AA6D] px-3 py-1.5 transition-colors uppercase tracking-wider"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="hidden md:inline text-xs font-bold px-4 py-2 rounded-xl bg-[#04AA6D] hover:bg-emerald-600 text-white transition-colors uppercase tracking-wider shadow-md shadow-emerald-500/20"
            >
              Get started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-[#04AA6D] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mob"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className="px-3 py-2.5 rounded-xl text-sm font-bold font-mono text-slate-700 dark:text-slate-200 hover:text-[#04AA6D] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                  <Link to="/login" className="px-3 py-2.5 text-sm font-bold font-mono text-slate-600 dark:text-slate-300 hover:text-[#04AA6D] text-center rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Sign in</Link>
                  <Link to="/register" className="px-3 py-2.5 text-sm font-bold font-mono bg-[#04AA6D] hover:bg-emerald-600 text-white text-center rounded-xl transition-colors">Get started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Page ── */}
      <main className="flex-1"><Outlet /></main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-14 px-6 bg-slate-100/50 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12 text-left">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <Logo size="w-7 h-7" textColor="text-slate-900 dark:text-white" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs font-sans">
                Collaborative compiler sandboxes and online workspaces for engineering teams and classrooms.
              </p>
            </div>
            {footerCols.map(({ title, links }) => (
              <div key={title}>
                <p className="text-xs font-mono font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">{title}</p>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        onClick={(e) => handleNavClick(e, link)}
                        className="text-xs font-sans text-slate-600 dark:text-slate-400 hover:text-[#04AA6D] dark:hover:text-[#04AA6D] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <p>© {new Date().getFullYear()} CodeSphere. All rights reserved.</p>
            <p>Built for engineers, by engineers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
