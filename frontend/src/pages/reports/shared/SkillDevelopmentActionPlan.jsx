import React from 'react';
import { Layers, CheckCircle2, Zap, Target } from 'lucide-react';

/**
 * SkillDevelopmentActionPlan renders the candidate skill action items in a 3-column grid layout.
 * Uses 100% explicit inline CSS styles for zero layout collapse across all print/PDF modes.
 */
const SkillDevelopmentActionPlan = ({ skillDevelopment = [] }) => {
  if (!skillDevelopment || skillDevelopment.length === 0) return null;

  return (
    <div 
      className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm text-left flex flex-col gap-6 w-full"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
        textAlign: 'left',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Header Section */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '18px',
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
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              flexShrink: 0
            }}
          >
            <Layers size={20} className="text-white" />
          </div>
          <div>
            <h3 
              style={{
                fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                lineHeight: 1.2
              }}
            >
              Skill Development Action Plan
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
              Actionable steps and targeted strategies to elevate key competency areas
            </p>
          </div>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          width: '100%'
        }}
      >
        {skillDevelopment.map((sk, idx) => (
          <div 
            key={`sk-col-${idx}`}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              width: '100%',
              boxSizing: 'border-box',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Header Badge Row */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  width: '100%'
                }}
              >
                <div 
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
                    flexShrink: 0
                  }}
                >
                  <CheckCircle2 size={16} />
                </div>

                <span 
                  style={{
                    fontFamily: 'var(--report-font-metrics, monospace)',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    color: '#047857',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    flexShrink: 0
                  }}
                >
                  Action Strategy
                </span>
              </div>

              {/* Skill Heading */}
              <h4 
                style={{
                  fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
                  fontSize: '1.02rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: 0,
                  lineHeight: 1.3
                }}
              >
                {sk.skill}
              </h4>

              {/* Action Plan Text */}
              <p 
                style={{
                  fontSize: '0.82rem',
                  color: '#475569',
                  lineHeight: 1.6,
                  margin: 0
                }}
              >
                {sk.actionPlan}
              </p>
            </div>

            {/* Bottom Takeaway Tag */}
            <div 
              style={{
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                borderRadius: '10px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: 'auto'
              }}
            >
              <Zap size={14} style={{ color: '#059669', flexShrink: 0 }} />
              <span 
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#334155'
                }}
              >
                Targeted Skill Enhancement
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillDevelopmentActionPlan;
export { SkillDevelopmentActionPlan };
