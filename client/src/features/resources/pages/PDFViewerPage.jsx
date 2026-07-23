import React from 'react';
import { PDFViewer } from '../components/PDFViewer.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const PDFViewerPage = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/resources" className="self-start" />
      <PDFViewer fileUrl="#" />
    </div>
  );
};
