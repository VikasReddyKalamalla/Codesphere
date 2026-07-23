import React from 'react';
import clsx from 'clsx';
import { SidebarGroup } from './SidebarGroup.jsx';
import { SidebarItem } from './SidebarItem.jsx';
import { SidebarFooter } from './SidebarFooter.jsx';

export const Sidebar = ({
  user,
  onLogout,
  groups = [],
  collapsed = false,
  className = ''
}) => {
  return (
    <aside
      className={clsx(
        'hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 shrink-0 sticky top-16 h-[calc(100vh-64px)]',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
        {groups.map((grp, idx) => (
          <SidebarGroup key={idx} label={grp.label} collapsed={collapsed}>
            {grp.items.map((item, idy) => (
              <SidebarItem
                key={idy}
                icon={item.icon}
                label={item.label}
                path={item.path}
                badge={item.badge}
                collapsed={collapsed}
              />
            ))}
          </SidebarGroup>
        ))}
      </div>
      <SidebarFooter user={user} onLogout={onLogout} collapsed={collapsed} />
    </aside>
  );
};
