import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextArea } from '../common/TextArea.jsx';

export const FormEditor = ({ name, rules, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const errorMsg = errors[name]?.message;

  return (
    <TextArea
      {...register(name, rules)}
      error={errorMsg}
      {...props}
    />
  );
};
