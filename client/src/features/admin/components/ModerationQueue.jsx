import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { ShieldAlert } from 'lucide-react';

export const ModerationQueue = () => {
  return (
    <Card>
      <CardBody className="flex items-center gap-3 p-4 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-500" />
        <span className="text-slate-500">No flag reports in moderation queue log list.</span>
      </CardBody>
    </Card>
  );
};
