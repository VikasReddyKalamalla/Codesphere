import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const partners = ['MIT', 'Stanford', 'Harvard', 'CMU', 'Berkeley', 'Oxford', 'ETH Zürich', 'NUS'];

export const Partners = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section ref={ref} className="px-6 py-12 bg-transparent z-10 relative">
      <div className="max-w-6xl mx-auto select-none">
        <p className="font-mono-origin text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center mb-6">
          Trusted by instructors and engineering teams worldwide
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          {partners.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="font-mono-origin text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-default"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Partners;
