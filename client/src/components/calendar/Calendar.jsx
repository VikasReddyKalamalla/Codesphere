import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../common/IconButton.jsx';
import clsx from 'clsx';

export const Calendar = () => {
  const [date, setDate] = useState(new Date());

  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrev = () => setDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNext = () => setDate(new Date(currentYear, currentMonth + 1, 1));

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 shadow-sm max-w-sm select-none mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-sm text-slate-850 dark:text-white">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <div className="flex gap-1">
          <IconButton icon={ChevronLeft} variant="ghost" size="sm" onClick={handlePrev} />
          <IconButton icon={ChevronRight} variant="ghost" size="sm" onClick={handleNext} />
        </div>
      </div>
      
      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-2">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>

      <div className="grid grid-cols-7 text-center text-xs gap-1.5">
        {Array.from({ length: firstDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} />
        ))}
        {Array.from({ length: totalDays }).map((_, idx) => {
          const day = idx + 1;
          const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();
          return (
            <div
              key={day}
              className={clsx(
                'aspect-square flex items-center justify-center rounded-lg font-medium cursor-pointer transition-colors',
                isToday
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350'
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};
