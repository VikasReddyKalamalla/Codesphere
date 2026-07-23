import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const Leaderboard = ({ list = [] }) => {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-slate-205 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-850 dark:text-white">Global Leaderboard ranking</span>
      </div>
      <CardBody className="flex flex-col gap-3">
        {list.map((usr, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-400">#{idx + 1}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-350">{usr.name}</span>
            </div>
            <span className="font-bold text-indigo-600">{usr.score} XP</span>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};
