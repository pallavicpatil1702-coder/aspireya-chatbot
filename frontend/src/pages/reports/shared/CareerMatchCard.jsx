import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Cpu, 
  Compass, 
  Briefcase, 
  Terminal, 
  Stethoscope, 
  Scale, 
  Coins, 
  GraduationCap,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const MiniBadge = ({ text }) => (
  <span style={{
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(79, 70, 229, 0.2)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    padding: '6px 12px',
    borderRadius: '99px',
    fontSize: '0.7rem',
    color: 'var(--report-indigo-start)',
    fontWeight: '700',
    letterSpacing: '0.05em'
  }}>
    {text}
  </span>
);

/**
 * CareerMatchCard displays a comprehensive visual card for matched career paths.
 * Pure Vanilla CSS version to avoid Tailwind dependencies.
 */
const CareerMatchCard = ({
  rank,
  title,
  matchPercentage,
  badgeText,
  tags = [],
  scoreColor = 'var(--report-indigo-start)',
  salaryPotential,
  futureDemand,
  aiAutomationRisk,
  skillGapAnalysis
}) => {
  const safePercentage = Math.min(100, Math.max(0, Number(matchPercentage) || 0));

  const getCareerInfo = (careerTitle) => {
    const t = (careerTitle || "").toLowerCase();
    if (t.includes("software") || t.includes("computer") || t.includes("ai") || t.includes("data") || t.includes("developer")) {
      return { icon: <Terminal size={22} color="#2563eb" />, bg: "#eff6ff", border: "#bfdbfe" };
    }
    if (t.includes("doctor") || t.includes("medical") || t.includes("surgeon") || t.includes("healthcare") || t.includes("dentist") || t.includes("psychologist")) {
      return { icon: <Stethoscope size={22} color="#e11d48" />, bg: "#fff1f2", border: "#fecdd3" };
    }
    if (t.includes("finance") || t.includes("cfo") || t.includes("accounting") || t.includes("investment") || t.includes("bank")) {
      return { icon: <Coins size={22} color="#d97706" />, bg: "#fffbeb", border: "#fde68a" };
    }
    if (t.includes("law") || t.includes("lawyer") || t.includes("counsel") || t.includes("legal")) {
      return { icon: <Scale size={22} color="#334155" />, bg: "#f8fafc", border: "#cbd5e1" };
    }
    if (t.includes("manager") || t.includes("consultant") || t.includes("analyst") || t.includes("business")) {
      return { icon: <Briefcase size={22} color="#059669" />, bg: "#ecfdf5", border: "#a7f3d0" };
    }
    if (t.includes("educator") || t.includes("teacher") || t.includes("professor") || t.includes("academic")) {
      return { icon: <GraduationCap size={22} color="#7c3aed" />, bg: "#f5f3ff", border: "#ddd6fe" };
    }
    return { icon: <Compass size={22} color="var(--report-indigo-start)" />, bg: "#eef2ff", border: "#c7d2fe" };
  };

  const careerInfo = getCareerInfo(title);

  return (
    <div className="report-card-premium report-animate-fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      minHeight: '340px',
      padding: '0',
      overflow: 'hidden',
      width: '100%'
    }}>
      {/* Top Gradient Line handled by ::before in CSS */}
      
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', width: '100%' }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              width: '48px', height: '48px', flexShrink: 0,
              backgroundColor: careerInfo.bg, border: `1px solid ${careerInfo.border}`, 
              borderRadius: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' 
            }}>
              {careerInfo.icon}
            </div>
            <div style={{ flex: 1, paddingTop: '2px' }}>
              {rank && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Sparkles size={12} color="#f59e0b" />
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--report-indigo-start)', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
                    Top Match #{rank}
                  </span>
                </div>
              )}
              <h3 className="report-heading-3" style={{ margin: 0, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                {title || "Information unavailable"}
              </h3>
            </div>
          </div>
          {badgeText && (
            <span className="report-badge-capsule" style={{ flexShrink: 0 }}>
              {badgeText}
            </span>
          )}
        </div>

        {/* Alignment Score Bar */}
        <div style={{ backgroundColor: 'rgba(248, 250, 252, 0.5)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(226, 232, 240, 0.8)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--report-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Alignment Score</span>
            <span className="report-metric-number" style={{ fontSize: '1.1rem', color: 'var(--report-indigo-start)', lineHeight: 1 }}>
              {safePercentage}%
            </span>
          </div>
          <div style={{ backgroundColor: 'rgba(226, 232, 240, 0.6)', height: '10px', borderRadius: '99px', overflow: 'hidden', width: '100%', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ 
              height: '100%', borderRadius: '99px', 
              width: `${safePercentage}%`, 
              background: 'var(--report-purple-grad)'
            }}></div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="report-metrics-row" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', marginTop: 'auto' }}>
          {/* Salary block */}
          <div className="report-metric-box" style={{ padding: '12px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--report-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <div style={{ background: '#ecfdf5', padding: '4px', borderRadius: '6px' }}>
                <DollarSign size={12} color="#059669" />
              </div>
              <span>Compensation</span>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--report-text-primary)' }}>
              {salaryPotential?.entry || salaryPotential?.mid || "₹5 - ₹8 LPA"}
            </span>
          </div>

          {/* Future Demand block */}
          <div className="report-metric-box" style={{ padding: '12px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--report-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <div style={{ background: '#eff6ff', padding: '4px', borderRadius: '6px' }}>
                <TrendingUp size={12} color="#2563eb" />
              </div>
              <span>Future Demand</span>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--report-text-primary)' }}>
              {futureDemand?.outlook || "High Growth"} 
            </span>
          </div>

          {/* AI automation index */}
          {aiAutomationRisk && (
            <div className="report-metric-box" style={{ gridColumn: 'span 2', padding: '12px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--report-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <div style={{ background: '#fffbeb', padding: '4px', borderRadius: '6px' }}>
                  <Cpu size={12} color="#d97706" />
                </div>
                <span>AI Automation Vulnerability</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--report-text-primary)' }}>
                  {aiAutomationRisk.level || "Low"} Risk
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--report-text-muted)', backgroundColor: 'rgba(241, 245, 249, 0.8)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                  {aiAutomationRisk.percentage}% exposure
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Skills Tags */}
        <div>
          {skillGapAnalysis?.requiredSkills && skillGapAnalysis.requiredSkills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skillGapAnalysis.requiredSkills.slice(0, 3).map((sk, skIdx) => (
                <MiniBadge key={skIdx} text={sk} />
              ))}
            </div>
          )}
          {!skillGapAnalysis?.requiredSkills && tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tags.map((tag, idx) => (
                <MiniBadge key={idx} text={tag} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Explore indicators */}
      <div style={{ 
        backgroundColor: 'rgba(248, 250, 252, 0.8)', padding: '14px 24px', 
        borderTop: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', 
        justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--report-indigo-start)', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Verify Requirements <ChevronRight size={14} />
        </span>
        <span style={{ fontSize: '0.65rem', backgroundColor: '#fff', color: 'var(--report-indigo-start)', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(79, 70, 229, 0.15)', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          Active Track
        </span>
      </div>
    </div>
  );
};

export default CareerMatchCard;
export { CareerMatchCard };

