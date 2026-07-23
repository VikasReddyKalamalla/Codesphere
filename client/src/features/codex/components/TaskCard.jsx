import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const TaskCard = ({ title }) => {
  return (
    <Card>
      <CardBody className="p-3.5 text-xs font-semibold text-slate-800 dark:text-white">{title}</CardBody>
    </Card>
  );
};
