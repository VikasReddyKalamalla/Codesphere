import React from 'react';
import { SearchInput } from '../common/SearchInput.jsx';

export const TableSearch = ({ value, onChange, onClear, placeholder = 'Search data...' }) => {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      onClear={onClear}
      placeholder={placeholder}
      className="max-w-xs"
    />
  );
};
