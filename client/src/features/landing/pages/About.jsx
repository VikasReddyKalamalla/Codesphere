import React from 'react';

export default function About() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-6 text-center select-none flex flex-col gap-4">
      <h2 className="text-xl font-bold text-slate-850 dark:text-white">About CodeSphere</h2>
      <p className="text-xs text-slate-500 leading-relaxed">
        We specialize in collaborative compilers sandboxes, allowing users to coordinate code builds over WebSockets channels.
      </p>
    </div>
  );
}
