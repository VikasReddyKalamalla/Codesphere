import React from 'react';
import { NotificationCard } from './NotificationCard.jsx';

export const NotificationList = ({ items = [], onDelete }) => {
  return (
    <div className="flex flex-col gap-3.5">
      {items.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center">No alerts in push logs lobby.</p>
      ) : (
        items.map((item) => (
          <NotificationCard key={item.id} item={item} onDelete={() => onDelete && onDelete(item.id)} />
        ))
      )}
    </div>
  );
};
