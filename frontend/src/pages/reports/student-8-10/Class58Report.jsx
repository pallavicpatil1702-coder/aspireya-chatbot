import React from 'react';
import ReportCover from '../shared/ReportCover.jsx';
import UpgradeCTA from '../shared/UpgradeCTA.jsx';
import Timeline from '../shared/Timeline.jsx';
import { Sparkles, Heart, Award, BookOpen, Smile, UserCheck, ShieldAlert, ClipboardList } from 'lucide-react';

const Class58Report = ({
  userName,
  timestamp,
  reportContent = {},
  isPremiumUnlocked = false,
  hasPremium = false,
  handleUpgrade
}) => {
  const coverTitle = reportContent.reportTitle || "My Learning & Growth Report";
  const summary = reportContent.executiveSummary || "";

  // Dynamic values or fallbacks matching our Class 5-8 schema
  const myInterests = reportContent.myInterests || "Curious about new topics and science exploration.";
  const myStrengths = Array.isArray(reportContent?.myStrengths)
    ? reportContent.myStrengths
    : [];
  const myLearningStyle = reportContent.myLearningStyle || "Learns best with drawing, charts, and science tasks.";
  const myFavouriteSubjects = Array.isArray(reportContent?.myFavouriteSubjects)
    ? reportContent.myFavouriteSubjects
    : [];
  const activitiesToExplore = Array.isArray(reportContent?.activitiesToExplore)
    ? reportContent.activitiesToExplore
    : [];
  const skillsICanImprove = Array.isArray(reportContent?.skillsICanImprove)
    ? reportContent.skillsICanImprove
    : [];
  const studyTips = Array.isArray(reportContent?.studyTips)
    ? reportContent.studyTips
    : [];
  const funChallenges = Array.isArray(reportContent?.funLearningChallenges)
    ? reportContent.funLearningChallenges
    : [];
  const parentAdvice = reportContent.parentGuidance || "";
  const teacherAdvice = reportContent.teacherGuidance || "";
  const plan30Day = Array.isArray(reportContent?.learningPlan30Day)
    ? reportContent.learningPlan30Day
    : [];

  return (
    <div className="report-inner-container flex flex-col gap-8 w-full">
      {/* Page 1: Cover Page */}
      <ReportCover
        type="class_5_8"
        title={coverTitle}
        badge="Class 5-8 Learning Portfolio"
        userName={userName}
        timestamp={timestamp}
        executiveSummary={summary}
        badgeIcon={<Smile size={14} className="text-emerald-500" />}
      />

      {/* Grid of basic sections (Free access) */}
      <div className="report-page-grid">
        {/* Interests Card */}
        <div className="report-card-premium flex flex-col gap-4 bg-gradient-to-br from-indigo-50/80 to-white border border-indigo-100/50 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100/60 rounded-xl text-indigo-600">
              <Heart size={20} className="fill-indigo-100/30" />
            </div>
            <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>My Interests</h3>
          </div>
          <p className="text-[0.8rem] text-slate-600 leading-relaxed font-medium" style={{ fontFamily: 'var(--report-font-body)' }}>
            {myInterests}
          </p>
        </div>

        {/* Learning Style Card */}
        <div className="report-card-premium flex flex-col gap-4 bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-100/50 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100/60 rounded-xl text-emerald-600">
              <BookOpen size={20} className="fill-emerald-100/30" />
            </div>
            <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>My Learning Style</h3>
          </div>
          <p className="text-[0.8rem] text-slate-600 leading-relaxed font-medium" style={{ fontFamily: 'var(--report-font-body)' }}>
            {myLearningStyle}
          </p>
        </div>

        {/* Strengths Card */}
        <div className="report-card-premium report-full-width flex flex-col gap-5 bg-gradient-to-br from-amber-50/80 to-white border border-amber-100/50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100/60 rounded-xl text-amber-600">
              <Award size={20} className="fill-amber-100/30" />
            </div>
            <h3
              className="report-heading-3 text-slate-800"
              style={{ margin: 0 }}
            >
              My Key Strengths
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myStrengths.length > 0 ? (
              myStrengths.map((str, idx) => {
                const strengthTitle =
                  typeof str === "string"
                    ? str
                    : str?.strength || str?.title || str?.name || "Strength";

                const strengthReason =
                  typeof str === "object" && str !== null
                    ? str?.why || str?.description || str?.reason || ""
                    : "";

                return (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-2xl border border-amber-100/60 shadow-sm flex flex-col gap-1.5 text-left hover:-translate-y-0.5 transition-transform"
                  >
                    <span className="text-[0.75rem] font-bold text-slate-800">
                      {strengthTitle}
                    </span>

                    {strengthReason && (
                      <span className="text-[0.7rem] text-slate-500 leading-relaxed">
                        {strengthReason}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-[0.75rem] text-slate-400">
                Strength information is not available.
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Premium Locking Wrapper */}
      {isPremiumUnlocked ? (
        <div className="flex flex-col gap-8 w-full report-animate-fade-in">
          <h3 className="report-heading-2 border-none pb-0 text-slate-800 flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500 animate-pulse" />
            <span>My Learning & Future Exploration Planner</span>
          </h3>

          <div className="report-page-grid">
            {/* Activities to Explore */}
            <div className="report-card-premium flex flex-col gap-4 bg-gradient-to-br from-purple-50/80 to-white border border-purple-100/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100/60 rounded-xl text-purple-600">
                  <Sparkles size={20} className="fill-purple-100/30" />
                </div>
                <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Fun Activities to Try</h3>
              </div>
              <ul className="list-disc pl-5 text-[0.8rem] text-slate-600 leading-relaxed font-medium flex flex-col gap-2">
                {activitiesToExplore.map((act, idx) => (
                  <li key={idx} className="marker:text-purple-400">{act}</li>
                ))}
              </ul>
            </div>

            {/* Study Tips */}
            <div className="report-card-premium flex flex-col gap-4 bg-gradient-to-br from-blue-50/80 to-white border border-blue-100/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100/60 rounded-xl text-blue-600">
                  <BookOpen size={20} className="fill-blue-100/30" />
                </div>
                <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Best Tips for Studying</h3>
              </div>
              <ul className="list-disc pl-5 text-[0.8rem] text-slate-600 leading-relaxed font-medium flex flex-col gap-2">
                {studyTips.map((tip, idx) => (
                  <li key={idx} className="marker:text-blue-400">{tip}</li>
                ))}
              </ul>
            </div>

            {/* Skills I Can Improve */}
            <div className="report-card-premium report-full-width flex flex-col gap-5 bg-gradient-to-br from-fuchsia-50/80 to-white border border-fuchsia-100/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-fuchsia-100/60 rounded-xl text-fuchsia-600">
                  <Award size={20} className="fill-fuchsia-100/30" />
                </div>
                <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Skills I Can Grow</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillsICanImprove.map((sk, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-fuchsia-100/60 shadow-sm text-left hover:-translate-y-0.5 transition-transform">
                    <h4 className="text-[0.75rem] font-bold text-slate-800 mb-1.5">{sk.skill}</h4>
                    <p className="text-[0.7rem] text-slate-500 leading-relaxed font-medium m-0">{sk.how}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Learning Challenges */}
            <div className="report-card-premium report-full-width flex flex-col gap-5 bg-gradient-to-br from-amber-50/80 to-white border border-amber-100/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100/60 rounded-xl text-amber-600">
                  <ClipboardList size={20} className="fill-amber-100/30" />
                </div>
                <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Fun Learning Quests</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {funChallenges.map((ch, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-amber-100/60 shadow-sm flex gap-3 items-start hover:-translate-y-0.5 transition-transform">
                    <span className="text-lg">⭐</span>
                    <p className="text-[0.72rem] text-slate-600 leading-relaxed m-0 font-medium">{ch}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Parent Tips */}
            <div className="report-card-premium flex flex-col gap-4 bg-gradient-to-br from-rose-50/80 to-white border border-rose-100/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-100/60 rounded-xl text-rose-600">
                  <Heart size={20} className="fill-rose-100/30" />
                </div>
                <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Tips for Parents</h3>
              </div>
              <p className="text-[0.8rem] text-slate-600 leading-relaxed font-medium" style={{ fontFamily: 'var(--report-font-body)' }}>
                {parentAdvice}
              </p>
            </div>

            {/* Teacher Tips */}
            <div className="report-card-premium flex flex-col gap-4 bg-gradient-to-br from-teal-50/80 to-white border border-teal-100/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-100/60 rounded-xl text-teal-600">
                  <UserCheck size={20} className="fill-teal-100/30" />
                </div>
                <h3 className="report-heading-3 text-slate-800" style={{ margin: 0 }}>Tips for Teachers</h3>
              </div>
              <p className="text-[0.8rem] text-slate-600 leading-relaxed font-medium" style={{ fontFamily: 'var(--report-font-body)' }}>
                {teacherAdvice}
              </p>
            </div>

            {/* 30-Day learning timeline */}
            <div className="report-card-premium report-full-width flex flex-col gap-4">
              <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block">
                My 30-Day Learning Quest Map:
              </span>
              <Timeline items={plan30Day} />
            </div>
          </div>
        </div>
      ) : (
        <UpgradeCTA onUpgrade={handleUpgrade} hasPremium={hasPremium} />
      )}
    </div>
  );
};

export default Class58Report;
export { Class58Report };
