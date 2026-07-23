import React, { useState } from 'react';
import { Star } from 'lucide-react';
import clsx from 'clsx';

export const Rating = ({
  rating = 0,
  max = 5,
  onChange,
  readonly = false,
  size = 16,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(null);

  const handleClick = (idx) => {
    if (readonly) return;
    onChange && onChange(idx + 1);
  };

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      {[...Array(max)].map((_, idx) => {
        const starVal = idx + 1;
        const isFilled = hoverRating !== null
          ? starVal <= hoverRating
          : starVal <= rating;

        return (
          <button
            key={idx}
            type="button"
            disabled={readonly}
            onClick={() => handleClick(idx)}
            onMouseEnter={() => !readonly && setHoverRating(starVal)}
            onMouseLeave={() => !readonly && setHoverRating(null)}
            className={clsx(
              'focus:outline-none transition-transform shrink-0',
              !readonly && 'hover:scale-110 cursor-pointer',
              isFilled ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'
            )}
            style={{ width: size, height: size }}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        );
      })}
    </div>
  );
};
