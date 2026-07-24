import React from 'react';

/**
 * MetricCard renders standard numerical metrics or labels.
 */
const MetricCard = ({ title, value, icon, description, color = 'var(--report-indigo-start)' }) => {
  return (
    <div className="report-metric-box flex flex-col justify-between" style={{ minHeight: '110px' }}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[0.62rem] font-bold text-slate-400 uppercase tracking-wider block text-left">
          {title}
        </span>
        {icon && <div style={{ color }} className="opacity-80">{icon}</div>}
      </div>
      <div className="text-left mt-1.5">
        <span 
          className="text-lg font-extrabold text-slate-800 block report-metric-number"
          style={{ color }}
        >
          {value || "Information unavailable"}
        </span>
        {description && (
          <p className="text-[0.62rem] text-slate-500 mt-1 leading-normal text-left">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
export { MetricCard };
