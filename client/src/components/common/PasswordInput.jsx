import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from './Input.jsx';

export const PasswordInput = React.forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative w-full">
      <Input ref={ref} type={show ? 'text' : 'password'} icon={Lock} {...props} />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 bottom-3 transition-colors"
        style={{ color: '#bbb' }}
        onMouseEnter={e => e.currentTarget.style.color = '#666'}
        onMouseLeave={e => e.currentTarget.style.color = '#bbb'}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';
