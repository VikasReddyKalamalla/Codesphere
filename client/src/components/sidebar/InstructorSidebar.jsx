import React from 'react';
import { KanbanSquare, BookOpen, Users, Presentation, LineChart, Award } from 'lucide-react';
import { Sidebar } from './Sidebar.jsx';

export const InstructorSidebar = ({ user, onLogout, collapsed = false }) => {
  const groups = [
    {
      label: 'Management',
      items: [
        { label: 'Overview', path: '/instructor', icon: KanbanSquare },
        { label: 'Courses Manager', path: '/instructor/courses', icon: BookOpen },
        { label: 'Live Sessions', path: '/instructor/sessions', icon: Presentation },
        { label: 'My Students', path: '/instructor/students', icon: Users }
      ]
    },
    {
      label: 'Reports',
      items: [
        { label: 'Analytics', path: '/instructor/analytics', icon: LineChart },
        { label: 'Certificates', path: '/instructor/certificates', icon: Award }
      ]
    }
  ];

  return <Sidebar user={user} onLogout={onLogout} groups={groups} collapsed={collapsed} />;
};
