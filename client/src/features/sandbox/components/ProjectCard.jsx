import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const ProjectCard = ({ project = {} }) => {
  return (
    <Card>
      <CardBody className="p-4 flex flex-col gap-1 text-xs">
        <span className="font-semibold text-slate-800 dark:text-white">{project.name}</span>
        <span className="text-[10px] text-slate-400">Sandbox Playground Project</span>
      </CardBody>
    </Card>
  );
};
