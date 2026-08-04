import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    const errText = error?.stack || error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    console.error('ErrorBoundary caught a runtime crash:', errText, errorInfo?.componentStack);

    // Auto recover if Vite dynamic module fetch fails during HMR / dev server restart
    if (errText.includes('Failed to fetch dynamically imported module') || errText.includes('Importing a module script failed')) {
      const lastAutoReload = Number(sessionStorage.getItem('cs_last_dynamic_reload') || 0);
      if (Date.now() - lastAutoReload > 3000) {
        sessionStorage.setItem('cs_last_dynamic_reload', String(Date.now()));
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message 
        ? String(this.state.error.message) 
        : (typeof this.state.error === 'object' ? (JSON.stringify(this.state.error) || 'Application Error') : String(this.state.error || 'Something went wrong.'));

      const stackTrace = this.state.error?.stack || this.state.errorInfo?.componentStack || '';

      return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-slate-950 text-white">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-white">Application Crash Caught</h2>
          <p className="text-xs text-rose-400 font-mono mt-3 max-w-xl w-full bg-slate-900 p-3.5 rounded-xl border border-slate-800 overflow-auto max-h-48 whitespace-pre-wrap break-words">
            {errorMsg}
          </p>
          {stackTrace && (
            <pre className="text-[10px] text-slate-400 font-mono mt-2 max-w-xl w-full bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 overflow-auto max-h-40 text-left whitespace-pre-wrap break-words">
              {stackTrace}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
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
