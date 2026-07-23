import React from 'react';

export const AuthHeader = ({ title, subtitle }) => (
  <div className="mb-7">
    <h1 className="text-2xl font-black tracking-tight" style={{ color: '#111' }}>{title}</h1>
    {subtitle && <p className="mt-1.5 text-sm" style={{ color: '#888' }}>{subtitle}</p>}
  </div>
);
