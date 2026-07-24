import React, { useState } from 'react';
import { Brain, Zap, Sparkles, Award, CheckCircle2, ChevronDown, ChevronUp, Star, ShieldCheck } from 'lucide-react';

/**
 * PsychometricTraitInsights renders an ultra-clean, student-friendly 5-Competency summary.
 * Avoids showing 16+ overwhelming bar cards at once. Provides a clear, attractive overview.
 */
const PsychometricTraitInsights = ({ userTraits = {} }) => {
  const [showAll, setShowAll] = useState(false);
  const traitEntries = Object.entries(userTraits);

  if (!userTraits || traitEntries.length === 0) return null;

  // Trait student-friendly descriptions dictionary
  const traitDescriptions = {
    numericalAbility: "Strong analytical capability with numbers, financial logic, and quantitative data.",
    problemSolving: "High capacity to deconstruct complex challenges and formulate logical solutions.",
    innovation: "Creative thinking with a natural drive to design novel processes and fresh ideas.",
    learningAbility: "Quick adaptation and high comprehension rate when acquiring new skills.",
    communication: "Articulate expression and effective teamwork collaboration capabilities.",
    logicalReasoning: "Systematic step-by-step thinking for structured decision-making.",
    analyticalThinking: "Deep evaluation of structured information and evidence-based insights.",
    planning: "Exceptional organizational skills for managing timelines and project goals.",
    leadership: "Natural ability to guide teams, make decisions, and drive results.",
    creativity: "Out-of-the-box thinking for innovative problem solving and design.",
    attentionToDetail: "Precision-oriented approach ensuring high accuracy in execution.",
    digitalLiteracy: "Aptitude for adopting new technology tools and software systems."
  };

  const formatTraitName = (rawName) => {
    if (!rawName) return "Competency";
    return rawName
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  // Convert traits into clean objects
  const allTraits = traitEntries.map(([name, score]) => {
    const numScore = typeof score === 'number' ? Math.min(5, Math.max(0, score)) : 0;
    const formattedName = formatTraitName(name);

    let ratingLabel = "Proficient";
    let badgeBg = "#e0e7ff";
    let badgeColor = "#3730a3";
    let iconColor = "#4f46e5";

    if (numScore >= 4.0) {
      ratingLabel = "Top Strength";
      badgeBg = "#ecfdf5";
      badgeColor = "#047857";
      iconColor = "#10b981";
    } else if (numScore < 3.0) {
      ratingLabel = "Developing";
      badgeBg = "#fef3c7";
      badgeColor = "#92400e";
      iconColor = "#f59e0b";
    }

    return {
      rawName: name,
      name: formattedName,
      score: numScore,
      ratingLabel,
      badgeBg,
      badgeColor,
      iconColor,
      desc: traitDescriptions[name] || `Demonstrates solid ${formattedName.toLowerCase()} capability suited for academic success.`
    };
  });

  // Sort traits by highest score
  const sortedTraits = [...allTraits].sort((a, b) => b.score - a.score);

  // Top 5 Key Strengths to display prominently
  const top5Traits = sortedTraits.slice(0, 5);
  const displayTraits = showAll ? sortedTraits : top5Traits;

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
      {/* Header */}
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
            <Brain size={20} className="text-white" />
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
              Key Psychometric Competencies
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
              Top core cognitive & behavioral strengths tailored for career clarity
            </p>
          </div>
        </div>

        <span 
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#047857',
            padding: '4px 12px',
            borderRadius: '99px',
            fontSize: '0.7rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            flexShrink: 0
          }}
        >
          Top Capabilities
        </span>
      </div>

      {/* Clean Grid Layout */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          width: '100%'
        }}
      >
        {displayTraits.map((trait, idx) => (
          <div 
            key={`clean-trait-${idx}`}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              width: '100%',
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Card Top Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={16} style={{ color: trait.iconColor, fill: trait.iconColor, flexShrink: 0 }} />
                  <h4 
                    style={{
                      fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
                      fontSize: '0.96rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: 0
                    }}
                  >
                    {trait.name}
                  </h4>
                </div>

                <span 
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    background: trait.badgeBg,
                    color: trait.badgeColor,
                    padding: '3px 9px',
                    borderRadius: '6px',
                    fontFamily: 'var(--report-font-metrics, monospace)',
                    flexShrink: 0
                  }}
                >
                  {trait.score.toFixed(1)} / 5
                </span>
              </div>

              {/* Description */}
              <p 
                style={{
                  fontSize: '0.8rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  margin: 0
                }}
              >
                {trait.desc}
              </p>
            </div>

            {/* Progress Fill Line */}
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
              <div 
                style={{
                  width: `${Math.min(100, Math.max(10, (trait.score / 5) * 100))}%`,
                  height: '100%',
                  background: trait.iconColor,
                  borderRadius: '99px'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Expand / Collapse Button if total traits > 5 */}
      {sortedTraits.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '10px 18px',
            color: '#4f46e5',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            margin: '4px auto 0 auto',
            transition: 'all 0.2s ease'
          }}
        >
          <span>{showAll ? 'Show Top 5 Strengths Only' : `View All ${sortedTraits.length} Traits`}</span>
          {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}
    </div>
  );
};

export default PsychometricTraitInsights;
export { PsychometricTraitInsights };
