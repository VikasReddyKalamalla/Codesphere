import React from 'react';
import { ReportTable } from '../components/ReportTable.jsx';

export const Reports = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <ReportTable />
    </div>
  );
};

export default Reports;
