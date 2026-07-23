import React from 'react';
import { ReportTable } from '../components/ReportTable.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Reports = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/admin" className="self-start" />
      <ReportTable />
    </div>
  );
};
