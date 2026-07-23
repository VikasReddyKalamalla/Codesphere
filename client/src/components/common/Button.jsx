import React from 'react';
import clsx from 'clsx';

export const Button = React.forwardRef(({
  children, variant = 'primary', size = 'md',
  isLoading = false, disabled = false,
  icon: Icon, iconPosition = 'left',
  className = '', type = 'button', ...props
}, ref) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:   'bg-[#04AA6D] hover:bg-[#03935e] text-white focus:ring-green-300',
    secondary: 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 focus:ring-green-100',
    outline:   'bg-transparent border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-green-100',
    ghost:     'bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-800 focus:ring-green-100',
    danger:    'bg-red-650 hover:bg-red-700 text-white focus:ring-red-300',
    success:   'bg-[#04AA6D] hover:bg-[#03935e] text-white focus:ring-green-300',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-sm gap-2',
  };

  return (
    <button
      ref={ref} type={type}
      disabled={disabled || isLoading}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!isLoading && Icon && iconPosition === 'left'  && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
});
Button.displayName = 'Button';
