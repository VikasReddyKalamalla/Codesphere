import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Badge } from '@components/common/Badge.jsx';

export const CurrentPlan = ({ plan = { name: 'Free Trial', status: 'active' } }) => {
  return (
    <Card className="bg-indigo-50/20 border-indigo-100/30">
      <CardBody className="flex items-center justify-between p-5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-indigo-505 uppercase">Subscription Status</span>
          <h4 className="text-sm font-bold text-slate-850 dark:text-white mt-0.5">{plan.name} Plan</h4>
        </div>
        <Badge variant="success">{plan.status}</Badge>
      </CardBody>
    </Card>
  );
};
