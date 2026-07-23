import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '../common/Checkbox.jsx';

export const FormCheckbox = ({ name, rules, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const errorMsg = errors[name]?.message;

  return (
    <Checkbox
      {...register(name, rules)}
      error={errorMsg}
      {...props}
    />
  );
};
