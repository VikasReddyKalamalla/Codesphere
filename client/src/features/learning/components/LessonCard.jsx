import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Play, FileText, Code2 } from 'lucide-react';
import ROUTES from '@routes/RouteConstants.js';

export const LessonCard = ({ lesson = {}, courseId }) => {
  const getIcon = () => {
    switch (lesson.type) {
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'code':
        return <Code2 className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getIconBg = () => {
    switch (lesson.type) {
      case 'article':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500';
      case 'code':
        return 'bg-purple-50 dark:bg-purple-950/20 text-purple-500';
      default:
        return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500';
    }
  };

  const getLessonUrl = () => {
    const lId = lesson.id || lesson._id;
    const mId = lesson.moduleId?._id || lesson.moduleId || 'module1';
    if (lesson.type === 'article') {
      return ROUTES.LEARNING_ARTICLE.replace(':pathId', courseId).replace(':lessonId', lId);
    }
    return ROUTES.LEARNING_LESSON.replace(':pathId', courseId).replace(':moduleId', mId).replace(':lessonId', lId);
  };

  const shouldOpenNewTab = lesson.type === 'article';

  return (
    <Link 
      to={getLessonUrl()}
      target={shouldOpenNewTab ? '_blank' : '_self'}
      rel={shouldOpenNewTab ? 'noopener noreferrer' : ''}
      className="block"
    >
      <Card className="hover:scale-[1.01] cursor-pointer transition-transform">
        <CardBody className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 ${getIconBg()} rounded-lg`}>
              {getIcon()}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-white line-clamp-1">{lesson.title}</h4>
              <span className="text-[10px] text-slate-400 block mt-0.5">{lesson.duration} mins</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};
