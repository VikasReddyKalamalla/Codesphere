import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface Props {
  panelName: string;
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PanelErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[PanelErrorBoundary: ${this.props.panelName}] Uncaught error:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-slate-900 text-slate-100 select-none space-y-3 border border-slate-800 rounded-lg">
          <div className="p-2.5 rounded-full bg-rose-500/15 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-xs font-semibold text-white">
              {this.props.panelName} encountered a problem
            </h3>
            <p className="text-[11px] font-mono text-slate-400 max-w-sm truncate">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
          </div>

          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#04AA6D]" />
            <span>Reload Panel</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
