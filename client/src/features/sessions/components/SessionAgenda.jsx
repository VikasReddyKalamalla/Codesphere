import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const SessionAgenda = ({ topics = ['Intro', 'Coding', 'Q&A'] }) => {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-slate-205 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-850 dark:text-white">Agenda Outlines</span>
      </div>
      <CardBody className="flex flex-col gap-2.5">
        {topics.map((t, idx) => (
          <div key={idx} className="flex gap-3 text-xs leading-relaxed">
            <span className="text-slate-400 font-bold">{idx + 1}.</span>
            <span className="text-slate-700 dark:text-slate-350">{t}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};
