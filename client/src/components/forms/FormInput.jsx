import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../common/Input.jsx';

export const FormInput = ({ name, rules, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const errorMsg = errors[name]?.message;

  return (
    <Input
      {...register(name, rules)}
      error={errorMsg}
      {...props}
    />
  );
};
