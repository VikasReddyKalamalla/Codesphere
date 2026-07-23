import React, { useState } from 'react';
import { Switch } from '@components/common/Switch.jsx';
import toast from 'react-hot-toast';

export const ThemeSettings = () => {
  const [dark, setDark] = useState(false);

  const toggle = (val) => {
    setDark(val);
    document.documentElement.classList.toggle('dark', val);
    toast.success(val ? 'Dark mode enabled' : 'Light mode enabled');
  };

  return (
    <div className="flex justify-between items-center py-2.5 select-none border-b border-slate-100 dark:border-slate-850 pb-3 last:border-b-0 last:pb-0">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-705 dark:text-slate-205">Toggle Dark Mode</span>
        <span className="text-[10px] text-slate-400 mt-0.5">Adapt screen colors to light environments</span>
      </div>
      <Switch checked={dark} onChange={toggle} />
    </div>
  );
};
