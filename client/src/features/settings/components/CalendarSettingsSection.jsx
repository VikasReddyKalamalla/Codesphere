import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Check, RefreshCw } from 'lucide-react';
import { selectCalendarSettings, saveSettingsSectionThunk } from '../redux';

export const CalendarSettingsSection = () => {
  const dispatch = useDispatch();
  const cal = useSelector(selectCalendarSettings);

  const handleToggle = (key, val) => {
    dispatch(saveSettingsSectionThunk('calendar', { [key]: !val }));
  };

  const providers = [
    { key: 'googleSync', name: 'Google Calendar Sync', desc: 'Sync live workshops & mentor sessions to Google Calendar', val: cal.googleSync },
    { key: 'outlookSync', name: 'Microsoft Outlook Sync', desc: 'Sync hackathons & live streams to Outlook', val: cal.outlookSync },
    { key: 'appleSync', name: 'Apple iCal Sync', desc: 'Generate webcal iCal feed URL for Apple Calendar', val: cal.appleSync },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> External Calendar Sync
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Connect Google Calendar, Outlook, and Apple Calendar to sync live sessions and event reminders</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {providers.map((p) => (
          <div key={p.key} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</p>
            </div>
            <button
              onClick={() => handleToggle(p.key, p.val)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                p.val
                  ? 'bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {p.val ? 'Connected' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
