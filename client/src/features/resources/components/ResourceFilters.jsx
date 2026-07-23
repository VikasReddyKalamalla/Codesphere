import React from 'react';
import { CategoryFilter } from '@components/filters/CategoryFilter.jsx';

export const ResourceFilters = ({ value, onChange, options = [] }) => {
  return <CategoryFilter value={value} onChange={onChange} options={options} />;
};
