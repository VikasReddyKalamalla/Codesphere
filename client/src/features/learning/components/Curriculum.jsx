import React from 'react';
import { ModuleCard } from './ModuleCard.jsx';
import { LessonCard } from './LessonCard.jsx';

export const Curriculum = ({ modules = [], courseId }) => {
  return (
    <div className="flex flex-col gap-4">
      {modules.map((mod, idx) => (
        <ModuleCard key={idx} module={mod}>
          {(mod.lessons || []).map((les, idy) => (
            <LessonCard key={idy} lesson={les} courseId={courseId} />
          ))}
        </ModuleCard>
      ))}
    </div>
  );
};
