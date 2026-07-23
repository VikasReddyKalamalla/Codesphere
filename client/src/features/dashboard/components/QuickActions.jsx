import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Button } from '@components/common/Button.jsx';
import { Link } from 'react-router-dom';

export const QuickActions = () => {
  return (
    <Card>
      <CardBody className="flex flex-wrap gap-2.5 items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">Quick Shortcuts</span>
        <div className="flex gap-2">
          <Link to="/sandbox">
            <Button variant="outline" size="sm">Launch Sandbox</Button>
          </Link>
          <Link to="/codex">
            <Button variant="primary" size="sm">New Project</Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};
