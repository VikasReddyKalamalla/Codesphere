import React from 'react';
import { Checkbox } from '@components/common/Checkbox.jsx';

export const RememberMe = ({ checked, onChange }) => {
  return (
    <div className="flex items-center justify-between mt-1">
      <Checkbox
        id="remember-me"
        label="Remember this browser"
        checked={checked}
        onChange={onChange}
      />
      <a href="/forgot-password" className="text-xs font-semibold text-[#04AA6D] hover:text-[#03935e] hover:underline font-mono-origin">
        Forgot Password?
      </a>
    </div>
  );
};
