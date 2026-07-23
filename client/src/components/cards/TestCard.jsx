import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';
import { HelpCircle, Clock } from 'lucide-react';

export const TestCard = ({ test = {}, onStart }) => {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Badge variant={test.difficulty === 'Advanced' ? 'danger' : test.difficulty === 'Intermediate' ? 'warning' : 'success'}>
            {test.difficulty}
          </Badge>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{test.category}</span>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-1">{test.title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{test.description}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1 border-t border-slate-100 dark:border-slate-855 pt-3">
          <div className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{test.questionsCount} Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{test.duration} mins</span>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={onStart} className="w-full mt-2">Start Assessment</Button>
      </CardBody>
    </Card>
  );
};
