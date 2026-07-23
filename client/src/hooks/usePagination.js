import { useState } from 'react';

export const usePagination = (initialPage = 1, totalPages = 1) => {
  const [page, setPage] = useState(initialPage);
  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));
  return { page, setPage, next, prev };
};
