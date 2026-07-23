import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Bell, Trash2 } from 'lucide-react';
import { IconButton } from '@components/common/IconButton.jsx';

export const NotificationCard = ({ item = {}, onDelete }) => {
  return (
    <Card className="hover:scale-[1.005] transition-all select-none">
      <CardBody className="flex items-center justify-between gap-4 p-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-505 rounded-xl">
            <Bell className="w-4.5 h-4.5 animate-bounce" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800 dark:text-slate-205">{item.title || 'Broadcast message'}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">{item.time}</span>
          </div>
        </div>
        <IconButton icon={Trash2} variant="ghost" onClick={onDelete} aria-label="Delete notification" className="text-slate-400 hover:text-rose-500" />
      </CardBody>
    </Card>
  );
};
