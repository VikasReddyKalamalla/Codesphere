import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const InvoiceCard = ({ invoice = {} }) => {
  return (
    <Card>
      <CardBody className="p-4 flex justify-between text-xs">
        <span>Invoice #{invoice.id || 'INV-001'}</span>
        <span className="font-bold text-indigo-650">${invoice.amount || 29}</span>
      </CardBody>
    </Card>
  );
};
