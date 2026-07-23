import React from 'react';

export const PDFViewer = ({ fileUrl }) => {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-900">
      <iframe
        src={fileUrl}
        title="PDF Document Viewer Frame"
        className="w-full h-[550px] border-0"
      />
    </div>
  );
};
