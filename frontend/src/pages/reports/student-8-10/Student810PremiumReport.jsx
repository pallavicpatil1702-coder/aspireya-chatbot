import React from 'react';
import { 
  Compass, 
  Brain, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  GraduationCap,
  Sparkles,
  BarChart2,
  Calendar
} from 'lucide-react';
import { getStreamForCareer } from '../utils/reportDataAdapter.js';
import { sanitizeForStudent8 } from '../utils/textSanitizer.js';
import CareerMatchCard from '../shared/CareerMatchCard.jsx';
import TraitCard from '../shared/TraitCard.jsx';
import ScoreCard from '../shared/ScoreCard.jsx';
import RadarChart from '../shared/RadarChart.jsx';
import Timeline from '../shared/Timeline.jsx';
import ParentGuide from '../shared/ParentGuide.jsx';
import TeacherGuide from '../shared/TeacherGuide.jsx';
import SkillCard from '../shared/SkillCard.jsx';
import { bulletizeAIText } from '../utils/textParser.js';

/**
 * Student810PremiumReport renders the full premium metrics for Class 8-10.
 * Transforms raw text blocks into lists, timelines, and do/don't matrices.
 */
const Student810PremiumReport = ({ 
  reportContent = {}, 
  topRecommendations = [],
  userTraits = {}
}) => {
  const primaryRec = topRecommendations[0] || {};
  const primaryStream = getStreamForCareer(primaryRec.career);
  
  // Safe display subjects mapping
  const subjectList = primaryStream.subjects || ["English", "Mathematics", "Science", "Social Science"];

  // Limit dynamic roadmap text into clean step vectors
  const week1Text = "Explore recommended high school streams. Map syllabus requirements and meet school seniors.";
  const week2Text = "Engage in science simulator modules, stock trading applications, or structured reading lists.";
  const week3Text = "Establish a structured self-study habit calendar and practice conceptual review quizzes.";
  const week4Text = "Reflect on career diagnostic scores with academic mentors to lock in stream selections.";

  const roadmapItems = [
    `Phase 1 Exploration: ${week1Text}`,
    `Phase 2 Skill-Building: ${week2Text}`,
    `Phase 3 Routine Calibration: ${week3Text}`,
    `Phase 4 Review & Lock: ${week4Text}`
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* 1. RIASEC & Interests (Unlocked) */}
      <div className="report-card-premium report-full-width">
        <h3 className="report-heading-2 mb-6 flex items-center gap-2">
          <BarChart2 size={20} className="text-indigo-600" />
          <span>Vocational Interest Radar Matrix</span>
        </h3>

        <div className="report-equal-cols gap-8 items-center">
          <RadarChart userTraits={userTraits} />
          
          <div className="flex flex-col gap-4">
            <span className="text-[0.62rem] font-bold text-slate-400 uppercase tracking-widest block">Core Alignment Profiles</span>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-800 block mb-1">Analytical Reasoning</span>
              <p className="text-[0.68rem] text-slate-500 leading-normal">
                Reflects interest in science labs, software logic algorithms, and statistical systems.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-800 block mb-1">Empirical Design</span>
              <p className="text-[0.68rem] text-slate-500 leading-normal">
                Matches creative project building, physical product crafting, and design thinking workflows.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stream Recommendations */}
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
                salaryPotential={rec.salaryPotential}
                futureDemand={rec.futureDemand}
                aiAutomationRisk={rec.aiAutomationRisk}
                skillGapAnalysis={rec.skillGapAnalysis}
              />
            );
          })}
        </div>
      </div>

      {/* 3. Strengths Profile (Unlocked) */}
      <div className="report-card-premium report-full-width">
        <h3 className="report-heading-2 mb-6 flex items-center gap-2">
          <Award size={20} className="text-indigo-600" />
          <span>Top Strengths & Talents 🌟</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {reportContent.keyStrengths?.slice(0, 4).map((str, idx) => (
            <TraitCard
              key={idx}
              title={sanitizeForStudent8(str.trait)}
              subtitle={sanitizeForStudent8(str.description)}
              accentColor="var(--report-indigo-start)"
            />
          ))}
          {(!reportContent.keyStrengths || reportContent.keyStrengths.length === 0) && (
            <div className="col-span-2 text-center text-xs text-slate-400">
              Strengths profile unavailable.
            </div>
          )}
        </div>
      </div>

      {/* 4. Study Habit & Learning Style (Unlocked) */}
      <div className="report-card-premium report-full-width">
        <h3 className="report-heading-2 mb-6 flex items-center gap-2">
          <Brain size={20} className="text-indigo-600" />
          <span>Study Habits & Cognitive Learning Guide</span>
        </h3>

        <div className="report-equal-cols gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
            <span className="text-[0.62rem] font-bold text-slate-400 uppercase tracking-widest block mb-2">Subject Mastery Guide</span>
            <div className="flex flex-col gap-2">
              {subjectList.map((sub, sIdx) => (
                <div key={sIdx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100">
                  <span className="font-semibold text-xs text-slate-800">{sub}</span>
                  <span className="text-[0.65rem] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md">High Potential</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-[0.62rem] font-bold text-slate-400 uppercase tracking-widest block mb-2">Effective Learning Tips</span>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2" style={{ fontFamily: 'var(--report-font-body)' }}>
              <li>Use physical/digital flashcards for conceptual science reviews.</li>
              <li>Structure studies in 40-minute focused blocks with 10-minute breaks.</li>
              <li>Read chapters prior to class lectures to build proactive cognitive frameworks.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Areas to Improve & Skill Gap Matrices */}
      <div className="report-equal-cols gap-6">
        {/* Areas of Improvement */}
        <div className="flex flex-col gap-4">
          <h3 className="report-heading-3 text-slate-800 mb-2" style={{ fontFamily: 'var(--report-font-heading)' }}>
            Growth Potential Focus Areas
          </h3>
          {reportContent.areasOfImprovement?.slice(0, 3).map((imp, idx) => (
            <TraitCard
              key={idx}
              variant="block"
              title={sanitizeForStudent8(imp.trait)}
              subtitle={sanitizeForStudent8(imp.actionItem)}
              accentColor="var(--report-gold-accent)"
              bgColor="#fffbeb"
            />
          ))}
          {(!reportContent.areasOfImprovement || reportContent.areasOfImprovement.length === 0) && (
            <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
              No improvements items specified.
            </div>
          )}
        </div>

        {/* Skill Gap Checklist */}
        <div className="flex flex-col gap-4">
          <h3 className="report-heading-3 text-slate-800 mb-2" style={{ fontFamily: 'var(--report-font-heading)' }}>
            Competency Skill Gap Analysis
          </h3>
          {primaryRec.skillGapAnalysis?.userGaps?.slice(0, 3).map((gap, idx) => (
            <SkillCard
              key={idx}
              name={gap}
              hasGap={true}
              actionPlan={primaryRec.skillGapAnalysis.actionPlan}
            />
          ))}
          {(!primaryRec.skillGapAnalysis?.userGaps || primaryRec.skillGapAnalysis.userGaps.length === 0) && (
            <SkillCard name="Advanced Analytical Logic" hasGap={false} />
          )}
        </div>
      </div>

      {/* 6. 30-Day Growth Quest Roadmap (Timeline) */}
      <div className="report-card-premium report-full-width">
        <h3 className="report-heading-2 mb-6 flex items-center gap-2">
          <Calendar size={20} className="text-indigo-600" />
          <span>30-Day Growth Quest Roadmap</span>
        </h3>
        <Timeline items={roadmapItems} />
      </div>

      {/* 7. Parent Guide (DO / DON'T Checklists) */}
      <ParentGuide advice={reportContent.sectionAnalysis?.values} />

      {/* 8. Teacher Guide (Mentor Recommendation Cards) */}
      <TeacherGuide advice={reportContent.finalAICareerIntelligenceSummary} />

    </div>
  );
};

export default Student810PremiumReport;
export { Student810PremiumReport };
