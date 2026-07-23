import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Switch } from '../common/Switch.jsx';

export const FormSwitch = ({ name, rules, label, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Switch
          checked={field.value}
          onChange={field.onChange}
          label={label}
          {...props}
        />
      )}
    />
  );
};
