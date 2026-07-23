import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Button } from '@components/common/Button.jsx';

export const UpgradePlan = () => {
  return (
    <Card>
      <CardBody className="p-5 flex justify-between items-center gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-850 dark:text-white">Upgrade plan capabilities</h4>
          <p className="text-[10px] text-slate-400 mt-1">Unlock live assessments with certificate verification.</p>
        </div>
        <Button variant="primary" size="sm">Upgrade</Button>
      </CardBody>
    </Card>
  );
};
