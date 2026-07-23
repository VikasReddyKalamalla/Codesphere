import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import clsx from 'clsx';

export const AnalyticsCard = ({ title, value, change, isPositive = true, chartData = [] }) => {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</span>
          <span className={clsx('text-xs font-bold px-1.5 py-0.5 rounded-full', isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-455')}>
            {isPositive ? '+' : ''}{change}%
          </span>
        </div>
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
        
        {chartData.length > 0 && (
          <div className="h-10 w-full mt-1.5">
            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
              <path
                d={`M ${chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100} ${30 - d}`).join(' L ')}`}
                fill="none"
                stroke={isPositive ? '#10b981' : '#f43f5e'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
