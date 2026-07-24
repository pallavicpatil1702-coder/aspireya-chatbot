import React from 'react';
import { Compass, BookOpen, Award, Target, Sparkles, Lock, ArrowRight, GraduationCap } from 'lucide-react';
import UpgradeCTA from '../shared/UpgradeCTA.jsx';
import CareerMatchBarChart from '../shared/CareerMatchBarChart.jsx';
import PersonalityRadarChart from '../shared/PersonalityRadarChart.jsx';
import StrengthDistributionChart from '../shared/StrengthDistributionChart.jsx';
import CareerComparisonGraph from '../shared/CareerComparisonGraph.jsx';
import SkillComparisonChart from '../shared/SkillComparisonChart.jsx';
import RecommendedCareerFields from '../shared/RecommendedCareerFields.jsx';
import './c1112Report.css';

const Student1112FreeReport = ({ 
  executiveSummary = "",
  careerFields = [], 
  degrees = [], 
  entranceExams = [],
  matchResults = [],
  userTraits = {},
  onUpgrade,
  hasPremium = false
}) => {
  return (
    <div className="c1112-container">
      {/* 1. Executive Summary Highlight Card */}
      {executiveSummary && (
        <div className="c1112-summary-card">
          <div className="c1112-summary-header">
            <Sparkles size={18} className="c1112-summary-icon" />
            <h3 className="c1112-summary-title">Executive Summary & Profile Overview</h3>
          </div>
          <p className="c1112-summary-text">{executiveSummary}</p>
        </div>
      )}

      {/* 2. Top Career Recommendations & Match Analysis */}
      <CareerMatchBarChart matchResults={matchResults} />

      {/* Chart 4: Strength Distribution Bars */}
      <StrengthDistributionChart />

      {/* 3. Recommended Career Fields (3-Column Layout) */}
      <RecommendedCareerFields careerFields={careerFields} />

      {/* 4. Target Degrees & Entrance Exams Grid */}
      <div className="c1112-grid-2">
        {/* Recommended Degrees */}
        <div className="c1112-card">
          <div className="c1112-card-header">
            <div className="c1112-card-icon">
              <GraduationCap size={20} />
            </div>
            <h3 className="c1112-card-title">Recommended College Majors</h3>
          </div>

          {degrees.length > 0 ? (
            <div className="c1112-chips-wrap">
              {degrees.map((degree, idx) => (
                <span key={`degree-${idx}`} className="c1112-chip c1112-chip-degree">
                  <BookOpen size={14} />
                  <span>{degree}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Target degree suggestions are being compiled.</p>
          )}
        </div>

        {/* Entrance Exams */}
        <div className="c1112-card">
          <div className="c1112-card-header">
            <div className="c1112-card-icon" style={{ background: 'rgba(217, 119, 6, 0.08)', color: '#d97706' }}>
              <Award size={20} />
            </div>
            <h3 className="c1112-card-title">Target Entrance Examinations</h3>
          </div>

          {entranceExams.length > 0 ? (
            <div className="c1112-chips-wrap">
              {entranceExams.map((exam, idx) => (
                <span key={`exam-${idx}`} className="c1112-chip c1112-chip-exam">
                  <Award size={14} />
                  <span>{exam}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Entrance exam recommendations will appear here.</p>
          )}
        </div>
      </div>

      {/* 5. Premium Upgrade CTA Section with Detailed Feature Breakdown */}
      <UpgradeCTA onUpgrade={onUpgrade} hasPremium={hasPremium} />
    </div>
  );
};

export default Student1112FreeReport;
export { Student1112FreeReport };
