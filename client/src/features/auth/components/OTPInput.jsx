import React, { useState } from 'react';

export const OTPInput = ({ length = 6, onComplete }) => {
  const [code, setCode] = useState(Array(length).fill(''));

  const handleChange = (val, idx) => {
    const newCode = [...code];
    newCode[idx] = val.slice(-1);
    setCode(newCode);

    if (val && idx < length - 1) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }

    if (newCode.every(c => c !== '')) {
      onComplete && onComplete(newCode.join(''));
    }
  };

  return (
    <div className="flex gap-2 justify-center py-2 select-none">
      {code.map((char, idx) => (
        <input
          key={idx}
          id={`otp-${idx}`}
          type="text"
          maxLength={1}
          value={char}
          onChange={(e) => handleChange(e.target.value, idx)}
          className="w-10 h-12 text-center text-lg font-bold border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      ))}
    </div>
  );
};
