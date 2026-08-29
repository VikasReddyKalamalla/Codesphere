import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  ArrowLeft, Play, Send, CheckCircle2, XCircle, RotateCcw,
  BookOpen, Lightbulb, Lock, Unlock, FileText, MessageSquare,
  Clock, Cpu, ChevronUp, ChevronDown, Bookmark, Star, AlertTriangle,
  Terminal, Sparkles, Check, Copy
} from 'lucide-react';
import { dsaAPI } from '../services/dsaAPI';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const LANG_CONFIG = {
  javascript: { name: 'JavaScript', monacoLang: 'javascript', defaultCode: '// Write your code here\n' },
  python: { name: 'Python 3', monacoLang: 'python', defaultCode: '# Write your code here\n' },
  java: { name: 'Java', monacoLang: 'java', defaultCode: '// Write your code here\n' },
  cpp: { name: 'C++', monacoLang: 'cpp', defaultCode: '// Write your code here\n' },
};

export default function DSAProblemPage() {
  const { problemSlug } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('statement');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  
  // Hint reveal state
  const [revealedHints, setRevealedHints] = useState(0);

  // Editorial state
  const [editorial, setEditorial] = useState(null);
  const [editorialLoading, setEditorialLoading] = useState(false);

  // Execution state
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTestTab, setActiveTestTab] = useState(0);

  // Notes state
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Submissions history
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // AI Co-Pilot Assistant State
  const [aiCoPilotModal, setAiCoPilotModal] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAIExplain = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiCoPilotModal({
        type: 'explain',
        title: '🤖 AI Co-Pilot: Code Explanation',
        text: `### 🧑‍🏫 AI Code Analysis for "${problem?.title || 'DSA Problem'}"\n\n1. **Data Structure Strategy**: Your code initializes state and iterates through the input parameters.\n2. **Time Complexity**: **O(N)** linear pass over elements.\n3. **Space Complexity**: **O(1)** auxiliary space usage.\n\n> *Tip: Ensure edge cases like null or single-element inputs are guarded.*`,
        codeSnippet: `// Example optimized pattern for ${language}:\nif (!input || input.length === 0) return 0;`
      });
      setAiLoading(false);
    }, 600);
  };

  const handleAIDebug = () => {
    setAiLoading(true);
    const hasError = results?.testResults?.some(t => !t.passed);
    setTimeout(() => {
      setAiCoPilotModal({
        type: 'debug',
        title: '🛠️ AI Co-Pilot: Error Diagnostic',
        text: hasError 
          ? `### ⚠️ Diagnostic Failure Analysis\nWe detected failed test cases in your latest run.\n\n**Common Root Cause**: Index out of bounds or off-by-one comparison on loop termination.\n\n**Recommendation**: Check strict bounds \`i < n\` instead of \`i <= n\`.`
          : `### ✅ Clean Code Inspection\nNo runtime errors detected in current execution. Check edge case handling for large input constraints.`,
        codeSnippet: `// Suggested index bounds fix:\nfor (let i = 0; i < array.length; i++) {\n  // Process element safely\n}`
      });
      setAiLoading(false);
    }, 600);
  };

  const handleAIHint = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiCoPilotModal({
        type: 'hint',
        title: '💡 AI Co-Pilot: Algorithmic Hint',
        text: `### 💡 Algorithmic Strategy Hint\nConsider using a **Two Pointer** technique (Left & Right pointers moving inward) or a **Hash Map** to store complement values for O(1) lookups instead of nested loops.`,
        codeSnippet: `// Two-Pointer approach skeleton:\nlet left = 0, right = nums.length - 1;\nwhile (left < right) {\n  // Evaluate pointers\n}`
      });
      setAiLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadProblem();
  }, [problemSlug]);

  const loadProblem = async () => {
    try {
      setLoading(true);
      const res = await dsaAPI.getProblemBySlug(problemSlug);
      const p = res.data.problem;
      setProblem(p);
      setNotes(p.personalNotes || '');
      setEditorial(p.editorial || null);

      // Set starter code
      const initialLang = p.starterCode?.python ? 'python' : Object.keys(p.starterCode || {})[0] || 'python';
      setLanguage(initialLang);
      setCode(p.starterCode?.[initialLang] || LANG_CONFIG[initialLang]?.defaultCode || '');
    } catch (err) {
      toast.error('Failed to load problem');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem?.starterCode?.[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  };

  const handleRun = async () => {
    try {
      setRunning(true);
      setResults(null);
      const res = await dsaAPI.runCode(problemSlug, { code, language });
      setResults({ type: 'run', ...res.data });
      if (res.data.allPassed) toast.success('Sample test cases passed!');
      else toast.error('Some test cases failed');
    } catch (err) {
      toast.error(err.message || 'Execution failed');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setResults(null);
      const res = await dsaAPI.submitCode(problemSlug, { code, language });
      setResults({ type: 'submit', ...res.data });

      if (res.data.allPassed) {
        toast.success('Accepted! 🎉');
        // Refresh problem data to get updated status/editorial
        loadProblem();
      } else {
        toast.error(`Submission evaluated: ${res.data.status}`);
      }
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlockEditorial = async () => {
    try {
      setEditorialLoading(true);
      const res = await dsaAPI.unlockEditorial(problemSlug);
      setEditorial(res.data.editorial);
      toast.success('Editorial unlocked!');
    } catch (err) {
      toast.error('Failed to unlock editorial');
    } finally {
      setEditorialLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      await dsaAPI.saveNotes(problemSlug, notes);
      toast.success('Notes saved');
    } catch (err) {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoadingSubmissions(true);
      const res = await dsaAPI.getSubmissions(problemSlug);
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      toast.error('Failed to load submissions');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Sparkles className="w-8 h-8 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  if (!problem) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Problem not found</div>;

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <div className="h-14 border-b border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(problem.topicId?.slug ? `/dsa/topic/${problem.topicId.slug}` : '/dsa')}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-zinc-500">{problem.topicId?.title || 'DSA'} /</span>
          <h1 className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs">{problem.title}</h1>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
            problem.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
            problem.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
            'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Language selector & LeetCode link & Actions */}
        <div className="flex items-center gap-3">
          {problem.leetcodeUrl && (
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#04AA6D]/20 hover:bg-[#04AA6D]/30 border border-[#04AA6D]/40 text-[#04AA6D] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              title="Open problem on LeetCode"
            >
              <span className="text-amber-400 font-extrabold">LC</span> Solve on LeetCode ↗
            </a>
          )}

          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-zinc-700"
          >
            {Object.keys(LANG_CONFIG).map(l => (
              <option key={l} value={l}>{LANG_CONFIG[l].name}</option>
            ))}
          </select>

          <button
            onClick={handleRun}
            disabled={running || submitting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg border border-zinc-700 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {running ? 'Running...' : 'Run'}
          </button>

          <button
            onClick={handleSubmit}
            disabled={running || submitting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Tabs & Content */}
        <div className="w-1/2 border-r border-zinc-800 flex flex-col bg-zinc-950 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-zinc-800 bg-zinc-900/50 px-2 shrink-0">
            {[
              { id: 'statement', label: 'Problem', icon: FileText },
              { id: 'hints', label: `Hints (${problem.hints?.length || 0})`, icon: Lightbulb },
              { id: 'editorial', label: 'Editorial', icon: BookOpen },
              { id: 'notes', label: 'Notes', icon: MessageSquare },
              { id: 'submissions', label: 'Submissions', icon: Clock },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'submissions') loadSubmissions();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-white bg-zinc-900'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 text-sm">
            {activeTab === 'statement' && (
              <div className="space-y-6">
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{problem.statement}</ReactMarkdown>
                </div>

                {/* Examples */}
                {problem.examples?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Examples</h3>
                    {problem.examples.map((ex, idx) => (
                      <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs space-y-2 font-mono">
                        <div><span className="text-zinc-500">Input:</span> {ex.input}</div>
                        <div><span className="text-zinc-500">Output:</span> <span className="text-emerald-400">{ex.output}</span></div>
                        {ex.explanation && <div className="text-zinc-400 font-sans italic">{ex.explanation}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Constraints</h3>
                    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 text-xs font-mono text-zinc-300">
                      <ReactMarkdown>{problem.constraints}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-400" /> Progressive Hint System
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Unlock hints step-by-step to guide your solution without spoiling the full answer.
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/30 shrink-0 font-mono">
                    Unlocked {revealedHints} / {problem.hints?.length || 3}
                  </div>
                </div>

                <div className="space-y-3">
                  {problem.hints?.map((hint, idx) => {
                    const isUnlocked = idx < revealedHints;
                    const stageTitles = [
                      'Stage 1: Conceptual Intuition',
                      'Stage 2: Data Structure & Strategy',
                      'Stage 3: Edge Cases & Complexity Target',
                    ];
                    const stageIcons = ['💡', '🛠️', '⚡'];

                    return (
                      <div
                        key={idx}
                        className={`border rounded-2xl transition-all overflow-hidden ${
                          isUnlocked
                            ? 'bg-zinc-950 border-[#04AA6D]/40 shadow-lg shadow-[#04AA6D]/5'
                            : 'bg-zinc-900/40 border-zinc-800/80'
                        }`}
                      >
                        {isUnlocked ? (
                          <div className="p-4 text-xs text-zinc-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-1.5">
                                <span>{stageIcons[idx] || '💡'}</span> {stageTitles[idx] || `Hint ${idx + 1}`}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono">UNLOCKED</span>
                            </div>
                            <div className="prose prose-invert prose-xs leading-relaxed">
                              <ReactMarkdown>{hint}</ReactMarkdown>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRevealedHints(idx + 1)}
                            disabled={idx > revealedHints}
                            className={`w-full p-4 text-xs flex items-center justify-between transition-colors ${
                              idx === revealedHints
                                ? 'text-white bg-zinc-900/80 hover:bg-[#04AA6D]/10 hover:border-[#04AA6D]/40 cursor-pointer'
                                : 'text-zinc-500 cursor-not-allowed opacity-60'
                            }`}
                          >
                            <span className="font-semibold flex items-center gap-2">
                              <span>🔒</span> {stageTitles[idx] || `Hint ${idx + 1}`} (Click to reveal)
                            </span>
                            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {idx === revealedHints ? 'Unlock Hint' : 'Locked'}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'editorial' && (
              <div>
                {editorial ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{editorial}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-4">
                    <Lock className="w-8 h-8 text-zinc-600 mx-auto" />
                    <div>
                      <h4 className="font-bold text-white">Editorial Locked</h4>
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1">
                        Solve this problem first to unlock the official editorial, or unlock it now.
                      </p>
                    </div>
                    <button
                      onClick={handleUnlockEditorial}
                      disabled={editorialLoading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      {editorialLoading ? 'Unlocking...' : 'Unlock Editorial'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="h-full flex flex-col gap-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write your personal notes, key takeaways, or approach here (Markdown supported)..."
                  className="flex-1 w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-3">
                {loadingSubmissions ? (
                  <div className="text-center py-8 text-xs text-zinc-500">Loading submissions...</div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8 text-xs text-zinc-500">No submissions yet</div>
                ) : (
                  submissions.map((sub, idx) => (
                    <div key={sub._id || idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        {sub.status === 'accepted' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={sub.status === 'accepted' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                          {sub.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-zinc-500">{sub.language}</div>
                      <div className="text-zinc-500">{new Date(sub.submittedAt).toLocaleDateString()}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Monaco Code Editor & Results */}
        <div className="w-1/2 flex flex-col bg-zinc-950 overflow-hidden">
          {/* AI Co-Pilot Assistant Action Toolbar */}
          <div className="bg-zinc-900/90 border-b border-zinc-800 px-3 py-1.5 flex items-center justify-between font-mono text-xs shrink-0">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI Co-Pilot Assistant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAIExplain}
                disabled={aiLoading}
                className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                ✨ Explain Code
              </button>
              <button
                onClick={handleAIDebug}
                disabled={aiLoading}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                🛠️ Fix & Debug
              </button>
              <button
                onClick={handleAIHint}
                disabled={aiLoading}
                className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                💡 AI Hint
              </button>
            </div>
          </div>

          {/* Editor Container */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={LANG_CONFIG[language]?.monacoLang || 'python'}
              value={code}
              onChange={(v) => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
                fontFamily: 'Fira Code, monospace',
              }}
            />
          </div>

          {/* Test Results / Execution Panel */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                className="h-56 border-t border-zinc-800 bg-zinc-900 flex flex-col overflow-hidden"
              >
                {/* Results Header */}
                <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 shrink-0">
                  <div className="flex items-center gap-2">
                    {results.allPassed ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> All Tests Passed ({results.passedTests}/{results.totalTests})
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Tests Failed ({results.passedTests}/{results.totalTests})
                      </span>
                    )}
                  </div>
                  <button onClick={() => setResults(null)} className="text-xs text-zinc-500 hover:text-zinc-300">Close</button>
                </div>

                {/* Test Case Tabs */}
                <div className="flex-1 flex flex-col overflow-hidden p-3 text-xs font-mono">
                  <div className="flex gap-2 mb-2 overflow-x-auto">
                    {results.testResults?.map((tr, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTestTab(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                          activeTestTab === idx ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:bg-zinc-950'
                        }`}
                      >
                        <span className={tr.passed ? 'w-2 h-2 rounded-full bg-emerald-400' : 'w-2 h-2 rounded-full bg-red-400'} />
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  {/* Active Test Case Detail */}
                  {results.testResults?.[activeTestTab] && (
                    <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-2 overflow-y-auto">
                      <div>
                        <div className="text-zinc-500">Input:</div>
                        <div className="text-zinc-200">{results.testResults[activeTestTab].input}</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">Expected:</div>
                        <div className="text-emerald-400">{results.testResults[activeTestTab].expected}</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">Output:</div>
                        <div className={results.testResults[activeTestTab].passed ? 'text-emerald-400 font-mono whitespace-pre-wrap' : 'text-red-400 font-mono whitespace-pre-wrap'}>
                          {results.testResults[activeTestTab].actual || '<empty>'}
                        </div>
                      </div>
                      {results.testResults[activeTestTab].error && (
                        <div className="mt-2 p-2 bg-red-950/40 border border-red-800/40 rounded-lg">
                          <div className="text-red-400 font-bold mb-1">Runtime / Compiler Error:</div>
                          <div className="text-red-300 font-mono text-[11px] whitespace-pre-wrap">
                            {results.testResults[activeTestTab].error}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI Co-Pilot Modal Drawer */}
      {aiCoPilotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-fade-in flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm font-mono">
                <Sparkles className="w-4 h-4" />
                <span>{aiCoPilotModal.title}</span>
              </div>
              <button
                onClick={() => setAiCoPilotModal(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="prose prose-invert prose-xs leading-relaxed text-zinc-300 font-sans max-h-60 overflow-y-auto">
              <ReactMarkdown>{aiCoPilotModal.text}</ReactMarkdown>
            </div>

            {aiCoPilotModal.codeSnippet && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase">Suggested Code Pattern</span>
                <div className="p-3 bg-black border border-zinc-800 rounded-xl font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                  {aiCoPilotModal.codeSnippet}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <button
                onClick={() => {
                  if (aiCoPilotModal.codeSnippet) {
                    setCode(prev => prev + '\n\n' + aiCoPilotModal.codeSnippet);
                    toast.success('Applied suggested code pattern to editor!');
                  }
                  setAiCoPilotModal(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Append Code to Editor
              </button>

              <button
                onClick={() => setAiCoPilotModal(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold font-mono rounded-xl transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
