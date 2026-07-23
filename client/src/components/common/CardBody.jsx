import React from 'react';
import clsx from 'clsx';

export const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={clsx('p-5', className)} {...props}>
      {children}
    </div>
  );
};
