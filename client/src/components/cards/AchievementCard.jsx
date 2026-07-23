import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import { Award } from 'lucide-react';

export const AchievementCard = ({ achievement = {} }) => {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl border border-amber-100 dark:border-amber-900/50">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-805 dark:text-white">{achievement.title}</h4>
          <p className="text-xs text-slate-450 dark:text-slate-400 mt-0.5">{achievement.description}</p>
          <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 block mt-1.5">+${achievement.xp} XP</span>
        </div>
      </CardBody>
    </Card>
  );
};
