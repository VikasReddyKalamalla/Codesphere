import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Award } from 'lucide-react';

export const ProfileCertificates = ({ list = [] }) => {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-slate-205 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-850 dark:text-white">Verified Certificates</span>
      </div>
      <CardBody className="flex flex-col gap-3">
        {list.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">Complete tests assessments to verify certifications.</p>
        ) : (
          list.map((c, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-indigo-505 shrink-0" />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{c.title}</span>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
};
