import React from 'react';

/**
 * DashboardCard represents a premium visualization card inside the Page 2 Hero Dashboard.
 * Enforces the visual density rule: max 2 lines of supporting text.
 */
const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  detail, 
  badgeText, 
  children 
}) => {
  return (
    <div 
      className="report-card-premium report-animate-fade-in flex flex-col justify-between overflow-visible" 
      style={{ 
        minHeight: 'auto',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center w-full">
          <span 
            className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-widest block"
            style={{ fontFamily: 'var(--report-font-heading)', lineHeight: '1.2' }}
          >
            {title}
          </span>
          {icon && (
            <div className="text-indigo-500 opacity-80 flex-shrink-0">
              {icon}
            </div>
          )}
        </div>
        
        {value && (
          <h2 
            className="text-2xl font-black text-slate-900 leading-tight"
            style={{ fontFamily: 'var(--report-font-heading)', margin: 0 }}
          >
            {value}
          </h2>
        )}
        
        {badgeText && (
          <div className="mt-1">
            <span className="report-badge-capsule report-badge-emerald">
              {badgeText}
            </span>
          </div>
        )}
      </div>

      <div 
        className="flex flex-col items-center justify-center w-full overflow-visible mt-4" 
        style={{ gap: '16px' }}
      >
        {children && (
          <div className="flex justify-center items-center w-full overflow-visible">
            {children}
          </div>
        )}
        {detail && (
          <p 
            className="text-[0.72rem] text-slate-500 text-center w-full" 
            style={{ 
              fontFamily: 'var(--report-font-body)', 
              lineHeight: '1.5',
              margin: 0,
              padding: 0
            }}
          >
            {detail}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
export { DashboardCard };
