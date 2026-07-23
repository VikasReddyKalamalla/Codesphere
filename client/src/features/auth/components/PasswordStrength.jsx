import React from 'react';
import clsx from 'clsx';
import { validatePasswordStrength } from '../validations/passwordValidation.js';

export const PasswordStrength = ({ password }) => {
  const score = validatePasswordStrength(password);
  const levels = ['Very Weak', 'Weak', 'Good', 'Strong'];

  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex justify-between text-[10px] font-semibold text-slate-500">
        <span>Password Integrity</span>
        <span>{levels[score - 1] || 'None'}</span>
      </div>
      <div className="flex gap-1 h-1.5 w-full">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className={clsx(
              'flex-1 rounded-full transition-colors duration-250',
              idx < score
                ? score <= 1
                  ? 'bg-rose-500'
                  : score <= 2
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                : 'bg-slate-200 dark:bg-slate-800'
            )}
          />
        ))}
      </div>
    </div>
  );
};
