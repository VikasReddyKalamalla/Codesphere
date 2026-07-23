import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const ModuleCard = ({ module = {}, children }) => {
  return (
    <Card>
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <span className="text-xs font-bold text-slate-800 dark:text-white">{module.title}</span>
        <span className="text-[10px] text-slate-400">{module.lessonsCount} lessons</span>
      </div>
      <CardBody className="flex flex-col gap-2.5">
        {children}
      </CardBody>
    </Card>
  );
};
