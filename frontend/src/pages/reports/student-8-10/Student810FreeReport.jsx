import React from 'react';
import { Brain, Heart, Compass, ShieldAlert } from 'lucide-react';
import CareerMatchCard from '../shared/CareerMatchCard.jsx';
import ScoreCard from '../shared/ScoreCard.jsx';
import RadarChart from '../shared/RadarChart.jsx';
import PremiumTeaserCard from '../shared/PremiumTeaserCard.jsx';
import UpgradeCTA from '../shared/UpgradeCTA.jsx';
import { getStreamForCareer } from '../utils/reportDataAdapter.js';

/**
 * Student810FreeReport renders Class 8-10 assessment segments for Free tier.
 * Completely gates premium content from rendering in the DOM.
 */
const Student810FreeReport = ({ 
  topRecommendations = [], 
  userTraits = {},
  onUpgrade 
}) => {
  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* 1. Personality Section (Free) */}
      <div className="report-card-premium report-full-width">
        <h3 className="report-heading-2 mb-6 flex items-center gap-2">
          <Brain size={20} className="text-indigo-600" />
          <span>My Personality Trait Profile</span>
        </h3>
        
        <div className="report-equal-cols gap-6">
          <div className="flex flex-col justify-center">
            <p className="text-xs text-slate-500 mb-6 leading-relaxed" style={{ fontFamily: 'var(--report-font-body)' }}>
              This profile maps your core behavioral inclinations. Focused learning and systematic environments align best with these scores.
            </p>
            {Object.entries(userTraits).slice(0, 3).map(([trait, score], idx) => {
              const pct = Math.round((Number(score) / 5) * 100);
              return (
                <ScoreCard
                  key={idx}
                  label={trait}
                  percentage={pct}
                  color="var(--report-indigo-start)"
                />
              );
            })}
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center text-center">
            <span style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</span>
            <span className="text-[0.62rem] font-bold text-slate-400 uppercase tracking-widest block">Primary Temperament</span>
            <h4 className="font-extrabold text-slate-700 text-sm mt-1 mb-2">Self-directed & Methodical</h4>
            <p className="text-[0.68rem] text-slate-500 leading-normal max-w-xs mx-auto">
              Your scores show a high capacity for learning and conceptualizing complex structures.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interest Section (Free) */}
      <div className="report-card-premium report-full-width">
        <h3 className="report-heading-2 mb-6 flex items-center gap-2">
          <Heart size={20} className="text-indigo-600" />
          <span>Vocational Interest Radar Matrix</span>
        </h3>

        <div className="report-equal-cols gap-8 items-center">
          <RadarChart userTraits={userTraits} />
          
          <div className="flex flex-col gap-4">
            <span className="text-[0.62rem] font-bold text-slate-400 uppercase tracking-widest block">Interest Areas Overview</span>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-800 block mb-1">Analytical Interest Index</span>
              <p className="text-[0.68rem] text-slate-500 leading-relaxed">
                Reflects alignment with systemic reasoning, science experiments, and technical engineering environments.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-800 block mb-1">Practical Creation Index</span>
              <p className="text-[0.68rem] text-slate-500 leading-relaxed">
                Indicates preferences for hands-on, tangible tool deployment and structural builds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top Career Suggestions (Free) */}
      <div className="w-full">
        <h3 className="report-heading-2 mb-6 flex items-center gap-2">
          <Compass size={20} className="text-indigo-600" />
          <span>My Stream Recommendation & Subject Path</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {topRecommendations.slice(0, 3).map((rec, idx) => {
            const sMap = getStreamForCareer(rec.career);
            return (
              <CareerMatchCard
                key={idx}
                rank={idx + 1}
                title={sMap.stream}
                matchPercentage={rec.matchPercentage}
                tags={sMap.subjects}
                badgeText="Recommended Stream"
                scoreColor="var(--report-indigo-start)"
              />
            );
          })}
        </div>
      </div>

      {/* 4. Locked Sections Placeholder (Premium Teaser) */}
      <div className="report-full-width">
        <h3 className="report-heading-2 mb-6 flex items-center gap-2" style={{ color: 'var(--report-text-muted)' }}>
          <ShieldAlert size={20} className="text-slate-400" />
          <span>Locked Premium Diagnostics</span>
        </h3>
        
        <div className="flex flex-col gap-6">
          <PremiumTeaserCard title="Prerequisite Skill Gap Analysis" sectionType="skills" />
          <PremiumTeaserCard title="30-Day Growth Quest Map" sectionType="roadmap" />
          <PremiumTeaserCard title="Parent & Mentor Guidance Portal" sectionType="guidance" />
        </div>
      </div>

      {/* 5. Upgrade Call-to-Action */}
      <UpgradeCTA onUpgrade={onUpgrade} />

    </div>
  );
};

export default Student810FreeReport;
