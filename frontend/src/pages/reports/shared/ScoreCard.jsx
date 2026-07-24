import React from 'react';

/**
 * ScoreCard renders a trait score label and a horizontal progress bar capsule.
 */
const ScoreCard = ({ label, percentage, color = 'var(--color-primary)', subtitle = "" }) => {
  const safePercentage = Math.min(100, Math.max(0, Number(percentage) || 0));

  return (
    <div className="mb-5 w-full">
      <div className="flex justify-between items-end text-xs font-bold mb-1.5">
        <span 
          style={{ fontFamily: 'var(--report-font-heading)', color: 'var(--report-text-primary)' }}
        >
          {label}
        </span>
        <span 
          className="report-metric-number"
          style={{ color: color === 'var(--color-primary)' ? 'var(--report-indigo-start)' : color, fontSize: '0.85rem' }}
        >
          {safePercentage}%
        </span>
      </div>
      
      <div 
        className="bg-slate-100 h-3 rounded-full overflow-hidden w-full"
        style={{ border: '1px solid rgba(226, 232, 240, 0.5)' }}
      >
        <div 
          className="h-full rounded-full" 
          style={{ 
            width: `${safePercentage}%`, 
            background: color === 'var(--color-primary)' ? 'var(--report-purple-grad)' : color,
            boxShadow: '0 0 8px rgba(79, 70, 229, 0.2)',
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        ></div>
      </div>
      {subtitle && (
        <p className="text-[0.7rem] text-slate-500 mt-1 leading-normal" style={{ fontFamily: 'var(--report-font-body)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default ScoreCard;
export { ScoreCard };
