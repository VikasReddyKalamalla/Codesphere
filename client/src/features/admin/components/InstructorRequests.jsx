import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const InstructorRequests = () => {
  const handleApprove = () => {
    toast.success('Instructor applicant request approved!');
  };
  return (
    <Card>
      <CardBody className="p-4 flex items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-slate-800 dark:text-white">Applicant: Dan Abramov</span>
          <p className="text-[10px] text-slate-400 mt-0.5">Area: Vite plugin compiling systems</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleApprove}>Approve</Button>
      </CardBody>
    </Card>
  );
};
