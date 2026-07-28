import React, { useState } from 'react';
import { NotificationList } from '../components/NotificationList.jsx';
import { MarkAsRead } from '../components/MarkAsRead.jsx';
import { UserAnnouncementsFeed } from '../components/UserAnnouncementsFeed.jsx';
import { Bell, Megaphone } from 'lucide-react';

export const Notifications = () => {
  const [activeTab, setActiveTab] = useState('announcements'); // Default to Announcements so user immediately sees official posts
  const [list, setList] = useState([
    { id: '1', title: 'Welcome to CodeSphere! Sandbox environment active.', time: '1h ago' }
  ]);

  const handleDelete = (id) => {
    setList(list.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in max-w-4xl mx-auto pb-12 font-sans text-slate-900 dark:text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
            <Bell className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Notifications & Announcements Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Stay updated with system alerts, compiler updates, and official CodeSphere announcements
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'announcements'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            Official Announcements
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'notifications'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            Personal Alerts ({list.length})
          </button>
        </div>
      </div>

      {/* Tab View Routing */}
      {activeTab === 'announcements' && (
        <UserAnnouncementsFeed />
      )}

      {activeTab === 'notifications' && (
        <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center gap-4 select-none border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Alert Log Messages</h2>
              <p className="text-xs text-slate-500">Realtime compiler activity updates</p>
            </div>
            <MarkAsRead onClick={() => setList([])} />
          </div>

          <NotificationList items={list} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
};
