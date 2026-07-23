import React from 'react';
import { Button } from '@components/common/Button.jsx';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export const AvatarUploader = () => {
  const handleUpload = () => {
    toast.success('Avatar image uploaded successfully!');
  };
  return (
    <div className="flex items-center gap-4 py-2 select-none">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-205 dark:border-slate-850 flex items-center justify-center text-slate-400 font-mono text-xs">
        IMG
      </div>
      <Button variant="outline" size="sm" icon={Upload} onClick={handleUpload}>Upload Photo</Button>
    </div>
  );
};
