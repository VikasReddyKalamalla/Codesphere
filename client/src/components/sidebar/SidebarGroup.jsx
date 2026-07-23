import React from 'react';

export const SidebarGroup = ({ label, children, collapsed = false }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && !collapsed && (
        <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 mt-4">
          {label}
        </span>
      )}
      {children}
    </div>
  );
};
