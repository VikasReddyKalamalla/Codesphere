import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Mail, Smartphone, Globe } from 'lucide-react';
import { selectNotificationSettings, saveSettingsSectionThunk } from '../redux';

export const NotificationsSection = () => {
  const dispatch = useDispatch();
  const notifs = useSelector(selectNotificationSettings);

  const handleToggle = (key, val) => {
    dispatch(saveSettingsSectionThunk('notifications', { [key]: !val }));
  };

  const channels = [
    { key: 'emailNotifs', label: 'Email Notifications', val: notifs.emailNotifs, icon: Mail },
    { key: 'pushNotifs', label: 'Push Notifications', val: notifs.pushNotifs, icon: Bell },
    { key: 'smsNotifs', label: 'SMS Alerts', val: notifs.smsNotifs, icon: Smartphone },
    { key: 'browserNotifs', label: 'Browser Notifications', val: notifs.browserNotifs, icon: Globe },
    { key: 'communityNotifs', label: 'Community & Forum Discussions', val: notifs.communityNotifs, icon: Bell },
    { key: 'learningNotifs', label: 'Learning & Milestone Alerts', val: notifs.learningNotifs, icon: Bell },
    { key: 'assessmentNotifs', label: 'Assessment & Test Results', val: notifs.assessmentNotifs, icon: Bell },
    { key: 'liveSessionNotifs', label: 'Live Workshop & Session Reminders', val: notifs.liveSessionNotifs, icon: Bell },
    { key: 'aiNotifs', label: 'AI Assistance & Code Review Updates', val: notifs.aiNotifs, icon: Bell },
    { key: 'weeklyDigest', label: 'Weekly Summary Digest', val: notifs.weeklyDigest, icon: Mail },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Notification Preferences
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Configure email, push, SMS, live session reminders, and AI updates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map((ch) => {
          const Icon = ch.icon;
          return (
            <div key={ch.key} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{ch.label}</span>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(ch.key, ch.val)}
                className={`w-11 h-6 rounded-full transition-all relative cursor-pointer ${
                  ch.val ? 'bg-[#04AA6D]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${ch.val ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
