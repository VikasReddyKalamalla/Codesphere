import React from 'react';

/**
 * LayoutWrapper — common wrapper applied inside all layout shells.
 * Handles: page transition animations, scroll-to-top on route change,
 * and any cross-cutting concerns that every page needs.
 */
const LayoutWrapper = ({ children, className = '' }) => {
  return (
    <div className={`animate-fade-in ${className}`}>
      {children}
    </div>
  );
};

export default LayoutWrapper;
