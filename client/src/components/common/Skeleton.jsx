import React from 'react';
import clsx from 'clsx';

export const Skeleton = ({
  className = '',
  variant = 'rect',
  ...props
}) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-slate-200 dark:bg-slate-800',
        variant === 'circle' ? 'rounded-full' : 'rounded-lg',
        className
      )}
      {...props}
    />
  );
};
