import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';

export const DashboardCard = ({ title, value, icon: Icon, description }) => {
  return (
    <Card>
      <CardBody className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</span>
          <span className="text-2xl font-bold text-slate-905 dark:text-white">{value}</span>
          {description && <span className="text-[10px] text-slate-450 mt-1">{description}</span>}
        </div>
        {Icon && (
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </CardBody>
    </Card>
  );
};
