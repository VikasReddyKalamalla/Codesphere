import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { CheckSquare } from 'lucide-react';

export const WorkspaceTasks = ({ list = [] }) => {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <CheckSquare className="w-4 h-4 text-[#6366f1]" />
        <span className="text-xs font-bold text-slate-850 dark:text-white">Workspace Tasks</span>
      </div>
      <CardBody className="flex flex-col gap-2.5">
        {list.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-50 dark:border-slate-855 pb-2.5 last:border-b-0 last:pb-0">
            <span className="text-slate-700 dark:text-slate-300 font-medium">{item.title}</span>
            <span className="text-[10px] font-semibold text-[#6366f1] bg-indigo-50 dark:bg-indigo-950/20 px-1.5 py-0.5 rounded uppercase">{item.status}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};
