import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { PDFViewer } from '../components/PDFViewer.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const PDFViewerPage = () => {
  const { resourceId } = useParams();
  const location = useLocation();

  const fileUrl = location.state?.fileUrl || `/api/resources/${resourceId}/download` || '#';
  const title = location.state?.title || 'Resource PDF Notes';

  return (
    <div className="flex flex-col gap-5 w-full font-sans">
      <BackButton fallbackPath="/resources" className="self-start" />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">{title}</h2>
      </div>
      <PDFViewer fileUrl={fileUrl} />
    </div>
  );
};

export default PDFViewerPage;
