import React from 'react';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const DeleteAccount = () => {
  const handleDel = () => {
    toast.error('Deletion request dispatch lock.');
  };
  return (
    <div className="p-5 bg-rose-50/20 border border-rose-200/30 rounded-xl flex items-center justify-between gap-4">
      <div>
        <h4 className="text-xs font-bold text-rose-600">Delete Account Space</h4>
        <span className="text-[10px] text-slate-400 block mt-0.5">Irreversibly wipe sandbox playpen file logs.</span>
      </div>
      <Button variant="danger" size="sm" onClick={handleDel}>Wipe details</Button>
    </div>
  );
};
