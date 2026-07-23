import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export const StepProgress = ({ steps = [], currentStep = 0 }) => {
  return (
    <div className="flex items-center justify-between w-full select-none">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;

        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center gap-1.5 relative z-10 shrink-0">
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2',
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isCurrent
                      ? 'bg-white border-indigo-650 text-indigo-650 dark:bg-slate-900'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={clsx('text-[10px] font-semibold tracking-wide', isCurrent ? 'text-indigo-600' : 'text-slate-400')}>{step}</span>
            </div>
            
            {idx < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-slate-100 dark:bg-slate-800 relative mx-2">
                <div
                  className="absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-350"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
