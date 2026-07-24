import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LessonSidebar } from '../components/LessonSidebar.jsx';
import { VideoLesson } from '../components/VideoLesson.jsx';
import { ArticleLesson } from '../components/ArticleLesson.jsx';
import { QuizLesson } from '../components/QuizLesson.jsx';
import { BackButton } from '@components/common/BackButton.jsx';
import { fetchCourseDetailsAPI } from '../services/learningAPI.js';
import apiClient from '@services/axios.js';

export const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
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

  useEffect(() => {
    if (!lessonId) return;

    let found = null;
    if (course?.modules) {
      for (const mod of course.modules) {
        const les = (mod.lessons || []).find(l => (l.id || l._id) === lessonId);
        if (les) {
          found = les;
          break;
        }
      }
    }

    if (found) {
      setActiveLesson(found);
    } else {
      // Fallback: fetch the single lesson from API
      apiClient.get(`/lessons/single/${lessonId}`)
        .then(res => {
          const data = res.data?.data || res.data || res;
          if (data) setActiveLesson(data);
        })
        .catch(err => console.error('Failed to load lesson:', err));
    }
  }, [lessonId, course]);

  const handleLessonSelect = (les) => {
    const mId = les.moduleId?._id || les.moduleId || 'module1';
    const lId = les.id || les._id;
    navigate(`/learning/${courseId}/module/${mId}/lesson/${lId}`);
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-500 dark:text-slate-400 font-medium">Loading Course curriculum...</div>;
  }

  return (
    <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      <LessonSidebar
        modules={course?.modules || []}
        activeLesson={activeLesson}
        onLessonSelect={handleLessonSelect}
      />
      <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)] flex flex-col gap-5">
        <BackButton fallbackPath={`/learning/${courseId}`} className="self-start" />
        
        {activeLesson ? (
          activeLesson.type === 'video' ? (
            <VideoLesson lesson={activeLesson} />
          ) : activeLesson.type === 'quiz' ? (
            <QuizLesson lesson={activeLesson} />
          ) : (
            <ArticleLesson lesson={activeLesson} />
          )
        ) : (
          <div className="text-center py-10 text-slate-400">Select a lesson from the curriculum outline.</div>
        )}
      </div>
    </div>
  );
};
