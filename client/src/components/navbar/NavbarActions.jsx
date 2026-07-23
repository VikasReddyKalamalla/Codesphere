import React from 'react';
import { Button } from '../common/Button.jsx';
import { Link } from 'react-router-dom';

export const NavbarActions = ({ isAuthenticated, onLoginClick }) => {
  if (isAuthenticated) return null;
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={onLoginClick}>
        Log In
      </Button>
      <Link to="/register">
        <Button variant="primary" size="sm">
          Sign Up
        </Button>
      </Link>
    </div>
  );
};
