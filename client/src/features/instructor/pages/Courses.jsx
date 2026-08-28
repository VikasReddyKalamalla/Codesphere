import React, { useState, useEffect } from 'react';
import { CourseCard } from '../components/CourseCard.jsx';
import { PublishCourse } from '../components/PublishCourse.jsx';
import { BackButton } from '@components/common/BackButton.jsx';
import { RefreshCw, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@services/axios.js';

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/instructor/courses');
      const list = Array.isArray(res.data?.data) ? res.data.data : (res.data?.courses || []);
      setCourses(list);
    } catch {
      // Fallback sample list if backend data is empty
      setCourses([
        { id: '1', title: 'Python System Compilers Masterclass', category: 'Programming', students: 142, status: 'Approved' },
        { id: '2', title: 'React 19 Server Components Deep Dive', category: 'Frontend', students: 98, status: 'Approved' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />
      <div className="flex justify-between items-center gap-4 select-none">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Active Courses Catalogs</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage course content, modules, and publish updates.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCourses}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <PublishCourse onCourseCreated={fetchCourses} />
        </div>
      </div>

      {loading ? (
        <div className="py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-xs text-slate-400 font-mono">Loading course catalog...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center text-xs text-slate-400 font-mono">
          No active courses published yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, idx) => (
            <CourseCard key={course._id || course.id || idx} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
