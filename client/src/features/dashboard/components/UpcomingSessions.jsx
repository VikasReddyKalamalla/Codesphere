import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardHeader } from '@components/common/CardHeader.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Video, Calendar } from 'lucide-react';
import { Badge } from '@components/common/Badge.jsx';

export const UpcomingSessions = ({ sessions = [] }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
          <Video className="w-4.5 h-4.5 text-indigo-500" />
          <span>Live Classrooms</span>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        {sessions.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No scheduled webcasts for this week.</p>
        ) : (
          sessions.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 border-b border-slate-50 dark:border-slate-850 pb-3 last:border-b-0 last:pb-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-205">{item.title}</span>
                <span className="text-[10px] text-slate-400">{item.host} &bull; {item.date}</span>
              </div>
              <Badge variant={item.status === 'live' ? 'danger' : 'warning'}>
                {item.status}
              </Badge>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
};
