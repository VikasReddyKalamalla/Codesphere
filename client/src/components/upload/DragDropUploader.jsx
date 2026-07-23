import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import clsx from 'clsx';

export const DragDropUploader = ({ onFilesDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesDrop && onFilesDrop(files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={clsx(
        'border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 min-h-[140px]',
        isDragOver
          ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 scale-[0.99]'
          : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30'
      )}
    >
      <Upload className={clsx('w-8 h-8 mb-2 transition-colors', isDragOver ? 'text-indigo-650' : 'text-slate-400')} />
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Drag files here to upload</span>
      <span className="text-xs text-slate-400 mt-1">Or click to select folders</span>
    </div>
  );
};
