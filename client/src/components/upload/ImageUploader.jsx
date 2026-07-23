import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import clsx from 'clsx';

export const ImageUploader = ({ onUpload, label = 'Select Image' }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState('');

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload && onUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*" ref={inputRef} onChange={handleSelect} className="sr-only" />
      <div
        onClick={() => inputRef.current?.click()}
        className={clsx(
          'w-24 h-24 rounded-full border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center cursor-pointer overflow-hidden relative hover:opacity-85 shadow-sm'
        )}
      >
        {preview ? (
          <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-[10px] text-slate-400 font-medium">
            <ImageIcon className="w-4.5 h-4.5" />
            <span>{label}</span>
          </div>
        )}
      </div>
    </div>
  );
};
