import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import { ProgressBar } from '../common/ProgressBar.jsx';
import { Rating } from '../common/Rating.jsx';
import { Link } from 'react-router-dom';

export const CourseCard = ({ course = {} }) => {
  return (
    <Card>
      <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative border-b border-slate-200 dark:border-slate-800">
        {course.image ? (
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Cover Image</div>
        )}
      </div>
      <CardBody className="flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{course.category}</span>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-1">{course.title}</h4>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>By {course.instructor}</span>
          <Rating rating={course.rating} size={12} readonly />
        </div>
        {course.progress !== undefined && (
          <ProgressBar value={course.progress} showLabel className="mt-1" />
        )}
        <Link to={`/learning/${course.id}`} className="text-xs font-semibold text-indigo-650 dark:text-indigo-455 hover:underline mt-2 self-start">
          View Lessons &rarr;
        </Link>
      </CardBody>
    </Card>
  );
};
