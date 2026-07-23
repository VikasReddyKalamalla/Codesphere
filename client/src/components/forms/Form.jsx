import React from 'react';

export const Form = ({ children, onSubmit, ...props }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full" {...props}>
      {children}
    </form>
  );
};
