import React from 'react';

export const TabPanel = ({ id, activeTab, children }) => {
  if (id !== activeTab) return null;
  return <div className="py-4 w-full animate-fade-in">{children}</div>;
};
