import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Radio } from '../common/Radio.jsx';

export const FormRadio = ({ name, rules, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const errorMsg = errors[name]?.message;

  return (
    <Radio
      {...register(name, rules)}
      error={errorMsg}
      {...props}
    />
  );
};
