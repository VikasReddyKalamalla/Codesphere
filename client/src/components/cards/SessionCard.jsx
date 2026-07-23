import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import { Video, Calendar } from 'lucide-react';
import { Badge } from '../common/Badge.jsx';

export const SessionCard = ({ session = {} }) => {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Badge variant={session.status === 'live' ? 'danger' : session.status === 'upcoming' ? 'warning' : 'secondary'}>
            {session.status}
          </Badge>
          <Video className="w-4.5 h-4.5 text-slate-405" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-1">{session.title}</h4>
          <p className="text-xs text-slate-400 mt-0.5">Hosted by {session.host}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1.5 border-t border-slate-100 dark:border-slate-850 pt-3">
          <Calendar className="w-4 h-4" />
          <span>{session.date}</span>
        </div>
      </CardBody>
    </Card>
  );
};
