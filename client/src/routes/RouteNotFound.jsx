import React from 'react';
import { useNavigate } from 'react-router-dom';

export const RouteNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 select-none animate-fade-in">
      <h1 className="text-8xl font-black bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent leading-none">
        404
      </h1>
      <h2 className="text-xl font-bold mt-6 tracking-tight">Page Not Found</h2>
      <p className="text-xs text-slate-400 mt-2 max-w-xs text-center leading-relaxed">
        The page you are looking for does not exist or has been relocated to another workspace.
      </p>
      <div className="flex gap-3 mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 text-xs font-bold transition-all"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/10"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default RouteNotFound;
