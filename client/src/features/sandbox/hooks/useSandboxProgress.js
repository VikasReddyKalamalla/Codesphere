import { useState } from 'react';

export const useSandboxProgress = () => {
  const [locCompiled, setLocCompiled] = useState(0);
  return { locCompiled, setLocCompiled };
};
