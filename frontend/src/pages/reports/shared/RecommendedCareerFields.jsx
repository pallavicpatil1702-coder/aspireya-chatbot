import React from 'react';
import { Compass, Sparkles, CheckCircle2, Award, ArrowUpRight } from 'lucide-react';

/**
 * RecommendedCareerFields renders candidate recommended career fields in a 3-column grid layout.
 * Uses 100% explicit inline CSS styles for zero layout collapse across all print/PDF modes.
 */
const RecommendedCareerFields = ({ careerFields = [] }) => {
  if (!careerFields || careerFields.length === 0) return null;

  // Color schemes for top 3 fields
  const cardAccents = [
    {
      badgeGrad: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      fitTagBg: '#fef3c7',
      fitTagBorder: '#fde68a',
      fitTagColor: '#92400e',
      fitText: '★ Top Recommendation'
    },
    {
      badgeGrad: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
      fitTagBg: '#f3e8ff',
      fitTagBorder: '#e9d5ff',
      fitTagColor: '#6b21a8',
      fitText: 'High Fit Match'
    },
    {
      badgeGrad: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      fitTagBg: '#e0f2fe',
      fitTagBorder: '#bae6fd',
      fitTagColor: '#0369a1',
      fitText: 'Strong Opportunity'
    }
  ];

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
            <Compass size={20} className="text-white" />
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
              Recommended Career Fields
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
              Top-aligned career pathways curated based on your psychometric profile and aptitude
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
        {careerFields.map((field, idx) => {
          const accent = cardAccents[idx % cardAccents.length];

          return (
            <div 
              key={`field-col-${idx}`}
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
                {/* Badge & Fit Pill Row */}
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
                      background: accent.badgeGrad,
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      flexShrink: 0
                    }}
                  >
                    #{idx + 1}
                  </div>

                  <span 
                    style={{
                      fontFamily: 'var(--report-font-metrics, monospace)',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      background: accent.fitTagBg,
                      border: `1px solid ${accent.fitTagBorder}`,
                      color: accent.fitTagColor,
                      padding: '3px 10px',
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      flexShrink: 0
                    }}
                  >
                    {accent.fitText}
                  </span>
                </div>

                {/* Heading */}
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
                  {field.field}
                </h4>

                {/* Description */}
                <p 
                  style={{
                    fontSize: '0.82rem',
                    color: '#475569',
                    lineHeight: 1.6,
                    margin: 0
                  }}
                >
                  {field.whyMatches}
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
                <CheckCircle2 size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                <span 
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#334155'
                  }}
                >
                  High Alignment Pathway
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedCareerFields;
export { RecommendedCareerFields };
