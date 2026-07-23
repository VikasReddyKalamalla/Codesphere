import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const CourseCard = ({ course = {} }) => {
  return (
    <Card>
      <CardBody className="p-4 flex flex-col gap-1 text-xs">
        <span className="font-bold text-slate-850 dark:text-white">{course.title}</span>
        <span className="text-[10px] text-slate-400 font-medium">Published Course</span>
      </CardBody>
    </Card>
  );
};
