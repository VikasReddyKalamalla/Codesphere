import React from 'react';
import clsx from 'clsx';

export const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  status = null,
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    away: 'bg-amber-500',
    busy: 'bg-rose-500',
  };

  const initials = alt
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={clsx('relative inline-flex shrink-0 select-none', className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={clsx('rounded-full object-cover border border-slate-100 dark:border-slate-850', sizes[size])}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full bg-slate-150 text-slate-750 dark:bg-slate-800 dark:text-slate-200 font-semibold flex items-center justify-center border border-slate-200 dark:border-slate-700',
            sizes[size]
          )}
        >
          {initials}
        </div>
      )}
      {status && statusColors[status] && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900',
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};
