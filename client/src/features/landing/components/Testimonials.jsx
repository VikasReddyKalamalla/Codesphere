import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    quote: 'Codesphere eliminated the entire compiler sandbox setup overhead for our syllabus. Cohorts co-edit with absolute co-presence.',
    name: 'Dr. Sarah Chen',
    role: 'Compilers Lab Lead · MIT EECS',
    initials: 'SC',
  },
  {
    quote: 'The combination of live sessions and automated assessments is genuinely useful. Students co-edit workspace tasks easily.',
    name: 'Prof. James Okafor',
    role: 'CS Instructor · Stanford University',
    initials: 'JO',
  },
  {
    quote: 'Our team syncs sandbox projects in real-time. Document milestones and compiler runs work exactly as we need.',
    name: 'Priya Nair',
    role: 'Software Engineer · Google',
    initials: 'PN',
  },
];

export const Testimonials = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="px-6 py-20 border-t border-slate-200 dark:border-slate-800 bg-transparent z-10 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12 text-left select-none"
        >
          <span className="font-mono-origin text-[10px] font-bold text-[#04AA6D] tracking-wider uppercase">
            Platform Reviews
          </span>
          <h2 className="font-mono-origin text-2xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mt-3">
            Trusted by classrooms & teams.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              whileHover={{ 
                y: -5, 
                scale: 1.02, 
                borderColor: 'rgba(4, 170, 109, 0.4)',
                boxShadow: '0 15px 30px -10px rgba(4, 170, 109, 0.1)' 
              }}
              transition={{ delay: i * 0.1, duration: 0.45, ease: 'easeOut' }}
              className="flex flex-col gap-5 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-md text-left cursor-pointer transition-colors"
            >
              <p className="font-mono-origin text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 select-none">
                <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-[10px] font-bold text-[#04AA6D] shrink-0 font-mono-origin">
                  {t.initials}
                </div>
                <div>
                  <p className="font-sans-origin text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{t.name}</p>
                  <p className="font-mono-origin text-[9px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
