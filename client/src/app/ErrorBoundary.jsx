import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const safeErrorMsg = error?.message ? String(error.message) : (typeof error === 'object' ? JSON.stringify(error) : String(error));
    console.error('ErrorBoundary caught a runtime crash:', safeErrorMsg);
  }

  render() {
    if (this.state.hasError) {
      const errorText = this.state.error?.message 
        ? String(this.state.error.message) 
        : (typeof this.state.error === 'object' ? (JSON.stringify(this.state.error) || 'Application Error') : String(this.state.error || 'Something went wrong.'));

      return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-slate-950 text-white select-none">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500 mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-black tracking-tight text-white">Application Crash Caught</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-sm text-center leading-relaxed font-mono bg-slate-900 p-2 rounded border border-slate-800 break-words">{errorText}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/10"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
