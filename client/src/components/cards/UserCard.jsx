import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import { Avatar } from '../common/Avatar.jsx';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';

export const UserCard = ({ user = {}, onFollow }) => {
  return (
    <Card className="text-center">
      <CardBody className="flex flex-col items-center gap-3">
        <Avatar src={user.avatar} alt={user.name} size="lg" status={user.status} />
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-white">{user.name}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
        </div>
        <Badge variant={user.role === 'Admin' ? 'danger' : user.role === 'Instructor' ? 'warning' : 'primary'}>
          {user.role}
        </Badge>
        {onFollow && (
          <Button variant="outline" size="sm" onClick={onFollow} className="w-full mt-2">
            Follow
          </Button>
        )}
      </CardBody>
    </Card>
  );
};
