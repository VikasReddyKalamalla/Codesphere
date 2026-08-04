import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BookOpen, ChevronDown, ChevronRight, Clock, Building2,
  AlertTriangle, CheckCircle2, Circle, RotateCw, Bookmark, Star, Zap,
  Check, FileText, Lightbulb, Sparkles, Code2, ShieldAlert, Cpu, Layers
} from 'lucide-react';
import { dsaAPI } from '../services/dsaAPI';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const DiffBadge = ({ d }) => {
  const c = { easy:'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', medium:'text-amber-400 bg-amber-500/15 border-amber-500/30', hard:'text-red-400 bg-red-500/15 border-red-500/30' };
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border tracking-wider ${c[d]||c.easy}`}>{d}</span>;
};

const StatusIcon = ({ status }) => {
  if (status === 'solved') return <CheckCircle2 className="w-4 h-4 text-[#04AA6D]" />;
  if (status === 'in_progress') return <RotateCw className="w-4 h-4 text-amber-400" />;
  if (status === 'needs_revision') return <AlertTriangle className="w-4 h-4 text-orange-400" />;
  return <Circle className="w-4 h-4 text-zinc-600" />;
};

/**
 * Custom Interactive Quiz Component for GeeksforGeeks Theory Self-Assessment
 */
const InteractiveQuiz = ({ quizData }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!quizData || quizData.length === 0) return null;

  const handleSelect = (qIdx, oIdx) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    quizData.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) score++;
    });
    return score;
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Interactive Concept Check (GFG Quiz)
        </div>
        {submitted && (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-mono font-bold">
            Score: {calculateScore()} / {quizData.length}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {quizData.map((q, qIdx) => (
          <div key={qIdx} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-start gap-2">
              <span className="text-[#04AA6D] font-mono">Q{qIdx + 1}.</span> {q.question}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[qIdx] === oIdx;
                const isCorrect = q.correct === oIdx;
                let btnStyle = 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700';

                if (submitted) {
                  if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold';
                  else if (isSelected && !isCorrect) btnStyle = 'bg-red-500/20 border-red-500/50 text-red-300';
                } else if (isSelected) {
                  btnStyle = 'bg-[#04AA6D]/20 border-[#04AA6D]/50 text-emerald-300 font-bold';
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, oIdx)}
                    className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {submitted && q.explanation && (
              <p className="text-[11px] text-zinc-400 font-mono bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                💡 <span className="text-zinc-200">Explanation:</span> {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selectedAnswers).length === 0}
            className="px-5 py-2 bg-[#04AA6D] hover:bg-[#038d5a] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Check Answers
          </button>
        ) : (
          <button
            onClick={() => { setSubmitted(false); setSelectedAnswers({}); }}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border border-zinc-700 transition-all cursor-pointer"
          >
            Retry Quiz 🔄
          </button>
        )}
      </div>
    </div>
  );
};
const FormattedMarkdownContent = ({ content }) => {
  if (!content) return null;

  // Detect raw table lines (e.g. | Concept | Time | ...)
  if (content.includes('|')) {
    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
    const tableRows = lines.filter(l => l.startsWith('|') && l.endsWith('|'));
    
    if (tableRows.length >= 2) {
      // Parse header and rows
      const parseRow = (row) => row.split('|').map(c => c.trim()).filter(Boolean);
      const headers = parseRow(tableRows[0]);
      const dataRows = tableRows.slice(2).map(parseRow); // Skip separator line

      const nonTableText = lines.filter(l => !l.startsWith('|')).join('\n');

      return (
        <div className="space-y-4">
          {nonTableText && (
            <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
              <ReactMarkdown>{nonTableText}</ReactMarkdown>
            </div>
          )}

          {/* GFG Style HTML Table */}
          <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950 shadow-xl my-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300 font-mono">
                <thead className="bg-[#04AA6D]/20 text-[#04AA6D] font-bold border-b border-zinc-800 uppercase tracking-wider">
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className="px-4 py-3 border-r border-zinc-800/80 last:border-r-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {dataRows.map((row, ri) => (
                    <tr key={ri} className="hover:bg-zinc-900/60 transition-colors">
                      {row.map((cell, ci) => {
                        const isO1 = cell.includes('O(1)');
                        const isON = cell.includes('O(N)') || cell.includes('O(log');
                        const isN2 = cell.includes('O(N²)');
                        return (
                          <td key={ci} className="px-4 py-3 border-r border-zinc-800/60 last:border-r-0">
                            {isO1 ? (
                              <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-md font-bold">{cell}</span>
                            ) : isON ? (
                              <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 rounded-md font-bold">{cell}</span>
                            ) : isN2 ? (
                              <span className="px-2 py-0.5 bg-red-500/15 text-red-400 rounded-md font-bold">{cell}</span>
                            ) : (
                              <span>{cell}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="prose prose-invert prose-sm max-w-none text-zinc-300 font-sans leading-relaxed">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default function DSATopicPage() {
  const { topicSlug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeTab, setActiveTab] = useState('theory'); // Theory-First Default!
  const [theoryLearned, setTheoryLearned] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => { loadTopic(); }, [topicSlug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadTopic = async () => {
    try {
      const res = await dsaAPI.getTopicBySlug(topicSlug);
      setData(res.data);
      const savedLearned = localStorage.getItem(`theory_learned_${topicSlug}`) === 'true';
      setTheoryLearned(savedLearned);

      const expanded = {};
      (res.data?.sections || []).forEach(s => { expanded[s._id] = true; });
      setExpandedSections(expanded);
    } catch (err) {
      toast.error('Failed to load topic details');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkTheoryLearned = () => {
    const next = !theoryLearned;
    setTheoryLearned(next);
    localStorage.setItem(`theory_learned_${topicSlug}`, next ? 'true' : 'false');
    if (next) {
      toast.success('Theory Mastered! Earned +20 XP 🎉', { duration: 4000 });
      setActiveTab('problems');
    } else {
      toast('Theory marked as pending review');
    }
  };

  const toggleSection = (id) => setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Sparkles className="w-8 h-8 text-[#04AA6D]" />
        </motion.div>
        <p className="text-xs text-zinc-500 font-mono">Opening Theory Module...</p>
      </div>
    );
  }

  if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Topic not found</div>;

  const { topic, sections, unsectionedProblems } = data;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#04AA6D] selection:text-white">
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-900 z-50">
        <div className="h-full bg-gradient-to-r from-[#04AA6D] via-emerald-400 to-teal-300 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Header Navigation */}
      <div className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dsa')}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{topic.icon}</span>
                <h1 className="text-base sm:text-lg font-bold truncate max-w-xs sm:max-w-md">{topic.title}</h1>
                <DiffBadge d={topic.difficulty} />
              </div>
              <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono mt-0.5">
                <span>{topic.userSolved || 0}/{topic.totalProblems} Solved</span>
                {topic.estimatedHours > 0 && <span>⏱️ ~{topic.estimatedHours}h</span>}
              </div>
            </div>
          </div>

          <button
            onClick={handleMarkTheoryLearned}
            className={`px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              theoryLearned
                ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30'
                : 'bg-[#04AA6D] hover:bg-[#038d5a] text-white'
            }`}
          >
            {theoryLearned ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Theory Mastered ✓
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" /> Mark Theory Learned (+20 XP)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Navigation Tabs */}
        <div className="flex gap-1.5 p-1.5 bg-zinc-900/90 rounded-2xl border border-zinc-800 mb-8 overflow-x-auto">
          {[
            { id: 'theory', label: '📖 GeeksforGeeks Theory Textbook', icon: BookOpen },
            { id: 'problems', label: `🎯 Practice Questions (${topic.totalProblems || 0})`, icon: Code2 },
            { id: 'overview', label: '💡 Overview & Companies', icon: Lightbulb },
            { id: 'resources', label: '📋 Cheat Sheet & Pitfalls', icon: ShieldAlert },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#04AA6D] text-white shadow-lg shadow-[#04AA6D]/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ═══ TAB 1: THEORY & CORE CONCEPTS ═══ */}
        {activeTab === 'theory' && (
          <div className="space-y-8">
            
            {/* GFG Style Banner Header */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-[#04AA6D]/20 border border-[#04AA6D]/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#04AA6D]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/30">
                    GEEKSFORGEEKS STYLE TEXTBOOK
                  </span>
                  {theoryLearned && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Mastered (+20 XP)
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Theoretical Foundations & Intuition
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                  Read through the core concepts, Big-O complexity matrices, and algorithmic code templates below.
                </p>
              </div>
            </div>

            {/* 1. Core Intuition & Intro */}
            {topic.introduction && (
              <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 text-[#04AA6D] font-bold text-sm uppercase tracking-wider border-b border-zinc-800/80 pb-3">
                  <Lightbulb className="w-4 h-4" /> Core Concept Blueprint
                </div>
                <FormattedMarkdownContent content={topic.introduction} />
              </div>
            )}

            {/* 2. Big-O Complexity Matrix */}
            {topic.cheatSheet && (
              <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 text-[#04AA6D] font-bold text-sm uppercase tracking-wider border-b border-zinc-800/80 pb-3">
                  <Cpu className="w-4 h-4" /> Time & Space Complexity Reference
                </div>
                <FormattedMarkdownContent content={topic.cheatSheet} />
              </div>
            )}

            {/* 3. Common Pitfalls & Traps */}
            {topic.commonMistakes && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-950/20 via-zinc-950 to-zinc-950 border border-red-900/30 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm uppercase tracking-wider border-b border-zinc-800/80 pb-3">
                  <AlertTriangle className="w-4 h-4" /> Common Interview Pitfalls
                </div>
                <FormattedMarkdownContent content={topic.commonMistakes} />
              </div>
            )}

            {/* 4. Interactive Concept Check Quiz */}
            {topic.quiz && (
              <InteractiveQuiz quizData={topic.quiz} />
            )}

            {/* Floating Action Bar */}
            <div className="sticky bottom-6 z-30 p-4 rounded-2xl bg-zinc-900/95 border border-zinc-800 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#04AA6D]/20 border border-[#04AA6D]/30 flex items-center justify-center text-[#04AA6D] shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Finished Reading the Concept?</h4>
                  <p className="text-[11px] text-zinc-400">Mark theory complete to unlock practice questions (+20 XP).</p>
                </div>
              </div>

              <button
                onClick={handleMarkTheoryLearned}
                className="px-5 py-2.5 bg-[#04AA6D] hover:bg-[#038d5a] font-bold text-xs text-white rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2 cursor-pointer border border-emerald-400/30"
              >
                {theoryLearned ? 'Revisit Theory' : 'Mark Theory as Mastered (+20 XP) →'}
              </button>
            </div>

          </div>
        )}

        {/* ═══ TAB 2: PRACTICE QUESTIONS ═══ */}
        {activeTab === 'problems' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-base font-bold text-white">Practice Questions Suite</h3>
                <p className="text-xs text-zinc-400">Solve LeetCode-style questions with live local code compilation.</p>
              </div>
              <span className="text-xs font-mono text-zinc-500">{topic.totalProblems || 0} Questions Total</span>
            </div>

            {/* Sections Accordion */}
            <div className="space-y-4">
              {sections?.map((section, si) => (
                <motion.div
                  key={section._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: si * 0.04 }}
                  className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950 shadow-lg"
                >
                  <button
                    onClick={() => toggleSection(section._id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-bold text-white">{section.title}</h4>
                      <span className="px-2.5 py-0.5 bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/30 rounded-full text-[10px] font-mono font-bold">
                        {section.problems?.length || 0} questions
                      </span>
                    </div>
                    {expandedSections[section._id] !== false ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                  </button>

                  {expandedSections[section._id] !== false && (
                    <div className="border-t border-zinc-800/80 divide-y divide-zinc-800/50">
                      {(section.problems || []).map((problem) => (
                        <button
                          key={problem._id}
                          onClick={() => navigate(`/dsa/problem/${problem.slug}`)}
                          className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-900/80 transition-colors text-left group cursor-pointer"
                        >
                          <StatusIcon status={problem.userStatus} />
                          <span className="flex-1 text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                            {problem.title}
                          </span>
                          <DiffBadge d={problem.difficulty} />
                          {problem.estimatedTime > 0 && <span className="text-[11px] text-zinc-500 font-mono">{problem.estimatedTime}m</span>}
                          <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-300 transition-colors shrink-0" />
                        </button>
                      ))}
                      {(!section.problems || section.problems.length === 0) && (
                        <div className="px-5 py-6 text-center text-xs text-zinc-600">No questions in this section yet</div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Unsectioned problems */}
              {unsectionedProblems?.length > 0 && (
                <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950 shadow-lg">
                  <div className="p-4 border-b border-zinc-800/80">
                    <h4 className="text-sm font-bold text-white">All Topic Questions</h4>
                  </div>
                  <div className="divide-y divide-zinc-800/50">
                    {unsectionedProblems.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => navigate(`/dsa/problem/${p.slug}`)}
                        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-900/80 transition-colors text-left group cursor-pointer"
                      >
                        <StatusIcon status={p.userStatus} />
                        <span className="flex-1 text-xs font-semibold text-zinc-200 group-hover:text-white truncate">{p.title}</span>
                        <DiffBadge d={p.difficulty} />
                        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ═══ TAB 3: OVERVIEW & COMPANIES ═══ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" /> Why This Topic Matters in Technical Interviews
              </h3>
              <FormattedMarkdownContent content={topic.whyItMatters || 'Mastering this topic is essential for software engineering technical rounds at FAANG and tier-1 product companies.'} />
            </div>

            {topic.interviewCompanies?.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#04AA6D]" /> Top Recruiting Companies
                </h3>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {topic.interviewCompanies.map(c => (
                    <span key={c} className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                      🏢 {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB 4: RESOURCES & PITFALLS ═══ */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            {topic.cheatSheet && (
              <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#04AA6D]" /> Complexity Cheat Sheet
                </h3>
                <FormattedMarkdownContent content={topic.cheatSheet} />
              </div>
            )}

            {topic.commonMistakes && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-950/20 via-zinc-950 to-zinc-950 border border-red-900/30 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" /> Common Mistakes & Edge Cases
                </h3>
                <FormattedMarkdownContent content={topic.commonMistakes} />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
