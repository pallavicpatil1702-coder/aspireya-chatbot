import React from 'react';
import { PieChart as PieIcon, Sparkles } from 'lucide-react';

/**
 * RadarChart component converted to a modern, highly-attractive SVG Pie / Donut Chart.
 * Uses robust SVG arcs, vibrant gradients, and a clean legend.
 */
const RadarChart = ({ userTraits = {} }) => {
  const traitEntries = Object.entries(userTraits);

  if (!userTraits || traitEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl min-h-[250px] text-center w-full">
        <span style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📊</span>
        <h4 className="font-bold text-slate-700 mb-1" style={{ fontFamily: 'var(--report-font-heading)' }}>
          Information unavailable
        </h4>
        <p className="text-xs text-slate-500 text-center max-w-[260px]">
          Psychometric interest matrix requires completing all assessment sections.
        </p>
      </div>
    );
  }

  // Format key names cleanly
  const formatTraitName = (rawName) => {
    if (!rawName) return "Cognitive Trait";
    return rawName
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  // Take top 6 traits
  const rawTraits = traitEntries.slice(0, 6);
  while (rawTraits.length < 6) {
    rawTraits.push([`Domain ${rawTraits.length + 1}`, 3]);
  }

  const traits = rawTraits.map(([name, score], idx) => {
    const scoreVal = Math.min(5, Math.max(0, Number(score) || 0));
    const percentage = Math.round((scoreVal / 5) * 100);
    return {
      id: idx + 1,
      name: formatTraitName(name),
      score: scoreVal,
      percentage: Math.max(10, Math.min(100, percentage))
    };
  });

  const colors = [
    { start: '#4f46e5', end: '#7c3aed', fill: 'url(#pieGrad0)' },
    { start: '#6366f1', end: '#a855f7', fill: 'url(#pieGrad1)' },
    { start: '#3b82f6', end: '#06b6d4', fill: 'url(#pieGrad2)' },
    { start: '#10b981', end: '#059669', fill: 'url(#pieGrad3)' },
    { start: '#f59e0b', end: '#d97706', fill: 'url(#pieGrad4)' },
    { start: '#ec4899', end: '#8b5cf6', fill: 'url(#pieGrad5)' }
  ];

  // Calculate sum of scores for pie slices
  const totalScore = traits.reduce((sum, t) => sum + t.percentage, 0) || 1;

  // Pie Chart Geometry
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 138;
  const innerR = 78;

  let currentAngle = -Math.PI / 2; // Start top 12 o'clock

  const slices = traits.map((t, idx) => {
    const sliceAngle = (t.percentage / totalScore) * (2 * Math.PI);
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    // Start & End outer arc points
    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);

    // Inner arc points
    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');

    return {
      ...t,
      pathData,
      color: colors[idx % colors.length]
    };
  });

  return (
    <div 
      className="flex flex-col md:flex-row items-center justify-center gap-8 w-full text-left"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        width: '100%',
        boxSizing: 'border-box',
        flexWrap: 'wrap'
      }}
    >
      {/* SVG Donut / Pie Chart */}
      <div 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: 'relative',
          flexShrink: 0
        }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            {colors.map((c, idx) => (
              <linearGradient id={`pieGrad${idx}`} key={idx} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={c.start} />
                <stop offset="100%" stopColor={c.end} />
              </linearGradient>
            ))}
            <filter id="pieGlow">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Pie Slices */}
          {slices.map((slice, idx) => (
            <path
              key={idx}
              d={slice.pathData}
              fill={slice.color.fill}
              stroke="#ffffff"
              strokeWidth="3"
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            />
          ))}

          {/* Center Donut Label */}
          <circle cx={cx} cy={cy} r={innerR - 4} fill="#ffffff" />
          <text
            x={cx}
            y={cy - 7}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontSize: '13px',
              fontWeight: 800,
              fill: '#0f172a',
              fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
              letterSpacing: '0.05em'
            }}
          >
            PSYCHOMETRIC
          </text>
          <text
            x={cx}
            y={cy + 11}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontSize: '11px',
              fontWeight: 800,
              fill: '#4f46e5',
              fontFamily: 'var(--report-font-metrics, monospace)',
              letterSpacing: '0.06em'
            }}
          >
            FIT MATRIX
          </text>
        </svg>
      </div>

      {/* Legend List Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          flex: '1 1 300px',
          width: '100%',
          minWidth: '200px'
        }}
      >
        {slices.map((slice, idx) => (
          <div 
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '8px 12px',
              borderRadius: '10px',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <span 
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${slice.color.start}, ${slice.color.end})`,
                  flexShrink: 0
                }}
              />
              <span 
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#334155',
                  fontFamily: 'var(--report-font-heading, sans-serif)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {slice.name}
              </span>
            </div>
            <span 
              style={{
                fontSize: '0.75rem',
                fontWeight: 900,
                color: slice.color.start,
                fontFamily: 'var(--report-font-metrics, monospace)',
                flexShrink: 0
              }}
            >
              {slice.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadarChart;
export { RadarChart };
