import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { IconButton } from '@components/common/IconButton.jsx';

export const BookmarkButton = () => {
  const [active, setActive] = useState(false);
  return (
    <IconButton
      icon={Bookmark}
      variant={active ? 'primary' : 'secondary'}
      onClick={() => setActive(!active)}
      aria-label="Bookmark resource"
    />
  );
};
