import React from 'react';
import clsx from 'clsx';

export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 60,
  strokeWidth = 6,
  showLabel = false,
  className = ''
}) => {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className={clsx('relative inline-flex items-center justify-center select-none', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-slate-100 dark:text-slate-800"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-indigo-600 dark:text-indigo-400 transition-all duration-300 ease-out"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-xs font-semibold text-slate-700 dark:text-slate-200">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
};
