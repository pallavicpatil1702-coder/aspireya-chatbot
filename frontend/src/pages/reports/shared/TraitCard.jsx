import React from 'react';
import { ShieldCheck, AlertCircle, Award } from 'lucide-react';

/**
 * TraitCard displays a specific skill, character trait, or action item.
 * Designed with a premium card layout, supporting hover animations and responsive alignment.
 */
const TraitCard = ({ 
  title, 
  subtitle, 
  variant = 'border', // 'border', 'block', or 'improvement'
  accentColor = 'var(--color-primary)',
  bgColor = '#fef3c7',
  icon
}) => {
  // Determine icon to render if none is supplied
  const defaultIcon = variant === 'improvement' 
    ? <AlertCircle size={18} className="text-amber-600" />
    : <ShieldCheck size={18} className="text-indigo-600" />;

  const displayIcon = icon || defaultIcon;

  if (variant === 'block') {
    return (
      <div 
        className="report-card-premium report-animate-fade-in" 
        style={{ 
          padding: '20px', 
          background: bgColor || 'rgba(255, 255, 255, 0.72)',
          borderLeft: `4px solid ${accentColor}`
        }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          {displayIcon}
          <h4 
            className="font-bold text-slate-800 text-sm"
            style={{ fontFamily: 'var(--report-font-heading)' }}
          >
            {title}
          </h4>
        </div>
        {subtitle && (
          <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: 'var(--report-font-body)' }}>
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  // default 'border' / standard outline card style
  return (
    <div 
      className="report-card-premium report-animate-fade-in" 
      style={{ 
        padding: '24px',
        borderLeft: `4px solid ${accentColor}`
      }}
    >
      <div className="flex items-center gap-2.5 mb-2">
        {displayIcon}
        <h4 
          className="font-bold text-slate-800 text-sm"
          style={{ fontFamily: 'var(--report-font-heading)' }}
        >
          {title}
        </h4>
      </div>
      {subtitle && (
        <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: 'var(--report-font-body)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default TraitCard;
export { TraitCard };
