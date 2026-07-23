import React from 'react';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const PublishCourse = () => {
  const handlePub = () => {
    toast.success('Course workspace published successfully!');
  };
  return (
    <Button variant="primary" onClick={handlePub} size="sm">Publish syllabus</Button>
  );
};
