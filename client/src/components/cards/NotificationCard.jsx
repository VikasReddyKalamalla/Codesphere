import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import { Bell, Check } from 'lucide-react';
import { IconButton } from '../common/IconButton.jsx';
import clsx from 'clsx';

export const NotificationCard = ({ notification = {}, onMarkRead }) => {
  return (
    <Card className={clsx('transition-opacity', notification.read ? 'opacity-60' : '')}>
      <CardBody className="flex items-start justify-between gap-4 p-4">
        <div className="flex gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-full shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-200">{notification.message}</p>
            <span className="text-xs text-slate-400 block mt-1">{notification.time}</span>
          </div>
        </div>
        {!notification.read && onMarkRead && (
          <IconButton icon={Check} variant="ghost" size="sm" onClick={onMarkRead} aria-label="Mark notification as read" />
        )}
      </CardBody>
    </Card>
  );
};
