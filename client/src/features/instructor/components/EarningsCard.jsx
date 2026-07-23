import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const EarningsCard = () => {
  return (
    <Card>
      <CardBody className="p-5 flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-500">Total Revenue Generated</span>
        <span className="font-bold text-indigo-650 text-base">$1,200</span>
      </CardBody>
    </Card>
  );
};
