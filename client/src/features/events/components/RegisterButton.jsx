import React from 'react';
import { Button } from '@components/common/Button.jsx';

export const RegisterButton = ({ onClick, registered = false }) => {
  return (
    <Button variant={registered ? 'secondary' : 'primary'} onClick={onClick} className="w-full">
      {registered ? 'Registered' : 'Register for Event'}
    </Button>
  );
};
