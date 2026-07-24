import React from 'react';
import { CheckSquare, AlertTriangle } from 'lucide-react';

/**
 * SkillCard renders individual entries in the Skill Gap Section.
 * Shows progress levels and checks if a gap exists.
 */
const SkillCard = ({ name, hasGap, actionPlan }) => {
  return (
    <div className="report-card-premium report-animate-fade-in" style={{ padding: '20px' }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <CheckSquare size={18} className={hasGap ? "text-amber-500" : "text-emerald-500"} />
          <span 
            className="font-bold text-slate-800 text-sm"
            style={{ fontFamily: 'var(--report-font-heading)' }}
          >
            {name || "Competency Index"}
          </span>
        </div>
        <span 
          className={`text-[0.62rem] font-bold px-2 py-0.5 rounded-md uppercase ${
            hasGap ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {hasGap ? "Skill Gap Identified" : "Aligned"}
        </span>
      </div>

      {/* Progress metrics */}
      <div className="mb-3">
        <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden w-full">
          <div 
            className="h-full rounded-full"
            style={{ 
              width: hasGap ? '45%' : '90%', 
              background: hasGap ? 'var(--report-gold-accent)' : 'var(--report-emerald-accent)'
            }}
          ></div>
        </div>
      </div>

      {actionPlan && (
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80 mt-2">
          <div className="flex items-center gap-1 text-[0.6rem] text-slate-400 font-extrabold uppercase mb-1">
            <AlertTriangle size={10} className="text-amber-500" />
            <span>Remedial Action plan</span>
          </div>
          <p className="text-[0.68rem] text-slate-600 leading-normal" style={{ fontFamily: 'var(--report-font-body)' }}>
            {actionPlan}
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillCard;
export { SkillCard };
