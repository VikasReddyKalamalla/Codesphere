import React from 'react';
import { Menu } from 'lucide-react';
import { Accordion } from '@components/accordions/Accordion.jsx';
import { AccordionItem } from '@components/accordions/AccordionItem.jsx';

export const LessonSidebar = ({ modules = [], activeLesson, onLessonSelect }) => {
  return (
    <aside className="w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-64px)] hidden md:block overflow-y-auto">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <Menu className="w-4 h-4 text-indigo-505" />
        <span className="text-xs font-bold text-slate-850 dark:text-white">Curriculum outline</span>
      </div>
      <div className="p-3">
        <Accordion>
          {modules.map((mod, idx) => (
            <AccordionItem key={idx} title={mod.title} defaultOpen={idx === 0}>
              <div className="flex flex-col gap-1.5">
                {(mod.lessons || []).map((les, idy) => {
                  const isCurrent = (activeLesson?.id || activeLesson?._id) === (les.id || les._id);
                  return (
                    <button
                      key={idy}
                      onClick={() => onLessonSelect && onLessonSelect(les)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[11px] font-medium transition-colors ${isCurrent ? 'bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                      {idy + 1}. {les.title}
                    </button>
                  );
                })}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
};
