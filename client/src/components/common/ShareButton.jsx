import React from 'react';
import { Share2 } from 'lucide-react';
import { IconButton } from './IconButton.jsx';
import toast from 'react-hot-toast';

export const ShareButton = ({
  url,
  title = 'CodeSphere',
  className = '',
  ...props
}) => {
  const handleShare = async () => {
    const targetUrl = url || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: targetUrl
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(targetUrl);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        toast.error('Could not copy link');
      }
    }
  };

  return (
    <IconButton
      icon={Share2}
      variant="secondary"
      size="sm"
      onClick={handleShare}
      className={className}
      aria-label="Share resource"
      {...props}
    />
  );
};
