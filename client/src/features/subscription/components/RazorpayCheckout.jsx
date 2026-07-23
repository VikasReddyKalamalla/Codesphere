import React from 'react';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const RazorpayCheckout = ({ amount = 2900 }) => {
  const handlePay = () => {
    toast.success('Razorpay checkout completed successfully!');
  };
  return (
    <Button variant="primary" onClick={handlePay} className="w-full mt-2">Pay ${amount / 100} with Razorpay</Button>
  );
};
