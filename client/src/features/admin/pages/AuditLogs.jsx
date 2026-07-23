import React from 'react';
import { AuditLogs as LogsList } from '../components/AuditLogs.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const AuditLogsPage = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/admin" className="self-start" />
      <LogsList list={[{ time: '5m ago', action: 'Approved Dan applicant request' }]} />
    </div>
  );
};
