import React from 'react';
import { GitBranch, AlertCircle, XCircle, Bell, Radio } from 'lucide-react';

interface StatusBarProps {
  language: string;
  line: number;
  col: number;
  onOpenLanguagePicker: () => void;
  onToggleTerminal: () => void;
  isDark: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  language,
  line,
  col,
  onOpenLanguagePicker,
  onToggleTerminal,
  isDark,
}) => {
  return (
    <footer
      className={`h-6 border-t flex items-center justify-between px-2 text-[11px] font-sans select-none shrink-0 z-30 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}
    >
      {/* Left: Remote Host Badge, Errors, Warnings, Git Branch */}
      <div className="flex items-center gap-3">
        {/* Remote badge >< matching VS Code bottom-left */}
        <button
          className="flex items-center justify-center w-7 h-6 -ml-2 bg-[#04AA6D] hover:bg-[#03985e] text-white transition font-mono font-bold text-xs cursor-pointer"
          title="CodeSphere Cloud Environment (Online)"
        >
          &gt;&lt;
        </button>

        {/* Git Branch */}
        <button
          className={`flex items-center gap-1 transition cursor-pointer ${
            isDark ? 'hover:text-white' : 'hover:text-slate-900'
          }`}
          title="Git: main"
        >
          <GitBranch className="w-3 h-3 text-[#04AA6D]" />
          <span>main*</span>
        </button>

        {/* Errors & Warnings diagnostics: ⊗ 0  ⚠️ 0 */}
        <button
          onClick={onToggleTerminal}
          className={`flex items-center gap-2 transition cursor-pointer text-[10px] font-mono ${
            isDark ? 'hover:text-white' : 'hover:text-slate-900'
          }`}
          title="Workspace Diagnostics"
        >
          <span className="flex items-center gap-0.5">
            <XCircle className="w-3 h-3" />
            <span>0</span>
          </span>
          <span className="flex items-center gap-0.5">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            <span>0</span>
          </span>
        </button>
      </div>

      {/* Right: Line/Col, Spaces, Encoding, Language, Notifications */}
      <div className="flex items-center gap-3 font-mono text-[11px]">
        <button
          onClick={onToggleTerminal}
          className={`transition cursor-pointer hidden sm:inline ${
            isDark ? 'hover:text-white' : 'hover:text-slate-900'
          }`}
        >
          Ln {line}, Col {col}
        </button>

        <span className="hidden sm:inline">Spaces: 2</span>
        <span>UTF-8</span>

        <button
          onClick={onOpenLanguagePicker}
          className="hover:text-[#04AA6D] transition font-semibold underline decoration-dotted capitalize cursor-pointer font-sans"
          title="Change Language Mode"
        >
          {language || 'Plain Text'}
        </button>

        <button
          className={`p-0.5 transition cursor-pointer ${
            isDark ? 'hover:text-white' : 'hover:text-slate-900'
          }`}
          title="Notifications"
        >
          <Bell className="w-3 h-3" />
        </button>
      </div>
    </footer>
  );
};
