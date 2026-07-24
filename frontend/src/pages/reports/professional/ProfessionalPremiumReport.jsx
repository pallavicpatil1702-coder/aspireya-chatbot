import React from 'react';
import { Compass, Briefcase, Award, Layers, ClipboardList, Calendar, Sparkles } from 'lucide-react';
import RecommendedCareerFields from '../shared/RecommendedCareerFields.jsx';
import SkillDevelopmentActionPlan from '../shared/SkillDevelopmentActionPlan.jsx';
import CollegePreparationRoadmap from '../shared/CollegePreparationRoadmap.jsx';
import PsychometricTraitInsights from '../shared/PsychometricTraitInsights.jsx';
import CareerComparisonGraph from '../shared/CareerComparisonGraph.jsx';

/**
 * ProfessionalPremiumReport renders the full executive diagnostic report for Professionals
 * using modern shared executive components.
 */
const ProfessionalPremiumReport = ({
  reportContent = {}
}) => {
  const leadership = reportContent.leadership || {};
  const careerTransition = reportContent.careerTransition || [];
  const executiveSkills = reportContent.executiveSkills || [];
  const industryTrends = reportContent.industryTrends || {};
  const growthPlan = reportContent.growthPlan || [];
  const advancedCertifications = reportContent.advancedCertifications || [];

  // Normalize career transition roles for 3-column component
  const careerFields = careerTransition.map(ct => ({
    field: ct.role,
    matchPercentage: 90,
    description: ct.whyItFits || `Strategic transition opportunity matching leadership capabilities.`
  }));

  const skillNames = executiveSkills.map(s => typeof s === 'string' ? s : (s.skill || "Strategic Management"));

  return (
    <div className="flex flex-col gap-8 w-full text-left" style={{ width: '100%', boxSizing: 'border-box' }}>
      {/* 1. Leadership Strengths Profile */}
      <div 
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#eef2ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Briefcase size={18} />
            </div>
            <h3 style={{ fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)', fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Leadership Strengths Profile
            </h3>
          </div>

          {leadership.style && (
            <span 
              style={{
                background: '#faf5ff',
                border: '1px solid #e9d5ff',
                color: '#6b21a8',
                padding: '4px 12px',
                borderRadius: '99px',
                fontSize: '0.74rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Style: {leadership.style}
            </span>
          )}
        </div>

        <div 
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px 20px',
            fontSize: '0.86rem',
            color: '#334155',
            lineHeight: 1.65
          }}
        >
          {leadership.details || "Demonstrates strong executive decision-making, strategic team delegation, and goal orientation."}
        </div>
      </div>

      {/* 2. Recommended Career Transitions (3-Column Grid) */}
      <RecommendedCareerFields careerFields={careerFields} />

      {/* 3. Multi-Dimensional Comparison Graph */}
      <CareerComparisonGraph careerFields={careerFields} />

      {/* 4. Skills for Executive Growth (3-Column Action Plan) */}
      <SkillDevelopmentActionPlan 
        skillDevelopment={skillNames.length > 0 ? skillNames : ["Strategic Planning & Execution", "Executive Leadership", "Cross-Functional Management"]} 
      />

      {/* 5. Psychometric Trait Insights */}
      <PsychometricTraitInsights 
        psychometricProfile={reportContent.psychometricProfile} 
      />

      {/* 6. Professional Growth Roadmap Timeline */}
      <CollegePreparationRoadmap 
        roadmap={growthPlan} 
      />
    </div>
  );
};

export default ProfessionalPremiumReport;
export { ProfessionalPremiumReport };
