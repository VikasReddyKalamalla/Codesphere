import React from 'react';
import { PaginationButton } from './PaginationButton.jsx';
import { PaginationInfo } from './PaginationInfo.jsx';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange
}) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
      <PaginationInfo start={start} end={end} total={totalItems} />
      <div className="flex items-center gap-1.5">
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
        >
          Prev
        </PaginationButton>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const p = idx + 1;
          return (
            <PaginationButton
              key={p}
              active={p === currentPage}
              onClick={() => onPageChange && onPageChange(p)}
            >
              {p}
            </PaginationButton>
          );
        })}
        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
        >
          Next
        </PaginationButton>
      </div>
    </div>
  );
};
