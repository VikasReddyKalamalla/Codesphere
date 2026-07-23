import React from 'react';
import { FormInput } from './FormInput.jsx';
import { Calendar as CalendarIcon } from 'lucide-react';

export const FormDatePicker = (props) => {
  return (
    <FormInput
      type="date"
      icon={CalendarIcon}
      {...props}
    />
  );
};
