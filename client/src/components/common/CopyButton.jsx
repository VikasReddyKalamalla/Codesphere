import React, { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';
import { IconButton } from './IconButton.jsx';

export const CopyButton = ({
  text,
  className = '',
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <IconButton
      icon={copied ? Check : Clipboard}
      variant={copied ? 'success' : 'secondary'}
      size="sm"
      onClick={handleCopy}
      className={className}
      aria-label="Copy to clipboard"
      {...props}
    />
  );
};
