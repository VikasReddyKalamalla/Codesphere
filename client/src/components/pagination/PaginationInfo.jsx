import React from 'react';

export const PaginationInfo = ({ start, end, total }) => {
  return (
    <span className="text-xs text-slate-400 select-none">
      Showing {start} to {end} of {total} entries
    </span>
  );
};
