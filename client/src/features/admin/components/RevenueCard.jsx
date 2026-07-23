import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const RevenueCard = () => {
  return (
    <Card>
      <CardBody className="p-5 flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-500">Gross monthly revenue</span>
        <span className="font-extrabold text-indigo-650 text-base">$14,200</span>
      </CardBody>
    </Card>
  );
};
