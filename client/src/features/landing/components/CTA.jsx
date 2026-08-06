import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

export const CTA = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const navigate = useNavigate();

  const handleRestrictedClick = (e, path) => {
    const isLoggedIn = !!localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'codesphere_token');
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: path } } });
    }
  };

  return (
    <section ref={ref} className="px-6 py-24 bg-transparent border-t border-slate-200 dark:border-slate-800 z-10 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          whileHover={{ 
            scale: 1.01, 
            boxShadow: '0 20px 40px -15px rgba(4, 170, 109, 0.12)' 
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f9f9fb] dark:bg-slate-900/90 p-8 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-10 shadow-lg text-left cursor-pointer"
        >
          <div className="max-w-lg select-none">
            <span className="font-mono-origin text-[10px] font-bold text-[#04AA6D] tracking-wider uppercase">
              Join Codesphere Today
            </span>
            <h2 className="font-mono-origin text-2xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 leading-snug mt-3">
              Ready to start compile runs?
            </h2>
            <p className="font-sans-origin mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Create compiler playpens, track active learning paths, co-edit with presence cursors, and verify solutions in one place.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="font-mono-origin inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg hover:shadow-green-500/10 transition-all duration-200"
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/pricing"
                onClick={(e) => handleRestrictedClick(e, '/pricing')}
                className="font-mono-origin inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all duration-200"
              >
                view pricing
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default CTA;
