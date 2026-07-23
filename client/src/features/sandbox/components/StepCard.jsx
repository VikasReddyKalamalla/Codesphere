import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const StepCard = ({ step = {} }) => {
  return (
    <Card>
      <CardBody className="p-3.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">{step.title}</CardBody>
    </Card>
  );
};
