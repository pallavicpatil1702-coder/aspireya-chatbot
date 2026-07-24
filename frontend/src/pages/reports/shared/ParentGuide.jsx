import React from 'react';
import { CheckCircle2, AlertTriangle, Home } from 'lucide-react';
import { categorizeAdvice } from '../utils/textParser.js';

/**
 * ParentGuide renders split DO and DON'T guides for parents.
 * Conforms to visual list and checklist PRD guidelines.
 */
const ParentGuide = ({ advice }) => {
  const { dos, donts } = categorizeAdvice(advice);

  return (
    <div className="report-full-width report-animate-fade-in">
      <h3 className="report-heading-2 mb-6 flex items-center gap-2">
        <Home size={20} className="text-indigo-600" />
        <span>Parent Advisory & Support Framework</span>
      </h3>

      <div className="report-equal-cols gap-6">
        {/* DO Checklist Card */}
        <div className="report-card-premium report-do-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg">
                <CheckCircle2 size={18} />
              </div>
              <h4 
                className="font-bold text-emerald-900 text-sm"
                style={{ fontFamily: 'var(--report-font-heading)' }}
              >
                Recommended Actions (DO)
              </h4>
            </div>
            <div className="report-visual-list">
              {dos.map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-700 leading-relaxed">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DON'T Checklist Card */}
        <div className="report-card-premium report-dont-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-rose-100 text-rose-800 p-1.5 rounded-lg">
                <AlertTriangle size={18} />
              </div>
              <h4 
                className="font-bold text-rose-900 text-sm"
                style={{ fontFamily: 'var(--report-font-heading)' }}
              >
                Behaviors to Avoid (DON'T)
              </h4>
            </div>
            <div className="report-visual-list">
              {donts.map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-700 leading-relaxed">
                  <span className="text-rose-500 font-bold">⚠</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentGuide;
export { ParentGuide };
