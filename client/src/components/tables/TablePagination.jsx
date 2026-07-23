import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../common/IconButton.jsx';

export const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0
}) => {
  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Showing {startIdx} to {endIdx} of {totalItems} entries
      </span>
      <div className="flex items-center gap-2">
        <IconButton
          icon={ChevronLeft}
          variant="secondary"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          aria-label="Previous page"
        />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          Page {currentPage} of {totalPages}
        </span>
        <IconButton
          icon={ChevronRight}
          variant="secondary"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          aria-label="Next page"
        />
      </div>
    </div>
  );
};
