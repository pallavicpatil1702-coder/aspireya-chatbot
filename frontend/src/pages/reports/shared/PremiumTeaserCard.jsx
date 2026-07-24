import React from 'react';
import { Lock } from 'lucide-react';

/**
 * PremiumTeaserCard represents a blurred gated section in the Free Report.
 * Contains no actual sensitive user data, showing a mock layout instead.
 */
const PremiumTeaserCard = ({ title = "Section Detail", sectionType = "roadmap" }) => {
  return (
    <div className="report-card-premium report-full-width" style={{ minHeight: '260px', overflow: 'hidden' }}>
      <h3 className="report-heading-3 mb-6 flex items-center gap-2" style={{ color: 'var(--report-text-muted)' }}>
        <span>{title}</span>
      </h3>
      
      {/* Blurred background mockup elements */}
      <div className="select-none pointer-events-none opacity-20 filter blur-xs" style={{ userSelect: 'none' }}>
        {sectionType === 'roadmap' && (
          <div className="report-timeline-track">
            <div className="report-timeline-card">
              <h4 className="font-bold mb-1">Week 1: Core Exploration Phase</h4>
              <div style={{ height: '8px', background: '#cbd5e1', width: '70%', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div style={{ height: '8px', background: '#e2e8f0', width: '90%', borderRadius: '4px' }}></div>
            </div>
            <div className="report-timeline-card">
              <h4 className="font-bold mb-1">Week 2: Advanced Concept Masterclass</h4>
              <div style={{ height: '8px', background: '#cbd5e1', width: '50%', borderRadius: '4px' }}></div>
            </div>
          </div>
        )}

        {sectionType === 'skills' && (
          <div className="grid grid-cols-2 gap-4">
            <div style={{ background: '#f1f5f9', height: '60px', borderRadius: '12px', padding: '12px' }}>
              <div style={{ height: '10px', background: '#cbd5e1', width: '40%', borderRadius: '2px', marginBottom: '8px' }}></div>
              <div style={{ height: '6px', background: '#e2e8f0', width: '80%', borderRadius: '2px' }}></div>
            </div>
            <div style={{ background: '#f1f5f9', height: '60px', borderRadius: '12px', padding: '12px' }}>
              <div style={{ height: '10px', background: '#cbd5e1', width: '60%', borderRadius: '2px', marginBottom: '8px' }}></div>
              <div style={{ height: '6px', background: '#e2e8f0', width: '50%', borderRadius: '2px' }}></div>
            </div>
          </div>
        )}

        {sectionType === 'guidance' && (
          <div className="report-equal-cols">
            <div className="report-card-premium report-do-card" style={{ height: '80px', padding: '12px' }}></div>
            <div className="report-card-premium report-dont-card" style={{ height: '80px', padding: '12px' }}></div>
          </div>
        )}
      </div>

      {/* Lock Gating Overlay */}
      <div className="report-premium-locked-overlay">
        <div 
          className="flex items-center justify-center" 
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            color: 'var(--report-gold-dark)',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.15)',
            marginBottom: '16px'
          }}
        >
          <Lock size={24} />
        </div>
        <h4 className="font-bold text-slate-800 mb-1" style={{ fontFamily: 'var(--report-font-heading)', fontSize: '1.05rem' }}>
          Premium Section Locked
        </h4>
        <p className="text-xs text-slate-500 max-w-[280px] leading-relaxed mb-1">
          Upgrade to unlock detailed metrics, custom roadmaps, skill analyses, and comprehensive support guidance.
        </p>
      </div>
    </div>
  );
};

export default PremiumTeaserCard;
export { PremiumTeaserCard };
