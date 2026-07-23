import React from 'react';
import { CategoryFilter } from '@components/filters/CategoryFilter.jsx';

export const SessionFilters = ({ value, onChange }) => {
  return <CategoryFilter value={value} onChange={onChange} options={[{ label: 'Active', value: 'live' }]} />;
};
