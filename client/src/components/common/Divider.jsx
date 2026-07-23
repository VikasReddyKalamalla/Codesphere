import React from 'react';
import clsx from 'clsx';

export const Divider = ({
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  return (
    <div
      className={clsx(
        'bg-slate-200 dark:bg-slate-800 shrink-0',
        orientation === 'horizontal' ? 'h-px w-full my-4' : 'w-px h-full mx-4 self-stretch',
        className
      )}
      {...props}
    />
  );
};
