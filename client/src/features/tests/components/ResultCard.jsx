import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Award } from 'lucide-react';

export const ResultCard = ({ score = 80, passed = true }) => {
  return (
    <Card className="text-center max-w-sm mx-auto">
      <CardBody className="flex flex-col items-center gap-4 py-8">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-550 rounded-full">
          <Award className="w-10 h-10 animate-bounce" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-805 dark:text-white">Assessment Complete!</h3>
          <p className="text-xs text-slate-400 mt-1">Score percentage achieved</p>
        </div>
        <span className="text-3xl font-extrabold text-indigo-600">{score}%</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${passed ? 'bg-emerald-50 text-emerald-650' : 'bg-rose-50 text-rose-650'}`}>
          {passed ? 'Passed' : 'Failed'}
        </span>
      </CardBody>
    </Card>
  );
};
