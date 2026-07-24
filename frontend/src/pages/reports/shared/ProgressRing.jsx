import React from 'react';

/**
 * ProgressRing renders a high-end, executive circular progress ring using SVG
 * with absolute HTML centered text overlay to guarantee clean score rendering.
 */
const ProgressRing = ({ 
  percentage, 
  size = 140, 
  strokeWidth = 12, 
  label = "Overall Match" 
}) => {
  const safePercentage = Math.min(100, Math.max(0, Number(percentage) || 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  // Determine dynamic match status tag
  const getMatchTag = (val) => {
    if (val >= 85) {
      return { text: "Excellent Match", bg: "#ecfdf5", border: "#a7f3d0", color: "#047857" };
    }
    if (val >= 75) {
      return { text: "Strong Alignment", bg: "#eef2ff", border: "#c7d2fe", color: "#3730a3" };
    }
    return { text: "Moderate Alignment", bg: "#fffbeb", border: "#fde68a", color: "#92400e" };
  };

  const matchTag = getMatchTag(safePercentage);
  const gradientId = `ring-grad-${Math.round(size)}-${safePercentage}`;

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div 
        style={{ 
          position: 'relative',
          width: `${size}px`, 
          height: `${size}px`,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg 
          width={size} 
          height={size}
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            display: 'block',
            overflow: 'visible'
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Rotated Circle Track starting at top (12 o'clock) */}
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {/* Background Track */}
            <circle
              stroke="#f1f5f9"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            {/* Foreground Gradient Path */}
            <circle
              stroke={`url(#${gradientId})`}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              r={radius}
              cx={size / 2}
              cy={size / 2}
              filter={`url(#glow-${gradientId})`}
              style={{ 
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </g>
        </svg>

        {/* Absolute Centered HTML Text Overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        >
          <span 
            style={{ 
              fontSize: `${Math.round(size * 0.24)}px`,
              fontWeight: 900,
              color: '#0f172a',
              fontFamily: 'var(--report-font-metrics, "Montserrat", sans-serif)',
              lineHeight: 1
            }}
          >
            {safePercentage}%
          </span>
          <span 
            style={{ 
              fontSize: `${Math.round(size * 0.085)}px`,
              fontWeight: 800,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: '3px'
            }}
          >
            Match Score
          </span>
        </div>
      </div>

      {/* Dynamic Match Status Pill Tag */}
      <span 
        style={{
          background: matchTag.bg,
          border: `1px solid ${matchTag.border}`,
          color: matchTag.color,
          padding: '4px 12px',
          borderRadius: '99px',
          fontSize: '0.72rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {matchTag.text}
      </span>

      {label && (
        <span 
          style={{ 
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#475569',
            textAlign: 'center',
            fontFamily: 'var(--report-font-heading, sans-serif)',
            maxWidth: '140px',
            lineHeight: 1.3
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default ProgressRing;
export { ProgressRing };
