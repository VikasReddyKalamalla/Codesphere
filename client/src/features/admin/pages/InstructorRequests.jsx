import React from 'react';
import { InstructorRequests as RequestsList } from '../components/InstructorRequests.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const InstructorRequestsPage = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/admin" className="self-start" />
      <RequestsList />
    </div>
  );
};
