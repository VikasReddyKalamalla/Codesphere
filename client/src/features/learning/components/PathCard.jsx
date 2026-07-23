import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Compass } from 'lucide-react';

export const PathCard = ({ path = {} }) => {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-505 rounded-xl">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-white">{path.title}</h4>
          <span className="text-[10px] text-slate-400 mt-1 block font-medium">{path.coursesCount} Courses &bull; {path.duration} hours</span>
        </div>
      </CardBody>
    </Card>
  );
};
