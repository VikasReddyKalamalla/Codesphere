import React from 'react';
import { ConfirmDialog } from '../common/ConfirmDialog.jsx';

export const DeleteModal = ({ isOpen, onConfirm, onCancel, itemName = 'this item' }) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title="Delete Item Confirmation"
      description={`Are you absolutely sure you want to delete ${itemName}? This process cannot be undone.`}
      confirmLabel="Delete"
      isDanger
    />
  );
};
