import React from 'react';
import { SessionModal } from '@components/modals/SessionModal.jsx';

export const SessionHeader = ({ title = 'Webcast Room' }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white select-none">
      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">Classroom Stream</span>
      <h3 className="text-base font-bold mt-0.5">{title}</h3>
    </div>
  );
};
