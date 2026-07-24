import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Curriculum } from '../components/Curriculum.jsx';
import { BackButton } from '@components/common/BackButton.jsx';
import { fetchCourseDetailsAPI } from '../services/learningAPI.js';

export const LearningDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetailsAPI(courseId)
      .then((res) => {
        if (res.success && res.data) {
          setCourse(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return <div className="text-center py-10 text-slate-500 dark:text-slate-400 font-medium">Loading Course Syllabus...</div>;
  }

  if (!course) {
    return (
      <div className="text-center py-10 flex flex-col gap-4">
        <BackButton fallbackPath="/learning" className="self-start" />
        <div className="text-slate-500 dark:text-slate-400 font-medium">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="flex justify-between items-center gap-4">
        <BackButton fallbackPath="/learning" />
      </div>

      <div>
        <span className="text-[10px] font-bold text-[#04AA6D] uppercase">Interactive Course Syllabus</span>
        <h3 className="text-base font-bold text-slate-850 dark:text-white mt-1">{course.title}</h3>
      </div>

      <Curriculum modules={course.modules || []} courseId={courseId} />
    </div>
  );
};
