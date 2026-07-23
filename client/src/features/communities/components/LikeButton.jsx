import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { IconButton } from '@components/common/IconButton.jsx';

export const LikeButton = () => {
  const [active, setActive] = useState(false);
  return (
    <IconButton
      icon={Heart}
      variant={active ? 'danger' : 'ghost'}
      onClick={() => setActive(!active)}
      aria-label="Like item"
    />
  );
};
