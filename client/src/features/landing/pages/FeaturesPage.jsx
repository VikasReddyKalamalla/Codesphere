import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  Terminal, Users, Video, ClipboardList, Award, BookOpen,
  Calendar, MessageSquare, GraduationCap, BarChart2, Shield, Zap,
} from 'lucide-react';
import ScrollingCodeBackground from '../components/ScrollingCodeBackground.jsx';

const sections = [
  {
    icon: Terminal, title: 'Compiler Sandbox', tag: 'Core',
    desc: 'Write, run, and debug code instantly in isolated browser-based terminals. No setup, no installs.',
    bullets: [
      '20+ languages: Python, Node.js, Java, C++, Go, Rust',
      'Cold-start execution in under 500ms',
      '60 free compile minutes per month on the free tier',
      'File tree editor, stdin/stdout, persistent projects',
    ],
    preview: [
      { t: '$ python main.py',              c: 'text-slate-500' },
      { t: 'Hello, CodeSphere!',            c: 'text-slate-800' },
      { t: '✓  Compiled in 38ms  ·  0 errors', c: 'text-[#04AA6D] font-semibold' },
    ],
  },
  {
    icon: Users, title: 'Collaborative Codex', tag: 'Teamwork',
    desc: 'Real-time co-editing with presence cursors, Git sync, and inline review comments.',
    bullets: [
      'Live presence cursors and diff highlighting',
      'Git-backed version history with branch switching',
      'Inline code comments and review threads',
      'Role-based workspace permissions',
    ],
    preview: [
      { t: '● Alex is editing line 12…',   c: 'text-blue-600'  },
      { t: '● Priya added a comment',       c: 'text-slate-700' },
      { t: '↑ synced with origin/main',     c: 'text-[#04AA6D]' },
      { t: '2 collaborators online',        c: 'text-slate-500' },
    ],
  },
  {
    icon: Video, title: 'Live Sessions', tag: 'Learning',
    desc: 'Conduct interactive video lectures with screen sharing, whiteboard, and embedded sandbox demos.',
    bullets: [
      'HD video + audio, up to 200 attendees',
      'Screen share with live coding sandbox',
      'Collaborative whiteboard with annotations',
      'Auto-recorded with searchable transcripts',
    ],
    preview: [
      { t: '● LIVE  ·  CS101 Algorithms',   c: 'text-red-650 font-semibold' },
      { t: '142 students watching',          c: 'text-slate-800' },
      { t: '"Can you re-run that example?"', c: 'text-slate-500' },
      { t: '3 hands raised',                 c: 'text-slate-600' },
    ],
  },
  {
    icon: ClipboardList, title: 'Assessments', tag: 'Testing',
    desc: 'Create timed coding tests with auto-grading, partial scoring, and plagiarism detection.',
    bullets: [
      'Timed exams with live countdown and auto-submit',
      'Automated test-case grading with partial scoring',
      'Plagiarism detection across all submissions',
      'Per-student attempt history and score breakdown',
    ],
    preview: [
      { t: '⏱  Test: Data Structures — 45:00', c: 'text-slate-700 font-semibold' },
      { t: '✓  12/15 test cases passed',        c: 'text-[#04AA6D]' },
      { t: '✗  3 failed: edge case (n=0)',       c: 'text-red-600 font-medium' },
      { t: 'Score: 80%  ·  Rank: 4 / 38',       c: 'text-slate-500' },
    ],
  },
  {
    icon: Award, title: 'Certificates & Leaderboards', tag: 'Motivation',
    desc: 'Gamified progress with live leaderboards and verifiable digital certificates.',
    bullets: [
      'Course, cohort, and global leaderboards',
      'XP points, streaks, and achievement badges',
      'Verifiable certificates with unique QR codes',
      'One-click share to LinkedIn and portfolios',
    ],
    preview: [
      { t: '#1  Alex Chen      2,840 XP', c: 'text-slate-800 font-bold' },
      { t: '#2  Priya Nair     2,610 XP', c: 'text-slate-600' },
      { t: '#3  Jordan Lee     2,390 XP', c: 'text-slate-650' },
      { t: '#4  You            1,980 XP', c: 'text-blue-600 font-semibold' },
    ],
  },
  {
    icon: BookOpen, title: 'Learning Paths', tag: 'Courses',
    desc: 'Structured curriculum with video lessons, coding exercises, and milestone tracking.',
    bullets: [
      'Modular curriculum builder for instructors',
      'Video lessons, exercises, and reading resources',
      'Progress tracking with completion percentages',
      'Prerequisite chains and skill-tree visualization',
    ],
    preview: [
      { t: '▸ JavaScript Fundamentals',      c: 'text-slate-700 font-semibold' },
      { t: '  ✓ Variables & Types   100%',   c: 'text-[#04AA6D]' },
      { t: '  ✓ Functions & Scope   100%',   c: 'text-[#04AA6D]' },
      { t: '  ● Async / Await        63%',   c: 'text-slate-550' },
    ],
  },
];

