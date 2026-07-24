import React from 'react';
import { Sparkles, ShieldCheck, Lock, CheckCircle2, ArrowRight, Star, Award, Layers, Calendar, GraduationCap, Brain, Target } from 'lucide-react';

/**
 * UpgradeCTA renders an attractive, light-themed banner highlighting
 * all exclusive sections included in the Premium Report.
 */
const UpgradeCTA = ({ onUpgrade, hasPremium = false }) => {
  const premiumSections = [
    { icon: Award, title: "Top 5 Career Multi-Dimensional Comparison", desc: "Aptitude Fit, Interest Match & Market Demand analytics" },
    { icon: Target, title: "Skill Capability vs Target Benchmark", desc: "Pinpoint exact skill gaps against industry benchmarks" },
    { icon: Layers, title: "Skill Development Action Plan", desc: "Structured 3-column actionable steps to build key skills" },
    { icon: GraduationCap, title: "Higher Education Preparation Guide", desc: "Admissions blueprint & strategic college selection advice" },
    { icon: Calendar, title: "College Preparation Roadmap (Days 1–365)", desc: "Sequential execution roadmap with explicit day durations" },
    { icon: Brain, title: "Psychometric Trait & Competency Breakdown", desc: "Categorized cognitive, behavioral & leadership insights" }
  ];

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #eff6ff 100%)',
        border: '1px solid #cbd5e1',
        borderRadius: '24px',
        padding: '32px 28px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
        color: '#0f172a',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        margin: '24px 0'
      }}
    >
      {/* Header Pill */}
      <div 
        style={{
          background: '#eef2ff',
          border: '1px solid #c7d2fe',
          padding: '6px 16px',
          borderRadius: '99px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          fontWeight: 900,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#3730a3'
        }}
      >
        <Sparkles size={16} className="text-indigo-600" />
        <span>Unlock Your Complete Career Blueprint</span>
      </div>

      {/* Main Title & Subtitle */}
      <div style={{ maxWidth: '650px' }}>
        <h2 
          style={{
            fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
            fontSize: '1.6rem',
            fontWeight: 900,
            margin: '0 0 10px 0',
            color: '#0f172a',
            lineHeight: 1.2
          }}
        >
          What's Included in Your Premium Report?
        </h2>
        <p style={{ fontSize: '0.86rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
          Gain absolute clarity with 6 exclusive diagnostic sections designed for academic excellence and long-term career success.
        </p>
      </div>

      {/* 6 Premium Sections Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
          width: '100%',
          textAlign: 'left'
        }}
      >
        {premiumSections.map((sec, idx) => {
          const IconComp = sec.icon;
          return (
            <div 
              key={`prem-light-sec-${idx}`}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
              }}
            >
              <div 
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)'
                }}
              >
                <IconComp size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', lineHeight: 1.3 }}>
                  {sec.title}
                </h4>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  {sec.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action CTA Button */}
      <button 
        onClick={onUpgrade}
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '14px',
          padding: '14px 32px',
          fontSize: '0.96rem',
          fontWeight: 900,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)',
          marginTop: '6px'
        }}
      >
        <span>{hasPremium ? "View Premium Report" : "Unlock Full Premium Blueprint"}</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default UpgradeCTA;
export { UpgradeCTA };
