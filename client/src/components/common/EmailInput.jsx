import React from 'react';
import { Mail } from 'lucide-react';
import { Input } from './Input.jsx';

export const EmailInput = React.forwardRef((props, ref) => {
  return (
    <Input
      ref={ref}
      type="email"
      icon={Mail}
      placeholder="email@example.com"
      {...props}
    />
  );
});

EmailInput.displayName = 'EmailInput';
