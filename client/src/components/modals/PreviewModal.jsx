import React from 'react';
import { Modal } from './Modal.jsx';

export const PreviewModal = ({ isOpen, onClose, fileUrl, fileType }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Media Lightbox Preview">
      <div className="w-full flex items-center justify-center p-2 bg-slate-900 rounded-lg">
        {fileType === 'image' ? (
          <img src={fileUrl} alt="Preview" className="max-w-full max-h-[60vh] object-contain rounded" />
        ) : (
          <iframe src={fileUrl} title="Document Preview" className="w-full h-[60vh] border-0 rounded" />
        )}
      </div>
    </Modal>
  );
};
