import React from 'react';
import { Compass, BookOpen, Award, Layers, Calendar, Sparkles, Target, GraduationCap, Brain, CheckCircle2 } from 'lucide-react';
import CareerMatchBarChart from '../shared/CareerMatchBarChart.jsx';
import PersonalityRadarChart from '../shared/PersonalityRadarChart.jsx';
import StrengthDistributionChart from '../shared/StrengthDistributionChart.jsx';
import CareerComparisonGraph from '../shared/CareerComparisonGraph.jsx';
import SkillComparisonChart from '../shared/SkillComparisonChart.jsx';
import RecommendedCareerFields from '../shared/RecommendedCareerFields.jsx';
import SkillDevelopmentActionPlan from '../shared/SkillDevelopmentActionPlan.jsx';
import CollegePreparationRoadmap from '../shared/CollegePreparationRoadmap.jsx';
import PsychometricTraitInsights from '../shared/PsychometricTraitInsights.jsx';
import './c1112Report.css';

const Student1112PremiumReport = ({
  reportContent = {},
  userTraits = {},
  matchResults = []
}) => {
  const careerFields = reportContent.careerFields || [];
  const degrees = reportContent.degrees || [];
  const entranceExams = reportContent.entranceExams || [];
  const roadmap = reportContent.roadmap || [];
  const skillDevelopment = reportContent.skillDevelopment || [];
  const higherEducation = reportContent.higherEducation || "";
  const executiveSummary = reportContent.executiveSummary || "";

  // Helper for formatting user trait object
  const traitList = Object.entries(userTraits).map(([trait, score]) => ({
    name: trait.replace(/([A-Z])/g, ' $1').trim(),
    score: typeof score === 'number' ? score : 0
  }));

  return (
    <div className="c1112-container report-animate-fade-in">
      {/* 1. Executive Summary Highlight Card */}
      {executiveSummary && (
        <div className="c1112-summary-card">
          <div className="flex items-center gap-2 mb-3 text-indigo-600">
            <Sparkles size={20} />
            <h3 className="c1112-card-title text-indigo-900" style={{ margin: 0 }}>
              Executive Summary & Insights
            </h3>
          </div>
          <p className="c1112-summary-text">
            {executiveSummary}
          </p>
        </div>
      )}

      {/* 2. Professional Psychometric Analytics Visualizations */}
      <div className="c1112-grid-2">
        {/* Chart 1: Career Match Alignment Bar Chart */}
        <CareerMatchBarChart matchResults={matchResults} />

        {/* Chart 2: Psychometric Personality Radar Chart */}
        <PersonalityRadarChart userTraits={userTraits} />
      </div>

      {/* Chart 3: Top 5 Career Multi-Dimensional Comparison Graph */}
      <CareerComparisonGraph matchResults={matchResults} careerFields={careerFields} />

      {/* Chart 4 & 5 Grid: Strength Distribution & Skill Capability Comparison */}
      <div className="c1112-grid-2">
        <StrengthDistributionChart />
        <SkillComparisonChart skillDevelopment={skillDevelopment} />
      </div>

      {/* 3. Recommended Career Fields */}
      <RecommendedCareerFields careerFields={careerFields} />

      {/* 4. Degrees & Entrance Examinations Grid */}
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
                <span key={`prem-deg-${idx}`} className="c1112-chip c1112-chip-degree">
                  <BookOpen size={14} />
                  <span>{degree}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Target degrees compiled based on profile.</p>
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
                <span key={`prem-exam-${idx}`} className="c1112-chip c1112-chip-exam">
                  <Award size={14} />
                  <span>{exam}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Target entrance examinations compiled.</p>
          )}
        </div>
      </div>

      {/* 5. Skill Development Action Plan (3-Column Layout) */}
      <SkillDevelopmentActionPlan skillDevelopment={skillDevelopment} />

      {/* 6. Higher Education Preparation Guide */}
      {higherEducation && (
        <div 
          style={{
            background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #ffffff 100%)',
            border: '1px solid rgba(124, 58, 237, 0.25)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'left'
          }}
        >
          {/* Header */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(124, 58, 237, 0.15)',
              paddingBottom: '16px',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                  flexShrink: 0
                }}
              >
                <GraduationCap size={20} className="text-white" />
              </div>
              <div>
                <h3 
                  style={{
                    fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#4c1d95',
                    margin: 0,
                    lineHeight: 1.2
                  }}
                >
                  Higher Education Preparation Guide
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#6b21a8', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  Strategic advice & core considerations for selecting the right college curriculum
                </p>
              </div>
            </div>

            <span 
              style={{
                background: '#ffffff',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                color: '#7c3aed',
                padding: '4px 12px',
                borderRadius: '99px',
                fontSize: '0.7rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                flexShrink: 0
              }}
            >
              Admissions Blueprint
            </span>
          </div>

          {/* Guidance Points Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {higherEducation
              .split(/(?<=\.)\s+/)
              .filter(sentence => sentence.trim().length > 0)
              .map((sentence, idx) => (
                <div 
                  key={`edu-guide-${idx}`}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(124, 58, 237, 0.15)',
                    borderRadius: '14px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    width: '100%',
                    boxSizing: 'border-box',
                    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.02)'
                  }}
                >
                  <div 
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(124, 58, 237, 0.1)',
                      color: '#7c3aed',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    {idx + 1}
                  </div>
                  <p 
                    style={{
                      fontSize: '0.84rem',
                      color: '#334155',
                      lineHeight: 1.6,
                      margin: 0,
                      fontWeight: 500
                    }}
                  >
                    {sentence.trim()}
                  </p>
                </div>
              ))}
          </div>

          {/* Bottom Highlight Note */}
          <div 
            style={{
              background: 'rgba(124, 58, 237, 0.06)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '12px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Sparkles size={16} style={{ color: '#7c3aed', flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5b21b6' }}>
              Expert Advisory: Align campus culture and faculty expertise with your primary career goals.
            </span>
          </div>
        </div>
      )}

      {/* 7. College Preparation Roadmap Vertical Timeline with Day Durations */}
      <CollegePreparationRoadmap roadmap={roadmap} />

      {/* 8. Psychometric Trait & Competency Breakdown */}
      <PsychometricTraitInsights userTraits={userTraits} />
    </div>
  );
};

export default Student1112PremiumReport;
export { Student1112PremiumReport };
