import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { SidebarGroup } from './SidebarGroup.jsx';
import { SidebarItem } from './SidebarItem.jsx';
import { SidebarFooter } from './SidebarFooter.jsx';
import { IconButton } from '../common/IconButton.jsx';

export const MobileSidebar = ({
  isOpen = false,
  onClose,
  user,
  onLogout,
  groups = []
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 md:hidden flex">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 w-72 h-full flex flex-col shadow-xl animate-slide-right">
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <span className="font-bold text-slate-850 dark:text-slate-100 text-sm">Navigation</span>
          <IconButton icon={X} variant="ghost" onClick={onClose} aria-label="Close menu" />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
          {groups.map((grp, idx) => (
            <SidebarGroup key={idx} label={grp.label}>
              {grp.items.map((item, idy) => (
                <SidebarItem
                  key={idy}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  badge={item.badge}
                  onClick={onClose}
                />
              ))}
            </SidebarGroup>
          ))}
        </div>
        <SidebarFooter user={user} onLogout={onLogout} />
      </div>
    </div>
  );
};
