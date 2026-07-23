import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button.jsx';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary intercepted render failure:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950">
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full border border-rose-100 dark:border-rose-900/40 mb-4 shrink-0">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Application Render Crash</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
            Something went wrong compiling this component. Try reloading the viewport or contact support.
          </p>
          <Button variant="primary" size="md" onClick={() => window.location.reload()}>
            Reload App
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
