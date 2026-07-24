import React from 'react';
import { Target, Award, Sparkles } from 'lucide-react';

/**
 * CareerMatchBarChart renders a modern, highly-attractive visual index for Top Career Matches.
 * Uses robust inline CSS so it never collapses in print or headless browser rendering.
 */
const CareerMatchBarChart = ({ matchResults = [] }) => {
  if (!matchResults || matchResults.length === 0) {
    return null;
  }

  // Take top 5 items
  const items = matchResults.slice(0, 5);

  return (
    <div 
      className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm text-left w-full"
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
      {/* Header Row */}
      <div 
        className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 flex-wrap gap-3"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '16px',
          marginBottom: '20px',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '38px',
              height: '38px',
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
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h4 
              style={{
                fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                lineHeight: 1.2
              }}
            >
              Career Match Alignment Index
            </h4>
            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Comparative fit analysis across calculated psychometric dimensions
            </p>
          </div>
        </div>

        <span 
          style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            color: '#4f46e5',
            background: 'rgba(79, 70, 229, 0.08)',
            border: '1px solid rgba(79, 70, 229, 0.2)',
            padding: '4px 12px',
            borderRadius: '99px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          Top {items.length} Matches
        </span>
      </div>

      {/* Bullet Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
        {items.map((item, idx) => {
          const name = item.careerName || item.career || item.field || `Career Option ${idx + 1}`;
          const score = typeof item.matchPercentage === 'number' ? item.matchPercentage : Math.max(70, 95 - idx * 6);
          const isTopMatch = idx === 0;

          return (
            <div 
              key={idx}
              style={{
                background: isTopMatch ? 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' : '#f8fafc',
                border: isTopMatch ? '1px solid #d8b4fe' : '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Item Header Info Row */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Bullet Rank Badge */}
                  <span 
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isTopMatch 
                        ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' 
                        : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: isTopMatch ? '0 2px 8px rgba(217, 119, 6, 0.3)' : '0 2px 6px rgba(79, 70, 229, 0.2)'
                    }}
                  >
                    {idx + 1}
                  </span>

                  {/* Career Name */}
                  <span 
                    style={{
                      fontFamily: 'var(--report-font-heading, sans-serif)',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      color: '#1e293b'
                    }}
                  >
                    {name}
                  </span>

                  {/* Best Fit Badge if Rank 1 */}
                  {isTopMatch && (
                    <span 
                      style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                        fontSize: '0.62rem',
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      <Award size={11} className="text-amber-600" /> Best Fit
                    </span>
                  )}
                </div>

                {/* Score Tag */}
                <span 
                  style={{
                    fontFamily: 'var(--report-font-metrics, monospace)',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    color: isTopMatch ? '#7c3aed' : '#4f46e5',
                    background: '#ffffff',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    flexShrink: 0
                  }}
                >
                  {score}% Match
                </span>
              </div>

              {/* Progress Bar Track */}
              <div 
                style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '99px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div 
                  style={{
                    width: `${Math.min(100, Math.max(10, score))}%`,
                    height: '100%',
                    borderRadius: '99px',
                    background: isTopMatch 
                      ? 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 60%, #ff6b3d 100%)' 
                      : 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
                    transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 0 8px rgba(79, 70, 229, 0.25)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CareerMatchBarChart;
export { CareerMatchBarChart };
