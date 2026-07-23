import React from 'react';

export const EventGallery = () => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-205 dark:border-slate-850" />
      ))}
    </div>
  );
};
