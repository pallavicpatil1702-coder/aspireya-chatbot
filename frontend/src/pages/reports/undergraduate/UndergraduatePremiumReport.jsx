import React from 'react';
import { Compass, Briefcase, Award, Layers, ClipboardList, Calendar, Sparkles } from 'lucide-react';
import RecommendedCareerFields from '../shared/RecommendedCareerFields.jsx';
import SkillDevelopmentActionPlan from '../shared/SkillDevelopmentActionPlan.jsx';
import CollegePreparationRoadmap from '../shared/CollegePreparationRoadmap.jsx';
import PsychometricTraitInsights from '../shared/PsychometricTraitInsights.jsx';
import CareerComparisonGraph from '../shared/CareerComparisonGraph.jsx';

/**
 * UndergraduatePremiumReport renders the full diagnostic report for Undergraduate candidates
 * using modern shared executive components.
 */
const UndergraduatePremiumReport = ({
  reportContent = {}
}) => {
  const careerPaths = reportContent.careerPaths || [];
  const internships = reportContent.internships || [];
  const certifications = reportContent.certifications || [];
  const skillGapAnalysis = reportContent.skillGapAnalysis || {};
  const industryReadiness = reportContent.industryReadiness || {};
  const careerRoadmap = reportContent.careerRoadmap || [];

  // Normalize career fields for 3-column component
  const careerFields = careerPaths.map(cp => ({
    field: cp.career,
    matchPercentage: cp.matchPercentage || 85,
    description: `Target career path focusing on industry placement, internship readiness, and domain specialization.`
  }));

  return (
    <div className="flex flex-col gap-8 w-full text-left" style={{ width: '100%', boxSizing: 'border-box' }}>
      {/* 1. Top Recommended Career Fields (3-Column Grid) */}
      <RecommendedCareerFields careerFields={careerFields} />

      {/* 2. Multi-Dimensional Comparison Graph */}
      <CareerComparisonGraph careerFields={careerFields} />

      {/* 3. Internships and Certifications */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          width: '100%'
        }}
      >
        {/* Internships */}
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
              Recommended Internships
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {internships.map((int, idx) => (
              <div 
                key={idx} 
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '0.84rem',
                  color: '#334155',
                  fontWeight: 600
                }}
              >
                {int}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Award size={18} />
            </div>
            <h3 style={{ fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)', fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Target Certifications
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {certifications.map((cert, idx) => (
              <div 
                key={idx} 
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '0.84rem',
                  color: '#334155',
                  fontWeight: 600
                }}
              >
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Skill Development Action Plan (3-Column Grid) */}
      <SkillDevelopmentActionPlan 
        skillDevelopment={skillGapAnalysis.requiredSkills || ["Technical Domain Expertise", "Data Analysis & Tools", "Professional Communication"]} 
      />

      {/* 5. Psychometric Trait Insights */}
      <PsychometricTraitInsights 
        psychometricProfile={reportContent.psychometricProfile} 
      />

      {/* 6. Multi-Phase Day-based Roadmap Pathway */}
      <CollegePreparationRoadmap 
        roadmap={careerRoadmap} 
      />
    </div>
  );
};

export default UndergraduatePremiumReport;
export { UndergraduatePremiumReport };
