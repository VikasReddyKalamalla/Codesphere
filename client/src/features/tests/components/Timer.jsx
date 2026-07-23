import React from 'react';
import { Clock } from 'lucide-react';
import { useTimer } from '../hooks/useTimer.js';

export const Timer = ({ limit = 1800 }) => {
  const { timeLeft } = useTimer(limit);

  const format = () => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200/20 px-3 py-1.5 rounded-lg select-none">
      <Clock className="w-4 h-4" />
      <span>Time Remaining: {format()}</span>
    </div>
  );
};
