import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const PlanComparison = () => {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-slate-205 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-850 dark:text-white">Plan Comparisons</span>
      </div>
      <CardBody className="p-4">
        <p className="text-xs text-slate-400 py-3 text-center">Detailed layout matrices of compiler speeds.</p>
      </CardBody>
    </Card>
  );
};
