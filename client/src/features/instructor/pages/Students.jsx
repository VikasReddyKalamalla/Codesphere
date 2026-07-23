import React from 'react';
import { StudentTable } from '../components/StudentTable.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Students = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/instructor" className="self-start" />
      <StudentTable list={[]} />
    </div>
  );
};
