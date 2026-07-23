import React from 'react';
import { NotificationCard } from '../cards/NotificationCard.jsx';

export const NotificationList = ({ items = [], onMarkRead }) => {
  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 ? (
        <p className="text-center text-xs py-8 text-slate-400 dark:text-slate-500">No alerts log at this moment</p>
      ) : (
        items.map((item) => (
          <NotificationCard key={item.id} notification={item} onMarkRead={() => onMarkRead && onMarkRead(item.id)} />
        ))
      )}
    </div>
  );
};
