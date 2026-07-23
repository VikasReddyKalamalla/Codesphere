import { useState, useMemo } from 'react';

export const useSearch = (list = [], keySelector = (item) => item) => {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    if (!query) return list;
    return list.filter((item) =>
      keySelector(item).toLowerCase().includes(query.toLowerCase())
    );
  }, [list, query]);

  return { query, setQuery, filtered };
};
