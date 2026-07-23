import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import Logo from '../components/Logo.jsx';

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
    <div className="min-h-screen flex flex-col" style={{ background: '#ffffff', color: '#333333' }}>

      {/* ── Navbar ── */}
      <header className={clsx(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
          : 'bg-white border-b border-slate-100',
      )}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">

          {/* Logo */}
          <Logo size="w-8 h-8" textColor="text-slate-800" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 font-mono-origin">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={clsx(
                  'px-3 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase transition-colors',
                  location.pathname === link.href
                    ? 'text-[#04AA6D] bg-green-50 border border-green-200/60'
                    : 'text-slate-600 hover:text-[#04AA6D] hover:bg-slate-100/50',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-2 font-mono-origin">
            <Link
              to="/login"
              className="hidden md:inline text-xs font-bold text-slate-600 hover:text-[#04AA6D] px-3 py-1.5 transition-colors uppercase tracking-wider"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="hidden md:inline text-xs font-bold px-4 py-2 rounded-lg bg-[#04AA6D] hover:bg-[#03935e] text-white transition-colors uppercase tracking-wider"
            >
              Get started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-[#04AA6D] hover:bg-slate-100 transition-colors"
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
              className="md:hidden overflow-hidden border-t border-slate-200 bg-white"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className="px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:text-[#04AA6D] hover:bg-slate-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2">
                  <Link to="/login" className="px-3 py-2.5 text-sm text-slate-600 hover:text-[#04AA6D] text-center rounded-lg hover:bg-slate-50 transition-colors font-bold">Sign in</Link>
                  <Link to="/register" className="px-3 py-2.5 text-sm font-semibold bg-[#04AA6D] hover:bg-[#03935e] text-white text-center rounded-lg transition-colors font-bold">Get started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Page ── */}
      <main className="flex-1"><Outlet /></main>

      <footer className="border-t border-slate-200 py-14 px-6" style={{ background: '#fcfcfc' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <Logo size="w-7 h-7" textColor="text-slate-800" />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                Collaborative compiler sandboxes and online workspaces for engineering teams and classrooms.
              </p>
            </div>
            {footerCols.map(({ title, links }) => (
              <div key={title}>
                <p className="text-xs font-bold text-[#111] uppercase tracking-widest mb-4">{title}</p>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        onClick={(e) => handleNavClick(e, link)}
                        className="text-sm text-[#666] hover:text-[#111] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-black/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-[#999]">© {new Date().getFullYear()} CodeSphere. All rights reserved.</p>
            <p className="text-xs text-[#999]">Built for engineers, by engineers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
