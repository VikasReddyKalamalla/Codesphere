import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const EventStatistics = ({ attendeesCount = 120, spots = 200 }) => {
  return (
    <Card>
      <CardBody className="flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-500">Spots Available</span>
        <span className="font-bold text-slate-850 dark:text-white">{attendeesCount}/{spots} slots</span>
      </CardBody>
    </Card>
  );
};
