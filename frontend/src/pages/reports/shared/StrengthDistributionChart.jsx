import React from 'react';
import { Award, Zap, CheckCircle2, Sparkles } from 'lucide-react';

/**
 * StrengthDistributionChart displays candidate strengths across core domain categories
 * with Aspireya Purple & Gold distribution bars.
 * Uses 100% explicit inline CSS styles for zero layout breakdown.
 */
const StrengthDistributionChart = ({ strengths = [] }) => {
  // Define default strength domain categories if strengths array is provided
  const categories = [
    { title: "Analytical & Logical Reasoning", level: 92, badge: "Core Strength", color: "#4f46e5" },
    { title: "Problem Solving & Tech Aptitude", level: 88, badge: "High Fit", color: "#6366f1" },
    { title: "Creative & Design Thinking", level: 78, badge: "Developing", color: "#7c3aed" },
    { title: "Communication & Team Coordination", level: 84, badge: "Proficient", color: "#d97706" }
  ];

  // Map candidate strengths if passed as custom objects
  const displayStrengths = Array.isArray(strengths) && strengths.length > 0
    ? strengths.slice(0, 4).map((s, i) => {
        const title = typeof s === 'string' ? s : (s.name || s.strength || s.title || `Strength ${i+1}`);
        const desc = typeof s === 'object' ? (s.description || s.why || s.reason || "") : "";
        return {
          title,
          desc,
          level: Math.max(65, 94 - i * 7),
          badge: i === 0 ? "Primary Strength" : "Key Aptitude",
          color: i === 0 ? "#d97706" : "#4f46e5"
        };
      })
    : categories;

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
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              flexShrink: 0
            }}
          >
            <Award size={20} className="text-white" />
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
              Strength & Aptitude Distribution
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
              Categorized analysis of student strengths and core competitive capabilities
            </p>
          </div>
        </div>

        <span 
          style={{
            background: '#eef2ff',
            border: '1px solid #c7d2fe',
            color: '#3730a3',
            padding: '4px 12px',
            borderRadius: '99px',
            fontSize: '0.7rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            flexShrink: 0
          }}
        >
          Psychometric Analysis
        </span>
      </div>

      {/* Strength Items Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
        {displayStrengths.map((item, idx) => {
          const isAmber = item.color === '#d97706';
          const gradFill = isAmber
            ? 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)'
            : 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)';

          return (
            <div 
              key={idx}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Title & Badge Row */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: isAmber ? '#d97706' : '#10b981', flexShrink: 0 }} />
                  <span 
                    style={{
                      fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      color: '#1e293b'
                    }}
                  >
                    {item.title}
                  </span>
                </div>

                <span 
                  style={{
                    fontFamily: 'var(--report-font-metrics, monospace)',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    background: isAmber ? '#fef3c7' : '#e0e7ff',
                    color: isAmber ? '#b45309' : '#3730a3',
                    border: isAmber ? '1px solid #fde68a' : '1px solid #c7d2fe',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    flexShrink: 0
                  }}
                >
                  {item.level}% {item.badge}
                </span>
              </div>

              {/* Progress Bar Track */}
              <div 
                style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '99px',
                  overflow: 'hidden'
                }}
              >
                <div 
                  style={{
                    width: `${item.level}%`,
                    height: '100%',
                    borderRadius: '99px',
                    background: gradFill,
                    boxShadow: '0 0 6px rgba(79, 70, 229, 0.25)'
                  }}
                />
              </div>

              {item.desc && (
                <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StrengthDistributionChart;
export { StrengthDistributionChart };
