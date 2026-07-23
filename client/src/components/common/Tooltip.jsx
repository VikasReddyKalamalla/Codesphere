import React, { useState } from 'react';
import clsx from 'clsx';

export const Tooltip = ({
  children,
  content,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={clsx(
            'absolute z-50 whitespace-nowrap bg-slate-950 text-white text-xs px-2 py-1 rounded shadow-lg transition-opacity duration-200 pointer-events-none',
            positions[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
