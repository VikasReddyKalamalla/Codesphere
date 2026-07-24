import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Trophy, Award, CheckCircle2, XCircle, ArrowLeft, Download, Share2, Sparkles,
  TrendingUp, Clock, FileText, Check, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@services/axios.js';
import { BackButton } from '@components/common/BackButton.jsx';

export const TestResults = () => {
  const { testId, attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let activeAttempt = null;
        if (attemptId && attemptId !== 'latest') {
          const res = await apiClient.get(`/attempts/${attemptId}`);
          activeAttempt = res.data?.data || res.data || res;
        } else {
          // Fallback to fetch latest attempt for this test
          const res = await apiClient.get('/tests/my/attempts');
          const attemptsList = res.data?.data?.attempts || res.data?.attempts || res.data || [];
          activeAttempt = attemptsList.find((att) => {
            const attTestId = att.testId?._id || att.testId;
            return attTestId === testId;
          });
        }
        setAttempt(activeAttempt);
      } catch (err) {
        console.error('Failed to fetch attempt details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [testId, attemptId]);

  const handleDownloadCertificate = () => {
    toast.success('Generating CodeSphere Skill Certification PDF...');
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 dark:text-slate-400 font-medium">Loading Results...</div>;
  }

  if (!attempt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-slate-500 dark:text-slate-400 font-medium">No attempt record found for this assessment.</div>
        <BackButton fallbackPath="/tests" />
      </div>
    );
  }

  const selectedTest = attempt.testId;
  const accuracy = Math.round((attempt.correctAnswers / (attempt.correctAnswers + attempt.wrongAnswers || 1)) * 100);
  const completionTime = `${Math.floor(attempt.timeTaken / 60)} Mins ${attempt.timeTaken % 60} Secs`;

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200 animate-fade-in">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#04AA6D]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <BackButton fallbackPath="/tests" className="self-start" />

      {/* Top Banner Result Card */}
      <div className="relative w-full bg-gradient-to-r from-emerald-950 via-[#0b2b1d] to-emerald-950 border border-[#04AA6D]/45 rounded-3xl p-6 md:p-8 overflow-hidden shadow-xl text-white">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex items-center gap-2">
              {attempt.passed ? (
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#04AA6D]/20 text-emerald-300 border border-[#04AA6D]/40 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  EXAMINATION EVALUATION PASSED
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-450" />
                  EXAMINATION BENCHMARK FAILED
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {selectedTest?.title || 'CodeSphere Assessment Evaluation'}
            </h1>

            <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-sans">
              {attempt.passed
                ? 'Congratulations! Your score exceeded the threshold benchmark cutoff score.'
                : 'You did not meet the minimum passing threshold score for this assessment.'}
            </p>
          </div>

          {/* Action Button */}
          {attempt.passed && (
            <button
              onClick={handleDownloadCertificate}
              className="px-6 py-3.5 rounded-2xl bg-[#04AA6D] hover:bg-[#03935e] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/40 border border-emerald-400/30 transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Award className="w-4 h-4" />
              Claim Skill Certificate
            </button>
          )}
        </div>

        {/* Score KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80 font-mono">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total Score</span>
            <span className="text-2xl font-black text-emerald-400">
              {attempt.totalScore} / {selectedTest?.totalMarks || attempt.totalScore}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</span>
            <span className="text-2xl font-black text-blue-400">{accuracy}%</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Percentage</span>
            <span className="text-2xl font-black text-amber-400">{attempt.percentage}%</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Time Taken</span>
            <span className="text-2xl font-black text-purple-400">{completionTime}</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col gap-4 font-sans">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">Question Breakdown</h3>

          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-emerald-600">Correct Answers</span>
              <span className="font-mono text-emerald-500 font-bold">{attempt.correctAnswers} Questions</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-rose-600">Wrong Answers</span>
              <span className="font-mono text-rose-500 font-bold">{attempt.wrongAnswers} Questions</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-550">Skipped Questions</span>
              <span className="font-mono text-slate-500 font-bold">{attempt.skippedQuestions} Questions</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col gap-4 font-sans">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">Verified Certificate</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {attempt.passed
              ? 'Your skill certification credential will be cryptographically signed by CodeSphere and appended to your public developer portfolio.'
              : 'Skill certificates are only available for passing assessment attempts. Revise your concepts and try again.'}
          </p>

          {attempt.passed && (
            <button
              onClick={handleDownloadCertificate}
              className="w-full py-3 rounded-2xl bg-[#04AA6D] hover:bg-[#03935e] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-auto"
            >
              <Download className="w-4 h-4" />
              Download PDF Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default TestResults;
