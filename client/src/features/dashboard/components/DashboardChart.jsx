import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { AreaChart } from '@components/charts/AreaChart.jsx';

export const DashboardChart = () => {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-slate-500 uppercase">Weekly Coding hours trends</span>
        <AreaChart data={[10, 30, 20, 50, 75, 40, 95]} />
      </CardBody>
    </Card>
  );
};
