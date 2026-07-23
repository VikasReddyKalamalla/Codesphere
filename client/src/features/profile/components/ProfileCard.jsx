import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const ProfileCard = ({ user = {} }) => {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3.5 p-5 text-xs">
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 font-semibold">About Me</span>
          <p className="text-slate-700 dark:text-slate-350 leading-relaxed">{user.bio || 'No biography written yet.'}</p>
        </div>
      </CardBody>
    </Card>
  );
};
