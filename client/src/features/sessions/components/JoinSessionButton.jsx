import React from 'react';
import { Button } from '@components/common/Button.jsx';
import { Video } from 'lucide-react';

export const JoinSessionButton = ({ onClick }) => {
  return (
    <Button variant="primary" size="md" icon={Video} onClick={onClick}>
      Join Stream
    </Button>
  );
};
