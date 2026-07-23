import React from 'react';
import { CategoryFilter } from '@components/filters/CategoryFilter.jsx';

export const NotificationFilter = ({ value, onChange }) => {
  return <CategoryFilter value={value} onChange={onChange} options={[{ label: 'Unread', value: 'unread' }]} />;
};
