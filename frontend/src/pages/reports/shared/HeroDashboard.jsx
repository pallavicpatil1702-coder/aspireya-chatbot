import React from 'react';
import { 
  Sparkles, 
  Brain, 
  BookOpen, 
  Heart, 
  Award,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import DashboardCard from './DashboardCard.jsx';
import ProgressRing from './ProgressRing.jsx';

/**
 * HeroDashboard surfaces the key diagnostic metrics immediately following the cover page.
 * Conforms to the Visual Density and 60-word limits rules.
 */
const HeroDashboard = ({
  overallScore = 85,
  topCareer = "Software Engineer",
  personalityType = "Analytical & Investigative",
  learningStyle = "Visual / Self-paced",
  interestType = "Investigative (RIASEC)",
  confidenceLevel = 92
}) => {
  return (
    <div className="report-full-width report-animate-fade-in mb-8">
      <h3 className="report-heading-2 mb-6 flex items-center gap-2">
        <Sparkles size={20} className="text-indigo-600 animate-pulse" />
        <span>Executive Talent & Career Dashboard</span>
      </h3>

      <div className="report-page-grid">
        
        {/* Overall Score DashboardCard */}
        <DashboardCard 
          title="Potential Fit Score" 
          detail="Combined matching index across cognitive traits and career matrices."
        >
          <div className="flex justify-center p-2">
            <ProgressRing percentage={overallScore} size={90} strokeWidth={8} />
          </div>
        </DashboardCard>

        {/* Top Career Match DashboardCard */}
        <DashboardCard 
          title="Primary Career Recommendation" 
          value={topCareer}
          icon={<Award size={20} />}
          detail="Your highest-matched career profile based on vocational interest vectors."
          badgeText="90%+ Compatibility"
        />

        {/* Personality Alignment DashboardCard */}
        <DashboardCard 
          title="Dominant Personality Trait" 
          value={personalityType}
          icon={<Brain size={20} />}
          detail="Key behavioral features influencing your work environment choices."
        />

        {/* Learning Style DashboardCard */}
        <DashboardCard 
          title="Cognitive Learning Style" 
          value={learningStyle}
          icon={<BookOpen size={20} />}
          detail="Preferred study and data ingestion workflows for maximum retention."
        />

        {/* RIASEC Interest Profile DashboardCard */}
        <DashboardCard 
          title="Primary Vocational Interest" 
          value={interestType}
          icon={<Heart size={20} />}
          detail="Dominant category reflecting your core professional interests."
        />

        {/* Confidence/Reliability Score DashboardCard */}
        <DashboardCard 
          title="Assessment Confidence Level" 
          detail="Response consistency score indicating high profile accuracy."
        >
          <div className="flex flex-col gap-2 p-1">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Calibration index</span>
              <span className="report-metric-number">{confidenceLevel}%</span>
            </div>
            <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden w-full">
              <div 
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${confidenceLevel}%`, transition: 'width 0.8s ease-out' }}
              ></div>
            </div>
          </div>
        </DashboardCard>

      </div>
    </div>
  );
};

export default HeroDashboard;
export { HeroDashboard };
