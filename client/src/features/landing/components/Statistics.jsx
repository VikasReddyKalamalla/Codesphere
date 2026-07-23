import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const stats = [
  { value: 14.2,  decimals: 1, suffix: 'M+', label: 'Lines Compiled',   sub: 'across compiler playpens'   },
  { value: 1200,  decimals: 0, suffix: '+',  label: 'College Cohorts',  sub: 'from 60+ universities'  },
  { value: 25000, decimals: 0, suffix: '+',  label: 'Active Workspace', sub: 'this month'             },
  { value: 99.99, decimals: 2, suffix: '%',  label: 'Playpen SLA',      sub: 'realtime sandbox uptime' },
];

function Counter({ end, decimals, suffix }) {
  const [val, setVal] = useState('0');
  const raf = useRef(null);
  useEffect(() => {
    const t0 = performance.now();
    const D = 1800;
    const step = (now) => {
      const p = Math.min((now - t0) / D, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const cur = end * e;
      setVal(decimals > 0 ? cur.toFixed(decimals) : Math.floor(cur).toLocaleString());
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [end, decimals]);
  return <>{val}{suffix}</>;
}

export const Statistics = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="px-6 py-20 border-t border-slate-200 bg-transparent z-10 relative">
      <div className="max-w-6xl mx-auto select-none">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              whileHover={{ 
                y: -5, 
                scale: 1.02, 
                borderColor: 'rgba(4, 170, 109, 0.4)',
                boxShadow: '0 15px 30px -10px rgba(4, 170, 109, 0.1)' 
              }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
              className="py-10 px-8 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl flex flex-col gap-1 text-left cursor-pointer transition-colors"
            >
              <p className="font-mono-origin text-2xl font-bold text-slate-800 tabular-nums">
                {inView ? <Counter end={s.value} decimals={s.decimals} suffix={s.suffix} /> : `0${s.suffix}`}
              </p>
              <p className="font-mono-origin text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
              <p className="font-sans-origin text-[11px] text-slate-400 mt-0.5 leading-relaxed">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Statistics;
