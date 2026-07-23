import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Select } from '../common/Select.jsx';

export const FormSelect = ({ name, rules, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const errorMsg = errors[name]?.message;

  return (
    <Select
      {...register(name, rules)}
      error={errorMsg}
      {...props}
    />
  );
};
