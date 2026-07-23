import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const RankCard = ({ rank = 5 }) => {
  return (
    <Card className="bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100/30">
      <CardBody className="flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-500">My global ranking</span>
        <span className="font-bold text-indigo-650">Position #{rank}</span>
      </CardBody>
    </Card>
  );
};
