import React, { useState } from 'react';
import { NotificationList } from '../components/NotificationList.jsx';
import { MarkAsRead } from '../components/MarkAsRead.jsx';

export const Notifications = () => {
  const [list, setList] = useState([
    { id: '1', title: 'Welcome to CodeSphere! Sandbox open.', time: '1h ago' }
  ]);

  const handleDelete = (id) => {
    setList(list.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in max-w-xl mx-auto">
      <div className="flex justify-between items-center gap-4 select-none">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Alert Log messages</h2>
          <p className="text-xs text-slate-500">Realtime compiler activity updates</p>
        </div>
        <MarkAsRead onClick={() => setList([])} />
      </div>

      <NotificationList items={list} onDelete={handleDelete} />
    </div>
  );
};
