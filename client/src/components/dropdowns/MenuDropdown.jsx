import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Dropdown } from './Dropdown.jsx';
import { IconButton } from '../common/IconButton.jsx';

export const MenuDropdown = ({ items = [] }) => {
  return (
    <Dropdown
      trigger={<IconButton icon={MoreVertical} variant="ghost" size="sm" aria-label="Open settings menu" />}
    >
      {({ close }) => (
        <div className="py-1">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { item.onClick && item.onClick(); close(); }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 text-left font-medium"
            >
              {item.icon && <item.icon className="w-4 h-4 text-slate-400" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
};
