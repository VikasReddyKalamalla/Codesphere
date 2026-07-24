import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Logo } from '@components/Logo.jsx';
import { ArrowLeft, Copy, Check, ExternalLink, CheckCircle2 } from 'lucide-react';
import apiClient from '@services/axios.js';

const ArticlePage = () => {
  const { pathId: courseId, lessonId } = useParams();
  const [copied, setCopied] = useState(null);
  const [article, setArticle] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      setPageLoading(true);
      try {
        const response = await apiClient.get(`/lessons/single/${lessonId}`);
        const data = response.data?.data || response.data || response;
        if (data) {
          let sections = data.articleSections || [];
          if (sections.length === 0 && data.article) {
            sections = [{ type: 'paragraph', content: data.article }];
          }
          setArticle({
            title: data.title,
            courseTitle: data.moduleId?.title || 'Learning Course',
            sections: sections
          });
        }
      } catch (err) {
        console.error('Failed to fetch lesson:', err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  // Mark lesson as complete
  const markComplete = useCallback(async () => {
    if (isCompleted || isLoading) return;
    
    setIsLoading(true);
    try {
      await apiClient.post('/learning/progress', { lessonId });
      setIsCompleted(true);
    } catch (err) {
      console.error('Failed to mark progress:', err);
    } finally {
      setIsLoading(false);
    }
  }, [lessonId, isCompleted, isLoading]);

  // Check if user has scrolled to bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        markComplete();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [markComplete]);

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderSection = (section, index) => {
    switch (section.type) {
      case 'heading':
        const HeadingTag = `h${section.level}`;
        return (
          <HeadingTag 
            key={index} 
            className={`font-bold text-slate-800 dark:text-white mt-8 mb-4 ${
              section.level === 2 ? 'text-2xl' : 'text-xl'
            }`}
          >
            {section.content}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p key={index} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {section.content}
          </p>
        );

      case 'code':
        return (
          <div key={index} className="mb-6 relative">
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-t-lg border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {section.language}
              </span>
              <button
                onClick={() => handleCopyCode(section.content, index)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {copied === index ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === index ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-b-lg overflow-x-auto">
              <code className="text-sm font-mono leading-relaxed">
                {section.content}
              </code>
            </pre>
          </div>
        );

      case 'list':
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-slate-600 dark:text-slate-300">
            {section.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );

      case 'note':
        return (
          <div key={index} className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm shrink-0">NOTE</span>
              <p className="text-slate-700 dark:text-slate-300 text-sm">{section.content}</p>
            </div>
          </div>
        );

      case 'tip':
        return (
          <div key={index} className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r-lg mb-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold text-sm shrink-0">TIP</span>
              <p className="text-slate-700 dark:text-slate-300 text-sm">{section.content}</p>
            </div>
          </div>
        );

      case 'warning':
        return (
          <div key={index} className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg mb-4">
            <div className="flex items-start gap-3">
              <span className="text-amber-600 dark:text-amber-400 font-bold text-sm shrink-0">WARNING</span>
              <p className="text-slate-700 dark:text-slate-300 text-sm">{section.content}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-500 dark:text-slate-400 font-medium">Loading Article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="text-slate-500 dark:text-slate-400 font-medium">Article not found.</div>
        <Link to={`/learning/${courseId}`} className="text-[#04AA6D] hover:underline font-bold">Back to Course</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo showText={true} />
            <div className="flex items-center gap-4">
              {isCompleted && (
                <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              )}
              <Link 
                to={`/learning/${courseId}`}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Course</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-3">
            <ExternalLink className="w-4 h-4" />
            <span>{article.courseTitle}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {article.title}
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
        </div>

        {/* Article Sections */}
        <div className="article-content">
          {article.sections.map((section, index) => renderSection(section, index))}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo size="w-6 h-6" showText={false} />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                © {new Date().getFullYear()} CodeSphere. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                Privacy
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                Terms
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ArticlePage;