const extras = [
  { icon: Calendar,      title: 'Events & Hackathons',    desc: 'Schedule competitions and workshops with registration and team formation.' },
  { icon: MessageSquare, title: 'Community Forums',       desc: 'Discussion boards with code snippets, upvotes, and threaded replies.' },
  { icon: GraduationCap, title: 'Instructor Dashboard',   desc: 'Manage courses, cohort progress, sessions, and bulk certificates.' },
  { icon: BarChart2,     title: 'Analytics',              desc: 'Compile metrics, test scores, engagement, and cohort performance.' },
  { icon: Shield,        title: 'Role-based Access',      desc: 'Granular permissions for students, instructors, admins with 2FA.' },
  { icon: Zap,           title: 'Resource Library',       desc: 'Shared PDFs, code snippets, and docs organized per course.' },
];

function Section({ s, idx }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const even = idx % 2 === 0;
  return (
    <div ref={ref} className="py-16 px-6 border-t border-slate-200 bg-transparent relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className={`flex flex-col ${even ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
          <motion.div
            initial={{ opacity: 0, x: even ? -30 : 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-1 flex flex-col gap-5 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                <s.icon className="w-4 h-4 text-slate-650" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono-origin">{s.tag}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-mono-origin">{s.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-sans-origin">{s.desc}</p>
            <ul className="flex flex-col gap-2.5">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-xs text-slate-650 font-sans-origin">
                  <CheckCircle2 className="w-4 h-4 text-[#04AA6D] shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: even ? 30 : -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="flex-1 w-full max-w-md"
          >
            <motion.div 
              whileHover={{ y: -5, scale: 1.01, boxShadow: '0 20px 40px -15px rgba(4, 170, 109, 0.12)' }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm overflow-hidden shadow-lg cursor-pointer"
            >
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-200 bg-slate-50 select-none">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="ml-2 text-[10px] text-slate-500 font-mono-origin font-semibold">
                  {s.title.toLowerCase().replace(/\s+/g,'-')}.cs
                </span>
              </div>
              <div className="px-5 py-5 font-mono-origin text-xs leading-7 text-left bg-slate-50/50">
                {s.preview.map((l, i) => <p key={i} className={l.c}>{l.t}</p>)}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  const { ref: extrasRef, inView: extrasInView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <div className="w-full relative bg-white overflow-hidden">
      <ScrollingCodeBackground />

      {/* Hero */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full flex flex-col items-center text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: 'easeOut' }} 
          className="max-w-2xl w-full"
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono-origin">Platform features</span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold text-slate-800 tracking-tight leading-tight font-mono-origin">
            Everything you need<br />to code, learn, and ship.
          </h1>
          <p className="mt-4 text-slate-655 text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-sans-origin">
            CodeSphere brings together sandboxes, collaborative workspaces, live classes, assessments, and analytics in one place.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/register" className="font-mono-origin inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold transition-all shadow-md">
                Start for free <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/pricing" className="font-mono-origin inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-350 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all">
                View pricing
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Feature sections */}
      {sections.map((s, i) => <Section key={s.title} s={s} idx={i} />)}

      {/* Extra grid */}
      <section ref={extrasRef} className="px-6 py-20 border-t border-slate-200 bg-transparent relative z-10">
        <div className="max-w-5xl mx-auto select-none">
          <motion.h2 
            initial={{ opacity: 0, y: 12 }}
            animate={extrasInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold text-slate-800 mb-10 text-center font-mono-origin"
          >
            More capabilities
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {extras.map((e, idx) => (
              <motion.div 
                key={e.title} 
                initial={{ opacity: 0, y: 25 }}
                animate={extrasInView ? { opacity: 1, y: 0 } : {}}
                whileHover={{ y: -4, scale: 1.01, borderColor: 'rgba(4, 170, 109, 0.4)' }}
                transition={{ delay: idx * 0.06, duration: 0.4, ease: 'easeOut' }}
                className="flex gap-4 p-5 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200">
                  <e.icon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-bold text-slate-800 mb-1 font-mono-origin uppercase tracking-wider">{e.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans-origin">{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-20 border-t border-slate-200 bg-slate-50 relative z-10">
        <div className="max-w-2xl mx-auto text-center select-none">
          <h2 className="text-2xl font-bold text-slate-800 font-mono-origin">Ready to get started?</h2>
          <p className="mt-3 text-slate-600 text-xs sm:text-sm font-sans-origin">Join thousands of teams and classrooms already building on CodeSphere.</p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
            <Link to="/register" className="font-mono-origin inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold transition-all shadow-md">
              Create free workspace <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
