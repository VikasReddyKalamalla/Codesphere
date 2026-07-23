import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Trophy, Award, CheckCircle2, XCircle, ArrowLeft, Download, Share2, Sparkles,
  TrendingUp, Clock, FileText, Check, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

import { selectLastAttemptResult, selectSelectedTest } from '../redux/testSelectors.js';
import { BackButton } from '@components/common/BackButton.jsx';

export const TestResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const lastResult = useSelector(selectLastAttemptResult) || {
    score: 94,
    totalMarks: 100,
    passingMarks: 60,
    passed: true,
    accuracy: 94,
    percentile: 96.8,
    rank: 8,
    completionTime: '18 Mins 42 Secs'
  };

  const selectedTest = useSelector(selectSelectedTest);

  const handleDownloadCertificate = () => {
    toast.success('Generating CodeSphere Skill Certification PDF...');
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200 animate-fade-in">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <BackButton fallbackPath="/tests" className="self-start" />

      {/* Top Banner Result Card */}
      <div className="relative w-full bg-gradient-to-r from-emerald-950 via-[#0b2b1d] to-emerald-950 border border-[#04AA6D]/40 rounded-3xl p-6 md:p-8 overflow-hidden shadow-xl text-white">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#04AA6D]/20 text-emerald-300 border border-[#04AA6D]/40 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                EXAMINATION EVALUATION PASSED
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {selectedTest?.title || 'CodeSphere Assessment Evaluation'}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
              Congratulations! Your submission exceeded the cutoff benchmark score.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleDownloadCertificate}
            className="px-6 py-3.5 rounded-2xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/40 border border-emerald-400/30 transition-all cursor-pointer flex items-center gap-2 shrink-0"
          >
            <Award className="w-4 h-4" />
            Claim Skill Certificate
          </button>
        </div>

        {/* Score KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800 font-mono">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total Score</span>
            <span className="text-2xl font-black text-emerald-400">{lastResult.score} / {lastResult.totalMarks}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</span>
            <span className="text-2xl font-black text-blue-400">{lastResult.accuracy}%</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Percentile Rank</span>
            <span className="text-2xl font-black text-amber-400">{lastResult.percentile}%</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Time Taken</span>
            <span className="text-2xl font-black text-purple-400">{lastResult.completionTime}</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col gap-4 font-sans">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">Sectional Performance</h3>

          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold">Algorithmic Problem Solving</span>
              <span className="font-mono text-emerald-500 font-bold">20 / 20 Marks (100%)</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold">System Design & Architecture</span>
              <span className="font-mono text-emerald-500 font-bold">28 / 30 Marks (93%)</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold">React & Frontend Core</span>
              <span className="font-mono text-emerald-500 font-bold">15 / 15 Marks (100%)</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col gap-4 font-sans">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">Verified Certificate</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Your skill certification credential will be cryptographically signed by CodeSphere and appended to your public developer portfolio.
          </p>

          <button
            onClick={handleDownloadCertificate}
            className="w-full py-3 rounded-2xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-auto"
          >
            <Download className="w-4 h-4" />
            Download PDF Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
export default TestResults;
