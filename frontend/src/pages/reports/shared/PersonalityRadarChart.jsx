import React from 'react';
import RadarChart from './RadarChart.jsx';
import { Brain, Sparkles } from 'lucide-react';

/**
 * PersonalityRadarChart wraps the psychometric SVG RadarChart with professional metadata
 * and Aspireya Purple & Gold branding.
 */
const PersonalityRadarChart = ({ userTraits = {} }) => {
  return (
    <div 
      className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm text-left flex flex-col gap-5 w-full"
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
      {/* Premium Header Row */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9',
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
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              flexShrink: 0
            }}
          >
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h4 
              style={{
                fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                lineHeight: 1.2
              }}
            >
              Psychometric Personality & Trait Profile
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
              Multi-axial analysis of core learning preferences and cognitive traits
            </p>
          </div>
        </div>

        {/* Eye-Catching Multi-Axial Badge */}
        <span 
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            color: '#92400e',
            border: '1px solid #f59e0b',
            padding: '5px 14px',
            borderRadius: '99px',
            fontSize: '0.7rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)',
            flexShrink: 0
          }}
        >
          <Sparkles size={13} className="text-amber-700 animate-pulse" />
          <span>Multi-Axial</span>
        </span>
      </div>

      {/* Chart Section */}
      <div className="w-full flex justify-center" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <RadarChart userTraits={userTraits} />
      </div>
    </div>
  );
};

export default PersonalityRadarChart;
export { PersonalityRadarChart };
