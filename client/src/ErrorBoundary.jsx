import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const safeMsg = error?.message ? String(error.message) : (typeof error === 'object' ? JSON.stringify(error) : String(error));
    console.error('ErrorBoundary caught an error:', safeMsg);
  }

  render() {
    if (this.state.hasError) {
      const errorText = this.state.error?.message 
        ? String(this.state.error.message) 
        : (typeof this.state.error === 'object' ? (JSON.stringify(this.state.error) || 'Application Error') : String(this.state.error || 'Something went wrong.'));

      return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-white">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="text-xs text-slate-400 mt-2 font-mono">{errorText}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
