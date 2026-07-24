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
          <div className="grid grid-cols-1 gap-4">
            {streamSuggestions.map((st, idx) => (
              <div key={idx} className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100 flex flex-col gap-2 text-left">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-extrabold text-indigo-900">{st.stream}</span>
                  <span className="text-[0.65rem] bg-indigo-100 text-indigo-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Suitability: {st.suitability}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed m-0">{st.whyItFits}</p>
              </div>
            ))}
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
