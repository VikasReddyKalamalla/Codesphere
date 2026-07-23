import React, { useState } from 'react';
import { Toggle } from '@components/common/Toggle.jsx';

export const NotificationSettings = () => {
  const [emailAlert, setEmailAlert] = useState(true);
  const [pushAlert, setPushAlert] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl select-none shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-705 dark:text-slate-205">Email Alerts Channels</span>
        <Toggle checked={emailAlert} onChange={setEmailAlert} />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-705 dark:text-slate-205">Browser Push alerts</span>
        <Toggle checked={pushAlert} onChange={setPushAlert} />
      </div>
    </div>
  );
};
