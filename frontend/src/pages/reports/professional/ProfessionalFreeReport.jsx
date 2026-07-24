import React from 'react';
import UpgradeCTA from '../shared/UpgradeCTA.jsx';
import PremiumTeaserCard from '../shared/PremiumTeaserCard.jsx';
import { ShieldCheck, Compass } from 'lucide-react';

const ProfessionalFreeReport = ({ 
  leadership = {}, 
  careerTransition = [], 
  onUpgrade,
  hasPremium = false
}) => {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* 1. Leadership Strengths (Free) */}
      <div className="report-card-premium report-full-width flex flex-col gap-3">
        <div className="flex items-center gap-2 text-indigo-500">
          <ShieldCheck size={20} />
          <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Leadership Strengths</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: 'var(--report-font-body)' }}>
          <strong>Style:</strong> {leadership.style || "Strategic & Team-oriented"}<br />
          <strong>Approach:</strong> {leadership.details || "Your answers show a preference for coordinating projects and supporting team members."}
        </p>
      </div>

      {/* 2. Target Transition Roles (Free) */}
      <div className="w-full">
        <h3 className="report-heading-2 mb-6 flex items-center gap-2">
          <Compass size={20} className="text-indigo-600" />
          <span>Recommended Career Transitions</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {careerTransition.map((pivot, idx) => (
            <div key={idx} className="report-card-premium flex flex-col gap-2 text-left">
              <span className="text-xs font-bold text-slate-800">{pivot.role}</span>
              <p className="text-xs text-slate-500 leading-relaxed m-0" style={{ fontFamily: 'var(--report-font-body)' }}>
                {pivot.whyItFits}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Locked Premium Insights (Free) */}
      <div className="report-full-width flex flex-col gap-4">
        <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block">
          Locked Premium Action Plan:
        </span>
        <div className="flex flex-col gap-4">
          <PremiumTeaserCard title="Growth Plan & Key Skill Gaps" sectionType="skills" />
          <PremiumTeaserCard title="Work Preparation & Industry Trends Outlook" sectionType="skills" />
          <PremiumTeaserCard title="Advanced Executive Certifications & Roadmap" sectionType="roadmap" />
        </div>
      </div>

      {/* 4. Upgrade CTA */}
      <UpgradeCTA onUpgrade={onUpgrade} hasPremium={hasPremium} />
    </div>
  );
};

export default ProfessionalFreeReport;
