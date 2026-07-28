import React from 'react';
import ReportCover from '../shared/ReportCover.jsx';
import UpgradeCTA from '../shared/UpgradeCTA.jsx';
import { Sparkles, Brain, BookOpen, Compass, Award, ShieldCheck, Heart, Users } from 'lucide-react';

const Class910Report = ({
  userName,
  timestamp,
  reportContent = {},
  isPremiumUnlocked = false,
  hasPremium = false,
  handleUpgrade
}) => {
  const coverTitle = reportContent.reportTitle || "Stream Exploration Report";
  const summary = reportContent.executiveSummary || "";

  // Dynamic values or fallbacks matching our Class 9-10 schema
  const subjectInterests = reportContent.subjectInterests || "";
  const streamSuggestions = reportContent.streamSuggestions || [];
  const strengths = reportContent.strengths || [];
  const learningStyle = reportContent.learningStyle || "";
  const studyStrategy = reportContent.studyStrategy || [];
  const skillsToBuild = reportContent.skillsToBuild || [];
  const activitiesToExplore = reportContent.activitiesToExplore || [];
  const parentGuidance = reportContent.parentGuidance || "";
  const teacherGuidance = reportContent.teacherGuidance || "";
  const futureExploration = reportContent.futureExploration || "";

  return (
    <div className="report-inner-container flex flex-col gap-8 w-full">
      {/* Page 1: Cover Page */}
      <ReportCover
        type="class_9_10"
        title={coverTitle}
        badge="Verified Guidance Portfolio"
        userName={userName}
        timestamp={timestamp}
        executiveSummary={summary}
        badgeIcon={<Compass size={14} className="text-indigo-600" />}
      />

      {/* Grid of basic sections (Free access) */}
      <div className="report-page-grid">
        {/* Subject Interests Card */}
        <div className="report-card-premium flex flex-col gap-3">
          <div className="flex items-center gap-2 text-indigo-500">
            <Heart size={20} />
            <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Subject Interests</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: 'var(--report-font-body)' }}>
            {subjectInterests}
          </p>
        </div>

        {/* Learning Style Card */}
        <div className="report-card-premium flex flex-col gap-3">
          <div className="flex items-center gap-2 text-indigo-500">
            <BookOpen size={20} />
            <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Learning Style</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: 'var(--report-font-body)' }}>
            {learningStyle}
          </p>
        </div>

        {/* Strengths Card */}
        <div className="report-card-premium report-full-width flex flex-col gap-4">
          <div className="flex items-center gap-2 text-indigo-500">
            <Award size={20} />
            <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Strengths</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strengths.map((str, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-800">{str.name}</span>
                <span className="text-[0.7rem] text-slate-500 leading-relaxed">{str.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stream Suggestions Card */}
        <div className="report-card-premium report-full-width flex flex-col gap-4">
          <div className="flex items-center gap-2 text-indigo-500">
            <Brain size={20} />
            <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Stream Suggestions</h3>
          </div>
          <div className="grid grid-cols-1 gap-5 mt-2">
            {streamSuggestions.map((st, idx) => {
              const suitabilityLower = (st.suitability || '').toLowerCase();
              let suitabilityColor = 'bg-slate-100 text-slate-700 border-slate-200';
              let badgeIcon = null;
              
              if (suitabilityLower.includes('high') || suitabilityLower.includes('excellent')) {
                suitabilityColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                badgeIcon = <Award size={12} className="mr-1" />;
              } else if (suitabilityLower.includes('medium') || suitabilityLower.includes('moderate')) {
                suitabilityColor = 'bg-amber-50 text-amber-700 border-amber-200';
                badgeIcon = <Compass size={12} className="mr-1" />;
              } else if (suitabilityLower.includes('low')) {
                suitabilityColor = 'bg-rose-50 text-rose-700 border-rose-200';
              }

              return (
                <div key={idx} className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex flex-col gap-3 group">
                  {/* Left gradient accent bar */}
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 w-full pl-3">
                    <h4 className="text-sm md:text-[0.95rem] font-extrabold text-slate-800 m-0 leading-tight">
                      {st.stream}
                    </h4>
                    <span className={`flex items-center text-[0.65rem] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider whitespace-nowrap ${suitabilityColor}`}>
                      {badgeIcon}
                      Suitability: {st.suitability || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="pl-3">
                    <p className="text-[0.75rem] md:text-[0.8rem] text-slate-600 leading-relaxed m-0 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {st.whyItFits}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Premium Locking Wrapper */}
      {isPremiumUnlocked ? (
        <div className="flex flex-col gap-8 w-full report-animate-fade-in">
          <h3 className="report-heading-2 border-none pb-0 text-slate-800 flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500 animate-pulse" />
            <span>High School Exploration & Guidance</span>
          </h3>

          <div className="report-page-grid">
            {/* Study Strategy */}
            <div className="report-card-premium flex flex-col gap-3">
              <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block">
                Study Strategies for Success:
              </span>
              <ul className="list-disc pl-5 text-xs text-slate-600 leading-relaxed flex flex-col gap-2">
                {studyStrategy.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Future Exploration */}
            <div className="report-card-premium flex flex-col gap-3">
              <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block">
                How to Explore Subjects Further:
              </span>
              <p className="text-xs text-slate-600 leading-relaxed m-0" style={{ fontFamily: 'var(--report-font-body)' }}>
                {futureExploration}
              </p>
            </div>

            {/* Skills to Build */}
            <div className="report-card-premium report-full-width flex flex-col gap-4">
              <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block">
                Key Skills to Grow:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillsToBuild.map((sk, idx) => (
                  <div key={idx} className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/40 text-left">
                    <h4 className="text-xs font-bold text-slate-700 mb-1">{sk.skill}</h4>
                    <p className="text-[0.7rem] text-slate-500 leading-relaxed">{sk.howToBuild}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities to Explore */}
            <div className="report-card-premium report-full-width flex flex-col gap-3">
              <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block">
                Activities & Extracurriculars to Join:
              </span>
              <ul className="list-disc pl-5 text-xs text-slate-600 leading-relaxed flex flex-col gap-2">
                {activitiesToExplore.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>

            {/* Parent Guidance */}
            <div className="report-card-premium flex flex-col gap-3">
              <div className="flex items-center gap-2 text-indigo-500">
                <Compass size={18} />
                <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Guidance for Parents</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: 'var(--report-font-body)' }}>
                {parentGuidance}
              </p>
            </div>

            {/* Teacher Guidance */}
            <div className="report-card-premium flex flex-col gap-3">
              <div className="flex items-center gap-2 text-indigo-500">
                <Users size={18} />
                <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Guidance for Teachers</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: 'var(--report-font-body)' }}>
                {teacherGuidance}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <UpgradeCTA onUpgrade={handleUpgrade} hasPremium={hasPremium} />
      )}
    </div>
  );
};

export default Class910Report;
export { Class910Report };
