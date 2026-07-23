import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Avatar } from '@components/common/Avatar.jsx';

export const SessionParticipants = ({ list = [] }) => {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-slate-205 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-850 dark:text-white">Attendees ({list.length})</span>
      </div>
      <CardBody className="flex flex-col gap-3 max-h-60 overflow-y-auto">
        {list.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <Avatar src={item.avatar} alt={item.name} size="sm" />
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};
