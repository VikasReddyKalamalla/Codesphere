import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckCircle2, Lock, Play, BookOpen, 
  Sparkles, ChevronRight, X, Award, Zap, 
  Code2, FileText, Flame, Layers,
  Compass, ArrowRight, Check, Tag, Filter,
  BookMarked, Cpu, ShieldCheck
} from 'lucide-react';
import { NATIVE_ROADMAPS } from '../data/nativeRoadmapsData.js';

// Text Sanitizer to strip leftover regex artifact text
const cleanText = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/roadmap\s+and\s+more\s+roadmaps\s+at/gi, '')
    .replace(/roadmap\.sh\s+and\s+more\s+roadmaps\s+at/gi, '')
    .replace(/roadmap\s+and\s+more\s+roadmaps/gi, '')
    .replace(/https?:\/\/[^\s]+/gi, '')
    .replace(/roadmap\.sh/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/:\s*$/, '')
    .trim();
};

/**
 * VisualRoadmapTree
 * 100% Native CodeSphere Visual Tree Roadmap
 * Renders structured roadmap tracks with milestone cards, sub-topics, and drawer syllabus.
 */
export const VisualRoadmapTree = ({
  modules = [],
  pathProgress,
  onMarkLessonComplete,
  onStartLearning,
  pathTitle = 'Learning Path Roadmap',
  category = 'Web Development',
  trackId = null
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('flowchart'); // 'flowchart' | 'timeline'
  
  // Find matching native roadmap dataset from NATIVE_ROADMAPS or fallback to prop modules
  const activeNativeTrack = useMemo(() => {
    if (trackId) {
      const match = NATIVE_ROADMAPS.find(r => r.id === trackId || r.id.toLowerCase() === trackId.toLowerCase());
      if (match) return match;
    }
    const catMatch = NATIVE_ROADMAPS.find(r => 
      r.category.toLowerCase() === (category || '').toLowerCase() ||
      r.id.toLowerCase() === (category || '').toLowerCase() ||
      (pathTitle || '').toLowerCase().includes(r.title.toLowerCase())
    );
    return catMatch || NATIVE_ROADMAPS[0];
  }, [trackId, category, pathTitle]);

  const [selectedTrackId, setSelectedTrackId] = useState(activeNativeTrack.id);

  // Sync selectedTrackId when activeNativeTrack changes (e.g. route navigation)
  useEffect(() => {
    if (activeNativeTrack?.id) {
      setSelectedTrackId(activeNativeTrack.id);
      setSelectedNodeId(null);
    }
  }, [activeNativeTrack]);

  const currentTrack = useMemo(() => {
    return NATIVE_ROADMAPS.find(r => r.id === selectedTrackId) || activeNativeTrack;
  }, [selectedTrackId, activeNativeTrack]);

  // Combine passed database modules with native track modules for maximum completeness
  const activeModules = useMemo(() => {
    if (currentTrack?.modules && currentTrack.modules.length > 0) return currentTrack.modules;
    if (modules && modules.length > 0) return modules;
    return [];
  }, [modules, currentTrack]);

  // Helper to check if lesson is done
  const isLessonDone = (lid) => {
    const cid = lid?._id || lid;
    return pathProgress?.completedLessons?.some(l => (l._id || l) === cid);
  };

  // Process tree nodes with step milestones
  const processedTree = useMemo(() => {
    let previousCompleted = true;

    return activeModules.map((mod, index) => {
      const lessons = mod.lessons || [];
      const totalLessons = lessons.length;
      const doneLessons = lessons.filter(l => isLessonDone(l)).length;
      const isCompleted = totalLessons > 0 && doneLessons === totalLessons;
      const hasStarted = doneLessons > 0;
      
      let status = 'locked';
      if (isCompleted) {
        status = 'completed';
      } else if (previousCompleted || index === 0) {
        status = hasStarted ? 'in-progress' : 'unlocked';
      } else {
        status = 'locked';
      }

      previousCompleted = isCompleted;

      return {
        id: mod._id || `mod-${index}`,
        rawModule: mod,
        title: mod.title || `Module ${index + 1}`,
        description: mod.description || '',
        order: mod.order || index + 1,
        topics: mod.topics || [],
        totalLessons,
        doneLessons,
        percentage: totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0,
        status,
        lessons
      };
    });
  }, [activeModules, pathProgress]);

  const selectedNode = useMemo(() => {
    return processedTree.find(n => n.id === selectedNodeId) || null;
  }, [processedTree, selectedNodeId]);

  const totalNodes = processedTree.length;
  const completedNodes = processedTree.filter(n => n.status === 'completed').length;
  const overallPct = totalNodes ? Math.round((completedNodes / totalNodes) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-8 select-none font-sans text-slate-900 dark:text-slate-100">
      
      {/* ── Top Header & Native Track Switcher ── */}
      <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden text-left">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#04AA6D]/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Title & Progress Summary */}
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#04AA6D]/20 border border-[#04AA6D]/40 flex items-center justify-center text-[#04AA6D] shrink-0">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#04AA6D]/20 text-[#04AA6D] uppercase border border-[#04AA6D]/30">
                Interactive Flowchart Engine
              </span>
              <span className="text-xs text-slate-400 font-mono font-semibold">• {totalNodes} Milestones</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono mt-1">{currentTrack.title || pathTitle}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed font-sans">{currentTrack.description}</p>
          </div>
        </div>

        {/* Track Selector & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setViewMode('flowchart')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === 'flowchart'
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Diagram
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-[#04AA6D] text-white font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Timeline View
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={selectedTrackId}
              onChange={(e) => setSelectedTrackId(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-white outline-none cursor-pointer pr-4"
            >
              {NATIVE_ROADMAPS.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
            <div className="text-left font-mono">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Progress</p>
              <p className="text-xs font-bold text-[#04AA6D]">{completedNodes} / {totalNodes} Cleared</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#04AA6D]/15 border border-[#04AA6D]/30 flex items-center justify-center text-[#04AA6D] font-mono font-bold text-xs">
              {overallPct}%
            </div>
          </div>
        </div>
      </div>

      {/* ── Native Interactive Visual Roadmap Tree Canvas ── */}
      <div className="relative w-full rounded-3xl bg-slate-950 border border-slate-800 p-8 sm:p-14 min-h-[650px] overflow-hidden flex flex-col items-center">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415512_1px,transparent_1px),linear-gradient(to_bottom,#33415512_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#04AA6D]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Start Milestone Marker */}
        <div className="relative z-10 mb-14 flex flex-col items-center">
          <div className="px-6 py-2.5 rounded-2xl bg-[#04AA6D]/20 border border-[#04AA6D]/40 text-[#04AA6D] font-mono font-bold text-xs flex items-center gap-2.5 shadow-xl shadow-[#04AA6D]/10">
            <Zap className="w-4 h-4" />
            <span>ROADMAP START: {currentTrack.title?.toUpperCase()}</span>
          </div>
          <div className="w-0.5 h-14 bg-gradient-to-b from-[#04AA6D] to-slate-800 mt-2" />
        </div>

        {/* Tree Nodes List */}
        {processedTree.length === 0 ? (
          <div className="text-center py-28 text-slate-500 font-mono text-xs">
            No modules available in this native roadmap track.
          </div>
        ) : viewMode === 'flowchart' ? (
          /* ─────────────────────────────────────────────────────────────
             AUTHENTIC ROADMAP.SH INTERACTIVE FLOWCHART DIAGRAM MODE
             Central Trunk Spine + Alternating Left/Right Sub-topic Branches
             ───────────────────────────────────────────────────────────── */
          <div className="w-full max-w-5xl flex flex-col items-center relative z-10 space-y-16">
            {processedTree.map((node, idx) => {
              const isCompleted = node.status === 'completed';
              const isInProgress = node.status === 'in-progress';
              const isUnlocked = node.status === 'unlocked';
              const isLocked = node.status === 'locked';
              const hasNext = idx < processedTree.length - 1;

              const cleanTitleText = cleanText(node.title).replace(/^Phase\s+\d+:\s*/i, '');
              const cleanTopicList = (node.topics || []).map(cleanText).filter(Boolean);
              
              const isEvenIndex = idx % 2 === 0;
              const sideBranchPosition = isEvenIndex ? 'right' : 'left';

              return (
                <div key={node.id} className="w-full flex flex-col items-center relative">
                  
                  {/* Central Vertical Trunk Segment */}
                  <div className="w-full flex items-center justify-center relative my-2">
                    
                    {/* LEFT Sub-topics Branch Container */}
                    <div className="flex-1 flex justify-end pr-6 items-center">
                      {sideBranchPosition === 'left' && cleanTopicList.length > 0 && (
                        <div className="flex flex-col gap-2 items-end z-20">
                          {cleanTopicList.slice(0, 4).map((t, ti) => (
                            <div
                              key={ti}
                              onClick={() => setSelectedNodeId(node.id)}
                              className="px-4 py-2 rounded-2xl bg-amber-200/90 dark:bg-amber-400/90 text-slate-950 font-bold text-xs font-mono border border-amber-300 dark:border-amber-300/80 shadow-md hover:scale-105 hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CENTRAL TRUNK MILESTONE BLOCK (Gold/Emerald Main Node Box) */}
                    <div
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`group relative z-30 px-8 py-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 text-center shadow-xl min-w-[280px] max-w-[380px] ${
                        isCompleted
                          ? 'bg-[#04AA6D] text-white border-emerald-300 shadow-emerald-950/60 hover:scale-105'
                          : isInProgress
                          ? 'bg-amber-400 text-slate-950 font-black border-amber-300 ring-4 ring-amber-400/30 shadow-amber-950/60 hover:scale-105'
                          : isUnlocked
                          ? 'bg-amber-300/95 dark:bg-amber-400/90 text-slate-950 font-extrabold border-amber-300 hover:scale-105 hover:bg-amber-300'
                          : 'bg-slate-900 text-slate-400 border-slate-800 opacity-70 hover:opacity-100 hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5 font-mono text-[10px] uppercase font-bold tracking-wider opacity-80">
                        <span>Milestone #{idx + 1}</span>
                        <span>{isCompleted ? '✓ Done' : isInProgress ? '⚡ Active' : isUnlocked ? 'Unlocked' : '🔒 Locked'}</span>
                      </div>
                      <h3 className="text-base font-black font-mono leading-tight tracking-tight">
                        {cleanTitleText}
                      </h3>
                      {node.totalLessons > 0 && (
                        <div className="mt-2 text-[10px] font-mono font-bold opacity-75">
                          {node.doneLessons} / {node.totalLessons} Lessons • {node.percentage}%
                        </div>
                      )}
                    </div>

                    {/* RIGHT Sub-topics Branch Container */}
                    <div className="flex-1 flex justify-start pl-6 items-center">
                      {sideBranchPosition === 'right' && cleanTopicList.length > 0 && (
                        <div className="flex flex-col gap-2 items-start z-20">
                          {cleanTopicList.slice(0, 4).map((t, ti) => (
                            <div
                              key={ti}
                              onClick={() => setSelectedNodeId(node.id)}
                              className="px-4 py-2 rounded-2xl bg-amber-200/90 dark:bg-amber-400/90 text-slate-950 font-bold text-xs font-mono border border-amber-300 dark:border-amber-300/80 shadow-md hover:scale-105 hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Vertical Trunk Connector Line */}
                  {hasNext && (
                    <div className="w-full flex justify-center py-2 relative pointer-events-none z-10">
                      <svg className="w-12 h-14 overflow-visible">
                        <line
                          x1="24" y1="0" x2="24" y2="56"
                          stroke={isCompleted ? '#04AA6D' : '#FBBF24'}
                          strokeWidth="3.5"
                          strokeDasharray={isCompleted ? 'none' : '6 6'}
                        />
                      </svg>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────
             TIMELINE LIST MODE (Detailed Module Cards View)
             ───────────────────────────────────────────────────────────── */
          <div className="w-full max-w-4xl flex flex-col items-center relative z-10 space-y-16">
            {processedTree.map((node, idx) => {
              if (filterType === 'unlocked' && node.status === 'locked') return null;
              if (filterType === 'completed' && node.status !== 'completed') return null;

              const hasNext = idx < processedTree.length - 1;
              const isCompleted = node.status === 'completed';
              const isInProgress = node.status === 'in-progress';
              const isUnlocked = node.status === 'unlocked';
              const isLocked = node.status === 'locked';

              return (
                <React.Fragment key={node.id}>
                  <div className="w-full flex items-center justify-center relative">
                    
                    {/* Spine Line */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-800 -z-10" />

                    {/* Node Card */}
                    <div
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`group relative w-full max-w-2xl p-7 rounded-3xl border cursor-pointer transition-all duration-300 text-left ${
                        isCompleted
                          ? 'bg-slate-900/95 border-emerald-500/50 hover:border-emerald-400 shadow-xl shadow-emerald-950/40'
                          : isInProgress
                          ? 'bg-slate-900 border-[#04AA6D] ring-2 ring-[#04AA6D]/40 shadow-2xl shadow-emerald-900/50'
                          : isUnlocked
                          ? 'bg-slate-900/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800/80'
                          : 'bg-slate-950 border-slate-800/80 opacity-60 hover:opacity-80'
                      }`}
                    >
                      {/* Node Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-md ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-[#04AA6D] border border-emerald-500/40'
                              : isInProgress
                              ? 'bg-[#04AA6D] text-white shadow-lg shadow-emerald-500/30'
                              : isUnlocked
                              ? 'bg-slate-800 text-slate-200 border border-slate-700'
                              : 'bg-slate-900 text-slate-600 border border-slate-800'
                          }`}>
                            {isCompleted ? <Check className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : <span>{idx + 1}</span>}
                          </div>

                          <div>
                            <span className="text-[10px] font-mono font-extrabold tracking-wider uppercase text-emerald-400">
                              MILESTONE #{idx + 1}
                            </span>
                            <h3 className="text-lg font-black text-white font-mono group-hover:text-[#04AA6D] transition-colors leading-snug">
                              {cleanText(node.title)}
                            </h3>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-[#04AA6D] border-emerald-500/30'
                            : isInProgress
                            ? 'bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/40'
                            : isUnlocked
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}>
                          {isCompleted ? 'Cleared ✓' : isInProgress ? 'In Progress ⚡' : isUnlocked ? 'Unlocked' : 'Locked 🔒'}
                        </span>
                      </div>

                      {/* Description */}
                      {cleanText(node.description) && (
                        <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                          {cleanText(node.description)}
                        </p>
                      )}

                      {/* Sub-topics Badges */}
                      {node.topics && node.topics.length > 0 && (
                        <div className="mb-5 flex flex-wrap items-center gap-2">
                          {node.topics.map(cleanText).filter(Boolean).map((t, ti) => (
                            <span key={ti} className="px-3 py-1 rounded-xl text-[11px] font-mono font-semibold bg-slate-950/80 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5 shadow-xs">
                              <Tag className="w-3 h-3 text-[#04AA6D]" />
                              <span>{t}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400">{node.doneLessons} of {node.totalLessons} Lessons Completed</span>
                          <span className="font-bold text-[#04AA6D]">{node.percentage}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div 
                            className="h-2 rounded-full bg-[#04AA6D] transition-all duration-500" 
                            style={{ width: `${node.percentage}%` }} 
                          />
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="mt-4 flex items-center justify-between text-xs font-mono text-[#04AA6D] font-bold group-hover:underline">
                        <span>{isLocked ? 'View Unlock Requirements' : 'Explore Milestone Syllabus & Concepts'}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {hasNext && (
                    <div className="w-full flex justify-center py-3 relative pointer-events-none">
                      <svg className="w-8 h-14 overflow-visible">
                        <line
                          x1="16" y1="0" x2="16" y2="56"
                          stroke={isCompleted ? '#04AA6D' : '#334155'}
                          strokeWidth="3"
                          strokeDasharray={isCompleted ? 'none' : '6 6'}
                        />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Pathway Completion Certificate Banner */}
        {processedTree.length > 0 && (
          <div className="relative z-10 mt-16 flex flex-col items-center">
            <div className="w-0.5 h-14 bg-gradient-to-b from-slate-800 to-[#04AA6D] mb-3" />
            <div className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-[#04AA6D] text-white font-mono font-bold text-xs flex items-center gap-3 shadow-2xl shadow-emerald-950/80 border border-emerald-400/40">
              <Award className="w-5 h-5" />
              <span>COMPLETION CERTIFICATE UNLOCKED AT 100% TRACK PROGRESS</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Node Detail Drawer Modal ── */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 p-8 overflow-y-auto flex flex-col text-left text-white shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#04AA6D]/20 text-[#04AA6D] uppercase">
                  Milestone Syllabus
                </span>
                <span className="text-xs font-mono text-slate-400">Node #{selectedNode.order}</span>
              </div>

              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-black text-white font-mono leading-snug">{cleanText(selectedNode.title)}</h2>
            {cleanText(selectedNode.description) && (
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">{cleanText(selectedNode.description)}</p>
            )}

            {/* Topics Covered */}
            {selectedNode.topics && selectedNode.topics.length > 0 && (
              <div className="my-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-2">Key Concepts & Topics Covered</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.topics.map(cleanText).filter(Boolean).map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 text-emerald-300 border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Node Status</p>
                <p className="text-sm font-bold font-mono text-[#04AA6D] mt-0.5 capitalize">{selectedNode.status}</p>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Completion</p>
                <p className="text-sm font-bold font-mono text-white mt-0.5">
                  {selectedNode.doneLessons} / {selectedNode.totalLessons} Lessons ({selectedNode.percentage}%)
                </p>
              </div>
            </div>

            {selectedNode.status === 'locked' && (
              <div className="mb-6 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-3">
                <Lock className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <h4 className="font-mono font-bold text-rose-200 text-sm">Milestone Locked</h4>
                  <p className="mt-1 leading-relaxed text-xs">
                    Finish all lessons in previous milestones to unlock this node.
                  </p>
                </div>
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-300 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#04AA6D]" />
                <span>Node Lessons & Practice Exercises</span>
              </h3>

              <div className="space-y-3">
                {selectedNode.lessons.length === 0 ? (
                  <p className="text-xs font-mono text-slate-500 py-6 text-center">No lessons published for this module yet.</p>
                ) : (
                  selectedNode.lessons.map((lesson, li) => {
                    const done = isLessonDone(lesson);
                    const LIcon = lesson.type === 'video' ? Play : lesson.type === 'code' ? Code2 : FileText;

                    return (
                      <div 
                        key={lesson._id || li} 
                        className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                          done 
                            ? 'bg-slate-950/80 border-emerald-500/30' 
                            : 'bg-slate-950/50 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${done ? 'bg-emerald-500/20 text-[#04AA6D]' : 'bg-slate-800 text-slate-400'}`}>
                            <LIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className={`font-mono font-bold ${done ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                              {lesson.title}
                            </p>
                            <span className="text-[10px] font-mono text-slate-500 capitalize">{lesson.type || 'lesson'}</span>
                          </div>
                        </div>

                        {selectedNode.status !== 'locked' && (
                          <button
                            onClick={() => onMarkLessonComplete(lesson._id || lesson, done)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                              done 
                                ? 'bg-emerald-500/10 text-[#04AA6D] border border-emerald-500/30 hover:bg-emerald-500/20' 
                                : 'bg-[#04AA6D] text-white hover:bg-emerald-600 shadow-md'
                            }`}
                          >
                            {done ? 'Completed ✓' : 'Mark Done'}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6">
              <button
                onClick={() => {
                  setSelectedNodeId(null);
                  if (onStartLearning) onStartLearning();
                }}
                disabled={selectedNode.status === 'locked'}
                className={`w-full py-3.5 rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  selectedNode.status === 'locked'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-[#04AA6D] text-white hover:bg-emerald-600 shadow-xl shadow-emerald-950/50'
                }`}
              >
                <span>{selectedNode.status === 'locked' ? 'Milestone Locked' : 'Start Milestone'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default VisualRoadmapTree;
