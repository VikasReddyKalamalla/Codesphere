import React, { useRef, useState } from 'react';
import { Upload, File, Check } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import clsx from 'clsx';

export const FileUploader = ({ onUpload, label = 'Upload Files' }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleSelect = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      onUpload && onUpload(f);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <input type="file" ref={fileInputRef} onChange={handleSelect} className="sr-only" />
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="md" icon={Upload} onClick={() => fileInputRef.current?.click()}>
          {label}
        </Button>
        {file && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[200px]">
            <File className="w-3.5 h-3.5" />
            <span>{file.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
