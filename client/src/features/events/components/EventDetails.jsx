import React from 'react';

export const EventDetails = ({ event = {} }) => {
  return (
    <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-655 dark:text-slate-350">
      <p>{event.description}</p>
      <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-400 mt-2">
        <span>Calendar Schedule: {event.date}</span>
        <span>Coordinates Location: {event.location}</span>
      </div>
    </div>
  );
};
