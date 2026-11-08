import React from 'react';
import { Outlet } from 'react-router-dom';
import { Terminal, Users, Video, Award } from 'lucide-react';
import { Logo } from '../components/Logo.jsx';

const highlights = [
  { icon: Terminal, text: 'Real-time compiler sandboxes' },
  { icon: Users,    text: 'Collaborative team workspaces' },
  { icon: Video,    text: 'Live video lecture sessions'   },
  { icon: Award,    text: 'Certificates & leaderboards'   },
];

const AuthLayout = () => (
  <div className="min-h-screen flex relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">

    {/* Left branding panel */}
    <div className="hidden lg:flex lg:w-[44%] shrink-0 flex-col relative bg-transparent">
      <div className="relative flex flex-col h-full px-12 py-10 z-10">
        <Logo size="w-7 h-7" textColor="text-slate-800 dark:text-white" />

        <div className="flex-1 flex flex-col justify-center gap-8 max-w-sm select-none">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white leading-snug tracking-tight font-mono-origin">
              Code together.<br />Learn faster.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-sans-origin">
              All-in-one platform for compiler sandboxes, collaborative workspaces, live sessions, and assessments.
            </p>
          </div>

          <ul className="flex flex-col gap-3.5">
            {highlights.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <Icon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-mono-origin">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[10px] font-mono mt-4 text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} CodeSphere
        </p>
      </div>
    </div>

    {/* Right form panel */}
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm relative z-10 border-l border-slate-200/60 dark:border-slate-800/60">
      {/* Mobile logo */}
      <div className="mb-10 lg:hidden">
        <Logo size="w-7 h-7" textColor="text-slate-800 dark:text-white" />
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
