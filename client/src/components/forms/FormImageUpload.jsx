import React, { useRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Image, Upload } from 'lucide-react';
import clsx from 'clsx';

export const FormImageUpload = ({ name, rules, label, error }) => {
  const { control } = useFormContext();
  const inputRef = useRef(null);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const errorMsg = fieldState.error?.message || error;
        const fileObj = field.value;
        const previewUrl = fileObj instanceof File ? URL.createObjectURL(fileObj) : fileObj;

        return (
          <div className="flex flex-col gap-1.5 w-full">
            {label && (
              <span className="text-sm font-medium text-slate-700 dark:text-slate-355">
                {label}
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={(e) => field.onChange(e.target.files?.[0])}
              className="sr-only"
            />
            <div
              onClick={() => inputRef.current?.click()}
              className={clsx(
                'relative w-28 h-28 border border-dashed rounded-xl overflow-hidden cursor-pointer bg-slate-50 dark:bg-slate-900 flex items-center justify-center border-slate-300 dark:border-slate-700 hover:opacity-85',
                errorMsg ? 'border-rose-400' : ''
              )}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-400 text-[10px]">
                  <Image className="w-5 h-5" />
                  <span>Choose Image</span>
                </div>
              )}
            </div>
            {errorMsg && <p className="text-xs text-rose-600 dark:text-rose-400">{errorMsg}</p>}
          </div>
        );
      }}
    />
  );
};
