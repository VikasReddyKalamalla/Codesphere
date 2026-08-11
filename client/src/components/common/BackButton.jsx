import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Button } from './Button.jsx';

export const BackButton = ({
  fallbackPath = -1,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof fallbackPath === 'number') {
      navigate(fallbackPath);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      icon={ArrowLeft}
      onClick={handleBack}
      className={clsx('self-start', className)}
      {...props}
    >
      Back
    </Button>
  );
};
