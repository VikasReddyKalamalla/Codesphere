import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardHeader } from '@components/common/CardHeader.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Activity } from 'lucide-react';

export const RecentActivity = ({ logs = [] }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-850 dark:text-white">
          <Activity className="w-4.5 h-4.5 text-indigo-505" />
          <span>Recent activity logs</span>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No recent actions recorded.</p>
        ) : (
          logs.slice(0, 4).map((log, idx) => (
            <div key={idx} className="flex gap-3 text-xs leading-relaxed border-b border-slate-50 dark:border-slate-850 pb-3 last:border-b-0 last:pb-0">
              <span className="text-slate-400 select-none">{log.time}</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">{log.message}</span>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
};
