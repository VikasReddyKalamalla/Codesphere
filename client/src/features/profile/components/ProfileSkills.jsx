import React from 'react';
import { Tag } from '@components/common/Tag.jsx';

export const ProfileSkills = ({ skills = ['JavaScript', 'React', 'Vite', 'Redux'] }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-bold text-slate-500 uppercase select-none">Skills Inventory</span>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <Tag key={idx}>{skill}</Tag>
        ))}
      </div>
    </div>
  );
};
