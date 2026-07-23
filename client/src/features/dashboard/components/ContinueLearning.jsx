import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardHeader } from '@components/common/CardHeader.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { BookOpen } from 'lucide-react';
import { ProgressBar } from '@components/common/ProgressBar.jsx';

export const ContinueLearning = ({ courses = [] }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <span>Continue Learning</span>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        {courses.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No active courses. Launch one in learning catalog.</p>
        ) : (
          courses.slice(0, 2).map((c, idx) => (
            <div key={idx} className="flex flex-col gap-1.5 border-b border-slate-50 dark:border-slate-850 pb-3 last:border-b-0 last:pb-0">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{c.title}</span>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                <span>By {c.instructor}</span>
                <span>{c.progress}% completed</span>
              </div>
              <ProgressBar value={c.progress} color="bg-indigo-650" />
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
};
