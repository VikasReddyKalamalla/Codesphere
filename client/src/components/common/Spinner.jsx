import React from 'react';
import clsx from 'clsx';

export const Spinner = ({
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4 stroke-[3px]',
    md: 'w-8 h-8 stroke-[2.5px]',
    lg: 'w-12 h-12 stroke-[2px]',
  };

  return (
    <svg
      className={clsx('animate-spin text-indigo-600 dark:text-indigo-400', sizes[size], className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
};
