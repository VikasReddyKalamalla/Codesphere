import React from 'react';
import { Outlet } from 'react-router-dom';

const InstructorLayout = () => (
  <div className="min-h-screen flex" style={{ background: '#F5F4F0' }}>
    <aside className="fixed inset-y-0 left-0 z-40 w-56 flex flex-col"
      style={{ background: '#fff', borderRight: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="h-14 flex items-center gap-2 px-5"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center">
          <span className="text-white text-xs font-black">CS</span>
        </div>
        <span className="text-sm font-bold" style={{ color: '#111' }}>Instructor Panel</span>
      </div>
      <nav className="flex-1 py-3 px-2 overflow-y-auto no-scrollbar" />
    </aside>
    <div className="ml-56 flex-1 flex flex-col">
      <header className="sticky top-0 z-30 h-14 flex items-center px-5"
        style={{ background: 'rgba(245,244,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="flex-1" />
      </header>
      <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
    </div>
  </div>
);

export default InstructorLayout;
