import React from 'react';
import { HelpCircle } from 'lucide-react';

const EmptySection = ({ title = "Section Data", message = "Data not available for this assessment type." }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center flex flex-col items-center justify-center gap-3">
      <HelpCircle className="text-slate-400" size={24} />
      <div>
        <h4 className="text-sm font-bold text-slate-700">{title}</h4>
        <p className="text-xs text-slate-500 mt-1">{message}</p>
      </div>
    </div>
  );
};

export default EmptySection;
