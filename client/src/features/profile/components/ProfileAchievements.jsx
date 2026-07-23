import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Trophy } from 'lucide-react';

export const ProfileAchievements = ({ items = [] }) => {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-850 dark:text-white">Achievements</span>
      </div>
      <CardBody className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">Compile sandbox playpens to unlock trophies.</p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-white">{item.title}</span>
                <span className="text-[10px] text-slate-400">{item.description}</span>
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
};
