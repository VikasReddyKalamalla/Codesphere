import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { LearningChart } from '@components/charts/LearningChart.jsx';

export const LearningProgress = () => {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-slate-500 uppercase">Learning Progress Analytics</span>
        <LearningChart />
      </CardBody>
    </Card>
  );
};
