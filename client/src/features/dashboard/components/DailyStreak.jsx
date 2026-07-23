import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Flame } from 'lucide-react';

export const DailyStreak = ({ days = 3 }) => {
  return (
    <Card className="bg-amber-500/10 border-amber-500/20">
      <CardBody className="flex items-center gap-3">
        <Flame className="w-8 h-8 text-amber-500 fill-current animate-bounce" />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-amber-600">{days}-Day Daily Streak!</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Keep compiling daily playpens to level up!</span>
        </div>
      </CardBody>
    </Card>
  );
};
