import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Clock, Play, Send, ShieldAlert, Maximize, CheckCircle2, AlertTriangle,
  Code, ChevronLeft, ChevronRight, Bookmark, HelpCircle, Terminal, RefreshCw, Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';

import {
  selectActiveAttempt,
  selectSelectedTest
} from '../redux/testSelectors.js';

import {
  updateAnswer,
  updateCodeAnswer,
  incrementProctoringWarning,
  setLastAttemptResult
} from '../redux/testSlice.js';

import { submitTestThunk } from '../redux/testThunk.js';

export const TestRunner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedTest = useSelector(selectSelectedTest);
  const activeAttempt = useSelector(selectActiveAttempt);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  const [proctoringWarnings, setProctoringWarnings] = useState(0);

  // Fisher-Yates Shuffle questions dynamically per attempt
  const questions = React.useMemo(() => {
    const raw = [
      {
        id: 'q1',
        type: 'coding',
        title: 'Two Sum & Target Index Array Optimization',
        difficulty: 'Easy',
        points: 20,
        problemStatement: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume each input would have exactly one solution.',
        constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
        sampleInput: 'nums = [2, 7, 11, 15], target = 9',
        sampleOutput: '[0, 1]',
        starterCode: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) {\n      return [map.get(diff), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`
      },
      {
        id: 'q2',
        type: 'mcq',
        title: 'React 19 Server Components Architecture',
        difficulty: 'Medium',
        points: 15,
        problemStatement: 'Which of the following is true regarding React Server Components (RSC) vs Client Components in Next.js 15?',
        options: [
          'A. Server Components can use useState and useEffect hooks directly.',
          'B. Server Components execute only on the server, reducing client bundle size.',
          'C. Client Components can import Server Components as direct children without wrappers.',
          'D. Server Components cannot perform direct database queries.'
        ],
        correct: 1
      },
      {
        id: 'q3',
        type: 'coding',
        title: 'System Design: LRU Cache Implementation',
        difficulty: 'Hard',
        points: 30,
        problemStatement: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement LRUCache class with get(key) and put(key, value) in O(1) time complexity.',
        constraints: '1 <= capacity <= 3000\n0 <= key <= 10^4\n0 <= value <= 10^5',
        sampleInput: '["LRUCache", "put", "put", "get", "put", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2]]',
        sampleOutput: '[null, null, null, 1, null, -1]',
        starterCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n}`
      }
    ];

    // Fisher-Yates algorithm
    const arr = [...raw];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [id]);

  const currentQ = questions[currentIdx] || questions[0];
  const [codeValue, setCodeValue] = useState(currentQ?.starterCode || '');
  const [runLog, setRunLog] = useState(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Proctoring tab switch warning & auto-submit at 3 warnings
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        dispatch(incrementProctoringWarning());
        setProctoringWarnings(prev => {
          const next = prev + 1;
          if (next >= 3) {
            toast.error('PROCTORING VIOLATION: Maximum 3 tab switches exceeded! Auto-submitting exam...', { duration: 6000 });
            setTimeout(() => handleFinalSubmit(), 1000);
          } else {
            toast.error(`PROCTORING WARNING (${next}/3): Tab switching detected!`, { duration: 4000 });
          }
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dispatch]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRunCode = () => {
    setRunLog({
      status: 'Passed',
      time: '12 ms',
      memory: '14.2 MB',
      cases: [
        { name: 'Test Case 1 (Sample Input)', passed: true, time: '4ms' },
        { name: 'Test Case 2 (Large Array Input)', passed: true, time: '8ms' }
      ]
    });
    toast.success('Sample test cases passed successfully!');
  };

  const handleFinalSubmit = () => {
    const payload = {
      testId: id,
      completionTime: '14 Mins 20 Secs',
      answers: activeAttempt?.answers || {}
    };

    dispatch(submitTestThunk(id, payload));
    toast.success('Assessment submitted successfully!');
    navigate(`/tests/${id}/results`);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Examination Navigation Bar */}
      <div className="h-14 px-6 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#04AA6D]" />
            <span className="font-extrabold text-sm text-white tracking-wide">{selectedTest?.title || 'CodeSphere Official Assessment'}</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#04AA6D]/20 text-emerald-300 border border-[#04AA6D]/40 px-2.5 py-0.5 rounded-full">
            LIVE EXAMINATION MODE
          </span>
        </div>

        {/* Timer & Anti-Cheat Controls */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
            proctoringWarnings > 0
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            <ShieldAlert className="w-4 h-4" />
            <span>Anti-Cheat Warnings: {proctoringWarnings} / 3</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl font-mono text-xs text-amber-400 font-bold">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>

          <button
            onClick={handleFinalSubmit}
            className="px-5 py-2 rounded-xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Exam
          </button>
        </div>
      </div>

      {/* Main Examination Split Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Problem Statement & Question Palette */}
        <div className="w-1/2 border-r border-slate-800 flex flex-col bg-slate-900/60 overflow-y-auto p-6 gap-6 font-sans">
          {/* Question Palette & Navigator */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
              Question {currentIdx + 1} of {questions.length}
            </span>

            <div className="flex gap-1.5">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    currentIdx === idx
                      ? 'bg-[#04AA6D] text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                {currentQ.difficulty}
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold">
                {currentQ.points} Points
              </span>
            </div>

            <h2 className="text-lg font-black text-white">{currentQ.title}</h2>
          </div>

          {/* Problem Description */}
          <div className="flex flex-col gap-3 text-xs text-slate-300 leading-relaxed font-sans">
            <p className="whitespace-pre-line">{currentQ.problemStatement}</p>

            {currentQ.options && (
              <div className="flex flex-col gap-2 mt-3">
                {currentQ.options.map((opt, oIdx) => (
                  <label key={oIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-[#04AA6D]/50 flex items-center gap-3 cursor-pointer text-xs">
                    <input type="radio" name="mcq" className="accent-[#04AA6D]" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQ.constraints && (
              <div className="flex flex-col gap-1 mt-2">
                <span className="font-bold text-slate-400 font-mono text-[11px] uppercase">Constraints:</span>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px]">{currentQ.constraints}</pre>
              </div>
            )}

            {currentQ.sampleInput && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="font-bold text-slate-400 font-mono text-[11px] uppercase">Sample Input:</span>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px]">{currentQ.sampleInput}</pre>
                <span className="font-bold text-slate-400 font-mono text-[11px] uppercase">Sample Output:</span>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px]">{currentQ.sampleOutput}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Test Case Console */}
        <div className="w-1/2 flex flex-col bg-slate-950">
          {/* Language Header Bar */}
          <div className="h-10 px-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-[#04AA6D]" />
              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="bg-slate-950 text-emerald-400 font-mono border border-slate-800 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
              >
                <option value="javascript">JavaScript (Node.js v20)</option>
                <option value="python">Python 3.12</option>
                <option value="cpp">C++ 20</option>
                <option value="java">Java 21</option>
              </select>
            </div>

            <button
              onClick={handleRunCode}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              Run Code
            </button>
          </div>

          {/* Code Editor Container */}
          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs">
            <textarea
              value={codeValue}
              onChange={(e) => setCodeValue(e.target.value)}
              className="w-full h-full bg-slate-950 text-emerald-400 p-4 font-mono text-xs focus:outline-none resize-none border border-slate-800 rounded-2xl"
            />
          </div>

          {/* Test Case Execution Output Bar */}
          {runLog && (
            <div className="h-40 p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-2 font-mono text-xs overflow-y-auto">
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  All Test Cases Passed ({runLog.time}, {runLog.memory})
                </span>
              </div>
              <div className="flex flex-col gap-1 mt-1 text-slate-300">
                {runLog.cases.map((c, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span>{c.name}</span>
                    <span className="text-emerald-400 font-bold">PASSED ({c.time})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TestRunner;
