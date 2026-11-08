import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LessonSidebar } from '../components/LessonSidebar.jsx';
import { VideoLesson } from '../components/VideoLesson.jsx';
import { ArticleLesson } from '../components/ArticleLesson.jsx';
import { QuizLesson } from '../components/QuizLesson.jsx';
import { BackButton } from '@components/common/BackButton.jsx';
import { fetchCourseDetailsAPI } from '../services/learningAPI.js';
import apiClient from '@services/axios.js';
import { NATIVE_ROADMAPS } from '../data/nativeRoadmapsData.js';

export const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const cleanId = (courseId || '').toLowerCase().trim();
  const nativeMatch = NATIVE_ROADMAPS.find(r => 
    r.id?.toLowerCase() === cleanId || 
    (r._id && r._id.toString().toLowerCase() === cleanId) ||
    (r.slug && r.slug.toLowerCase() === cleanId) ||
    r.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(cleanId)
  );

  const [course, setCourse] = useState(() => nativeMatch || null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourseDetailsAPI(courseId)
      .then((res) => {
        if (res.success && res.data) {
          setCourse(res.data);
        }
      })
      .catch((err) => console.error(err));
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

  if (loading && !course) {
    return (
      <div className="w-full h-0.5 bg-emerald-500/20 overflow-hidden">
        <div className="h-full bg-[#04AA6D] animate-pulse w-full" />
      </div>
    );
  }

  return (
    <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      <LessonSidebar
        modules={course?.modules || []}
        activeLesson={activeLesson}
        onLessonSelect={handleLessonSelect}
      />
      <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)] flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <BackButton fallbackPath={`/learning/${courseId}`} className="self-start" />
          {activeLesson && (
            <button
              onClick={() => {
                const lId = activeLesson.id || activeLesson._id;
                navigate(`/learning/${courseId}/lesson/${lId}/practice`);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Practice in Cloud Workspace ⚡</span>
            </button>
          )}
        </div>
        
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

export default LessonViewer;
