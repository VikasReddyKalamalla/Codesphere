import React from 'react';
import { Outlet } from 'react-router-dom';
import Logo from '../components/Logo.jsx';

const ErrorLayout = () => (
  <div className="min-h-screen flex flex-col" style={{ background: '#F5F4F0' }}>
    <header className="h-14 flex items-center px-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', background: '#fff' }}>
      <Logo size="w-6 h-6" textColor="text-slate-800" />
    </header>
    <main className="flex-1 flex items-center justify-center"><Outlet /></main>
  </div>
);

export default ErrorLayout;
