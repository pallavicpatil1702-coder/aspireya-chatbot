import React from 'react';
import { GraduationCap, Lightbulb } from 'lucide-react';
import { bulletizeAIText } from '../utils/textParser.js';

/**
 * TeacherGuide renders recommendation cards for teachers and academic mentors.
 */
const TeacherGuide = ({ advice }) => {
  const recommendations = bulletizeAIText(advice, 3);

  return (
    <div className="report-full-width report-animate-fade-in">
      <h3 className="report-heading-2 mb-6 flex items-center gap-2">
        <GraduationCap size={20} className="text-indigo-600" />
        <span>Academic Mentor & Teacher Guidance</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="report-card-premium flex flex-col justify-between" style={{ minHeight: '140px' }}>
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg"
                style={{ width: '28px', height: '28px' }}
              >
                <Lightbulb size={16} />
              </div>
              <span 
                className="text-[0.68rem] font-bold text-indigo-800 uppercase tracking-wider"
                style={{ fontFamily: 'var(--report-font-heading)' }}
              >
                Strategy Recommendation #{idx + 1}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-2" style={{ fontFamily: 'var(--report-font-body)' }}>
              {rec}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherGuide;
export { TeacherGuide };
