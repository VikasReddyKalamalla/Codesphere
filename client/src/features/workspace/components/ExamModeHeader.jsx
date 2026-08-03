import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, Lock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const ExamModeHeader = ({ onSubmitExam }) => {
  const [secondsLeft, setSecondsLeft] = useState(3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-amber-950 via-red-950 to-amber-950 border-b border-amber-800/80 px-4 py-2 flex items-center justify-between z-30 shrink-0 text-amber-200 text-xs">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400">
          <ShieldAlert className="w-4 h-4" />
          Exam Mode Active
        </span>
        <span className="text-amber-400">|</span>
        <span className="flex items-center gap-1 text-slate-300">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          AI Tutor Disabled • File Lock Active
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-amber-300 bg-black/40 px-3 py-1 rounded-lg border border-amber-800/50">
          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{formatTime(secondsLeft)}</span>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to submit your exam now?')) {
              onSubmitExam();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-md shadow-amber-600/30 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          Submit Exam
        </button>
      </div>
    </div>
  );
};
