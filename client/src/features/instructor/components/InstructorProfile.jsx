import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const InstructorProfile = () => {
  return (
    <Card>
      <CardBody className="p-4 text-xs">
        <span className="font-bold text-slate-800 dark:text-white">Instructor Qualifications</span>
        <p className="text-slate-400 mt-1">Certified mentor in compiler engineering.</p>
      </CardBody>
    </Card>
  );
};
