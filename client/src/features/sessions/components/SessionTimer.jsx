import React, { useState, useEffect } from 'react';

export const SessionTimer = () => {
  const [sec, setSec] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const format = () => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <span className="text-xs font-bold font-mono text-rose-500 bg-rose-50/10 px-2 py-0.5 border border-rose-500/25 rounded-md">
      Live: {format()}
    </span>
  );
};
