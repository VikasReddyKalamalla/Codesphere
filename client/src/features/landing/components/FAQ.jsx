import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { q: 'Is the sandbox free to use?',            a: 'Every account gets 60 free compile minutes per month. Paid plans include unlimited execution with priority runtime.' },
  { q: 'Which languages are supported?',          a: 'Over 20 languages including Python, JavaScript/Node.js, Java, C/C++, Go, Rust, Ruby, PHP, and more.' },
  { q: 'Can I use this for a full classroom?',    a: 'Yes. The Standard plan supports unlimited students, bulk enrollment, live sessions, and automated grading.' },
  { q: 'How does real-time collaboration work?',  a: 'Codex uses operational transforms to sync edits instantly — you see teammates\' cursors and changes live.' },
  { q: 'Are certificates verifiable?',            a: 'Every certificate has a unique URL and QR code. Students can share them directly to LinkedIn.' },
  { q: 'Is my code private?',                     a: 'All projects are private by default. You control who can view, edit, or run your code.' },
];

export const FAQ = () => {
  const [open, setOpen] = useState(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="px-6 py-24 bg-transparent border-t border-slate-200 dark:border-slate-800 z-10 relative">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12 text-left select-none"
        >
          <span className="font-mono-origin text-[10px] font-bold text-[#04AA6D] tracking-wider uppercase">
            Platform Help
          </span>
          <h2 className="font-mono-origin text-2xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mt-3">
            Common Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-md"
        >
          {faqs.map((faq, i) => (
            <div key={i} className={i < faqs.length - 1 ? 'border-b border-slate-200 dark:border-slate-800' : ''}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50 group"
              >
                <motion.span 
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="font-mono-origin text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#04AA6D] dark:group-hover:text-[#04AA6D] transition-colors"
                >
                  {faq.q}
                </motion.span>
                {open === i
                  ? <Minus className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-[#04AA6D]" />
                  : <Plus  className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-[#04AA6D]" />
                }
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="ans"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 font-sans-origin text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
export default FAQ;
