import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Code2, Users, GraduationCap, Play, 
  Terminal, User, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const Features = () => {
  const { ref: ref1, inView: inView1 } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: ref2, inView: inView2 } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: ref3, inView: inView3 } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="px-6 py-24 bg-transparent flex flex-col gap-32 z-10 relative">
      
      {/* ─── SECTION 1: SANDBOX COMPILER PLAYPENS ─── */}
      <motion.div 
        ref={ref1}
        initial={{ opacity: 0, y: 50 }}
        animate={inView1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        <div className="lg:col-span-5 flex flex-col items-start text-left select-none">
          <span className="font-mono-origin text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            01 / Sandbox Compilers
          </span>
          <h2 className="font-mono-origin text-2xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 leading-tight mt-3">
            Compile files in 20+ environments.
          </h2>
          <p className="font-sans-origin text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
            Browse published playpen projects, view step-by-step instructions, configure local technology stacks, and execute code instantly.
          </p>
          <div className="mt-6 flex flex-col gap-3 font-sans-origin text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#04AA6D]" />
              <span>Step-by-step interactive instruction steps</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#04AA6D]" />
              <span>Persistent MongoDB user progress</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#04AA6D]" />
              <span>Solution bookmarking & verification status</span>
            </div>
          </div>
        </div>

        {/* Right side: High-fidelity compiler UI Mockup */}
        <div className="lg:col-span-7 w-full">
          <motion.div 
            whileHover={{ y: -6, scale: 1.01, boxShadow: '0 20px 40px -15px rgba(4, 170, 109, 0.15)' }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg p-5 font-mono-origin relative group cursor-pointer"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-4 select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">WebRTC_Playpen.jsx</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded bg-green-500/10 text-[#04AA6D] border border-green-500/20 font-bold">
                COMPILE READY
              </span>
            </div>

            {/* Code lines */}
            <div className="text-[11px] sm:text-xs leading-6 text-slate-600 dark:text-slate-300 text-left select-none bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <p><span className="text-blue-600 dark:text-blue-400 font-bold">import</span> React, {'{ useState }'} <span className="text-blue-600 dark:text-blue-400 font-bold">from</span> <span className="text-amber-800 dark:text-amber-300">'react'</span>;</p>
              <p><span className="text-blue-600 dark:text-blue-400 font-bold">import</span> {'{ compileSystem }'} <span className="text-blue-600 dark:text-blue-400 font-bold">from</span> <span className="text-amber-800 dark:text-amber-300">'@codesphere/sandbox'</span>;</p>
              <p className="mt-2"><span className="text-blue-600 dark:text-blue-400 font-bold">export const</span> <span className="text-[#04AA6D] font-bold">PlaypenApp</span> = () =&gt; {'{'}</p>
              <p className="pl-4"><span className="text-blue-600 dark:text-blue-400 font-bold">const</span> [status, setStatus] = useState(<span className="text-amber-800 dark:text-amber-300">'idle'</span>);</p>
              <p className="pl-4 mt-1"><span className="text-blue-600 dark:text-blue-400 font-bold">const</span> <span className="text-[#04AA6D] font-bold">handleCompile</span> = <span className="text-blue-600 dark:text-blue-400 font-bold">async</span> () =&gt; {'{'}</p>
              <p className="pl-8 text-slate-400 dark:text-slate-500">// Trigger live playpen output</p>
              <p className="pl-8">setStatus(<span className="text-amber-800 dark:text-amber-300">'compiling'</span>);</p>
              <p className="pl-8">await compileSystem();</p>
              <p className="pl-4">{'}'}</p>
              <p className="mt-1">{'}'}</p>
            </div>

            {/* Simulated Live Action Terminal */}
            <div className="mt-5 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-left">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-200 dark:border-slate-700 mb-2">
                <span>Playpen Output</span>
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1"><Play size={10} /> Active</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">Connecting playpen websockets compiler...</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">Executing script...</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">✓ Compile successful! Counter initialized to 0.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ─── SECTION 2: MULTIPLAYER CODEX WORKSPACES ─── */}
      <motion.div 
        ref={ref2}
        initial={{ opacity: 0, y: 50 }}
        animate={inView2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        {/* Left Column Mockup */}
        <div className="lg:col-span-7 w-full order-last lg:order-first">
          <motion.div 
            whileHover={{ y: -6, scale: 1.01, boxShadow: '0 20px 40px -15px rgba(59, 130, 246, 0.15)' }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg p-5 font-mono-origin relative cursor-pointer"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-4 select-none">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Multicursor Editor</span>
              <div className="flex items-center gap-2 text-[10px] text-[#04AA6D]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#04AA6D] animate-ping" />
                <span>3 users active</span>
              </div>
            </div>

            {/* Code co-editing */}
            <div className="text-[11px] sm:text-xs leading-7 text-slate-600 dark:text-slate-300 text-left select-none bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <p><span className="text-slate-400 dark:text-slate-500">// Collaborative workspace sandbox</span></p>
              <p className="mt-1 flex items-center flex-wrap gap-1">
                <span className="text-blue-600 dark:text-blue-400 font-bold">const</span> 
                <span>room</span> 
                <span>=</span> 
                <span className="text-blue-600 dark:text-blue-400 font-bold">new</span> 
                <span className="text-[#04AA6D] font-bold">MultiplayerRoom</span>
                <span>(</span>
                <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1 py-0.5 rounded border border-blue-500/20">
                  viksd_688
                </span>
                <span className="w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse" />
                <span>);</span>
              </p>
              <p className="mt-1 flex items-center flex-wrap gap-1">
                <span className="text-blue-600 dark:text-blue-400 font-bold">await</span>
                <span>room</span>
                <span>.</span>
                <span className="text-[#04AA6D] font-bold">syncFiles</span>
                <span>(</span>
                <span className="bg-emerald-500/10 text-[#04AA6D] px-1 py-0.5 rounded border border-emerald-500/20">
                  instructor_main
                </span>
                <span className="w-0.5 h-4 bg-emerald-500 ml-0.5 animate-pulse" />
                <span>);</span>
              </p>
            </div>

            {/* Presence users */}
            <div className="mt-6 flex items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-4 select-none">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Active:</span>
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 border border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-bold text-white">V</div>
                <div className="w-6 h-6 rounded-full bg-emerald-600 border border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-bold text-white">I</div>
                <div className="w-6 h-6 rounded-full bg-amber-600 border border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-bold text-white">J</div>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Real-time git synchronization enabled</span>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-5 flex flex-col items-start text-left select-none">
          <span className="font-mono-origin text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            02 / Collaborative Codex
          </span>
          <h2 className="font-mono-origin text-2xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 leading-tight mt-3">
            Realtime co-editing workspaces.
          </h2>
          <p className="font-sans-origin text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
            Codesphere workspaces feature multiplayer collaborative editing, file trees, task boards, and chat channels to keep classrooms synchronized.
          </p>
          <div className="mt-6 flex flex-col gap-3 font-sans-origin text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#04AA6D]" />
              <span>Multi-user cursors & document edits history</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#04AA6D]" />
              <span>Shared visual task boards per workspace</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#04AA6D]" />
              <span>Inline code review remarks & chat channels</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── SECTION 3: LEARNING & AUTOMATED ASSESSMENT PATHS ─── */}
      <motion.div 
        ref={ref3}
        initial={{ opacity: 0, y: 50 }}
        animate={inView3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        <div className="lg:col-span-5 flex flex-col items-start text-left select-none">
          <span className="font-mono-origin text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            03 / Learning Paths & Tests
          </span>
          <h2 className="font-mono-origin text-2xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 leading-tight mt-3">
            Track syllabus & test progress.
          </h2>
          <p className="font-sans-origin text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
            Coordinate modules, monitor daily streaks, and conduct automated assessments. Instructors review students submissions and issue certificates.
          </p>
          <div className="mt-6 flex flex-col gap-3 font-sans-origin text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#04AA6D]" />
              <span>Automated test-grading & code compile metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#04AA6D]" />
              <span>Streak calculations & achievement rewards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#04AA6D]" />
              <span>Instructor approvals & student dashboard reports</span>
            </div>
          </div>
        </div>

        {/* Right side: High-fidelity study milestone UI Mockup */}
        <div className="lg:col-span-7 w-full">
          <motion.div 
            whileHover={{ y: -6, scale: 1.01, boxShadow: '0 20px 40px -15px rgba(4, 170, 109, 0.15)' }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg p-6 font-sans-origin relative cursor-pointer"
          >
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-5 select-none">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Fullstack Pathway</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Course Syllabus Progress</p>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#04AA6D]" />
                <span className="text-[10px] font-bold text-[#04AA6D] uppercase tracking-widest font-mono-origin">75% Done</span>
              </div>
            </div>

            {/* Milestones list */}
            <div className="flex flex-col gap-3.5 select-none text-left">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-green-500/10 text-[#04AA6D] border border-green-500/20 flex items-center justify-center font-bold font-mono-origin text-xs">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Module 1: Web APIs & Routing</h4>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500">Completed 2 days ago</p>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono-origin font-semibold">100 XP</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-green-500/10 text-[#04AA6D] border border-green-500/20 flex items-center justify-center font-bold font-mono-origin text-xs">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Module 2: Mongoose Database Hook fixes</h4>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500">Completed 1 hour ago</p>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono-origin font-semibold">250 XP</span>
              </div>

              <div className="p-3 bg-green-50/40 dark:bg-emerald-950/20 border border-[#04AA6D]/30 rounded-lg flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-green-500/10 text-[#04AA6D] border border-green-500/20 flex items-center justify-center font-bold font-mono-origin text-xs">2</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Assessment 1: Playpen socket build</h4>
                    <p className="text-[9px] text-[#04AA6D] font-semibold flex items-center gap-1">Next milestone <ChevronRight size={10} /></p>
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono-origin font-semibold">500 XP</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

    </section>
  );
};
export default Features;
