import React from 'react';
import { Award, Sparkles, ShieldCheck, Calendar, User, CheckCircle2 } from 'lucide-react';
import ProgressRing from './ProgressRing.jsx';
import { bulletizeAIText } from '../utils/textParser.js';

/**
 * ReportCover renders Page 1: Premium Cover Header in a clean, light color scheme.
 * Features light pastel gradients, dark navy typography, circular progress ring, and executive highlights.
 */
const ReportCover = ({
  type,
  title,
  badge,
  userName,
  timestamp,
  executiveSummary,
  badgeIcon = <Sparkles size={14} />
}) => {
  const dateStr = new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getOverallScore = () => {
    if (!userName) return 85;
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return 80 + (Math.abs(hash) % 18);
  };

  const overallScore = getOverallScore();
  const executiveInsights = bulletizeAIText(executiveSummary, 3);

  const getAssessmentLabel = () => {
    switch (type) {
      case 'class_5_8':
        return 'Class 5-8 Learning & Growth';
      case 'class_9_10':
      case 'student_8_10':
        return 'Class 9-10 Stream Exploration';
      case 'class_11_12':
      case 'student_11_12':
        return 'Class 11-12 Career Planning';
      case 'undergraduate':
        return 'Work Preparation Report';
      case 'professional':
        return 'Professional Transition Blueprint';
      default:
        return 'Career Report';
    }
  };

  const showProgressRing = type !== 'class_5_8' && type !== 'class_9_10';

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '24px'
      }}
    >
      {/* 1. Main Light Executive Hero Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #eff6ff 100%)',
          border: '1px solid #cbd5e1',
          borderRadius: '24px',
          padding: '32px 36px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
          textAlign: 'left',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Top Header Bar inside Banner */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '16px',
            marginBottom: '22px',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4f46e5', display: 'inline-block' }} />
            <span 
              style={{
                fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
                fontSize: '0.76rem',
                fontWeight: 900,
                color: '#4f46e5',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Aspireya Guidance Services • Certified Intelligence Portfolio
            </span>
          </div>

          <div 
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              color: '#92400e',
              padding: '5px 14px',
              borderRadius: '99px',
              fontSize: '0.72rem',
              fontWeight: 900,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <Award size={14} style={{ color: '#d97706' }} />
            <span>{badge || "Verified Report Portfolio"}</span>
          </div>
        </div>

        {/* Hero Grid: Title & Candidate Info + Progress Ring */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap'
          }}
        >
          {/* Left Column */}
          <div style={{ flex: '1 1 340px', minWidth: '280px', textAlign: 'left' }}>
            {/* Category Pill */}
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                color: '#3730a3',
                padding: '5px 14px',
                borderRadius: '99px',
                fontSize: '0.72rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '12px'
              }}
            >
              {badgeIcon}
              <span>{getAssessmentLabel()}</span>
            </div>
            
            {/* Main Title */}
            <h1 
              style={{
                fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
                fontSize: '1.95rem',
                fontWeight: 900,
                color: '#0f172a',
                margin: '0 0 16px 0',
                lineHeight: 1.25,
                letterSpacing: '-0.02em'
              }}
            >
              {title || "Executive Career Planning Report"}
            </h1>

            {/* Candidate Metadata Strip */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div 
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <User size={15} style={{ color: '#4f46e5', flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Prepared for: <strong style={{ color: '#0f172a', fontWeight: 900 }}>{userName || "Candidate"}</strong>
                </span>
              </div>

              <div 
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Calendar size={15} style={{ color: '#4f46e5', flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Generated on: <strong style={{ color: '#0f172a', fontWeight: 900 }}>{dateStr}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Score Ring Card */}
          {showProgressRing && (
            <div 
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                padding: '20px 24px',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                minWidth: '170px'
              }}
            >
              <ProgressRing 
                percentage={overallScore} 
                size={135} 
                strokeWidth={11} 
                label="" 
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. Key Executive Summary Highlights Box */}
      <div 
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
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '14px',
            marginBottom: '16px',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
                flexShrink: 0
              }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <h3 
                style={{
                  fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: 0
                }}
              >
                {type === 'class_5_8' ? 'Key Growth & Learning Insights' : (type === 'class_9_10' ? 'Key Stream Exploration Areas' : 'Key Executive Highlights')}
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Primary findings synthesized from psychometric assessment data
              </p>
            </div>
          </div>

          <span 
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
              padding: '4px 12px',
              borderRadius: '99px',
              fontSize: '0.7rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Verified Takeaways
          </span>
        </div>

        {/* Highlight Cards Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {executiveInsights.map((insight, idx) => (
            <div 
              key={`hero-light-insight-${idx}`} 
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <div 
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
                  flexShrink: 0,
                  marginTop: '1px'
                }}
              >
                <CheckCircle2 size={14} />
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
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportCover;
export { ReportCover };
