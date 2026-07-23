import React, { useRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Upload, File } from 'lucide-react';
import clsx from 'clsx';

export const FormFileUpload = ({ name, rules, label, error }) => {
  const { control } = useFormContext();
  const fileInputRef = useRef(null);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const errorMsg = fieldState.error?.message || error;
        
        return (
          <div className="flex flex-col gap-1.5 w-full">
            {label && (
              <span className="text-sm font-medium text-slate-700 dark:text-slate-350">
                {label}
              </span>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => field.onChange(e.target.files?.[0])}
              className="sr-only"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={clsx(
                'border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 transition-all duration-200',
                errorMsg ? 'border-rose-300 dark:border-rose-900' : 'border-slate-300 dark:border-slate-700'
              )}
            >
              {field.value ? (
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
                  <File className="w-5 h-5" />
                  <span className="text-sm truncate max-w-xs">{field.value.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs">Drag and drop file, or click to browse</span>
                </div>
              )}
            </div>
            {errorMsg && <p className="text-xs text-rose-600 dark:text-rose-450">{errorMsg}</p>}
          </div>
        );
      }}
    />
  );
};
