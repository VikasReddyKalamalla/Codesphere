import React from 'react';
import { Button } from '../common/Button.jsx';

export const FormActions = ({
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  isSubmitting = false
}) => {
  return (
    <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
      {onCancel && (
        <Button variant="secondary" size="md" onClick={onCancel} disabled={isSubmitting}>
          {cancelLabel}
        </Button>
      )}
      <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </div>
  );
};
