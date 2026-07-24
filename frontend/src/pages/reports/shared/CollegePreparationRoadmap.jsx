import React from 'react';
import { Calendar, Clock, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

/**
 * CollegePreparationRoadmap renders an executive, soft light-themed roadmap pathway.
 * Designed with a soft pastel palette, gentle timeline connectors, and clear milestone cards.
 */
const CollegePreparationRoadmap = ({ roadmap = [] }) => {
  // Pre-configured light pastel executive phase metadata
  const defaultPhases = [
    {
      phase: "01",
      timeframe: "Days 1 – 30 | Month 1",
      label: "FOUNDATION",
      title: "Core Academics & Syllabus Mastery",
      desc: "Consolidate Class 12 board preparation focusing on core subject weightage and fundamental concept clarity.",
      milestones: [
        "Complete high-weightage syllabus topics and concept reviews",
        "Maintain academic GPA consistency across term evaluations"
      ],
      badgeBg: "#eef2ff",
      badgeBorder: "#c7d2fe",
      badgeColor: "#3730a3",
      accentColor: "#4f46e5"
    },
    {
      phase: "02",
      timeframe: "Days 31 – 90 | Months 2 – 3",
      label: "PREPARATION",
      title: "Entrance Exam Preparation & Mock Drills",
      desc: "Structured preparation for national entrance examinations (CUET-UG, JEE Main, NEET, or IPMAT) through timed mock tests.",
      milestones: [
        "Solve 5-year entrance question papers & timed sample assessments",
        "Target performance gaps through focused subject revision"
      ],
      badgeBg: "#faf5ff",
      badgeBorder: "#e9d5ff",
      badgeColor: "#6b21a8",
      accentColor: "#7c3aed"
    },
    {
      phase: "03",
      timeframe: "Days 91 – 180 | Months 4 – 6",
      label: "STRATEGY",
      title: "College Selection & Application Filings",
      desc: "Research target accredited universities, evaluate previous year cutoff trends, and submit online applications.",
      milestones: [
        "Shortlist top 5 accredited universities offering BTech, BBA, BCom, or CA programs",
        "Compile transcripts, recommendation letters, and Statement of Purpose"
      ],
      badgeBg: "#f0f9ff",
      badgeBorder: "#bae6fd",
      badgeColor: "#0369a1",
      accentColor: "#0284c7"
    },
    {
      phase: "04",
      timeframe: "Days 181 – 365 | Months 7 – 12",
      label: "ADMISSION",
      title: "Counseling, Seat Allocation & Enrollment",
      desc: "Participate in central counseling rounds, verify admission credentials, and complete final campus onboarding.",
      milestones: [
        "Attend seat allocation counseling sessions for target programs",
        "Complete fee submission, hostel allocation, and campus orientation"
      ],
      badgeBg: "#ecfdf5",
      badgeBorder: "#a7f3d0",
      badgeColor: "#047857",
      accentColor: "#059669"
    }
  ];

  // Map incoming roadmap array
  const phases = (roadmap && roadmap.length > 0)
    ? roadmap.map((step, idx) => {
        const defaultData = defaultPhases[idx % defaultPhases.length];
        const numStr = String(idx + 1).padStart(2, '0');
        return {
          phase: numStr,
          timeframe: defaultData.timeframe,
          label: defaultData.label,
          title: step.includes(':') ? step.split(':')[0] : `Phase ${numStr} Milestone`,
          desc: step.includes(':') ? step.split(':')[1] : step,
          milestones: defaultData.milestones,
          badgeBg: defaultData.badgeBg,
          badgeBorder: defaultData.badgeBorder,
          badgeColor: defaultData.badgeColor,
          accentColor: defaultData.accentColor
        };
      })
    : defaultPhases;

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
      {/* Soft Light Header Section */}
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
              background: '#eef2ff',
              border: '1px solid #c7d2fe',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Calendar size={20} />
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
              College Preparation Roadmap
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
              Structured multi-phase execution timeline with explicit day durations
            </p>
          </div>
        </div>

        <span 
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            color: '#475569',
            padding: '4px 12px',
            borderRadius: '99px',
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0
          }}
        >
          <ShieldCheck size={14} style={{ color: '#4f46e5' }} />
          Structured Roadmap
        </span>
      </div>

      {/* Light Soft Stepper Timeline */}
      <div 
        style={{
          position: 'relative',
          paddingLeft: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Soft Vertical Connecting Line */}
        <div 
          style={{
            position: 'absolute',
            left: '17px',
            top: '20px',
            bottom: '30px',
            width: '2px',
            background: '#e2e8f0',
            borderRadius: '99px'
          }}
        />

        {phases.map((p, idx) => (
          <div 
            key={`light-phase-${idx}`}
            style={{
              position: 'relative',
              width: '100%'
            }}
          >
            {/* Soft Numbered Stepper Badge */}
            <div 
              style={{
                position: 'absolute',
                left: '-40px',
                top: '16px',
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: '#ffffff',
                border: `2px solid ${p.accentColor}`,
                color: p.accentColor,
                fontSize: '0.8rem',
                fontWeight: 900,
                fontFamily: 'var(--report-font-metrics, monospace)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
                zIndex: 2,
                transform: 'translateX(-50%)'
              }}
            >
              {p.phase}
            </div>

            {/* Phase Content Box */}
            <div 
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
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
                  gap: '12px',
                  width: '100%',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span 
                    style={{
                      background: p.badgeBg,
                      border: `1px solid ${p.badgeBorder}`,
                      color: p.badgeColor,
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em'
                    }}
                  >
                    {p.label}
                  </span>

                  <h4 
                    style={{
                      fontFamily: 'var(--report-font-heading, "Montserrat", sans-serif)',
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: 0
                    }}
                  >
                    {p.title}
                  </h4>
                </div>

                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    fontFamily: 'var(--report-font-metrics, monospace)',
                    flexShrink: 0
                  }}
                >
                  <Clock size={13} style={{ color: p.accentColor }} />
                  <span>{p.timeframe}</span>
                </div>
              </div>

              {/* Description */}
              <p 
                style={{
                  fontSize: '0.84rem',
                  color: '#475569',
                  lineHeight: 1.6,
                  margin: 0
                }}
              >
                {p.desc}
              </p>

              {/* Action Milestones Box */}
              {p.milestones && p.milestones.length > 0 && (
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '10px',
                    width: '100%',
                    marginTop: '2px'
                  }}
                >
                  {p.milestones.map((m, mIdx) => (
                    <div 
                      key={`light-m-${mIdx}`} 
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <CheckCircle2 size={15} style={{ color: p.accentColor, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.78rem', color: '#1e293b', fontWeight: 600, lineHeight: 1.4 }}>
                        {m}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegePreparationRoadmap;
export { CollegePreparationRoadmap };
