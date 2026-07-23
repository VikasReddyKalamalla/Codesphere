import React from 'react';
import clsx from 'clsx';

export const Tabs = ({ children, activeTab, onChange, className = '' }) => {
  return (
    <div className={clsx('flex gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto w-full select-none', className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, {
          isActive: child.props.id === activeTab,
          onClick: () => onChange && onChange(child.props.id)
        });
      })}
    </div>
  );
};
