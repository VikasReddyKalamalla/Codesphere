import React from 'react';
import { Calendar } from '@components/calendar/Calendar.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const EventCalendar = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/events" className="self-start" />
      <Calendar />
    </div>
  );
};
